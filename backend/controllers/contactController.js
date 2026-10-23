// Controller for handling contact form submission with security validation

// Regular expression for RFC 5322 compliant email check
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Strips ASCII control characters to prevent log injection / header injection
const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[\x00-\x1F\x7F]/g, '').trim();
};

exports.submitContactForm = (req, res) => {
    try {
        let { name, email, message } = req.body;

        // Type validation
        if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid input format. Name, email, and message must be strings.' 
            });
        }

        // Sanitize and trim
        name = sanitizeString(name);
        email = sanitizeString(email).toLowerCase();
        message = sanitizeString(message);

        // Required field validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields: name, email, and message.' 
            });
        }

        // Field length limits to guard against buffer/memory exhaustion
        if (name.length > 100) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name exceeds maximum length of 100 characters.' 
            });
        }

        if (email.length > 254 || !EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address.' 
            });
        }

        if (message.length > 3000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Message exceeds maximum length of 3000 characters.' 
            });
        }

        // Log safely (no CRLF injection)
        console.log('--- New Contact Form Submission ---');
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Message Length: ${message.length} chars`);
        console.log('-----------------------------------');

        // Return success response to client
        return res.status(200).json({
            success: true,
            message: 'Thank you for reaching out! Your message has been received successfully.'
        });

    } catch (error) {
        console.error('Contact Form Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request.'
        });
    }
};
