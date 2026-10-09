// This is the controller that handles the logic for the contact route

exports.submitContactForm = (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Basic Validation
        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide name, email, and message.' 
            });
        }

        /* 
         * ==========================================
         * TODO for Future Expansion:
         * 1. Save data to a Database (e.g., MongoDB, PostgreSQL)
         *    const newContact = await Contact.create({ name, email, message });
         * 
         * 2. Send an Email Notification (e.g., using Nodemailer or SendGrid)
         *    await sendEmail({ to: 'admin@praveshojha.com.np', subject: 'New Message', body: message });
         * ==========================================
         */
        
        console.log('--- New Contact Form Submission ---');
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Message: ${message}`);
        console.log('-----------------------------------');

        // Return success response to the client
        res.status(200).json({
            success: true,
            message: 'Thank you for reaching out! Your message has been received successfully.'
        });

    } catch (error) {
        console.error('Contact Form Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request.'
        });
    }
};
