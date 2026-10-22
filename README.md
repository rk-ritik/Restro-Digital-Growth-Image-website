# FoodImager — Commercial Food Photography Asset Library

FoodImager is a modern, high-performance web platform designed for restaurants, cloud kitchens, food aggregator managers (Zomato, Swiggy, Uber Eats), and culinary brands to discover, preview, and download studio-quality food photography assets.

---

## 🎨 Visual Design System

- **Color Palette:**
  - **Backgrounds:** Near-black obsidian (`#0B0E14`), dark charcoal (`#121721`), and elevated card slate (`#141A25`).
  - **Primary Brand Accent:** Vibrant warm orange (`#FF713F` / `#FA5C25`) with subtle glow effects.
  - **Secondary Accents:** Emerald teal (`#10B981`) for Vegetarian badges & success states; Coral red (`#EF4444`) for Non-Vegetarian badges.
  - **Typography:** `Plus Jakarta Sans` and `Inter` via Google Fonts.
- **Layout:**
  - Fixed left sidebar on desktop with quick navigation, logo badge, and real-time account quota card.
  - Responsive collapsible slide-out drawer on tablet and mobile viewports.
  - 4-column responsive grid on desktop, 3 on tablet, 2 on mobile, 1 on small screens.

---

## 🚀 Key Features

### 1. Asset Gallery (`/`)
- **Large Instant Search:** Case-insensitive search across dish titles, categories, cuisines, and descriptive tags with keyboard shortcut (`/` or `Ctrl+K`) and popular suggestion chips.
- **32 Category Filters:** Instant horizontal filtering across all requested categories:
  *All, Accompaniments, Beverages, Biryani & Rice, Breads, Breakfast, Burger, Cake & Pastry, Chaap, Chinese, Combo, Desserts, Fried Rice & Pulao, Icecream, Maggi, Meals, Momos, Noodles, North Indian, Pizza & Pasta, Platters, Rolls, Salad, Sandwich, Shawarma, Snacks, Soup, South Indian, Starters, Sweets, Thali, Waffles.*
- **Dietary Filter:** Official FSSAI-style green square/circle (Veg) and brown-red square/triangle (Non-Veg) toggle.
- **Display Toggle:** Switch between Standard (4 columns), Compact (5 columns), and Large Studio (3 columns).
- **Sorting:** Sort by Most Popular (download count), Highest Rated, or Alphabetical (A-Z).
- **Scalable Pagination:** "Load More" mechanism ensuring 1,000+ food images render smoothly with zero browser lag.
- **Image Fallback Protection:** Guaranteed zero broken images with automatic `onError` graceful SVG fallback.

### 2. High-Res Image Preview Modal
- Click any dish card to view ultra-high-resolution photograph.
- Complete asset metadata: resolution (e.g. 3840 x 2880), file size, commercial royalty-free license badge, rating, and tags.
- Physical download trigger with confetti animation.
- Shareable asset link copying to clipboard.
- Report image modal to flag inaccuracies (wrong category, dietary type, or blurriness).

### 3. Direct Image Download
- **Physical file download:** Fetches the actual image blob and triggers an immediate download using the sanitized dish name as filename (e.g., `oreo-shake.jpg`, `veg-dum-biryani.jpg`).
- Does **not** merely open the image in a new browser tab.
- Automatically increments monthly account quota and records the download to history.

### 4. Download History (`/downloads`)
- Tracks past downloads locally in `localStorage`.
- Storage counter (e.g., `42.5 MB` saved).
- Quick 1-click re-download button for any past asset.
- Filter past downloads by name or category.
- Clear history button.
- *Notice: Download history is preserved in your current browser's local storage and does not automatically synchronize across separate devices.*

### 5. Bulk ZIP Export (`/bulk-export`)
- Multi-select food items using checkboxes or **"Select All Filtered"**.
- Live selection counter (e.g., `Selected: 12 images`).
- Downloads selected images packaged into a single `.zip` archive via `JSZip` and `file-saver`.
- Progress bar showing real-time packaging and compression status.
- Exports actual binary image files, not just text filenames.

### 6. Bulk Photo Upload (`/bulk-upload`)
- Multi-file drag-and-drop zone supporting JPEG, PNG, and WebP.
- Instant client-side previews using `URL.createObjectURL`.
- Metadata editor for each uploaded file: Dish Name, Category dropdown, Veg/Non-Veg toggle, and Tags.
- **"Add All to Gallery"** merges staged photos directly into the active gallery session.
- Honest disclaimer about frontend prototype storage vs. permanent cloud storage.

### 7. Other Supporting Pages
- **Request Photo (`/request-photo`):** Studio shoot order form with delivery platform target (Zomato, Swiggy, Print) and live request queue tracking.
- **Profile (`/profile`):** Editable restaurant brand settings, executive chef title, delivery platforms, and default download resolution format.
- **Subscription (`/subscription`):** 3-tier membership breakdown (Starter, Pro Creator, Agency & Enterprise) and real-time download quota progress bar.
- **Logout:** Confirmation modal preventing accidental session sign-out.

---

## 📁 Project Structure

```
food-image-gallery/
├── public/
│   ├── images/
│   │   └── food/                 # Food photography assets (.jpg) & fallback (.svg)
│   │       ├── oreo-shake.jpg
│   │       ├── paneer-chilli.jpg
│   │       ├── veg-biryani.jpg
│   │       ├── chocolate-shake.jpg
│   │       ├── gourmet-burger.jpg
│   │       ├── woodfired-pizza.jpg
│   │       ├── steamed-momos.jpg
│   │       ├── belgian-waffle.jpg
│   │       ├── butter-chicken.jpg
│   │       ├── masala-dosa.jpg
│   │       └── placeholder.svg
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx           # Fixed desktop & collapsible mobile sidebar
│   │   ├── SearchBar.jsx         # Search with keyboard shortcuts & quick picks
│   │   ├── CategoryFilters.jsx   # 32 categories with smooth scroll
│   │   ├── FoodTypeFilter.jsx    # Veg / Non-Veg / All official FSSAI tabs
│   │   ├── DisplayToggle.jsx     # Compact / Standard / Large grid toggles
│   │   ├── FoodCard.jsx          # Food card with download, report & hover
│   │   ├── ImagePreviewModal.jsx # Full-screen preview, specs, download
│   │   ├── ReportModal.jsx       # Quality & category issue reporting modal
│   │   ├── Toast.jsx             # Animated notification banner
│   │   └── EmptyState.jsx        # Friendly zero-results state
│   ├── context/
│   │   └── ToastContext.jsx      # Global toast notification provider
│   ├── pages/
│   │   ├── Gallery.jsx           # Main landing page & food asset gallery
│   │   ├── Downloads.jsx         # Download history log & re-download table
│   │   ├── BulkExport.jsx        # Multi-select & JSZip batch exporter
│   │   ├── BulkUpload.jsx        # Multi-file intake & local gallery fusion
│   │   ├── RequestPhoto.jsx      # Studio photo request form & queue
│   │   ├── Profile.jsx           # Restaurant culinary profile editor
│   │   └── Subscription.jsx      # Membership quota meter & plans
│   ├── data/
│   │   ├── foods.js              # Scalable food dataset & catalog generator
│   │   └── categories.js         # 32 food categories with icons
│   ├── utils/
│   │   ├── downloadImage.js      # Blob download, file naming & confetti
│   │   └── storage.js            # LocalStorage persistence layer
│   ├── App.jsx                   # Router & application layout shell
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Base Tailwind tokens & custom scrollbars
├── index.html                    # Meta tags, viewport & Google Fonts
├── vite.config.js                # Vite configuration with Tailwind CSS v4
└── package.json                  # Dependencies
```

---

## 🛠️ How to Add New Food Images (Scaling to 1,000+ Assets)

The application was built from the ground up to support high-volume catalogs (1,000+ dishes) without requiring changes to components. Follow these steps to register new photographs:

### Step 1: Add Image Asset to Public Directory
Save your high-resolution food photograph under:
`public/images/food/<dish-slug>.jpg`

**Recommended Image Specifications:**
- **Dimensions:** 3840 x 2880 px (4:3) or 2400 x 1600 px (3:2)
- **Format:** JPEG or WebP (Full RGB)
- **File size:** 1.5 MB – 4.0 MB for maximum print and digital clarity
- **Naming:** Lowercase with hyphens (e.g., `amritsari-kulcha.jpg`)

### Step 2: Register Dish in `src/data/foods.js`
Open `src/data/foods.js` and add an entry to the `INITIAL_FOODS` array:

```javascript
{
  id: 'food-033',
  name: 'Amritsari Kulcha with Chole',
  image: '/images/food/amritsari-kulcha.jpg',
  category: 'North Indian',
  foodType: 'veg', // 'veg' | 'non-veg'
  tags: ['kulcha', 'amritsari', 'chole', 'tandoori', 'punjabi', 'breakfast', 'zomato'],
  filename: 'amritsari-kulcha.jpg',
  resolution: '3840 x 2880',
  fileSize: '3.6 MB',
  downloads: 0,
  isPlaceholder: false, // Set to true if awaiting studio photograph
  rating: 4.9,
  description: 'Charred crispy tandoori kulcha stuffed with spiced potatoes, served with tangy chole and pickled onions.',
}
```

### High-Volume Performance Safeguards:
1. **Lazy Loading:** All images use native `loading="lazy"` so off-screen images do not consume bandwidth.
2. **Chunked Pagination:** The `visibleCount` state in `Gallery.jsx` renders dishes in batches (e.g. 16 or 24 at a time), keeping DOM node counts low and rendering instantaneous even with 1,000+ items in memory.
3. **Synthetic Scaling:** Use `generateExpandedCatalog(1000)` in `src/data/foods.js` to stress-test your deployment with thousands of realistic menu combinations.

---

## 🔍 Feature Status: Client-Side vs Backend

| Feature | Current Prototype Status | Production Backend Requirement |
| :--- | :--- | :--- |
| **Gallery Browsing & Filtering** | ✅ **100% Working** | Can connect to a REST/GraphQL API or CMS (e.g. Strapi, Supabase) |
| **Instant Search & Hotkeys** | ✅ **100% Working** | Full-text client search; can switch to MeiliSearch / Algolia for 50k+ items |
| **Physical File Download** | ✅ **100% Working** | Enforces blob download directly to disk with sanitized filename |
| **Download History** | ✅ **100% Working** | Stored locally in `localStorage`; requires DB to sync across devices |
| **Bulk ZIP Export** | ✅ **100% Working** | In-browser `JSZip` compression; can offload to AWS Lambda for 100+ files |
| **Bulk Upload Intake** | ✅ **100% Working** | Local `URL.createObjectURL` preview; requires S3/Cloudinary bucket for permanent hosting |
| **Photo Shoot Requests** | ✅ **100% Working** | Stored in `localStorage`; requires ticketing API (Jira/Zendesk/Stripe) |
| **Profile Settings** | ✅ **100% Working** | Persisted in `localStorage`; requires User Auth & Database |
| **Subscription Quotas** | ✅ **100% Working** | Client quota tracking; requires payment gateway (Stripe/Razorpay) |

---

## 💻 Development & Build Setup

### Prerequisites
- Node.js `v18+` or `v20+` (Tested on Node v24)
- npm `v9+` or `v10+`

### Installation
```bash
# Navigate to the project directory
cd food-image-gallery

# Install dependencies
npm install

# Start local development server
npm run dev

# Open in browser at http://localhost:5173
```

### Production Build
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```
