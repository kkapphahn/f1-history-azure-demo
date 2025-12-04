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

// Intersection Observer for Timeline animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach(item => {
    observer.observe(item);
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(13, 13, 20, 1)';
    } else {
        header.style.background = 'rgba(13, 13, 20, 0.95)';
    }
});

// Add animation to cards on scroll
const cards = document.querySelectorAll('.champion-card, .moment-card');
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    cardObserver.observe(card);
});

// Dynamic year counter
const currentYear = new Date().getFullYear();
const yearsOfF1 = currentYear - 1950;
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    heroSubtitle.textContent = `${yearsOfF1}+ Years of Speed, Glory, and Innovation`;
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Console Easter Egg for F1 fans
console.log('%c🏎️ Welcome to F1 History! 🏁', 'font-size: 20px; font-weight: bold; color: #e10600;');
console.log('%cFastest lap around this site: ' + performance.now().toFixed(2) + 'ms', 'color: #ffd700;');
