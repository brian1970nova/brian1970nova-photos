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
  {
    type:  "drive",
    id:    "1hvnYoXVLPOH83T_MU7O_CYwbQoLvhiAK",
    title: "Colorado",
    date:  "Nov 2023",
    emoji: "🏔️"
    coverPhoto: "https://lh3.googleusercontent.com/d/1RBsWBV3_MjGauXaOvELLdOx0Jeq7p_ag"
  },

    {
   type:      "photos",
   photosUrl: "https://photos.app.goo.gl/x7vQV1Lw227KKMXR9",
   title:     "Colorado",
   date:      "July 2025",
   emoji:     "☀️",
  coverPhoto:  "https://lh3.googleusercontent.com/d/1a6jvFQIiRE9cvsnmrA-FAdxAI14_2Sr-"
 },

  {
    type:       "photos",
    photosUrl:  "https://www.icloud.com/sharedalbum/#B21JtdOXm02INQs",
    title:      "Colorado 2024",
    date:       "Oct 2024",
    emoji:      "🌅",
    coverPhoto: "https://lh3.googleusercontent.com/d/1DqZliQ3Ul9u7sq-j-ZHGNjWd_aM4dOco"
  },
];

// ── Gallery header text ───────────────────────────────────────────────────
const GALLERY_TITLE   = "Brian's Photos";
const GALLERY_TAGLINE = "Family gallery — pick an album to browse";
