"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function BioAccordion({ sections }) {
  // First section starts open so the page never looks empty
  const [open, setOpen] = useState(() => new Set([0]));

  function toggle(i) {
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <section className="card p-3 md:p-5" aria-label="Biography">
      <ul className="space-y-2">
        {sections.map((s, i) => {
          const isOpen = open.has(i);
          return (
            <li key={s.title} className="overflow-hidden rounded-2xl bg-forest-900/70">
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-forest-900"
              >
                <span className="font-serif text-lg md:text-xl">{s.title}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-sand-300"
                  aria-hidden
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p className="px-5 pb-5 text-base leading-relaxed text-sand-100/95 md:text-lg">
                      {s.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
