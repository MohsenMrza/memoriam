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
    photo: "/photos/cameranmirza.png",
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
  {
    id: "mohammadi-begum-khan",
    name: "Mohammadi Begum Khan",
    // Name shown on the grave, in case it differs (e.g. includes "P.Eng.")
    headstoneText: "MOHAMMADI BEGUM KHAN",
    born: "1930",
    died: "1999",
    photo: "/photos/mohammadibkhan.jpg",
    cemetery: "Pine Ridge Memorial Gardens", 
    section: "B", 
    plot: "12", 
    sections: [
      {
        title: "Biography",
        body: "Mohammadi arrived to Canada in 1952 and was one of the first of the Khan family to settle in Toronto.",
      },
      {
        title: "Family",
        body: "Mohammadi was married to Atahullah Khan, They had 4 children, Arshad, Osman, Ghosiya, and Ahmedi.",
      },
    ],
  },
  {
    id: "m-fazaluddin-khan",
    name: "Fazal Khan",
    // Name shown on the grave, in case it differs (e.g. includes "P.Eng.")
    headstoneText: "M. FAZALUDDIN KHAN",
    born: "1929",
    died: "2017",
    photo: "/photos/fazalkhan.jpg",
    cemetery: "Pine Ridge Memorial Gardens", 
    section: "A", // TODO: edit
    plot: "53", // TODO: edit
    sections: [
      {
        title: "Biography",
        body: "Fazal is remembered with love by his family. This page is a place to keep his story: who he was, what he accomplished, and what he meant to the people around him.",
      },
      {
        title: "Career",
        body: "Fazal was a licensed Professional Engineer (P.Eng.). He's done extensive work on multiple major highways in Canada (such as the 401 and 407), and was also a lead in designing the Ontario Science Center.",
      },
      {
        title: "Family",
        body: "Fazal was married to Rashida Mirza and has two children, Arman and Romana Mirza.",
      },
      {
        title: "Stories",
        body: "Fazal was an avid golf player, he even wrote and published a book titled The art of Golf in 2019.",
      },
    ],
  },
  {
    id: "syed-attaullah-khan",
    name: "Attaullah Khan",
    // Name shown on the grave, in case it differs (e.g. includes "P.Eng.")
    headstoneText: "SYED ATTAULLAH KHAN",
    born: "1925",
    died: "2016",
    photo: null,
    cemetery: "Pine Ridge Memorial Gardens", 
    section: "B", // TODO: edit
    plot: "13", // TODO: edit
    sections: [
      {
        title: "Biography",
        body: "Attaullah is remembered with love by his family. This page is a place to keep his story: who he was, what he accomplished, and what he meant to the people around him.",
      },
      {
        title: "Career",
        body: "Attaullah was a licensed Professional Architect.",
      },
      {
        title: "Family",
        body: "Attaullah was married to Rawanda and had 2 children, Fahad, and Fatima.",
      },
      {
        title: "Stories",
        body: "Attaullah made chairs.",
      },
    ],
  },
  {
    id: "mukhtar-unissa-begum",
    name: "Mukhtar Begum",
    // Name shown on the grave, in case it differs (e.g. includes "P.Eng.")
    headstoneText: "MUKHTAR UNISSA BEGUM",
    born: "1927",
    died: "2021",
    photo: null,
    cemetery: "Pine Ridge Memorial Gardens", 
    section: "c", // TODO: edit
    plot: "23", // TODO: edit
    sections: [
      {
        title: "Biography",
        body: "Attaullah is remembered with love by his family. This page is a place to keep his story: who he was, what he accomplished, and what he meant to the people around him.",
      },
      {
        title: "Career",
        body: "Attaullah was a licensed Professional Architect.",
      },
      {
        title: "Family",
        body: "Attaullah was married to Rawanda and had 2 children, Fahad, and Fatima.",
      },
      {
        title: "Stories",
        body: "Attaullah made chairs.",
      },
    ],
  },
  


];
  

/* ============================ template for future refrence ============================

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

  const joined = tokens.join(" ");

  const results = memorials.map((m) => {
    // Use BOTH name and headstone text
    const searchableText = normalize(
      `${m.name} ${m.headstoneText || ""}`
    );

    const nameWords = searchableText
      .split(" ")
      .filter((w) => w.length > 1);

    let matches = 0;
    let score = 0;

    for (const nw of nameWords) {
      let best = 0;

      for (const token of tokens) {
        best = Math.max(best, similarity(nw, token));
      }

      if (joined.includes(nw)) {
        best = 1;
      }

      if (best >= 0.7) {
        matches++;
      }

      score += best;
    }

    const avgScore = score / nameWords.length;

    // Check years
    const years = [
      String(m.born).match(/\d{4}/)?.[0],
      String(m.died).match(/\d{4}/)?.[0],
    ].filter(Boolean);

    let yearHits = 0;

    for (const year of years) {
      if (joined.includes(year)) {
        yearHits++;
      }
    }

    const yearBonus = yearHits * 0.2;

    let confidence = avgScore + yearBonus;

    confidence = Math.min(confidence, 1);

    return {
      memorial: m,
      confidence,
      matches,
      yearHits,
    };
  });

  return results
    .filter((r) => r.confidence >= 0.45)
    .sort((a, b) => b.confidence - a.confidence);
}
