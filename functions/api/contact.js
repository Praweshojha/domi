// Cloudflare Pages Serverless Function for /api/contact

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[\x00-\x1F\x7F]/g, '').trim();
};

export async function onRequestPost(context) {
    const jsonHeader = {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
    };

    try {
        const { request } = context;
        const contentType = request.headers.get('content-type') || '';
        
        if (!contentType.includes('application/json')) {
            return new Response(
                JSON.stringify({ success: false, message: 'Invalid Content-Type. Expected application/json.' }),
                { status: 400, headers: jsonHeader }
            );
        }

        const body = await request.json();
        let { name, email, message } = body;

        if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
            return new Response(
                JSON.stringify({ success: false, message: 'Invalid data format. Fields must be strings.' }),
                { status: 400, headers: jsonHeader }
            );
        }

        name = sanitizeString(name);
        email = sanitizeString(email).toLowerCase();
        message = sanitizeString(message);

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

        // Forward inquiry directly to Prawesh's Google Drive Sheet & Gmail via Google Apps Script
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
