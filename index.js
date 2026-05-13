/**
 * Arabic Academy - Main JavaScript
 * Clean, modular, vanilla JavaScript
 */

(function() {
  'use strict';

  // ========================================
  // Mobile Navigation Toggle
  // ========================================
  
  function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');
    
    if (!mobileMenuBtn || !nav) return;
    
    mobileMenuBtn.addEventListener('click', function() {
      nav.classList.toggle('active');
      
      // Toggle aria-expanded for accessibility
      const isExpanded = nav.classList.contains('active');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        nav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Close menu when pressing Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.focus();
      }
    });
  }

  // ========================================
  // Smooth Scroll for Anchor Links
  // ========================================
  
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        
        if (target) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ========================================
  // Form Validation
  // ========================================
  
  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isValid = validateForm(form);
        
        if (isValid) {
          // Show success message
          showNotification('Message sent successfully!', 'success');
          form.reset();
        }
      });
      
      // Real-time validation
      form.querySelectorAll('input, textarea').forEach(function(input) {
        input.addEventListener('blur', function() {
          validateField(input);
        });
        
        input.addEventListener('input', function() {
          if (input.classList.contains('error')) {
            validateField(input);
          }
        });
      });
    });
  }
  
  function validateForm(form) {
    let isValid = true;
    
    form.querySelectorAll('[required]').forEach(function(field) {
      if (!validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required check
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    if (isValid && field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Update field state
    if (isValid) {
      field.classList.remove('error');
      removeErrorMessage(field);
    } else {
      field.classList.add('error');
      showErrorMessage(field, errorMessage);
    }
    
    return isValid;
  }
  
  function showErrorMessage(field, message) {
    removeErrorMessage(field);
    
    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.cssText = 'color: #ef4444; font-size: 0.8125rem; margin-top: 0.25rem; display: block;';
    
    field.parentNode.appendChild(errorEl);
    field.style.borderColor = '#ef4444';
  }
  
  function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    field.style.borderColor = '';
  }

  // ========================================
  // Notifications
  // ========================================
  
  function showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
      existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const bgColor = type === 'success' ? '#10b981' : '#ef4444';
    
    notification.style.cssText = `
      position: fixed;
      top: 90px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(function() {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(function() {
        notification.remove();
      }, 300);
    }, 4000);
  }
  
  // Add notification animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    .form-input.error,
    .form-textarea.error {
      border-color: #ef4444 !important;
    }
  `;
  document.head.appendChild(style);

  // ========================================
  // Pricing Card Selection
  // ========================================
  
  function initPricingCards() {
    const pricingButtons = document.querySelectorAll('.pricing-card .btn');
    
    pricingButtons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        const card = this.closest('.pricing-card');
        const planName = card.querySelector('h3').textContent;
        
        // Store selected plan and redirect to contact
        sessionStorage.setItem('selectedPlan', planName);
        window.location.href = 'contact.html';
      });
    });
    
    // Pre-fill plan in contact form if coming from pricing
    const selectedPlan = sessionStorage.getItem('selectedPlan');
    const messageField = document.querySelector('#message');
    
    if (selectedPlan && messageField && !messageField.value) {
      messageField.value = `I'm interested in the ${selectedPlan} plan.`;
      sessionStorage.removeItem('selectedPlan');
    }
  }

  // ========================================
  // Course Card Interaction
  // ========================================
  
  function initCourseCards() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(function(card) {
      card.addEventListener('click', function() {
        // Visual feedback
        this.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      });
      
      // Keyboard accessibility
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // ========================================
  // Active Navigation Link
  // ========================================
  
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // ========================================
  // Scroll Header Shadow
  // ========================================
  
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          if (window.scrollY > 10) {
            header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          } else {
            header.style.boxShadow = '';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ========================================
  // Initialize All
  // ========================================
  
  function init() {
    initMobileMenu();
    initSmoothScroll();
    initFormValidation();
    initPricingCards();
    initCourseCards();
    setActiveNavLink();
    initHeaderScroll();
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
