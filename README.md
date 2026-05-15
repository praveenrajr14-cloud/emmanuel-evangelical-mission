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

Full Tamil, Malayalam, and Hindi Bible text must come from a licensed or public-domain source. This project includes a live Bible API proxy for API.Bible.

Add these Vercel environment variables:

```text
API_BIBLE_KEY=your-api-bible-key
API_BIBLE_TAMIL_ID=licensed-tamil-bible-id
API_BIBLE_MALAYALAM_ID=licensed-malayalam-bible-id
API_BIBLE_HINDI_ID=licensed-hindi-bible-id
```

Without those variables, the Bible page falls back to sample passages in `bible-data.js`.

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
