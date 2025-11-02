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
const config = {
    lessons: [
        { id: 1, title: "The Simplest Neuron" },
        { id: 2, title: "Measuring Error - The Loss Function" },
        { id: 3, title: "Gradient Descent" },
        { id: 4, title: "The Training Loop" },
        { id: 5, title: "Sigmoid Activation" },
        { id: 6, title: "The XOR Problem" },
        { id: 7, title: "Multi-Layer Perceptron (MLP)" },
        { id: 8, title: "Backpropagation" },
        { id: 9, title: "House Price Prediction" },
        { id: 10, title: "ReLU vs. Sigmoid" }
    ]
};

// State
const state = {
    currentTheme: localStorage.getItem('theme') || 'dark'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeNavigation();
    initializeSmoothScrolling();
    initializeCourse();
});

// --- New Course Functionality ---

const courseSidebar = $('#course-sidebar');
const sidebarLinks = $('#sidebar-links');
const courseContent = $('#course-content');

function initializeCourse() {
    if (!courseSidebar) return;

    // 1. Populate sidebar
    sidebarLinks.innerHTML = config.lessons.map(lesson => `
        <li>
            <a href="#lesson-${lesson.id}" data-lesson-id="${lesson.id}">
                <span class="lesson-number">${String(lesson.id).padStart(2, '0')}.</span> ${lesson.title}
            </a>
        </li>
    `).join('');

    // 2. Add event listeners to new links
    $$('#sidebar-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lessonId = link.getAttribute('data-lesson-id');
            loadLesson(lessonId);
            
            // Update active state
            $$('#sidebar-links a').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // 3. Load initial lesson (e.g., Lesson 1)
    loadLesson(1);
    $('#sidebar-links a')?.classList.add('active');
}

async function loadLesson(lessonId) {
    try {
        const response = await fetch(`lessons/lesson-${lessonId}.html`);
        if (!response.ok) {
            throw new Error(`Lesson ${lessonId} not found.`);
        }
        const content = await response.text();
        courseContent.innerHTML = content;
        
        // Add functionality to the new copy buttons
        initializeCopyButtons();

        // Tell Prism to highlight the new code blocks
        Prism.highlightAll();

    } catch (error) {
        courseContent.innerHTML = `<p style="color: var(--accent-tertiary);">Error loading lesson: ${error.message}</p>`;
    }
}

function initializeCopyButtons() {
    $$('.copy-code-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const pre = btn.nextElementSibling;
            const code = pre.querySelector('code');
            navigator.clipboard.writeText(code.innerText);
            
            const originalText = btn.innerText;
            btn.innerText = 'Copied!';
            setTimeout(() => {
                btn.innerText = originalText;
            }, 2000);
        });
    });
}


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
        let navLink = $(`.nav-link[href="#${sectionId}"]`);

        // Also check for about.html links
        if (!navLink) {
             navLink = $(`.nav-link[href*="${sectionId}"]`);
        }

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink?.classList.add('active');
        }
    });
}





// Smooth scrolling
function initializeSmoothScrolling() {
    // This logic should only apply to the main lessons page
    if (!document.querySelector('.course-container')) {
        // On the 'About Me' page, we want default link behavior
        return;
    }

    // Handle navigation links within the lessons page (e.g., hero button)
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = $(targetId);
            if(targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
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
