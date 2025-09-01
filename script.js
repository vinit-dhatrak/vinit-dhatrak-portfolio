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

// Minimal configuration
const config = {};

// State
const state = {
    currentTheme: localStorage.getItem('theme') || 'dark'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeNavigation();
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

// Close navigation with Escape (keep only essential keyboard interaction)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
        toggleNavMenu();
    }
});

// Minimal console message
console.log('🚀 Vinit Dhatrak - Lead Software Engineer | https://dhatrak.com');
