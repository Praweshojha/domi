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

        // Forward inquiry directly to FormSubmit to deliver into ojhaprawesh@gmail.com
        try {
            await fetch('https://formsubmit.co/ajax/ojhaprawesh@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Origin': 'https://praweshojha.com.np',
                    'Referer': 'https://praweshojha.com.np/',
                },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    _subject: `New Portfolio Message from ${name} (praweshojha.com.np)`,
                    _replyto: email,
                    _template: 'table',
                    _captcha: 'false',
                }),
            });
        } catch (forwardErr) {
            // Log but don't fail if forwarder had a minor network hiccup
            console.error('Email forwarding error:', forwardErr);
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: 'Thank you! Your message has been sent directly to Prawesh\'s email inbox.',
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
