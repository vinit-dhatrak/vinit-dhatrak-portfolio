// Utility functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// DOM elements
const navToggle = $('#nav-toggle');
const navMenu = $('#nav-menu');
const themeToggle = $('#theme-toggle');
const typingText = $('#typing-text');
const navLinks = $$('.nav-link');
const navLogo = $('.nav-logo');
const backToTopLink = $('.footer-links a');

// Configuration
const config = {
    typingSpeed: 100,
    typingDelay: 1000,
    observerOptions: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    }
};

// State
const state = {
    currentTheme: localStorage.getItem('theme') || 'dark',
    isTyping: false,
    observedElements: new Set()
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeNavigation();
    initializeTypingAnimation();
    initializeScrollAnimations();
    initializeIntersectionObserver();
    initializeTerminalAnimation();
    initializeSmoothScrolling();
});

// Theme management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    updateThemeIcon();
    
    themeToggle?.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    localStorage.setItem('theme', state.currentTheme);
    updateThemeIcon();
    
    // Add a subtle animation to the theme toggle
    themeToggle.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
}

function updateThemeIcon() {
    const icon = themeToggle?.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = state.currentTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Navigation
function initializeNavigation() {
    navToggle?.addEventListener('click', toggleNavMenu);
    
    // Close nav menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu?.classList.contains('active')) {
                toggleNavMenu();
            }
        });
    });
    
    // Close nav menu when clicking on logo
    if (navLogo) {
        navLogo.addEventListener('click', () => {
            if (navMenu?.classList.contains('active')) {
                toggleNavMenu();
            }
        });
    }
    
    // Close nav menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle?.contains(e.target) && !navMenu?.contains(e.target)) {
            navMenu?.classList.remove('active');
        }
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function toggleNavMenu() {
    navMenu?.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = navToggle?.querySelectorAll('span');
    if (spans) {
        spans.forEach((span, index) => {
            span.style.transform = navMenu?.classList.contains('active') 
                ? getHamburgerTransform(index) 
                : 'none';
        });
    }
}

function getHamburgerTransform(index) {
    const transforms = [
        'rotate(45deg) translate(5px, 5px)',
        'opacity: 0',
        'rotate(-45deg) translate(7px, -6px)'
    ];
    return transforms[index] || 'none';
}

function updateActiveNavLink() {
    const sections = $$('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = $(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink?.classList.add('active');
        }
    });
}

// Typing animation
function initializeTypingAnimation() {
    const texts = [
        'Hello, I\'m Vinit Dhatrak',
        'I build distributed systems',
        'I scale cloud infrastructure', 
        'I lead engineering teams'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        if (!typingText) return;
        
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.innerHTML = currentText.substring(0, charIndex - 1) + '<span class="cursor">|</span>';
            charIndex--;
        } else {
            typingText.innerHTML = currentText.substring(0, charIndex + 1) + '<span class="cursor">|</span>';
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : config.typingSpeed;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = config.typingDelay;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    typeText();
}

// Terminal animation
function initializeTerminalAnimation() {
    const terminalLines = $$('.terminal-line');
    
    terminalLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            line.style.transition = 'all 0.5s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, index * 300);
    });
}

// Scroll animations
function initializeScrollAnimations() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = $('.hero');
        
        if (hero) {
            const speed = scrolled * 0.5;
            hero.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Animate elements on scroll
    const animateOnScroll = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                state.observedElements.add(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(animateOnScroll, config.observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = $$('.timeline-item, .project-card, .tech-item, .contact-link');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Intersection Observer for section visibility
function initializeIntersectionObserver() {
    const sections = $$('section[id]');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateNavHighlight(sectionId);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    });
    
    sections.forEach(section => sectionObserver.observe(section));
}

function updateNavHighlight(sectionId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling
function initializeSmoothScrolling() {
    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = $(`#${targetId}`);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle logo click
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Handle back to top link
    if (backToTopLink) {
        backToTopLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Project card interactions
function initializeProjectCards() {
    const projectCards = $$('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0)';
        });
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Toggle theme with Ctrl/Cmd + Shift + T
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Toggle navigation with Ctrl/Cmd + Shift + N
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
        e.preventDefault();
        toggleNavMenu();
    }
    
    // Close navigation with Escape
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
        toggleNavMenu();
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate in hero content
    const heroElements = $$('.hero-title, .hero-subtitle, .hero-description, .hero-cta');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
}, 100));

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Add some fun animations or effects
    document.body.style.animation = 'rainbow 2s infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
    
    // Show a fun message
    const message = document.createElement('div');
    message.textContent = '🎉 You found the easter egg! 🎉';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--accent-primary);
        color: var(--bg-primary);
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        font-family: var(--font-mono);
        font-weight: bold;
        z-index: 9999;
        animation: bounce 0.5s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes bounce {
        0%, 20%, 60%, 100% { transform: translate(-50%, -50%) translateY(0); }
        40% { transform: translate(-50%, -50%) translateY(-10px); }
        80% { transform: translate(-50%, -50%) translateY(-5px); }
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .timeline-item,
    .project-card,
    .tech-item,
    .contact-link {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .loaded .hero-visual {
        animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// Console message for developers
console.log(`
🚀 Welcome to Vinit Dhatrak's Portfolio!

Built with:
- Vanilla JavaScript
- CSS Grid & Flexbox
- Intersection Observer API
- CSS Custom Properties

Try these keyboard shortcuts:
- Ctrl/Cmd + Shift + T: Toggle theme
- Ctrl/Cmd + Shift + N: Toggle navigation
- Konami Code: ↑↑↓↓←→←→BA for a surprise!

Interested in the code? Check out the GitHub repository!
`);

// Analytics and performance monitoring (placeholder)
function trackEvent(action, category = 'User Interaction') {
    // Implement your analytics tracking here
    console.log(`Analytics: ${category} - ${action}`);
}

// Track important user interactions
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        trackEvent(`Navigation: ${link.textContent.trim()}`);
    });
});

themeToggle?.addEventListener('click', () => {
    trackEvent('Theme Toggle');
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
