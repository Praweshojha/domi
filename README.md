# Pravesh Ojha - Professional Profile Website

This repository contains the source code for the professional personal profile of Pravesh Ojha (`praveshojha.com.np`). It is structured as a full-stack web application with a separated frontend and backend.

## Project Architecture

The project is divided into two main environments:

*   **`frontend/`**: Contains the client-side code.
    *   `public/`: Holds the static assets served to the user's browser.
        *   `index.html`: The main markup file.
        *   `css/style.css`: The styling.
        *   `js/app.js`: Client-side interactivity and API calling logic.
*   **`backend/`**: A Node.js and Express.js server that handles API requests (like the Contact form) and serves the frontend static files.
    *   `server.js`: The entry point for the backend application.
    *   `routes/`: API route definitions.
    *   `controllers/`: Logic corresponding to routes (e.g., handling form submissions).

## How to Run Locally

### Prerequisites
You need to have **Node.js** installed on your computer.

### Setup Steps
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies (Express, CORS, dotenv):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   *(For development with auto-restart, use `npm run dev` instead).*

4. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

## Future Expansion
- **Database Integration:** Connect the `contactController.js` to a database (MongoDB, Postgres) to save form submissions.
- **Email Service:** Integrate Nodemailer or SendGrid to send an email notification when someone submits the form.
- **Frontend Framework:** The frontend is currently pure HTML/CSS/JS for simplicity, but the architecture allows for easily replacing the `frontend` folder with a React, Vue, or Angular application.
