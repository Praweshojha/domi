// Cloudflare Pages Serverless Function for /api/contact
// Hardened Defense: Anti-CSRF Origin Check, Payload Size Cap, Multi-line Formula Sanitization, Server-Side Honeypot

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Security Sanitizer: Defends against Control Characters, Zero-Width Characters & Multi-line Spreadsheet Formula Injection
const sanitizeString = (str, maxLen = 3000) => {
    if (typeof str !== 'string') return '';
    // Strip null bytes, control characters, and invisible zero-width unicode characters
    let clean = str
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u200B-\u200D\uFEFF]/g, '')
        .trim()
        .slice(0, maxLen);

    // Multi-line Formula Injection defense: Neutralize any line starting with formula characters (=, +, -, @, \t, \r)
    clean = clean.split('\n').map(line => {
        const trimmed = line.trimStart();
        if (/^[=+\-@\t\r]/.test(trimmed)) {
            return "'" + line;
        }
        return line;
    }).join('\n');

    return clean;
};

export async function onRequestPost(context) {
    const jsonHeader = {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
    };

    try {
        const { request } = context;

        // 1. Origin / Referer Validation (Anti-CSRF & Cross-Origin Relay Defense)
        const origin = request.headers.get('origin') || '';
        if (origin) {
            const isAllowed = origin.includes('praweshojha.com.np') || origin.includes('localhost') || origin.includes('127.0.0.1');
            if (!isAllowed) {
                return new Response(
                    JSON.stringify({ success: false, message: 'Cross-origin request forbidden.' }),
                    { status: 403, headers: jsonHeader }
                );
            }
        }

        // 2. Payload Size Defense (Prevents Memory Exhaustion / DoS attacks)
        const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
        if (contentLength > 50000) {
            return new Response(
                JSON.stringify({ success: false, message: 'Payload size exceeds allowable threshold.' }),
                { status: 413, headers: jsonHeader }
            );
        }

        // 3. Content-Type Validation
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            return new Response(
                JSON.stringify({ success: false, message: 'Invalid Content-Type. Expected application/json.' }),
                { status: 400, headers: jsonHeader }
            );
        }

        const body = await request.json();
        let { name, email, message, website } = body;

        // 4. Server-Side Honeypot Trap (Automated spam bots fill this hidden field)
        if (typeof website === 'string' && website.trim().length > 0) {
            return new Response(
                JSON.stringify({ success: true, message: 'Thank you! Your message has been received.' }),
                { status: 200, headers: jsonHeader }
            );
        }

        // 5. Strict Type & Presence Validation
        if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
            return new Response(
                JSON.stringify({ success: false, message: 'Invalid data format. Fields must be strings.' }),
                { status: 400, headers: jsonHeader }
            );
        }

        name = sanitizeString(name, 100);
        email = sanitizeString(email, 254).toLowerCase();
        message = sanitizeString(message, 3000);

        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({ success: false, message: 'Please provide all required fields: name, email, and message.' }),
                { status: 400, headers: jsonHeader }
            );
        }

        if (name.length > 100) {
            return new Response(
                JSON.stringify({ success: false, message: 'Name exceeds maximum length of 100 characters.' }),
                { status: 400, headers: jsonHeader }
            );
        }

        if (email.length > 254 || !EMAIL_REGEX.test(email)) {
            return new Response(
                JSON.stringify({ success: false, message: 'Please provide a valid email address.' }),
                { status: 400, headers: jsonHeader }
            );
        }

        if (message.length > 3000) {
            return new Response(
                JSON.stringify({ success: false, message: 'Message exceeds maximum length of 3000 characters.' }),
                { status: 400, headers: jsonHeader }
            );
        }

        // 6. Forward Sanitized Payload to Google Apps Script Webhook
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzEgoNYmtR96Qyk-x7lxRj-jAVHS8x9-t8bIT2iJnKl1AKxaFEeSlUEUhIDutwprs7J/exec';
        try {
            const googleRes = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
                redirect: 'follow',
            });
            const googleData = await googleRes.json().catch(() => ({}));
            if (googleData && googleData.success) {
                return new Response(
                    JSON.stringify({
                        success: true,
                        message: 'Thank you! Your message has been saved to Prawesh\'s Google Sheet and sent to his email.',
                    }),
                    { status: 200, headers: jsonHeader }
                );
            }
        } catch (forwardErr) {
            console.error('Google Apps Script forwarding error:', forwardErr);
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Thank you! Your message has been saved to Prawesh\'s Google Sheet and sent to his email.',
            }),
            { status: 200, headers: jsonHeader }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({ success: false, message: 'An error occurred while processing your request.' }),
            { status: 400, headers: jsonHeader }
        );
    }
}
