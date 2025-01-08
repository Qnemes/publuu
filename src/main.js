'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const hamburger = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('.nav-links');
  const languageSelect = document.querySelector('#language-select');
  const solutionsButton = document.querySelector('#solutions-button');
  const solutionsDropdown = document.querySelector('#solutions-dropdown');
  const langButton = document.querySelector('#lang-button');
  const langDropdown = document.querySelector('#language-dropdown');

  function closeDropdowns(exceptDropdown = null) {
    const dropdowns = document.querySelectorAll('.dropdown-menu');

    dropdowns.forEach((dropdown) => {
      if (dropdown !== exceptDropdown) {
        const button = document.querySelector(`#${dropdown.id}`);
        button.setAttribute('aria-expanded', 'false');
        dropdown.hidden = true;
      }
    });
  }

  function toggleDropdown(button, dropdown) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);
    dropdown.hidden = isExpanded;
  }

  solutionsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(solutionsButton, solutionsDropdown);
    closeDropdowns(solutionsDropdown);
  });

  langButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(langButton, langDropdown);
    closeDropdowns(langDropdown);
  });

  document.addEventListener('click', () => {
    closeDropdowns();
  });

  document?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdowns();
    }
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    console.log('clicked');
  });

  document.querySelectorAll('.nav-links').forEach((n) =>
    n.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    })
  );

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeMenu = document.querySelector('.nav-list.active');
      if (activeMenu) {
        activeMenu.classList.remove('active');
        menuToggle?.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Language Selector
  languageSelect?.addEventListener('click', () => {
    const isExpanded = languageSelect.getAttribute('aria-expanded') === 'true';
    languageSelect.setAttribute('aria-expanded', !isExpanded);
  });
});

// Lazy Loading Images
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

if ('loading' in HTMLImageElement.prototype) {
  lazyImages.forEach((img) => {
    img.src = img.dataset.src;
  });
} else {
  const lazyLoadScript = document.createElement('script');
  lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(lazyLoadScript);
}

/* Function to initialize and handle number animations */
function initNumberAnimations(selector = '.stat-number', duration = 1000) {
  const elements = document.querySelectorAll(selector);

  const observerOptions = {
    root: null, // Use the viewport as the root
    threshold: 0.3, // Trigger when 30% of the element is visible
  };

  // Create Intersection Observer
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const endNumber = parseFloat(element.dataset.endNumber);
        const suffix = element.dataset.suffix || '';
        if (isNaN(endNumber)) return;

        // Prevent re-triggering animation
        const animationRunning = JSON.parse(element.dataset.animationRunning ?? false);
        if (animationRunning) return;

        element.dataset.animationRunning = true;

        const speed = 10; // Base speed for all animations
        const totalSteps = Math.ceil(duration / speed); // Total steps to complete animation
        const increment = endNumber / totalSteps; // Increment step for synchronized duration

        // Start the number animation
        incNbrRec(0, endNumber, element, speed, increment, suffix);

        // Unobserve the element after the animation starts
        observer.unobserve(element);
      }
    });
  }, observerOptions);

  // Observe each element
  elements.forEach((element) => observer.observe(element));
}

/* Recursive function to increase the number */
function incNbrRec(currentNumber, endNumber, element, speed, increment, suffix) {
  if (currentNumber < endNumber) {
    const displayNumber = formatNumberWithSuffix(currentNumber, suffix);
    element.innerHTML = displayNumber;

    setTimeout(() => {
      incNbrRec(
        Math.min(currentNumber + increment, endNumber),
        endNumber,
        element,
        speed,
        increment,
        suffix
      );
    }, speed);
  } else {
    element.innerHTML = formatNumberWithSuffix(endNumber, suffix);
    element.dataset.animationRunning = false;
  }
}

/* Format number with suffix */
function formatNumberWithSuffix(number, suffix) {
  const formattedNumber = Number.isInteger(number) ? number : number.toFixed(1); // Show one decimal for fractional numbers

  return suffix ? `${formattedNumber}${suffix}` : formattedNumber;
}

initNumberAnimations('.stat-number', 900);
