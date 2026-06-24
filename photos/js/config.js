// ══════════════════════════════════════════════════════════════════════════
//  PHOTO GALLERY CONFIGURATION — edit this file to manage your albums
//  brian1970nova.com/photos
// ══════════════════════════════════════════════════════════════════════════

// ── Your Google API key ───────────────────────────────────────────────────
const GOOGLE_API_KEY = "AIzaSyC5tvRwk1nwfHTIQMshdjc_vOv3Hb5_6qA";

// ── Your albums ───────────────────────────────────────────────────────────
//
//  type: "drive"  → photos stored in a Google Drive folder
//    id: the folder ID from the Drive URL
//
//  type: "photos" → a Google Photos shared album link
//    photosUrl: the full share URL (https://photos.app.goo.gl/...)
//
// ─────────────────────────────────────────────────────────────────────────

const ALBUMS = [

  {
    type:  "drive",
    id:    "1ZEDqTUU5kbgJ0yNFcIzXsWYvBB8JgSMq",
    title: "Colorado",
    date:  "Oct 2022",
    emoji: "🏔️"
  },

  // Add more albums here — copy the block above and change the values

];

// ── Gallery header text ───────────────────────────────────────────────────
const GALLERY_TITLE   = "Brian's Photos";
const GALLERY_TAGLINE = "Family gallery — pick an album to browse";