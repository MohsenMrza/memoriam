// Copies the OCR engine + English language data from node_modules into
// public/tesseract so Memoriam's grave scanner works with NO internet
// (important for fair Wi-Fi). Runs automatically after `npm install`.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const out = path.join(root, "public", "tesseract");
const langOut = path.join(out, "lang");

function copy(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

try {
  const core = path.join(root, "node_modules", "tesseract.js-core");
  // Only the LSTM builds are needed (that is what the default engine uses)
  for (const f of fs.readdirSync(core)) {
    if (/^tesseract-core.*lstm.*\.(js|wasm)$/.test(f)) {
      copy(path.join(core, f), path.join(out, f));
    }
  }
  copy(
    path.join(root, "node_modules", "tesseract.js", "dist", "worker.min.js"),
    path.join(out, "worker.min.js")
  );
  copy(
    path.join(
      root,
      "node_modules",
      "@tesseract.js-data",
      "eng",
      "4.0.0_best_int",
      "eng.traineddata.gz"
    ),
    path.join(langOut, "eng.traineddata.gz")
  );
  console.log("Memoriam: OCR files copied to public/tesseract");
} catch (err) {
  console.warn("Memoriam: could not copy OCR files:", err.message);
}
