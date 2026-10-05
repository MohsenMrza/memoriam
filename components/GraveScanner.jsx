"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { matchFromText } from "@/data/memorials";

// Headstones are hard for OCR: weathered stone, glare, speckled borders,
// grass. Letters, however, are *big, solid and locally lighter/darker than
// their surroundings*, while the noise is small and speckly. So we:
//   1. threshold each pixel against its local average (works for engraved,
//      raised bronze, colour or black & white printouts alike)
//   2. remove thin specks (morphological opening)
//   3. keep only blobs tall enough to be a letter
// That leaves clean black-on-white lettering for Tesseract. We try a few
// settings (and both polarities) and stop at the first one that matches.
async function prepareImages(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0, w, h);
  const rgba = ctx.getImageData(0, 0, w, h).data;

  const gray = new Uint8ClampedArray(w * h);
  for (let i = 0, p = 0; i < rgba.length; i += 4, p++) {
    gray[p] = (rgba[i] * 0.299 + rgba[i + 1] * 0.587 + rgba[i + 2] * 0.114) | 0;
  }

  // integral image -> local mean in O(1) per pixel
  const iw = w + 1;
  const integral = new Int32Array(iw * (h + 1));
  for (let y = 1; y <= h; y++) {
    let row = 0;
    for (let x = 1; x <= w; x++) {
      row += gray[(y - 1) * w + (x - 1)];
      integral[y * iw + x] = integral[(y - 1) * iw + x] + row;
    }
  }
  const half = Math.max(8, Math.round(w * 0.015));
  const localMean = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - half), y1 = Math.min(h, y + half + 1);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - half), x1 = Math.min(w, x + half + 1);
      const sum =
        integral[y1 * iw + x1] - integral[y0 * iw + x1] -
        integral[y1 * iw + x0] + integral[y0 * iw + x0];
      localMean[y * w + x] = sum / ((x1 - x0) * (y1 - y0));
    }
  }

  // square erosion / dilation with a (2r+1) window, done separably
  function morph(src, r, dilate) {
    const tmp = new Uint8Array(w * h);
    const out = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let v = dilate ? 0 : 1;
        for (let k = -r; k <= r; k++) {
          const xx = x + k;
          const val = xx < 0 || xx >= w ? (dilate ? 0 : 1) : src[y * w + xx];
          if (dilate ? val : !val) { v = dilate ? 1 : 0; break; }
        }
        tmp[y * w + x] = v;
      }
    }
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let v = dilate ? 0 : 1;
        for (let k = -r; k <= r; k++) {
          const yy = y + k;
          const val = yy < 0 || yy >= h ? (dilate ? 0 : 1) : tmp[yy * w + x];
          if (dilate ? val : !val) { v = dilate ? 1 : 0; break; }
        }
        out[y * w + x] = v;
      }
    }
    return out;
  }

  const queue = new Int32Array(w * h);

  function letterMask(polarity, openSize, minHeightFrac) {
    let bin = new Uint8Array(w * h);
    for (let p = 0; p < bin.length; p++) {
      bin[p] = polarity * (gray[p] - localMean[p]) > 10 ? 1 : 0;
    }
    const r = (openSize - 1) / 2;
    bin = morph(morph(bin, r, false), r, true);

    // keep only blobs that are tall enough to be letters
    const minH = Math.max(6, h * minHeightFrac);
    const visited = new Uint8Array(w * h);
    const keep = new Uint8Array(w * h);
    for (let start = 0; start < bin.length; start++) {
      if (!bin[start] || visited[start]) continue;
      let head = 0, tail = 0, minY = h, maxY = 0;
      queue[tail++] = start;
      visited[start] = 1;
      while (head < tail) {
        const p = queue[head++];
        const y = (p / w) | 0, x = p - y * w;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= h) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            if (xx < 0 || xx >= w) continue;
            const q = yy * w + xx;
            if (bin[q] && !visited[q]) {
              visited[q] = 1;
              queue[tail++] = q;
            }
          }
        }
      }
      if (maxY - minY + 1 >= minH) {
        for (let i = 0; i < tail; i++) keep[queue[i]] = 1;
      }
    }

    // paint black letters on a white page with a margin
    const pad = 24;
    const c2 = document.createElement("canvas");
    c2.width = w + pad * 2;
    c2.height = h + pad * 2;
    const ctx2 = c2.getContext("2d");
    ctx2.fillStyle = "#fff";
    ctx2.fillRect(0, 0, c2.width, c2.height);
    const img2 = ctx2.getImageData(pad, pad, w, h);
    for (let p = 0, o = 0; p < keep.length; p++, o += 4) {
      const v = keep[p] ? 0 : 255;
      img2.data[o] = img2.data[o + 1] = img2.data[o + 2] = v;
      img2.data[o + 3] = 255;
    }
    ctx2.putImageData(img2, pad, pad);
    return c2.toDataURL("image/png");
  }

  function plainGray() {
    const c2 = document.createElement("canvas");
    c2.width = w;
    c2.height = h;
    const ctx2 = c2.getContext("2d");
    const img2 = ctx2.createImageData(w, h);
    for (let p = 0, o = 0; p < gray.length; p++, o += 4) {
      img2.data[o] = img2.data[o + 1] = img2.data[o + 2] = gray[p];
      img2.data[o + 3] = 255;
    }
    ctx2.putImageData(img2, 0, 0);
    return c2.toDataURL("image/png");
  }

  // each entry builds its image only when needed
  return [
    () => letterMask(1, 5, 0.02), // light letters on a darker surface
    () => letterMask(1, 3, 0.015), // same, for smaller / farther text
    () => letterMask(-1, 5, 0.02), // dark letters on a lighter surface
    () => letterMask(-1, 3, 0.015),
    () => plainGray(),
  ];
}

export default function GraveScanner() {
  const router = useRouter();
  const workerRef = useRef(null);
  const progressRef = useRef(() => {});
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | reading | found | notfound | error
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");
  const [match, setMatch] = useState(null);
  const [others, setOthers] = useState([]);

  // free the OCR worker and preview URL when leaving the page
  useEffect(() => {
    return () => {
      workerRef.current?.then?.((w) => w.terminate()).catch(() => {});
    };
  }, []);

  function getWorker() {
    if (!workerRef.current) {
      workerRef.current = import("tesseract.js").then(({ createWorker }) =>
        createWorker("eng", 1, {
          workerPath: "/tesseract/worker.min.js",
          corePath: "/tesseract",
          langPath: "/tesseract/lang",
          gzip: true,
          logger: (m) => {
            if (m.status === "recognizing text") progressRef.current(m.progress);
          },
        })
      );
    }
    return workerRef.current;
  }

  // start loading the engine as soon as the page opens, so the first scan is fast
  useEffect(() => {
    getWorker().catch(() => {});
  }, []);

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setStatus("reading");
    setProgress(0);
    setText("");
    setMatch(null);
    setOthers([]);

    try {
      const worker = await getWorker();
      const attempts = await prepareImages(file);

      let allText = "";
      let matches = [];
      for (let i = 0; i < attempts.length; i++) {
        progressRef.current = (p) => setProgress((i + p) / attempts.length);
        setProgress(i / attempts.length);
        const { data } = await worker.recognize(attempts[i]());
        allText += "\n" + data.text;
        matches = matchFromText(allText);
        if (matches.length && matches[0].confidence >= 0.75) break;
      }

      const cleaned = allText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => /[A-Za-z0-9]{2,}/.test(l))
        .join("\n");
      setText(cleaned);

      if (matches.length) {
        setMatch(matches[0]);
        setOthers(matches.slice(1, 3));
        setStatus("found");
        setTimeout(
          () => router.push(`/memorial/${matches[0].memorial.id}`),
          2200
        );
      } else {
        setStatus("notfound");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  function reset() {
    setStatus("idle");
    setPreview(null);
    setText("");
    setMatch(null);
  }

  const busy = status === "reading";

  return (
    <div className="card overflow-hidden p-5 md:p-8">
      <h1 className="font-serif text-3xl md:text-4xl">Scan a grave</h1>
      <p className="mt-2 text-sand-200 md:text-lg">
        Take a photo of a headstone and Memoriam will read the name and open
        their memorial page.
      </p>

      {/* preview */}
      <div className="mt-6 overflow-hidden rounded-2xl bg-forest-950/70">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Headstone you photographed"
            className="max-h-80 w-full object-contain"
          />
        ) : (
          <div className="grid h-48 place-items-center px-6 text-center text-sand-300">
            <div>
              <svg
                viewBox="0 0 24 24"
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 8a2 2 0 0 1 2-2h1.5l1.2-1.6A1 1 0 0 1 9.5 4h5a1 1 0 0 1 .8.4L16.5 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
                <circle cx="12" cy="12.5" r="3.2" />
              </svg>
              <p className="mt-3 text-sm">
                Tip: hold your phone straight above the plaque, with the name
                filling the frame.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* actions */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label
          className={
            "flex-1 cursor-pointer rounded-full bg-sand-200 px-6 py-3.5 text-center font-medium text-forest-950 shadow-sandcard transition hover:-translate-y-0.5 " +
            (busy ? "pointer-events-none opacity-60" : "")
          }
        >
          Take a photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={onFile}
            className="sr-only"
            disabled={busy}
          />
        </label>
        <label
          className={
            "flex-1 cursor-pointer rounded-full border border-sand-300/60 px-6 py-3.5 text-center font-medium text-sand-100 transition hover:bg-forest-800 " +
            (busy ? "pointer-events-none opacity-60" : "")
          }
        >
          Upload a photo
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            className="sr-only"
            disabled={busy}
          />
        </label>
      </div>

      {/* result */}
      <div aria-live="polite" className="mt-6">
        <AnimatePresence mode="wait">
          {busy && (
            <motion.div
              key="reading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-serif text-lg italic">Reading the headstone…</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-forest-950/70">
                <motion.div
                  className="h-full rounded-full bg-sand-200"
                  animate={{ width: `${Math.max(6, progress * 100)}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
            </motion.div>
          )}

          {status === "found" && match && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-sand-200 p-5 text-forest-950"
            >
              <p className="text-xs uppercase tracking-widest text-sand-500">
                Match found
              </p>
              <p className="mt-1 font-serif text-2xl md:text-3xl">
                {match.memorial.name}
              </p>
              <p className="text-sand-500">
                {match.memorial.born} – {match.memorial.died}
              </p>
              <p className="mt-3 text-sm">Opening memorial…</p>
              <Link
                href={`/memorial/${match.memorial.id}`}
                className="mt-2 inline-block rounded-full bg-forest-900 px-5 py-2 text-sm text-sand-100"
              >
                Open now
              </Link>
              {others.length > 0 && (
                <p className="mt-3 text-xs text-sand-500">
                  Not right? Could also be:{" "}
                  {others.map((o, i) => (
                    <Link
                      key={o.memorial.id}
                      href={`/memorial/${o.memorial.id}`}
                      className="underline"
                    >
                      {o.memorial.name}
                      {i < others.length - 1 ? ", " : ""}
                    </Link>
                  ))}
                </p>
              )}
            </motion.div>
          )}

          {status === "notfound" && (
            <motion.div
              key="nf"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-forest-950/70 p-5"
            >
              <p className="font-serif text-xl">No matching memorial found</p>
              <p className="mt-1 text-sm text-sand-300">
                Try a closer, straighter photo with less glare, or search by
                name instead.
              </p>
              <button
                onClick={reset}
                className="mt-3 rounded-full bg-sand-200 px-5 py-2 text-sm text-forest-950"
              >
                Try again
              </button>
            </motion.div>
          )}

          {status === "error" && (
            <motion.p
              key="err"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl bg-forest-950/70 p-5 text-sand-200"
            >
              Something went wrong reading that photo. Please try another one.
            </motion.p>
          )}
        </AnimatePresence>

        {text && (status === "found" || status === "notfound") && (
          <details className="mt-4 text-sm text-sand-300">
            <summary className="cursor-pointer">Text detected on the headstone</summary>
            <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-forest-950/70 p-3 font-mono text-xs">
              {text}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
