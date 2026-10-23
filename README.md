# Prawesh Ojha - Professional Profile Website

This repository contains the source code for the professional personal profile of Prawesh Ojha (`praveshojha.com.np`). It is structured as a full-stack web application with separated frontend and backend environments.

## Project Architecture & Security

* **Technology Stack**: Modern HTML5, CSS3, vanilla JavaScript on the frontend, and a hardened **Node.js + Express.js** server on the backend.
* **No PHP Dependency**: This website does **not** use PHP anywhere in its stack. It is completely immune to PHP-specific vulnerabilities (including recent AI-discovered core PHP bugs such as PHP2Shell / CVE-2026-109618).
* **Cloudflare Deployment**: Configured via `wrangler.toml` for ultra-fast, serverless edge static asset delivery on Cloudflare.

### Security Hardening Measures Implemented:
1. **HTTP Security Headers**: Powered by `helmet` to set Content Security Policy (CSP), Strict-Transport-Security (HSTS), MIME-sniffing prevention (`nosniff`), and frame-busting protections.
2. **Framework Concealment**: `X-Powered-By` header stripped to prevent server fingerprinting.
3. **DDoS & Spam Rate Limiting**: Powered by `express-rate-limit` with global API limits and strict contact endpoint throttling (max 5 submissions per 15 minutes per IP).
4. **CORS Restrictions**: Whitelists authorized origins (`praveshojha.com.np`, `localhost`) to prevent unauthorized cross-origin requests.
5. **Payload Limits**: Strict 10KB body limit to prevent memory exhaustion attacks.
6. **Input Sanitization**: Email format validation, string length restrictions, and control-character stripping in `contactController.js` to guard against log injection and denial of service.
7. **Safe Outbound Links**: All external hyperlinks configured with `rel="noopener noreferrer"` to prevent tabnabbing.

---

## Project Structure

* **`frontend/`**: Contains the client-side code.
  * `public/`: Static assets served directly to the client browser.
    * `index.html`: The main markup file with security meta-tags.
    * `css/style.css`: Stylesheet.
    * `js/app.js`: Client-side interactivity.
* **`backend/`**: Hardened Node.js and Express.js API server.
  * `server.js`: Server entry point with security middleware.
  * `routes/`: API route definitions.
  * `controllers/`: Request handling, validation, and sanitization.
* **`wrangler.toml`**: Cloudflare deployment configuration.

---

## How to Run Locally

### Prerequisites
You need **Node.js** (v18+) installed on your computer.

### Setup Steps
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   *(For development with auto-restart: `npm run dev`)*

4. Open your browser at `http://localhost:3000`.
