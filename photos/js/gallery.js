// ══════════════════════════════════════════════════════════════════════════
//  gallery.js  —  Albums listing page
// ══════════════════════════════════════════════════════════════════════════

document.querySelector("h1").textContent   = GALLERY_TITLE;
document.querySelector(".tagline").textContent = GALLERY_TAGLINE;
document.title = GALLERY_TITLE;

const grid = document.getElementById("albums-grid");

// ── Helpers ──────────────────────────────────────────────────────────────

function driveImgUrl(fileId) {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

async function getDriveCover(folderId) {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === "YOUR_API_KEY_HERE") return null;
  try {
    const url = `https://www.googleapis.com/drive/v3/files`
      + `?q='${folderId}'+in+parents+and+mimeType+contains+'image/'`
      + `&orderBy=name&pageSize=1`
      + `&fields=files(id,name)`
      + `&key=${GOOGLE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.files && data.files.length > 0) return driveImgUrl(data.files[0].id);
  } catch (_) {}
  return null;
}

// ── Render ────────────────────────────────────────────────────────────────

async function renderAlbums() {
  grid.innerHTML = "";

  if (!ALBUMS || ALBUMS.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:3rem;color:#888;">
        <p style="font-size:1.1rem;margin-bottom:1rem;">No albums yet.</p>
        <p style="font-size:0.9rem;">Open <code style="background:#222;padding:0.2rem 0.4rem;border-radius:3px;">photos/js/config.js</code> and add your albums.</p>
      </div>`;
    return;
  }

  for (const album of ALBUMS) {
    const card = document.createElement(album.type === "photos" ? "a" : "a");
    card.className = "album-card" + (album.type === "photos" ? " external" : "");

    // For Drive albums: link to album.html?id=...
    // For Photos albums: open Google Photos in new tab
    if (album.type === "drive") {
      card.href = `album.html?id=${encodeURIComponent(album.id)}&title=${encodeURIComponent(album.title)}&date=${encodeURIComponent(album.date || "")}`;
    } else {
      card.href = album.photosUrl;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    }

    // Resolve cover photo
    let coverSrc = album.coverPhoto || null;
    if (!coverSrc && album.type === "drive") {
      coverSrc = await getDriveCover(album.id);
    }

    const thumbHtml = coverSrc
      ? `<img class="album-thumb" src="${coverSrc}" alt="${album.title}" loading="lazy" onerror="this.parentNode.replaceChild(makePlaceholder('${album.emoji || "📁"}'),this)">`
      : `<div class="album-thumb-placeholder">${album.emoji || (album.type === "drive" ? "📁" : "🖼️")}</div>`;

    const badge = album.type === "drive"
      ? `<span class="album-badge badge-drive">Drive</span>`
      : `<span class="album-badge badge-photos">Photos</span>`;

    const externalHint = album.type === "photos"
      ? `<div class="external-link-hint">↗ Opens in Google Photos</div>`
      : "";

    card.innerHTML = `
      ${thumbHtml}
      <div class="album-info">
        <h2>${escHtml(album.title)}${badge}</h2>
        <div class="meta">${escHtml(album.date || "")}</div>
        ${externalHint}
      </div>`;

    grid.appendChild(card);
  }
}

function makePlaceholder(emoji) {
  const div = document.createElement("div");
  div.className = "album-thumb-placeholder";
  div.textContent = emoji;
  return div;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Init ──────────────────────────────────────────────────────────────────
renderAlbums().catch(err => {
  grid.innerHTML = `<div class="error-msg">Failed to load albums: ${escHtml(err.message)}</div>`;
});
