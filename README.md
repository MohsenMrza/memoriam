# Memoriam

AI-powered digital memorial platform (career fair prototype): searchable memorial
pages with a wiki-style bio, a cemetery map mockup, an AI memorial assistant, and
a grave scanner that reads a headstone photo and opens that person's page.

Start here: **[GUIDE.md](GUIDE.md)** (running it, adding family, deploying, fair day).

Quick start (Windows): double-click `start-memoriam.bat`.

Stack: Next.js 14, Tailwind CSS, Framer Motion, Tesseract.js (OCR in the browser).

- `data/memorials.js`: the people (edit this)
- `components/GraveScanner.jsx`: photo to text to memorial
- `app/api/chat/route.js`: AI assistant (needs `OPENAI_API_KEY`, optional)
