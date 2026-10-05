// ============================================================================
//  MEMORIAM: memorial records
//
//  This file is the whole "database" for the demo. To add a person, copy the
//  TEMPLATE block at the bottom into the `memorials` list below (before the
//  closing `];`), fill it in, save. To remove someone, delete their block.
//  The site reloads by itself while `npm run dev` is running.
//
//  Rules:
//   - `id` must be unique, lowercase, no spaces (it becomes the page URL:
//     /memorial/cameran-mirza)
//   - `name` should be spelled exactly as it appears on the headstone, because
//     that's what the photo scanner matches against
//   - `born` / `died` are years (or full dates) as text
//   - `photo` is optional: put an image in the /public/photos folder and use
//     "/photos/yourfile.jpg", or leave it as null to show initials
//   - `sections` can be anything: add, remove or rename them freely
// ============================================================================

export const memorials = [
  {
    id: "cameran-mirza",
    name: "Cameran Mirza",
    // Name shown on the grave, in case it differs (e.g. includes "P.Eng.")
    headstoneText: "CAMERAN MIRZA P.ENG.",
    born: "1935",
    died: "2022",
    photo: cameranmirza.png,
    cemetery: "Pine Ridge Memorial Gardens", 
    section: "A", // TODO: edit
    plot: "61", // TODO: edit
    sections: [
      {
        title: "Biography",
        body: "Cameran Mirza (1935–2022) is remembered with love by his family. This page is a place to keep his story: who he was, what he accomplished, and what he meant to the people around him.",
      },
      {
        title: "Career",
        body: "Cameran was a licensed Professional Engineer (P.Eng.). He's done extensive work on multiple major highways in Canada (such as the 401 and 407), and was also a lead in designing the Ontario Science Center.",
      },
      {
        title: "Family",
        body: "Cameran was married to Rashida Mirza and has two children, Arman and Romana Mirza.",
      },
      {
        title: "Stories",
        body: "Cameran was an avid golf player, he even wrote and published a book titled The art of Golf in 2019.",
      },
    ],
  },
  // ---- Add more people below this line ----
];

//{
  //id: "karamat-khan",
  //name: "Karamat Khan",
  //headstoneText: "KARAMAT KHAN",
  //born: ""
/* ============================ TEMPLATE (copy me) ============================

  {
    id: "first-last",
    name: "First Last",
    headstoneText: "FIRST LAST",
    born: "1940",
    died: "2020",
    photo: null,
    cemetery: "Cemetery Name",
    section: "B",
    plot: "12",
    sections: [
      { title: "Biography", body: "Their life story." },
      { title: "Family", body: "Spouse, children, grandchildren." },
      { title: "Career", body: "What they did for work." },
    ],
  },

============================================================================ */

export function getMemorial(id) {
  return memorials.find((m) => m.id === id);
}

// Lowercase, strip punctuation/accents so "O'Connor" matches "oconnor".
function normalize(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Levenshtein distance, so slightly misread text still matches.
function distance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

function similarity(a, b) {
  if (!a || !b) return 0;
  // very short words (Li, Wei, Ali) match too easily against noise,
  // so they must be read exactly
  if (a.length <= 3 || b.length <= 3) return a === b ? 1 : 0;
  return 1 - distance(a, b) / Math.max(a.length, b.length);
}

// Searches name, family name, cemetery and grave location ("section c plot 14").
export function searchMemorials(query) {
  const q = normalize(query || "");
  if (!q) return [];
  const words = q.split(" ").filter(Boolean);

  return memorials
    .map((m) => {
      const nameNorm = normalize(m.name);
      const nameWords = nameNorm.split(" ");
      const location = normalize(
        `${m.cemetery} section ${m.section} plot ${m.plot} ${m.section}${m.plot}`
      );
      const haystack = `${nameNorm} ${location} ${m.born} ${m.died}`;

      let score = 0;
      for (const w of words) {
        if (haystack.includes(w)) {
          score += 2;
        } else {
          const tolerance = w.length > 5 ? 2 : w.length > 3 ? 1 : 0;
          if (
            tolerance &&
            nameWords.some((nw) => distance(w, nw) <= tolerance)
          ) {
            score += 1;
          }
        }
      }
      return { memorial: m, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.memorial);
}

// Matches raw OCR text from a headstone photo to a memorial.
// Every word of the person's name must be found (allowing OCR typos), and
// matching birth/death years add confidence. Returns best matches first:
//   [{ memorial, confidence: 0..1 }]
export function matchFromText(ocrText) {
  const tokens = normalize(ocrText)
    .split(" ")
    .filter((t) => t.length > 1);
  if (tokens.length === 0) return [];
  const joined = tokens.join("");

  const results = memorials.map((m) => {
    const nameWords = normalize(m.name)
      .split(" ")
      .filter((w) => w.length > 1);
    if (nameWords.length === 0) return { memorial: m, confidence: 0 };

    // best similarity of each name word against any OCR token
    const wordScores = nameWords.map((nw) => {
      let best = 0;
      for (const t of tokens) best = Math.max(best, similarity(nw, t));
      // also catch a name glued to a neighbour ("CAMERANMIRZA")
      if (joined.includes(nw)) best = 1;
      return best;
    });

    const weakest = Math.min(...wordScores);
    const avg = wordScores.reduce((a, b) => a + b, 0) / wordScores.length;

    // years bonus
    const years = [m.born, m.died]
      .map((y) => String(y).match(/\d{4}/)?.[0])
      .filter(Boolean);
    const yearHits = years.filter((y) => joined.includes(y)).length;
    const yearBonus = years.length ? (yearHits / years.length) * 0.15 : 0;

    // a name word that's barely there means it's probably a different person
    const confidence = weakest < 0.6 ? avg * 0.5 : Math.min(1, avg * 0.85 + yearBonus);
    return { memorial: m, confidence };
  });

  return results
    .filter((r) => r.confidence >= 0.7)
    .sort((a, b) => b.confidence - a.confidence);
}
