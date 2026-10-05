"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MemorialChat({ memorial }) {
  const first = memorial.name.split(" ")[0];
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hello. Ask me anything about ${memorial.name}'s life.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const suggestions = [
    `Who was ${first}?`,
    `What did ${first} do for work?`,
    `Tell me about ${first}'s family`,
    `Where is ${first} buried?`,
  ];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function ask(text) {
    const question = text.trim();
    if (!question || loading) return;
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memorialId: memorial.id, question }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: data.answer || "Sorry, I couldn't answer that just now.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Sorry, I couldn't reach the assistant. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-label="Memorial assistant"
      className="card-sand flex h-full min-h-[360px] flex-col p-4 md:p-5"
    >
      <h2 className="font-serif text-xl">Ask about {first}</h2>

      <div
        ref={scrollRef}
        className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1 md:max-h-[320px]"
        style={{ maxHeight: 320 }}
      >
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={m.role === "user" ? "flex justify-end" : "flex"}
          >
            <p
              className={
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed md:text-base " +
                (m.role === "user"
                  ? "bg-forest-900 text-sand-100"
                  : "bg-sand-100 text-forest-950")
              }
            >
              {m.text}
            </p>
          </motion.div>
        ))}
        {loading && (
          <p className="text-sm italic text-sand-500">Remembering…</p>
        )}
      </div>

      {messages.length === 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="rounded-full bg-sand-100 px-3 py-1.5 text-xs text-forest-950 transition hover:bg-sand-300 md:text-sm"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="mt-3 flex items-center rounded-full bg-sand-500 pl-4 pr-1.5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${first}…`}
          aria-label="Ask a question"
          className="h-11 w-full bg-transparent text-sand-100 placeholder:text-sand-200/80 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={loading}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sand-100 transition hover:bg-forest-900/40 disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M3 11.2 20.5 3.5a.6.6 0 0 1 .8.8L13.6 21.8a.6.6 0 0 1-1.1-.1l-1.9-6.9-6.9-1.9a.6.6 0 0 1-.1-1.1Z" />
          </svg>
        </button>
      </form>
    </section>
  );
}
