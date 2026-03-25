document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling and Active Nav State
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-links a');

    // Smooth scroll for anchor links
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();
                window.scrollTo({
                    top: targetSection.offsetTop - 70, // offset for fixed navbar
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Update active state on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        
        // Find current section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // 150px tolerance for better UX
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Form Submission Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Visual feedback
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Prepare Web3Forms data
            const formData = {
                access_key: 'de177f92-0766-4eb5-b2c2-34292eb94b31',
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value,
                from_name: 'Portfolio Contact Form'
            };

            // Web3Forms API call
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(async (response) => {
                const json = await response.json();
                if (response.status == 200) {
                    submitBtn.textContent = 'Message Sent Successfully!';
                    submitBtn.style.backgroundColor = 'var(--color-green)';
                    submitBtn.style.borderColor = 'var(--color-green)';
                    submitBtn.style.color = 'var(--color-cream)';
                    contactForm.reset();
                } else {
                    console.log(response);
                    submitBtn.textContent = json.message || 'Failed to Send';
                    submitBtn.style.backgroundColor = '#cc0000';
                }
            })
            .catch(error => {
                console.log(error);
                submitBtn.textContent = 'Something went wrong!';
                submitBtn.style.backgroundColor = '#cc0000';
            })
            .finally(() => {
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.style.color = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }
});
