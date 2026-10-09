// Navigation Toggle
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if(burger && nav) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-links-active');
            // Burger Animation
            burger.classList.toggle('toggle');
        });
        
        // Close nav when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('nav-links-active')) {
                    nav.classList.remove('nav-links-active');
                    burger.classList.remove('toggle');
                }
            });
        });
    }
}

// Contact Form Handler
const handleContactForm = () => {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');

    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Determine API URL (Handles both dev environment and production)
                const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
                    ? 'http://localhost:3000/api/contact' 
                    : '/api/contact';

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    statusDiv.className = 'success';
                    statusDiv.innerText = result.message || 'Message sent successfully!';
                    form.reset();
                } else {
                    throw new Error(result.message || 'Failed to send message.');
                }
            } catch (error) {
                console.error('Error:', error);
                statusDiv.className = 'error';
                statusDiv.innerText = 'There was an error sending your message. Please try again later.';
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                
                // Clear status message after 5 seconds
                setTimeout(() => {
                    statusDiv.innerText = '';
                    statusDiv.className = '';
                }, 5000);
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    handleContactForm();
});
