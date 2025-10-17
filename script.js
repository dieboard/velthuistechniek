document.addEventListener('DOMContentLoaded', () => {
    const particleContainer = document.getElementById('particle-container');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particleContainer.appendChild(particle);
    }

    const navLinks = document.querySelectorAll('.elevator-nav a');
    const sections = document.querySelectorAll('main section');
    const animatedElements = document.querySelectorAll('.animated');

    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Active section highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    const closeBtn = document.querySelector('.lightbox-close');

    function openLightbox(videoSrc) {
        if (lightbox && lightboxVideo) {
            lightboxVideo.src = videoSrc;
            lightbox.classList.add('active');
            lightboxVideo.play();
        }
    }

    function closeLightbox() {
        if (lightbox && lightboxVideo) {
            lightbox.classList.remove('active');
            lightboxVideo.pause();
            lightboxVideo.src = ""; // Clear the source
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            // Close lightbox if the dark background is clicked, but not the video player itself
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // This is where we will add triggers later
    window.openLightbox = openLightbox;
});