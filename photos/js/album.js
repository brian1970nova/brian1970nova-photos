// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  album.js  â€”  Individual album page (Google Drive folders only)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const params   = new URLSearchParams(location.search);
const folderId = params.get("id");
const title    = params.get("title") || "Album";
const date     = params.get("date")  || "";

document.getElementById("album-title").textContent    = title;
document.getElementById("album-subtitle").textContent = date;
document.title = `${title} â€” ${GALLERY_TITLE}`;

const grid  = document.getElementById("photos-grid");
const lb    = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCap = document.getElementById("lb-caption");

let photos  = [];  // { id, name, thumb, full }
let current = 0;

// â”€â”€ Google Drive fetch â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
        + `?q='${folderId}'+in+parents`
        + `+and+(mimeType+contains+'image/'+or+mimeType+contains+'video/')`
        + `+and+trashed%3Dfalse`
        + `&orderBy=name`
        + `&pageSize=100`
        + `&fields=nextPageToken,files(id,name,mimeType,thumbnailLink)`
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
      â€¢ The Drive folder is set to "Anyone with the link can view"<br>
      â€¢ Your API key has Drive API enabled<br>
      â€¢ There are no API key restrictions blocking this domain
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
    type:  f.mimeType.startsWith('video/') ? 'video' : 'image',
    thumb: f.thumbnailLink
      ? f.thumbnailLink.replace(/=s\d+$/, '=s400')
      : (f.mimeType.startsWith('video/')
          ? `https://drive.google.com/thumbnail?id=${f.id}&sz=w400`
          : `https://lh3.googleusercontent.com/d/${f.id}=w400`),
    full:  f.mimeType.startsWith('video/')
      ? `https://drive.google.com/file/d/${f.id}/preview`
      : `https://lh3.googleusercontent.com/d/${f.id}=s0`
  }));

  renderTiles();
}

// â”€â”€ Render tiles â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function renderTiles() {
  grid.innerHTML = "";
  photos.forEach((photo, idx) => {
    const tile = document.createElement("div");
    tile.className = "photo-tile" + (photo.type === 'video' ? ' video-tile' : '');
    tile.innerHTML = `
      <img src="${photo.thumb}" alt="${escHtml(photo.name)}" loading="lazy">
      ${photo.type === 'video' ? '<div class="play-btn">â–¶</div>' : ''}
      <div class="photo-overlay"><span>${escHtml(photo.name)}</span></div>`;
    tile.addEventListener("click", () => openLightbox(idx));
    grid.appendChild(tile);
  });
}

// â”€â”€ Lightbox â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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
  const iframe = document.getElementById('lb-video');
  if (iframe) { iframe.src = ''; }
}

function showPhoto() {
  const p = photos[current];
  const lbContent = document.querySelector('.lb-content');

  if (p.type === 'video') {
    // Replace img with iframe for video playback
    lbImg.style.display = 'none';
    let iframe = document.getElementById('lb-video');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'lb-video';
      iframe.allow = 'autoplay';
      iframe.allowFullscreen = true;
      lbContent.insertBefore(iframe, lbImg);
    }
    iframe.style.display = 'block';
    iframe.src = p.full;
    lbCap.innerHTML = `â–¶ ${escHtml(p.name)}&nbsp;&nbsp;(${current + 1} / ${photos.length})`;
  } else {
    // Show image, hide video iframe
    lbImg.style.display = 'block';
    lbImg.src = p.full;
    const iframe = document.getElementById('lb-video');
    if (iframe) { iframe.style.display = 'none'; iframe.src = ''; }
    lbCap.innerHTML = `${escHtml(p.name)}&nbsp;&nbsp;(${current + 1} / ${photos.length})
      &nbsp;&nbsp;<a href="${p.full}" target="_blank" rel="noopener"
        style="color:#e8c060;text-decoration:none;font-size:0.85rem;">View full size â†—</a>`;
  }
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

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function escHtml(str) {
  return String(str)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// â”€â”€ Init â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
loadPhotos();
