import { NextResponse } from "next/server";
import { getMemorial } from "@/data/memorials";

// Builds the only knowledge the assistant is allowed to use.
function buildContext(m) {
  const lines = [
    `Name: ${m.name}`,
    `Born: ${m.born}`,
    `Died: ${m.died}`,
    `Buried at: ${m.cemetery}, Section ${m.section}, Plot ${m.plot}`,
    ...m.sections.map((s) => `${s.title}: ${s.body}`),
  ];
  return lines.join("\n");
}

const NO_INFO = (m) =>
  `I don't have that information on ${m.name}'s memorial page yet. Family members can add more stories over time.`;

// Offline fallback so the demo still works with no API key or Wi-Fi.
function localAnswer(m, question) {
  const q = question.toLowerCase();
  const first = m.name.split(" ")[0];

  if (/(buried|grave|plot|cemetery|where.*(rest|lie))/.test(q)) {
    return `${first} is buried at ${m.cemetery}, Section ${m.section}, Plot ${m.plot}.`;
  }
  if (/(who (was|is)|tell me about|summary|summari[sz]e|life)/.test(q)) {
    const bio = m.sections.find((s) => s.title === "Biography");
    return `${m.name} (${m.born}–${m.died}). ${bio ? bio.body : ""}`.trim();
  }
  if (/(born|birth|when did.*die|died|age|how old)/.test(q)) {
    return `${m.name} was born in ${m.born} and passed away in ${m.died}.`;
  }

  const keywordMap = {
    Career: /(work|job|career|profession|employ|do for a living)/,
    Family: /(family|wife|husband|married|children|kids|grand|son|daughter|relative)/,
    Education: /(school|educat|degree|study|studied)/,
    Hobbies: /(hobby|hobbies|enjoy|loved|free time|interest)/,
    "Community Involvement": /(communit|volunteer|charity|help)/,
    "Military Service": /(military|army|air force|served|war)/,
    Stories: /(story|stories|remember|memory|anecdote)/,
  };
  for (const [title, re] of Object.entries(keywordMap)) {
    if (re.test(q)) {
      const section = m.sections.find((s) => s.title === title);
      if (section) return section.body;
    }
  }
  if (/(accomplish|achiev|proud|legacy)/.test(q)) {
    const picks = m.sections.filter((s) =>
      ["Career", "Community Involvement", "Military Service"].includes(s.title)
    );
    if (picks.length) return picks.map((s) => s.body).join(" ");
  }
  return NO_INFO(m);
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { memorialId, question } = body || {};
  const memorial = getMemorial(memorialId);
  if (!memorial || typeof question !== "string" || !question.trim()) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const q = question.slice(0, 500);

  const apiKey = process.env.OPENAI_API_KEY; // stays on the server
  if (!apiKey) {
    return NextResponse.json({ answer: localAnswer(memorial, q), mode: "local" });
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content:
              "You are the Memoriam memorial assistant. Answer visitors' questions about one person, warmly and respectfully, using ONLY the memorial information below. " +
              "If the answer is not in that information, say you don't have that information on the memorial page yet. Never invent facts, dates, names or relatives. Keep answers short.\n\n" +
              "MEMORIAL INFORMATION:\n" +
              buildContext(memorial),
          },
          { role: "user", content: q },
        ],
      }),
    });

    if (!res.ok) throw new Error(`OpenAI ${res.status}`);
    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error("Empty answer");
    return NextResponse.json({ answer, mode: "openai" });
  } catch {
    // Network or API trouble at the fair: fall back instead of failing
    return NextResponse.json({ answer: localAnswer(memorial, q), mode: "local" });
  }
}
