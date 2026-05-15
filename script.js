const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const prayerForm = document.querySelector(".prayer-form");
const prayerInput = document.querySelector("#request");
const prayerItems = document.querySelector(".prayer-items");
const eventForm = document.querySelector("#eventForm");
const videoForm = document.querySelector("#videoForm");
const eventList = document.querySelector("#eventList");
const videoList = document.querySelector("#videoList");
const bibleLanguage = document.querySelector("#bibleLanguage");
const bibleBook = document.querySelector("#bibleBook");
const bibleChapter = document.querySelector("#bibleChapter");
const bibleTitle = document.querySelector("#bibleTitle");
const bibleText = document.querySelector("#bibleText");
const bibleLicense = document.querySelector("#bibleLicense");
const aiForm = document.querySelector("#aiForm");
const aiMode = document.querySelector("#aiMode");
const aiPrompt = document.querySelector("#aiPrompt");
const aiOutput = document.querySelector("#aiOutput");
const contentOutput = document.querySelector("#contentOutput");
const copyContent = document.querySelector("#copyContent");

if (year) year.textContent = new Date().getFullYear();

const store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const defaultEvents = [
  {
    id: crypto.randomUUID(),
    title: "Sunday Worship Service",
    date: "2026-05-17T18:30",
    location: "Emmanuel Evangelical Mission",
    description: "Join us for worship, prayer, Bible teaching, and fellowship.",
  },
  {
    id: crypto.randomUUID(),
    title: "Friday Prayer Fellowship",
    date: "2026-05-22T10:00",
    location: "Church prayer hall",
    description: "A focused time of intercession for families, leaders, and North India.",
  },
];

let events = store.get("eem-events", defaultEvents);
let videos = store.get("eem-videos", []);
const savedPrayers = store.get("eem-prayers", []);

const fetchContent = async () => {
  try {
    const response = await fetch("content.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Content file unavailable");
    const content = await response.json();
    events = Array.isArray(content.events) ? content.events : [];
    videos = Array.isArray(content.videos) ? content.videos : [];
    store.set("eem-events", events);
    store.set("eem-videos", videos);
  } catch {
    events = store.get("eem-events", defaultEvents);
    videos = store.get("eem-videos", []);
  }
};

const saveDraft = () => {
  store.set("eem-events", events);
  store.set("eem-videos", videos);
  renderContentOutput();
};

const renderContentOutput = () => {
  if (!contentOutput) return;
  contentOutput.value = JSON.stringify({ events, videos }, null, 2);
};

const updateHeader = () => {
  if (header) header.classList.toggle("scrolled", window.scrollY > 20);
};

const closeMenu = () => {
  if (!nav || !toggle) return;
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open navigation");
};

updateHeader();
window.addEventListener("scroll", updateHeader);

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) closeMenu();
  });
}

const formatEventDate = (value) => {
  if (!value) return "Date to be announced";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const createButton = (label, onClick) => {
  const button = document.createElement("button");
  button.className = "small-button";
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
};

const renderEvents = () => {
  if (!eventList) return;
  eventList.innerHTML = "";

  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No events uploaded yet.";
    eventList.append(empty);
    return;
  }

  events
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((eventItem) => {
      const card = document.createElement("article");
      card.className = "event-card";
      const date = document.createElement("span");
      date.className = "event-date";
      date.textContent = formatEventDate(eventItem.date);
      const title = document.createElement("h3");
      title.textContent = eventItem.title;
      const location = document.createElement("p");
      location.textContent = eventItem.location || "Location to be announced";
      const description = document.createElement("p");
      description.textContent = eventItem.description || "More details coming soon.";
      card.append(date, title, location, description);

      if (eventForm) {
        const actions = document.createElement("div");
        actions.className = "card-actions";
        actions.append(
          createButton("Delete", () => {
            events = events.filter((item) => item.id !== eventItem.id);
            saveDraft();
            renderEvents();
          })
        );
        card.append(actions);
      }

      eventList.append(card);
    });
};

const getYouTubeId = (url) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.slice(1);
    if (parsed.searchParams.has("v")) return parsed.searchParams.get("v");
    const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];
    const liveMatch = parsed.pathname.match(/\/live\/([^/?]+)/);
    if (liveMatch) return liveMatch[1];
    const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
    return shortsMatch ? shortsMatch[1] : "";
  } catch {
    return "";
  }
};

const renderVideos = () => {
  if (!videoList) return;
  videoList.innerHTML = "";

  if (!videos.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No YouTube messages uploaded yet.";
    videoList.append(empty);
    return;
  }

  videos.forEach((video) => {
    const videoId = getYouTubeId(video.url);
    const card = document.createElement("article");
    card.className = "video-card";

    if (videoId) {
      const iframe = document.createElement("iframe");
      iframe.className = "video-frame";
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.title = video.title;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      card.append(iframe);
    }

    const body = document.createElement("div");
    body.className = "video-card-body";
    const title = document.createElement("h3");
    title.textContent = video.title;
    const description = document.createElement("p");
    description.textContent = video.description || "Watch this message from the church.";
    body.append(title, description);

    if (videoForm) {
      const actions = document.createElement("div");
      actions.className = "card-actions";
      actions.append(
        createButton("Delete", () => {
          videos = videos.filter((item) => item.id !== video.id);
          saveDraft();
          renderVideos();
        })
      );
      body.append(actions);
    }

    card.append(body);
    videoList.append(card);
  });
};

if (eventForm) {
  eventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    events.push({
      id: crypto.randomUUID(),
      title: document.querySelector("#eventTitle").value.trim(),
      date: document.querySelector("#eventDate").value,
      location: document.querySelector("#eventLocation").value.trim(),
      description: document.querySelector("#eventDescription").value.trim(),
    });
    saveDraft();
    eventForm.reset();
    renderEvents();
  });
}

if (videoForm) {
  videoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    videos.unshift({
      id: crypto.randomUUID(),
      title: document.querySelector("#videoTitle").value.trim(),
      url: document.querySelector("#videoUrl").value.trim(),
      description: document.querySelector("#videoDescription").value.trim(),
    });
    saveDraft();
    videoForm.reset();
    renderVideos();
  });
}

if (copyContent && contentOutput) {
  copyContent.addEventListener("click", async () => {
    await navigator.clipboard.writeText(contentOutput.value);
    copyContent.textContent = "Copied";
    window.setTimeout(() => {
      copyContent.textContent = "Copy JSON";
    }, 1800);
  });
}

const renderPrayers = () => {
  if (!prayerItems) return;
  prayerItems.innerHTML = "";
  savedPrayers.slice(-4).forEach((prayer) => {
    const item = document.createElement("div");
    item.className = "prayer-item";
    item.textContent = prayer;
    prayerItems.prepend(item);
  });
};

if (prayerForm && prayerInput) {
  prayerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const request = prayerInput.value.trim();
    if (!request) {
      prayerInput.focus();
      return;
    }
    savedPrayers.push(request);
    store.set("eem-prayers", savedPrayers);
    prayerInput.value = "";
    renderPrayers();
  });
}

const getBible = () => window.EEM_BIBLE_DATA || {};
let liveBible = false;

const renderBibleBooks = async () => {
  if (!bibleLanguage || !bibleBook) return;
  const language = bibleLanguage.value;
  const bible = getBible()[language];
  bibleBook.innerHTML = "";
  bibleChapter.innerHTML = "";
  bibleText.innerHTML = "";
  liveBible = false;

  try {
    const response = await fetch(`/api/bible?language=${encodeURIComponent(language)}`);
    const payload = await response.json();
    if (payload.configured && Array.isArray(payload.data)) {
      liveBible = true;
      payload.data.forEach((book) => {
        const option = document.createElement("option");
        option.value = book.id;
        option.textContent = book.name;
        bibleBook.append(option);
      });
      if (bibleLicense) bibleLicense.textContent = "Full Bible is loaded from your licensed Bible API configuration.";
      await renderBibleChapters();
      return;
    }
  } catch {
    liveBible = false;
  }

  Object.keys(bible.books).forEach((bookName) => {
    const option = document.createElement("option");
    option.value = bookName;
    option.textContent = bookName;
    bibleBook.append(option);
  });

  if (bibleLicense) bibleLicense.textContent = bible.licenseNote;
  renderBibleChapters();
};

const renderBibleChapters = async () => {
  if (!bibleLanguage || !bibleBook || !bibleChapter) return;
  if (liveBible) {
    bibleChapter.innerHTML = "";
    const response = await fetch(
      `/api/bible?language=${encodeURIComponent(bibleLanguage.value)}&book=${encodeURIComponent(bibleBook.value)}`
    );
    const payload = await response.json();
    if (payload.configured && Array.isArray(payload.data)) {
      payload.data.forEach((chapter) => {
        const option = document.createElement("option");
        option.value = chapter.id;
        option.textContent = chapter.reference || `Chapter ${chapter.number}`;
        bibleChapter.append(option);
      });
      await renderBibleText();
      return;
    }
  }

  const bible = getBible()[bibleLanguage.value];
  const book = bible.books[bibleBook.value];
  bibleChapter.innerHTML = "";

  book.chapters.forEach((chapter, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `Chapter ${index + 1}`;
    bibleChapter.append(option);
  });

  renderBibleText();
};

const renderBibleText = async () => {
  if (!bibleLanguage || !bibleBook || !bibleChapter || !bibleTitle || !bibleText) return;
  if (liveBible) {
    bibleText.innerHTML = "";
    bibleTitle.textContent = bibleChapter.options[bibleChapter.selectedIndex]?.textContent || "Bible";
    const response = await fetch(
      `/api/bible?language=${encodeURIComponent(bibleLanguage.value)}&chapter=${encodeURIComponent(
        bibleChapter.value
      )}`
    );
    const payload = await response.json();
    if (payload.configured && payload.data) {
      const line = document.createElement("p");
      line.textContent = payload.data.content || "";
      bibleText.append(line);
    }
    return;
  }

  const bible = getBible()[bibleLanguage.value];
  const book = bible.books[bibleBook.value];
  const chapterIndex = Number(bibleChapter.value) || 0;
  const verses = book.chapters[chapterIndex] || [];
  bibleTitle.textContent = `${bibleBook.value} ${chapterIndex + 1}`;
  bibleText.innerHTML = "";

  verses.forEach((verse, index) => {
    const line = document.createElement("p");
    const number = document.createElement("sup");
    number.textContent = String(index + 1);
    line.append(number, document.createTextNode(` ${verse}`));
    bibleText.append(line);
  });
};

if (bibleLanguage) {
  bibleLanguage.addEventListener("change", renderBibleBooks);
  bibleBook.addEventListener("change", renderBibleChapters);
  bibleChapter.addEventListener("change", renderBibleText);
  renderBibleBooks();
}

const localAiResponse = (mode, topic) => {
  const responses = {
    prayer: `Prayer points for ${topic}:\n\n1. Pray for open hearts and homes.\n2. Pray for protection and wisdom for church workers.\n3. Pray for healing in families and communities.\n4. Pray that the love of Christ will be seen through humble service.`,
    event: `${topic}\n\nJoin Emmanuel Evangelical Mission for a meaningful time of worship, prayer, and encouragement. Come with your family and invite someone who needs hope. Together we will seek God for North India and encourage one another in faith.`,
    youtube: `${topic}\n\nIn this message from Emmanuel Evangelical Mission, we reflect on God's Word and the call to pray for North India. Watch, share, and join us in prayer for families, churches, villages, and cities.`,
    study: `Bible study outline for ${topic}:\n\nOpening prayer\nKey Scripture reading\nMain truth from the passage\nDiscussion: What does this teach us about God?\nApplication: How should we pray and serve this week?\nClosing prayer for North India`,
  };
  return responses[mode];
};

if (aiForm) {
  aiForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const topic = aiPrompt.value.trim() || "North India";
    const mode = aiMode.value;
    aiOutput.textContent = "Preparing suggestion...";

    if (window.CHURCH_AI_ENDPOINT) {
      try {
        const response = await fetch(window.CHURCH_AI_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, topic }),
        });
        const data = await response.json();
        aiOutput.textContent = data.text || localAiResponse(mode, topic);
        return;
      } catch {
        aiOutput.textContent = localAiResponse(mode, topic);
        return;
      }
    }

    aiOutput.textContent = localAiResponse(mode, topic);
  });
}

const initContent = async () => {
  await fetchContent();
  renderContentOutput();
  renderEvents();
  renderVideos();
};

initContent();
renderPrayers();
