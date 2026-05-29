console.log("Portfolio Website Loaded Successfully - Cyberpunk Theme Active");

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (hamburger) {
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
});

// Scroll Animations using Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
});

// Add basic hover scaling to all buttons (enhancing the original script)
const buttons = document.querySelectorAll("button:not(.close-modal)");
buttons.forEach(button => {
    button.addEventListener("mousedown", () => {
        button.style.transform = "scale(0.95)";
    });
    button.addEventListener("mouseup", () => {
        button.style.transform = "scale(1)";
    });
    button.addEventListener("mouseleave", () => {
        button.style.transform = "";
    });
});

// --- CONTACT MODAL & EMAILJS LOGIC ---
const contactModal = document.getElementById('contactModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const triggerBtns = document.querySelectorAll('.contact-trigger-btn');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const loaderIcon = submitBtn.querySelector('.loader-icon');
const successNotification = document.getElementById('successNotification');

// Open Modal
triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
});

// Close Modal
const closeModal = () => {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';

    // Reset form and UI after closing animation
    setTimeout(() => {
        contactForm.reset();
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
        successNotification.classList.remove('active');
        contactForm.style.display = 'block';
    }, 300);
};

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// Close modal on outside click
if (contactModal) {
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal();
        }
    });
}

// Form Validation and Submission
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;
        const nameInput = document.getElementById('userName');
        const emailInput = document.getElementById('userEmail');
        const messageInput = document.getElementById('userMessage');

        // Reset errors
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));

        // Validate Name
        if (!nameInput.value.trim()) {
            nameInput.parentElement.classList.add('error');
            isValid = false;
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            emailInput.parentElement.classList.add('error');
            isValid = false;
        }

        // Validate Message
        if (!messageInput.value.trim()) {
            messageInput.parentElement.classList.add('error');
            isValid = false;
        }

        if (isValid) {
            // Show loader
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            loaderIcon.style.display = 'inline-block';

            // Prepare data to send
            const templateParams = {
                user_name: nameInput.value.trim(),
                user_email: emailInput.value.trim(),
                message: messageInput.value.trim(),
            };

            // EmailJS Submission using explicit parameters
            emailjs.send('service_jtat29u', 'template_dswednd', templateParams)
                .then((result) => {
                    // Success
                    console.log("EmailJS Success:", result.text);
                    submitBtn.disabled = false;
                    btnText.style.display = 'block';
                    loaderIcon.style.display = 'none';

                    // Show success notification
                    contactForm.style.display = 'none';
                    successNotification.classList.add('active');

                    // Auto close after 3 seconds
                    setTimeout(() => {
                        closeModal();
                    }, 3000);
                })
                .catch((error) => {
                    // Error
                    console.error("EmailJS Error - Failed to send message:", error);
                    submitBtn.disabled = false;
                    btnText.style.display = 'block';
                    loaderIcon.style.display = 'none';

                    // Specific error alert based on the error object
                    const errorMsg = error.text || error.message || "Network error or invalid parameters.";
                    alert("Failed to send message. Error details: " + errorMsg + "\nPlease check the console for more information.");
                });
        }
    });
}

// Remove error styling on input
document.querySelectorAll('.form-group input, .form-group textarea').forEach(element => {
    element.addEventListener('input', function () {
        if (this.value.trim() !== '') {
            this.parentElement.classList.remove('error');
        }
    });
});
