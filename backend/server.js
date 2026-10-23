require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust the first proxy (e.g. Cloudflare, Nginx, or hosting load balancers)
app.set('trust proxy', 1);

// Disable 'X-Powered-By' header to conceal framework details from attackers
app.disable('x-powered-by');

// Security Headers with Helmet
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                frameAncestors: ["'none'"],
            },
        },
        crossOriginEmbedderPolicy: false,
    })
);

// CORS Configuration - Restrict allowed domains in production
const allowedOrigins = [
    'https://praweshojha.com.np',
    'https://www.praweshojha.com.np',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

if (process.env.ALLOWED_ORIGIN) {
    allowedOrigins.push(process.env.ALLOWED_ORIGIN);
}

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow same-origin or local tools with no origin header
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Blocked by CORS policy'));
        },
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    })
);

// Payload size limits to protect against memory exhaustion / Denial of Service (DoS)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Global rate limiting: Max 120 requests per 15 minutes per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', globalLimiter);

// Strict rate limiter for contact submissions: Max 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many contact messages sent from this IP. Please wait 15 minutes before trying again.',
    },
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// API Routes
app.use('/api/contact', contactLimiter, contactRoutes);

// Fallback route for SPA or direct navigation (serves index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    // Intercept malformed JSON body errors
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ success: false, message: 'Invalid JSON payload format.' });
    }

    // Avoid leaking internal stack traces to the public
    console.error('Unhandled Application Error:', err.message);
    const statusCode = err.message === 'Blocked by CORS policy' ? 403 : (err.status || 500);
    res.status(statusCode).json({
        success: false,
        message: statusCode === 403 ? 'CORS request rejected.' : 'Internal Server Error',
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running securely on http://localhost:${PORT}`);
});
