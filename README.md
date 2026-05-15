# Emmanuel Evangelical Mission Website

This site is ready for free Vercel hosting with separate public pages and a hidden content helper dashboard.

## Pages

- `index.html` - home, events, YouTube messages, AI helper
- `about.html` - about page
- `contact.html` - contact and prayer wall
- `bible.html` - Tamil, Malayalam, Hindi Bible reader
- `admin.html` - helper page for preparing event and YouTube updates

`admin.html` is not linked from the public navigation. It does not write to the live website directly; it prepares JSON that you paste into `content.json` on GitHub.

## Vercel setup

1. Push this folder to GitHub.
2. Import the project in Vercel.
3. Deploy.

No Redis, KV, or paid database is required for events and YouTube links.

## Updating events and YouTube videos

1. Open `/admin.html` on your website.
2. Add event or YouTube details.
3. Copy the generated JSON.
4. Open `content.json` in GitHub.
5. Click edit.
6. Replace the whole file with the copied JSON.
7. Commit changes.
8. Vercel redeploys automatically.

The public home page reads `content.json`, so updates appear after Vercel finishes redeploying.

## Full Bible setup

The Bible page uses free eBible.org chapter pages for Tamil, Malayalam, and Hindi:

- Tamil: Biblica Open Indian Tamil Contemporary Version
- Malayalam: Malayalam Bible from eBible.org
- Hindi: Biblica Open Hindi Contemporary Version

No paid Bible database or environment variables are required.

## Local testing

Install dependencies:

```text
npm install
```

Run Vercel locally:

```text
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/admin.html
```
