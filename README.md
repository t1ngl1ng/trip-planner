# Japan Trip Planner (offline phone app)

One web app, 5 files: `index.html`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`.
The app itself starts blank, so nothing personal sits on the public website. The family itinerary
lives in a plan file (`Downloads/Family/Jpn 2612/Japan-trip-plan-START.json`): send it to each phone and
tap **📥 Load a plan file** on first open.

## Put it online once (so phones can install it)
For it to work offline from the home screen, it needs a one-time HTTPS address. Two free options:

**GitHub Pages (permanent):** make a new public repository, upload these 5 files, then go to
Settings → Pages → Branch `main` / root → Save. You get `https://<you>.github.io/<repo>/`.

**Netlify Drop (quickest):** go to app.netlify.com/drop and drag this folder onto it. Sign up for a free
account to claim the site; otherwise it's deleted after an hour.

Then on each phone, open the link in Chrome → ⋮ → **Add to Home screen / Install app**.
(iPhone: Safari → Share → Add to Home Screen.) After the first open it works with no internet.

## Your data
- Each phone saves its plan in the browser automatically. Nothing is uploaded anywhere.
- **Family & share → Share plan file** sends a `.json` file through WhatsApp or email. The other person
  taps **Import → Merge**. The newest version of each item is kept, so everyone's changes combine.
- Export a backup now and then. Clearing Chrome's site data deletes the plan on that phone.
- The QR code opens the app's web address. The plan itself is too big for a QR code, so send the file
  or the "Copy plan as a link" link.

## Updating the app later
Upload a new `index.html` and change `VERSION` in `sw.js` (e.g. `jtp-v2`). Phones pick up the new
version the next time they open it online. Plan data on each phone is not affected.
