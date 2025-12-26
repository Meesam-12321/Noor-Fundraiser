// Global variables for application state
let currentTheme = 'light';
let selectedAmount = 5000;
let totalRaised = 0;
let donorsCount = 0;
let currentTestimonial = 0;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeAmountButtons();
    initializeDonationTracking();
    initializeTestimonials();
    initializeAnimations();
    initializeCountdownTimer();
    initializeImageLoading();
    startProgressAnimation();
    
    // Add smooth scrolling for navigation
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
});

// Image Loading Management
function initializeImageLoading() {
    const noorImage = document.getElementById('noorImage');
    const fallbackElement = document.querySelector('.placeholder-fallback');
    
    // Check if the image loads successfully
    noorImage.onload = function() {
        noorImage.style.display = 'block';
        fallbackElement.style.display = 'none';
        
        // Add a subtle fade-in animation
        noorImage.style.opacity = '0';
        noorImage.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
            noorImage.style.opacity = '1';
        }, 100);
    };
    
    // If image fails to load, keep the fallback
    noorImage.onerror = function() {
        noorImage.style.display = 'none';
        fallbackElement.style.display = 'flex';
        console.log('Noor image not found, using fallback placeholder');
    };
    
    // Try to load the image
    noorImage.src = noorImage.src + '?v=' + Date.now(); // Cache busting
}

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeIcon = document.querySelector('#themeToggle i');
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    
    // Update theme toggle button text for accessibility
    document.getElementById('themeToggle').setAttribute(
        'aria-label', 
        `Switch to ${theme === 'light' ? 'dark' : 'light'} theme`
    );
}

// Amount Button Management
function initializeAmountButtons() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountDiv = document.getElementById('customAmount');
    const amountInput = document.getElementById('amountInput');
    
    amountButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove selected class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            
            const amount = button.getAttribute('data-amount');
            
            if (amount === 'custom') {
                button.classList.add('selected');
                customAmountDiv.style.display = 'block';
                amountInput.focus();
                selectedAmount = parseInt(amountInput.value) || 1000;
            } else {
                button.classList.add('selected');
                customAmountDiv.style.display = 'none';
                selectedAmount = parseInt(amount);
            }
            
            updateDonateButton();
        });
    });
    
    amountInput.addEventListener('input', () => {
        selectedAmount = parseInt(amountInput.value) || 0;
        updateDonateButton();
    });
    
    // Set default selection
    document.querySelector('.amount-btn[data-amount="5000"]').classList.add('selected');
}

function updateDonateButton() {
    const donateBtn = document.getElementById('donateBtn');
    const span = donateBtn.querySelector('span');
    
    if (selectedAmount > 0) {
        span.textContent = `Donate PKR ${selectedAmount.toLocaleString()}`;
        donateBtn.disabled = false;
        donateBtn.style.opacity = '1';
    } else {
        span.textContent = 'Donate Now';
        donateBtn.disabled = true;
        donateBtn.style.opacity = '0.6';
    }
}

// Donation Tracking
function initializeDonationTracking() {
    const donateBtn = document.getElementById('donateBtn');
    
    // Load saved progress from localStorage
    totalRaised = parseInt(localStorage.getItem('totalRaised')) || 0;
    donorsCount = parseInt(localStorage.getItem('donorsCount')) || 0;
    
    updateProgress();
    
    donateBtn.addEventListener('click', () => {
        if (selectedAmount > 0) {
            processDonation(selectedAmount);
        }
    });
}

function processDonation(amount) {
    // Simulate donation processing
    showDonationAnimation();
    
    // Update totals
    totalRaised += amount;
    donorsCount += 1;
    
    // Save to localStorage
    localStorage.setItem('totalRaised', totalRaised.toString());
    localStorage.setItem('donorsCount', donorsCount.toString());
    
    // Update UI
    setTimeout(() => {
        updateProgress();
        showThankYouMessage(amount);
    }, 1500);
}

function updateProgress() {
    const targetAmount = 50000;
    const progressPercentage = Math.min((totalRaised / targetAmount) * 100, 100);
    const remainingAmount = Math.max(targetAmount - totalRaised, 0);
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = progressPercentage + '%';
    
    // Update text elements
    document.getElementById('currentAmount').textContent = `PKR ${totalRaised.toLocaleString()}`;
    document.getElementById('progressPercentage').textContent = `${Math.round(progressPercentage)}%`;
    document.getElementById('remainingAmount').textContent = `PKR ${remainingAmount.toLocaleString()}`;
    document.getElementById('donorsCount').textContent = donorsCount;
    
    // Add celebration effect if goal reached
    if (progressPercentage >= 100) {
        celebrateGoalReached();
    }
}

function showDonationAnimation() {
    const donateBtn = document.getElementById('donateBtn');
    const originalText = donateBtn.innerHTML;
    
    donateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Processing...</span>';
    donateBtn.disabled = true;
    
    setTimeout(() => {
        donateBtn.innerHTML = '<i class="fas fa-check"></i> <span>Thank You!</span>';
        donateBtn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            donateBtn.innerHTML = originalText;
            donateBtn.disabled = false;
            donateBtn.style.background = '';
        }, 2000);
    }, 1500);
}

function showThankYouMessage(amount) {
    // Create thank you overlay
    const overlay = document.createElement('div');
    overlay.className = 'thank-you-overlay';
    overlay.innerHTML = `
        <div class="thank-you-content">
            <div class="thank-you-icon">
                <i class="fas fa-heart"></i>
            </div>
            <h3>Thank You!</h3>
            <p>Your donation of <strong>PKR ${amount.toLocaleString()}</strong> means the world to Noor.</p>
            <p>Together, we're making education possible.</p>
            <button onclick="closeThankYou()" class="close-thank-you">Continue</button>
        </div>
    `;
    
    // Add styles for the overlay
    const style = document.createElement('style');
    style.textContent = `
        .thank-you-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        }
        
        .thank-you-content {
            background: var(--bg-card);
            padding: 3rem;
            border-radius: var(--border-radius);
            text-align: center;
            max-width: 400px;
            margin: 0 1rem;
            box-shadow: 0 20px 60px var(--shadow-strong);
        }
        
        .thank-you-icon {
            width: 80px;
            height: 80px;
            background: var(--primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            color: var(--text-inverse);
            font-size: 2rem;
            animation: pulse 1s ease-out;
        }
        
        .thank-you-content h3 {
            font-family: var(--font-heading);
            font-size: 2rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        .thank-you-content p {
            margin-bottom: 1rem;
            color: var(--text-secondary);
        }
        
        .close-thank-you {
            background: var(--primary-color);
            color: var(--text-inverse);
            border: none;
            padding: 1rem 2rem;
            border-radius: var(--border-radius-small);
            cursor: pointer;
            font-weight: var(--font-weight-medium);
            margin-top: 1rem;
            transition: all 0.3s ease;
        }
        
        .close-thank-you:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (overlay.parentNode) {
            closeThankYou();
        }
    }, 5000);
}

function closeThankYou() {
    const overlay = document.querySelector('.thank-you-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

function celebrateGoalReached() {
    // Create confetti effect
    const confettiCount = 50;
    const colors = ['#d2691e', '#ff6b35', '#8b4513', '#ff8a65'];
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 50);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${color};
        top: -10px;
        left: ${Math.random() * 100}%;
        z-index: 10000;
        pointer-events: none;
        border-radius: 50%;
    `;
    
    document.body.appendChild(confetti);
    
    const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 50}px) rotate(360deg)`, opacity: 0 }
    ], {
        duration: 3000,
        easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
    });
    
    animation.onfinish = () => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    };
}

// Testimonials Management
function initializeTestimonials() {
    setInterval(() => {
        nextTestimonial();
    }, 5000);
}

function showTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentTestimonial = index;
}

function nextTestimonial() {
    const testimonials = document.querySelectorAll('.testimonial');
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}

// Countdown Timer
function initializeCountdownTimer() {
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 5); // 5 days from now
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = examDate.getTime() - now;
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        let timeText = '';
        if (days > 0) {
            timeText = `${days} Day${days !== 1 ? 's' : ''}`;
        } else if (hours > 0) {
            timeText = `${hours} Hour${hours !== 1 ? 's' : ''}`;
        } else {
            timeText = 'Final Hours';
        }
        
        document.getElementById('timeLeft').textContent = timeText;
        
        if (distance < 0) {
            document.getElementById('timeLeft').textContent = 'Urgent';
            clearInterval(countdownInterval);
        }
    }
    
    const countdownInterval = setInterval(updateCountdown, 1000 * 60); // Update every minute
    updateCountdown(); // Initial call
}

// Animation Utilities
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    document.querySelectorAll('.story-paragraph, .impact-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

function startProgressAnimation() {
    setTimeout(() => {
        updateProgress();
    }, 1000);
}

// Utility Functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navHeight = document.querySelector('.nav').offsetHeight;
        const elementPosition = element.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const originalContent = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('copied');
        }, 2000);
    });
}

// Social Sharing Functions
function shareOnWhatsApp() {
    const message = encodeURIComponent(`Help Noor Naveed complete his education! He needs PKR 50,000 for his final exams. Every contribution matters. ${window.location.href}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnTwitter() {
    const message = encodeURIComponent('Help Noor Naveed complete his education! He needs support for his final exams. Every contribution matters.');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${message}&url=${url}`, '_blank');
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeThankYou();
    }
    
    // Arrow keys for testimonials
    if (e.key === 'ArrowLeft') {
        const prevIndex = currentTestimonial === 0 ? 2 : currentTestimonial - 1;
        showTestimonial(prevIndex);
    } else if (e.key === 'ArrowRight') {
        nextTestimonial();
    }
});

// Performance Monitoring
function trackPerformance() {
    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    });
}

// Initialize performance tracking
trackPerformance();

// Accessibility enhancements
function enhanceAccessibility() {
    // Add ARIA labels to interactive elements
    document.querySelectorAll('.amount-btn').forEach((btn, index) => {
        btn.setAttribute('aria-label', `Select donation amount ${btn.textContent}`);
    });
    
    // Add proper ARIA roles
    document.querySelector('.progress-bar').setAttribute('role', 'progressbar');
    document.querySelector('.progress-bar').setAttribute('aria-valuemin', '0');
    document.querySelector('.progress-bar').setAttribute('aria-valuemax', '50000');
    
    // Update progress bar ARIA values
    const progressBar = document.getElementById('progressFill');
    if (progressBar) {
        progressBar.parentElement.setAttribute('aria-valuenow', totalRaised.toString());
        progressBar.parentElement.setAttribute('aria-valuetext', `${totalRaised} rupees raised out of 50,000`);
    }
}

// Initialize accessibility features
enhanceAccessibility();

// Error handling for failed operations
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // Could implement error reporting here
});

// Service Worker registration for offline support (future enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker could be registered here for offline functionality
        console.log('Service Worker support detected');
    });
}

// Initialize application
console.log('Noor Naveed Fundraising App initialized successfully');