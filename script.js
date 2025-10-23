document.addEventListener('DOMContentLoaded', () => {
    // --- New: Load Projects Dynamically ---
    async function loadProjects() {
        try {
            const response = await fetch('content.json');
            const data = await response.json();
            window.projects = data.projects || []; // Store for modal
            renderProjects(window.projects);
        } catch (error) {
            console.error("Failed to load projects:", error);
            const projectGrid = document.querySelector('.project-grid');
            if(projectGrid) {
                projectGrid.innerHTML = '<p style="color: red;">Could not load projects.</p>';
            }
        }
    }

    function renderProjects(projects) {
        const projectGrid = document.querySelector('.project-grid');
        if (!projectGrid) return;

        projectGrid.innerHTML = projects.map((project, index) => `
            <div class="project-card" data-project-index="${index}" data-testid="project-card">
                <img src="${project.tileImage || 'images/placeholder-project.png'}" alt="${project.title}">
                <div class="project-card-content">
                    <h3>${project.title}</h3>
                    <p>${project.tileSummary}</p>
                    <button class="read-more-btn" data-testid="project-card-read-more">Lees Meer</button>
                </div>
            </div>
        `).join('');
    }

    // --- Existing Code (with minor adjustments) ---
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
    const closeBtn = document.querySelector('#lightbox .lightbox-close');

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

    // Modal functionality
    const modalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModals = document.querySelectorAll('.modal-close');
    const modals = document.querySelectorAll('.modal');

    function openModal(modal) {
        if (modal == null) return;
        modal.classList.add('active');
    }

    function closeModal(modal) {
        if (modal == null) return;
        modal.classList.remove('active');
    }

    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
        });
    });

    closeModals.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Image lightbox functionality
    const imageLightbox = document.getElementById('image-lightbox');
    const imageLightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('caption');
    const imageGridImages = document.querySelectorAll('.image-grid img');
    const imageLightboxClose = document.querySelector('#image-lightbox .lightbox-close');

    imageGridImages.forEach(image => {
        image.addEventListener('click', () => {
            imageLightbox.classList.add('active');
            imageLightboxImg.src = image.src;
            captionText.innerHTML = image.alt;
        });
    });

    function closeImageLightbox() {
        imageLightbox.classList.remove('active');
    }

    if (imageLightboxClose) {
        imageLightboxClose.addEventListener('click', closeImageLightbox);
    }

    if (imageLightbox) {
        imageLightbox.addEventListener('click', (e) => {
            if (e.target === imageLightbox) {
                closeImageLightbox();
            }
        });
    }

    // Project Gallery Modal
    const projectDetailModal = document.getElementById('project-detail-modal');

    function openProjectModal(project) {
        if (!projectDetailModal) return;

        const titleEl = document.getElementById('project-modal-title');
        const descriptionEl = document.getElementById('project-modal-description');
        const carouselImagesEl = projectDetailModal.querySelector('.carousel-images');

        titleEl.textContent = project.title;
        descriptionEl.innerHTML = project.modalDescription || project.description || ''; // Fallback for old data
        carouselImagesEl.innerHTML = (project.modalImages || project.images || []).map((img, index) =>
            `<img src="${img}" alt="${project.title}" style="display: ${index === 0 ? 'block' : 'none'};">`
        ).join('');

        projectDetailModal.classList.add('active');
        let currentImageIndex = 0;

        const images = carouselImagesEl.querySelectorAll('img');
        const prevBtn = projectDetailModal.querySelector('.carousel-prev');
        const nextBtn = projectDetailModal.querySelector('.carousel-next');

        function showImage(index) {
            images.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
        }

        prevBtn.onclick = () => {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : images.length - 1;
            showImage(currentImageIndex);
        };

        nextBtn.onclick = () => {
            currentImageIndex = (currentImageIndex < images.length - 1) ? currentImageIndex + 1 : 0;
            showImage(currentImageIndex);
        };
    }

    // Refined Project Modal Trigger
    const projectGrid = document.querySelector('.project-grid');
    if (projectGrid) {
        projectGrid.addEventListener('click', (e) => {
            // Check if the clicked element or its parent is the "Lees Meer" button
            const readMoreButton = e.target.closest('.project-card .read-more-btn');
            if (readMoreButton) {
                const projectCard = e.target.closest('.project-card');
                if (projectCard) {
                    const projectIndex = projectCard.dataset.projectIndex;
                    const project = window.projects[projectIndex];
                    openProjectModal(project);
                }
            }
        });
    }

    // --- Initial Load ---
    loadProjects();
});
