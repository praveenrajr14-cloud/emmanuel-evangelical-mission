const API_BIBLE_BASE = "https://api.scripture.api.bible/v1";

const bibleIds = {
  tamil: process.env.API_BIBLE_TAMIL_ID,
  malayalam: process.env.API_BIBLE_MALAYALAM_ID,
  hindi: process.env.API_BIBLE_HINDI_ID
};

const json = (res, status, data) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  res.end(JSON.stringify(data));
};

const bibleFetch = async (path) => {
  const response = await fetch(`${API_BIBLE_BASE}${path}`, {
    headers: { "api-key": process.env.API_BIBLE_KEY || "" }
  });

  if (!response.ok) {
    throw new Error(`Bible API request failed: ${response.status}`);
  }

  return response.json();
};

module.exports = async (req, res) => {
  try {
    if (!process.env.API_BIBLE_KEY) {
      return json(res, 200, {
        configured: false,
        message: "Add API_BIBLE_KEY and language Bible IDs in Vercel to enable full Bible."
      });
    }

    const url = new URL(req.url, `https://${req.headers.host}`);
    const language = url.searchParams.get("language") || "tamil";
    const bibleId = bibleIds[language];

    if (!bibleId) {
      return json(res, 400, { error: `Bible ID is not configured for ${language}.` });
    }

    const bookId = url.searchParams.get("book");
    const chapterId = url.searchParams.get("chapter");

    if (chapterId) {
      const data = await bibleFetch(`/bibles/${bibleId}/chapters/${chapterId}?content-type=text`);
      return json(res, 200, { configured: true, mode: "chapter", data: data.data });
    }

    if (bookId) {
      const data = await bibleFetch(`/bibles/${bibleId}/books/${bookId}/chapters`);
      return json(res, 200, { configured: true, mode: "chapters", data: data.data });
    }

    const data = await bibleFetch(`/bibles/${bibleId}/books`);
    return json(res, 200, { configured: true, mode: "books", data: data.data });
  } catch (error) {
    return json(res, 500, { error: error.message || "Bible API error" });
  }
};
