// ══════════════════════════════════════════════════════════════════════════
//  PHOTO GALLERY CONFIGURATION — edit this file to manage your albums
//  brian1970nova.com/photos
// ══════════════════════════════════════════════════════════════════════════

// ── Step 1: Add your Google API key here ─────────────────────────────────
//  Get one free at: https://console.cloud.google.com
//  Enable "Google Drive API", create an API key (no OAuth needed for public folders)
const GOOGLE_API_KEY = "AIzaSyC5tvRwk1nwfHTIQMshdjc_vOv3Hb5_6qA";

// ── Step 2: Define your albums ────────────────────────────────────────────
//
//  TWO TYPES of albums:
//
//  1. "drive" — photos stored in a Google Drive folder
//     - Share the folder: Right-click folder → Share → Anyone with the link → Viewer
//     - Copy the folder ID from the URL:
//       https://drive.google.com/drive/folders/THIS_IS_THE_FOLDER_ID
//
//  2. "photos" — a Google Photos shared album
//     - Open the album in Google Photos → Share → Create link
//     - Paste the full share URL below
//     - Clicking the card opens Google Photos in a new tab (family can view/download there)
//
// ─────────────────────────────────────────────────────────────────────────

const ALBUMS = [

  // ── EXAMPLE: Google Drive album ──────────────────────────────────────
   {
     type:       "drive",
    id:         "1ZEDqTUU5kbgJ0yNFcIzXsWYvBB8JgSMq",
    title:      "Colorado",
    date:       "Oct 2022",
    coverPhoto: "",   // optional: paste a direct image URL to use as the card cover
                       // leave blank to auto-use the first photo in the folder
     emoji:      "🏖️"  // shown if no cover photo loads
   },

  // ── EXAMPLE: Google Photos shared album ──────────────────────────────
  // {
  //   type:        "photos",
  //   photosUrl:   "https://photos.app.goo.gl/XXXXXXXXXXXXX",
  //   title:       "Christmas 2023",
  //   date:        "December 2023",
  //   coverPhoto:  "",   // optional: paste any image URL to show as the card cover
  //   emoji:       "🎄"
  // },

  // ── ADD YOUR REAL ALBUMS BELOW ────────────────────────────────────────
  // (remove the example comments above once you've added yours)

];

// ── Optional: Gallery title shown in the header ───────────────────────────
const GALLERY_TITLE   = "Brian's Photos";
const GALLERY_TAGLINE = "Family gallery — pick an album to browse";
