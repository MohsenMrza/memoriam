# Memoriam: guide

## 1. Start it (easiest way, Windows)

Double-click **`start-memoriam.bat`**. First run installs everything (a couple of
minutes), then it builds the site, opens your browser, and prints the addresses
for your phone. Leave the black window open while presenting. Close it to stop.

Needs Node.js (LTS) from https://nodejs.org installed once.

Manual way, in PowerShell inside this folder:

```powershell
npm install        # once
npm run dev        # editing mode (auto-refreshes when you save)
# or, for presenting (faster and steadier):
npm run build
npm start -- -H 0.0.0.0
```

## 2. Add / remove people

Everything lives in **`data/memorials.js`**.

- **Remove**: delete that person's `{ ... },` block.
- **Add**: copy the TEMPLATE block at the bottom of the file into the list.
- Spell `name` **exactly as on the headstone**. The photo scanner matches against it.
- `id` must be unique, lowercase, no spaces. It becomes the page address.
- Portrait: save the image in `public/photos/` and set `photo: "/photos/name.jpg"`.
  Use `photo: null` to show initials instead.
- `cemetery`, `section`, `plot` feed the map label and the search.
- `sections` are the expandable bio sections. Use any titles you like.
- Save the file. In `npm run dev` the page updates by itself. If you are running
  the built version (`npm start`), stop it and run `npm run build` again.

The AI assistant reads whatever you write in a person's sections and answers only
from that, so more detail gives better answers.

## 3. Grave scanner tips (for the table print-out)

- Print the photo large (at least half a page), in colour or black and white.
  Both were tested.
- Matte paper beats glossy: glare is the main thing that breaks it.
- Tell recruiters: stand straight above the page, fill the frame with the plaque,
  tap **Take a photo**.
- The scanner runs inside the phone's browser. It does not need an account or an
  API key, and the OCR engine is served from the site itself.
- Before the fair: scan your print-out with a couple of different phones.

## 4. Put it online (Vercel)

Option A: no GitHub, from this folder:

```powershell
npx vercel login
npx vercel --prod
```

Answer the prompts (project name, e.g. `memoriam-demo`). You get a
`https://<name>.vercel.app` link.

Option B: GitHub + Vercel (auto-updates when you push):

1. Create an empty repo on github.com.
2. In this folder:
   ```powershell
   git init
   git add .
   git commit -m "Memoriam"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
3. On vercel.com choose **Add New > Project**, import the repo, click **Deploy**.

To use the real AI on the deployed site: Vercel project > Settings > Environment
Variables > add `OPENAI_API_KEY`, then redeploy. Without it the assistant uses the
built-in answerer.

`memoriam.vercel.app` is already taken, so pick another project name
(`memoriam-demo`, `memoriam-yourname`, ...). You can rename it in Vercel's settings.

## 5. Fair day plan

| Setup | When to use |
| --- | --- |
| **Vercel link on a QR code** | Main plan. Phones use their own mobile data, so gym Wi-Fi hardly matters. |
| **Your laptop + phone hotspot** | Backup. Run `start-memoriam.bat`, connect the laptop and recruiters' phones to your hotspot, use the `http://192.168.x.x:3000` address it prints. No internet needed at all. |
| **Screen recording** | Last resort if both fail. |

Notes:
- The first scan downloads about 7 MB (the OCR engine). It starts loading when the
  Scan page opens, so open it once on a phone before the crowd arrives.
- Print the QR code and the headstone photo side by side on the table.
- Keep your laptop plugged in with sleep turned off.
