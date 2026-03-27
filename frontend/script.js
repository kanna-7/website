// ProjectPraveen - Script Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Analytics & Tracking
    const backendUrl = 'https://projectpraveen.onrender.com';

    function updateStats() {
        // Fetch Visitor Count
        fetch(`${backendUrl}/api/visit-count`)
            .then(res => res.json())
            .then(data => {
                const heroCountEl = document.getElementById('heroVisitorCount');
                const footerCountEl = document.getElementById('footerVisitorCount');
                if (heroCountEl) heroCountEl.innerText = `${data.count}+`;
                if (footerCountEl) footerCountEl.innerText = `${data.count}+ views`;
            });
        
        // Fetch Download Count
        fetch(`${backendUrl}/api/download-count`)
            .then(res => res.json())
            .then(data => {
                const downloadEl = document.getElementById('downloadCount');
                if (downloadEl) downloadEl.innerText = `${data.count}+ downloads`;
            });
    }

    // Initial Track Visit
    fetch(`${backendUrl}/api/visit`, { method: 'POST' })
        .then(() => updateStats())
        .catch(err => {
            console.log('Analytics offline');
            const heroCountEl = document.getElementById('heroVisitorCount');
            const footerCountEl = document.getElementById('footerVisitorCount');
            if (heroCountEl) heroCountEl.parentElement.style.display = 'none';
            if (footerCountEl) footerCountEl.style.display = 'none';
        });

    // Update Download count when button is clicked
    const downloadBtn = document.querySelector('a[download]');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // Wait 2 seconds for backend to process, then update the UI
            setTimeout(updateStats, 2000);
        });
    }

    // 2. Initialize Feather Icons
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

    // 4. Student Exploration Slider
    const sliderTrack = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const slides = document.querySelectorAll('.slide');
    
    if (sliderTrack && prevBtn && nextBtn && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        function updateSlider() {
            sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        // Auto-slide
        let slideInterval = setInterval(nextSlide, 5000);

        function resetAutoSlide() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }
    }
});
