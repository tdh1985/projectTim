// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll with throttling
let scrollTimeout;
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
        navbar.style.boxShadow = 'none';
    }
}

window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = requestAnimationFrame(() => {
            handleNavbarScroll();
            scrollTimeout = null;
        });
    }
}, { passive: true });

// Portfolio Filter with optimized animations
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        // Use requestAnimationFrame for smoother filtering
        requestAnimationFrame(() => {
            galleryItems.forEach((item, index) => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'translate3d(0, 20px, 0)';
                    
                    // Stagger the animations for smooth appearance
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translate3d(0, 0, 0)';
                    }, index * 50);
                } else {
                    item.style.transition = 'opacity 0.3s ease';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});

// Scroll to Top Button Functionality with throttling
const scrollToTopBtn = document.getElementById('scrollToTop');
let scrollToTopTimeout;

function handleScrollToTopVisibility() {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', () => {
    if (!scrollToTopTimeout) {
        scrollToTopTimeout = requestAnimationFrame(() => {
            handleScrollToTopVisibility();
            scrollToTopTimeout = null;
        });
    }
}, { passive: true });

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Fullscreen Gallery Functionality
let currentFullscreenItem = null;

galleryItems.forEach(item => {
    // Main click handler for the gallery item
    item.addEventListener('click', (e) => {
        // If already in fullscreen mode, exit
        if (item.classList.contains('fullscreen')) {
            exitFullscreen();
            return;
        }
        
        // Don't trigger if clicking on buttons
        if (e.target.classList.contains('view-btn') || 
            e.target.closest('.view-btn')) {
            return;
        }
        
        // Prevent event bubbling
        e.preventDefault();
        e.stopPropagation();
        
        // Enter fullscreen
        enterFullscreen(item);
    });
    
    // Specific click handler for images to ensure they're clickable
    const img = item.querySelector('img');
    if (img) {
        img.addEventListener('click', (e) => {
            // If already in fullscreen mode, exit
            if (item.classList.contains('fullscreen')) {
                exitFullscreen();
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            enterFullscreen(item);
        });
    }
    
    // Click handler for overlay area (but not buttons)
    const overlay = item.querySelector('.gallery-overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            // Don't trigger if clicking on buttons
            if (e.target.classList.contains('view-btn') || 
                e.target.closest('.view-btn')) {
                return;
            }
            
            // If already in fullscreen mode, exit
            if (item.classList.contains('fullscreen')) {
                exitFullscreen();
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            enterFullscreen(item);
        });
    }
});

// Remove the toggle function since we handle logic in click handlers directly

function enterFullscreen(item) {
    // Prevent multiple fullscreen items
    if (currentFullscreenItem) {
        exitFullscreen();
        return;
    }
    
    currentFullscreenItem = item;
    
    // Get the fullscreen image source
    const fullscreenSrc = item.getAttribute('data-fullscreen-image');
    const img = item.querySelector('img');
    
    if (!img || !fullscreenSrc) {
        console.warn('Missing image or fullscreen source');
        return;
    }
    
    // Store original image src
    item.setAttribute('data-original-src', img.src);
    
    // Update image source to high resolution
    img.src = fullscreenSrc;
    
    // Add fullscreen classes and styles
    item.classList.add('fullscreen');
    item.classList.add('fullscreen-enter');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Add close hint
    const closeHint = document.createElement('div');
    closeHint.className = 'fullscreen-close-hint';
    closeHint.innerHTML = '×';
    item.appendChild(closeHint);
    
    // Remove enter animation class after animation completes
    setTimeout(() => {
        if (item.classList.contains('fullscreen')) {
            item.classList.remove('fullscreen-enter');
        }
    }, 500);
}

function exitFullscreen() {
    if (!currentFullscreenItem) return;
    
    const item = currentFullscreenItem;
    const img = item.querySelector('img');
    const closeHint = item.querySelector('.fullscreen-close-hint');
    
    // Add exit animation
    item.classList.add('fullscreen-exit');
    
    setTimeout(() => {
        // Restore original image source
        const originalSrc = item.getAttribute('data-original-src');
        if (originalSrc) {
            img.src = originalSrc;
        }
        
        // Remove fullscreen classes
        item.classList.remove('fullscreen', 'fullscreen-exit');
        
        // Remove close hint
        if (closeHint) {
            closeHint.remove();
        }
        
        // Restore body scrolling
        document.body.style.overflow = 'auto';
        
        currentFullscreenItem = null;
    }, 500);
}

// Keyboard navigation for fullscreen
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentFullscreenItem) {
        exitFullscreen();
    }
});

// Lightbox functionality (keeping for the View Full buttons)
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.querySelector('.lightbox-content');
const closeBtn = document.querySelector('.close');
const viewButtons = document.querySelectorAll('.view-btn');

viewButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const imageSrc = button.getAttribute('data-image');
        lightboxContent.src = imageSrc;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
});

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Lightbox rating system
const lightboxStars = document.querySelectorAll('.lightbox-stars i');
let lightboxRating = 0;

lightboxStars.forEach((star, index) => {
    star.addEventListener('click', () => {
        lightboxRating = index + 1;
        updateLightboxStars();
        
        // Show feedback
        const ratingText = document.querySelector('.lightbox-rating h3');
        ratingText.textContent = `Thank you for rating! (${lightboxRating}/5)`;
        setTimeout(() => {
            ratingText.textContent = 'Rate this photo';
        }, 2000);
    });
    
    star.addEventListener('mouseover', () => {
        highlightStars(lightboxStars, index + 1);
    });
});

document.querySelector('.lightbox-rating').addEventListener('mouseleave', () => {
    updateLightboxStars();
});

function updateLightboxStars() {
    lightboxStars.forEach((star, index) => {
        if (index < lightboxRating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

function highlightStars(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}


// Contact form submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = '#27ae60';
        contactForm.reset();
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '#e74c3c';
            submitBtn.disabled = false;
        }, 2000);
    }, 1000);
});

// CTA Button scroll to portfolio with easing
document.querySelector('.cta-button').addEventListener('click', () => {
    const portfolioSection = document.querySelector('#portfolio');
    const targetPosition = portfolioSection.offsetTop - 80; // Account for navbar height
    
    // Use custom smooth scrolling for better control
    smoothScrollTo(targetPosition, 1000);
});

// Custom smooth scroll function with easing
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }
    
    function scrollAnimation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeProgress = easeInOutQuart(progress);
        
        window.scrollTo(0, startPosition + distance * easeProgress);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(scrollAnimation);
        }
    }
    
    requestAnimationFrame(scrollAnimation);
}

// Intersection Observer for animations with reduced threshold for smoother performance
const observerOptions = {
    threshold: [0.1, 0.3],
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            element.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translate3d(0, 0, 0)';
            
            // Unobserve after animation to improve performance
            observer.unobserve(element);
        }
    });
}, observerOptions);

// Observe elements for animation with initial state
document.querySelectorAll('.gallery-item, .skill-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translate3d(0, 30px, 0)';
    el.style.willChange = 'opacity, transform';
    observer.observe(el);
});

// Parallax effect for hero section with throttling
let parallaxTimeout;
function handleParallax() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    const speed = scrolled * 0.5;
    
    if (parallax && scrolled < window.innerHeight) {
        parallax.style.transform = `translate3d(0, ${speed}px, 0)`;
    }
}

window.addEventListener('scroll', () => {
    if (!parallaxTimeout) {
        parallaxTimeout = requestAnimationFrame(() => {
            handleParallax();
            parallaxTimeout = null;
        });
    }
}, { passive: true });

// Gallery item hover effects with hardware acceleration
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translate3d(0, -10px, 0) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translate3d(0, 0, 0) scale(1)';
    });
});

// Preload images for better performance
function preloadImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        const imageUrl = img.getAttribute('data-src');
        const imageElement = new Image();
        imageElement.onload = () => {
            img.src = imageUrl;
            img.classList.add('loaded');
        };
        imageElement.src = imageUrl;
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadImages);

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading states
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading class after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 500);
    });
});

// Dynamic copyright year
document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const copyrightText = document.querySelector('.footer-bottom p');
    if (copyrightText) {
        copyrightText.textContent = `© ${currentYear} Tim Downey Photography. All rights reserved.`;
    }
});

// Gallery masonry layout adjustment
function adjustGalleryLayout() {
    const gallery = document.querySelector('.gallery');
    const items = gallery.querySelectorAll('.gallery-item');
    
    items.forEach(item => {
        item.style.height = 'auto';
    });
}

// Call layout adjustment on resize
window.addEventListener('resize', adjustGalleryLayout);
document.addEventListener('DOMContentLoaded', adjustGalleryLayout);

// Social media share functionality (placeholder)
function shareOnSocialMedia(platform, url, text) {
    let shareUrl = '';
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Add click handlers for social links (when they're clicked)
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = link.querySelector('i').classList.contains('fa-facebook') ? 'facebook' :
                        link.querySelector('i').classList.contains('fa-twitter') ? 'twitter' :
                        link.querySelector('i').classList.contains('fa-linkedin') ? 'linkedin' : '';
        
        if (platform) {
            shareOnSocialMedia(platform, window.location.href, 'Check out Tim Downey Photography!');
        }
    });
});

// Lightroom Modal Functionality
const openLightroomBtn = document.getElementById('openLightroomModal');
const closeLightroomBtn = document.getElementById('closeLightroomModal');
const lightroomModal = document.getElementById('lightroomModal');

openLightroomBtn.addEventListener('click', () => {
    // Show modal with loading message
    lightroomModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Open Lightroom gallery in new tab after short delay
    setTimeout(() => {
        window.open('https://adobe.ly/3m2E31D', '_blank');
        
        // Auto-close modal after opening gallery
        setTimeout(() => {
            lightroomModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1500);
    }, 500);
});

closeLightroomBtn.addEventListener('click', () => {
    lightroomModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
lightroomModal.addEventListener('click', (e) => {
    if (e.target === lightroomModal) {
        lightroomModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

console.log('Tim Downey Photography website loaded successfully!');