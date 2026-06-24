// ══════════════════════════════════════════════════════════════════════════
//  album.js  —  Individual album page (Google Drive folders only)
// ══════════════════════════════════════════════════════════════════════════

const params   = new URLSearchParams(location.search);
const folderId = params.get("id");
const title    = params.get("title") || "Album";
const date     = params.get("date")  || "";

document.getElementById("album-title").textContent    = title;
document.getElementById("album-subtitle").textContent = date;
document.title = `${title} — ${GALLERY_TITLE}`;

const grid  = document.getElementById("photos-grid");
const lb    = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCap = document.getElementById("lb-caption");

let photos  = [];  // { id, name, thumb, full }
let current = 0;

// ── Google Drive fetch ────────────────────────────────────────────────────

async function loadPhotos() {
  if (!folderId) {
    grid.innerHTML = `<div class="error-msg">No album specified.</div>`;
    return;
  }

  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === "YOUR_API_KEY_HERE") {
    grid.innerHTML = `
      <div class="error-msg">
        <strong>API key not set.</strong><br>
        Open <code>photos/js/config.js</code> and add your Google API key to view Drive photos.
      </div>`;
    return;
  }

  let allFiles = [];
  let pageToken = null;

  try {
    do {
      const tokenParam = pageToken ? `&pageToken=${pageToken}` : "";
      const url = `https://www.googleapis.com/drive/v3/files`
        + `?q='${folderId}'+in+parents+and+mimeType+contains+'image/'`
        + `+and+trashed%3Dfalse`
        + `&orderBy=name`
        + `&pageSize=100`
        + `&fields=nextPageToken,files(id,name)`
        + `&key=${GOOGLE_API_KEY}`
        + tokenParam;

      const res  = await fetch(url);
      const data = await res.json();

      if (data.error) throw new Error(data.error.message);

      allFiles = allFiles.concat(data.files || []);
      pageToken = data.nextPageToken || null;
    } while (pageToken);

  } catch (err) {
    grid.innerHTML = `<div class="error-msg">
      <strong>Could not load photos.</strong><br>
      ${escHtml(err.message)}<br><br>
      Make sure:<br>
      • The Drive folder is set to "Anyone with the link can view"<br>
      • Your API key has Drive API enabled<br>
      • There are no API key restrictions blocking this domain
    </div>`;
    return;
  }

  if (allFiles.length === 0) {
    grid.innerHTML = `<div class="loading">No photos found in this folder.</div>`;
    return;
  }

  photos = allFiles.map(f => ({
    id:    f.id,
    name:  f.name,
    thumb: `https://lh3.googleusercontent.com/d/${f.id}=w400`,
    full:  `https://lh3.googleusercontent.com/d/${f.id}=w1600`
  }));

  renderTiles();
}

// ── Render tiles ──────────────────────────────────────────────────────────

function renderTiles() {
  grid.innerHTML = "";
  photos.forEach((photo, idx) => {
    const tile = document.createElement("div");
    tile.className = "photo-tile";
    tile.innerHTML = `
      <img src="${photo.thumb}" alt="${escHtml(photo.name)}" loading="lazy"
           onerror="this.src='${photo.full}'">
      <div class="photo-overlay"><span>${escHtml(photo.name)}</span></div>`;
    tile.addEventListener("click", () => openLightbox(idx));
    grid.appendChild(tile);
  });
}

// ── Lightbox ──────────────────────────────────────────────────────────────

function openLightbox(idx) {
  current = idx;
  showPhoto();
  lb.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lb.classList.add("hidden");
  document.body.style.overflow = "";
  lbImg.src = "";
}

function showPhoto() {
  const p = photos[current];
  lbImg.src = p.full;
  lbCap.textContent = `${p.name}  (${current + 1} / ${photos.length})`;
}

document.getElementById("lb-close").addEventListener("click", closeLightbox);
document.getElementById("lb-prev").addEventListener("click", () => {
  current = (current - 1 + photos.length) % photos.length;
  showPhoto();
});
document.getElementById("lb-next").addEventListener("click", () => {
  current = (current + 1) % photos.length;
  showPhoto();
});

// Click outside image to close
lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (lb.classList.contains("hidden")) return;
  if (e.key === "Escape")      closeLightbox();
  if (e.key === "ArrowLeft")   { current = (current - 1 + photos.length) % photos.length; showPhoto(); }
  if (e.key === "ArrowRight")  { current = (current + 1) % photos.length; showPhoto(); }
});

// Touch swipe
let touchStartX = 0;
lb.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; });
lb.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) {
    if (dx < 0) { current = (current + 1) % photos.length; }
    else        { current = (current - 1 + photos.length) % photos.length; }
    showPhoto();
  }
});

// ── Helpers ──────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Init ──────────────────────────────────────────────────────────────────
loadPhotos();
