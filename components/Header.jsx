"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { memorials, searchMemorials } from "@/data/memorials";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const boxRef = useRef(null);

  const results = query.trim() ? searchMemorials(query) : [];

  // close the dropdown when tapping elsewhere
  useEffect(() => {
    function onDown(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    if (results[0]) {
      setFocused(false);
      router.push(`/memorial/${results[0].id}`);
    }
  }

  return (
    <header className="relative z-20 mx-auto w-full max-w-6xl px-4 pt-5 md:px-8">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="hidden font-serif text-xl tracking-wide text-sand-200 md:block"
        >
          Memoriam
        </Link>

        <div ref={boxRef} className="relative flex-1">
          <form
            onSubmit={onSubmit}
            className="flex items-center rounded-full bg-sand-200 pl-5 pr-2 shadow-sandcard"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Search name, family or grave location…"
              aria-label="Search memorials"
              className="h-12 w-full bg-transparent font-serif text-base italic text-forest-950 placeholder:text-sand-500 focus:outline-none md:h-14 md:text-lg"
            />
            {/* Scan a grave: the showpiece feature, one tap away */}
            <Link
              href="/scan"
              aria-label="Scan a grave"
              title="Scan a grave"
              className="ml-2 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-900 text-sand-100 transition hover:bg-forest-700 md:h-10 md:w-10"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 8a2 2 0 0 1 2-2h1.5l1.2-1.6A1 1 0 0 1 9.5 4h5a1 1 0 0 1 .8.4L16.5 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
                <circle cx="12" cy="12.5" r="3.2" />
              </svg>
            </Link>
          </form>

          <AnimatePresence>
            {focused && query.trim() && (
              <motion.ul
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-3 overflow-hidden rounded-3xl bg-sand-100 text-forest-950 shadow-card"
              >
                {results.length === 0 && (
                  <li className="px-5 py-4 text-sm text-sand-500">
                    No memorials found for “{query}”.
                  </li>
                )}
                {results.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/memorial/${m.id}`}
                      onClick={() => setFocused(false)}
                      className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-sand-200"
                    >
                      <span>
                        <span className="block font-serif text-lg">
                          {m.name}
                        </span>
                        <span className="block text-xs text-sand-500">
                          {m.cemetery} · Section {m.section} Plot {m.plot}
                        </span>
                      </span>
                      <span className="text-sm text-sand-500">
                        {m.born}–{m.died}
                      </span>
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full transition hover:bg-forest-800"
        >
          <span className="h-0.5 w-7 rounded bg-sand-200" />
          <span className="h-0.5 w-7 rounded bg-sand-200" />
          <span className="h-0.5 w-7 rounded bg-sand-200" />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute right-4 top-full mt-2 w-60 rounded-3xl bg-sand-100 p-2 text-forest-950 shadow-card md:right-8"
          >
            {[
              { href: "/", label: "Home" },
              { href: "/scan", label: "Scan a grave" },
              ...memorials.slice(0, 1).map((m) => ({
                href: `/memorial/${m.id}`,
                label: "Example memorial",
              })),
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-4 py-3 font-serif text-lg transition hover:bg-sand-200"
              >
                {item.label}
              </Link>
            ))}
            <p className="px-4 pb-2 pt-3 text-xs text-sand-500">
              Faith &amp; grief support, family trees and more are on the
              roadmap.
            </p>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
