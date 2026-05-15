# Emmanuel Evangelical Mission Website

This site is ready for Vercel hosting with separate public pages and a hidden admin dashboard.

## Pages

- `index.html` - home, events, YouTube messages, AI helper
- `about.html` - about page
- `contact.html` - contact and prayer wall
- `bible.html` - Tamil, Malayalam, Hindi Bible reader
- `admin.html` - dashboard for events and YouTube links

`admin.html` is not linked from the public navigation, but real privacy requires `ADMIN_PASSWORD`.

## Vercel setup

1. Push this folder to GitHub.
2. Import the project in Vercel.
3. Add Redis/KV storage in Vercel or Upstash Redis.
4. Add these environment variables in Vercel:

```text
ADMIN_PASSWORD=choose-a-strong-password
KV_REST_API_URL=your-redis-rest-url
KV_REST_API_TOKEN=your-redis-rest-token
```

If your Redis provider names the variables differently, the API also accepts:

```text
UPSTASH_REDIS_REST_URL=your-redis-rest-url
UPSTASH_REDIS_REST_TOKEN=your-redis-rest-token
```

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
