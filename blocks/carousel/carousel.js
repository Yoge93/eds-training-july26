
import { createOptimizedPicture, decorateButtons, decorateIcons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const VARIANTS = ['dark', 'light', 'full-width'];

export default function decorate(block) {
  // Snapshot source rows before mutation
  const sourceRows = [...block.children];
  if (!sourceRows.length) return;

  // Check for style column (first column if it matches variant values)
  const cols = sourceRows;
  if (cols[0] && VARIANTS.some(v => cols[0].textContent.trim().includes(v))) {
    cols[0].textContent.trim().split(/[\s,]+/).forEach(token => {
      if (VARIANTS.includes(token)) block.classList.add(token);
    });
    cols.shift();
  }

  // Parse block-level fields (none in this case, all fields are style/autoplay)
  // Remaining columns are all carousel-slide items
  const slideCols = cols;

  // Create carousel structure
  const wrapper = document.createElement('div');
  wrapper.className = 'carousel-wrapper';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'carousel-slides';

  // Process each slide
  slideCols.forEach((slideCol, index) => {
    const slide = document.createElement('article');
    slide.className = 'carousel-slide';
    moveInstrumentation(slideCol, slide);

    // Parse slide fields (image, title, description, link)
    const rows = [...slideCol.children];
    const [imageRow, titleRow, descRow, linkRow, linkTextRow] = rows;

    // Image (reference field - field collapsed with imageAlt)
    if (imageRow?.querySelector('picture')) {
      const picture = imageRow.querySelector('picture');
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, index === 0, [{ width: '800' }, { width: '1600' }]);
        moveInstrumentation(picture, optimizedPic);
        picture.replaceWith(optimizedPic);
      }
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'carousel-slide-image';
      imageWrapper.append(...imageRow.children);
      slide.appendChild(imageWrapper);
    }

    // Content wrapper
    const content = document.createElement('div');
    content.className = 'carousel-slide-content';

    // Title
    if (titleRow) {
      const h3 = document.createElement('h3');
      h3.className = 'carousel-slide-title';
      moveInstrumentation(titleRow, h3);
      h3.textContent = titleRow.textContent.trim();
      content.appendChild(h3);
    }

    // Description
    if (descRow) {
      const desc = document.createElement('div');
      desc.className = 'carousel-slide-description';
      moveInstrumentation(descRow, desc);
      while (descRow.firstChild) desc.append(descRow.firstChild);
      content.appendChild(desc);
    }

    // Link (if present)
    if (linkRow?.querySelector('a') || linkTextRow) {
      const linkEl = linkRow?.querySelector('a') || document.createElement('a');
      if (!linkRow?.querySelector('a')) {
        moveInstrumentation(linkRow, linkEl);
        moveInstrumentation(linkTextRow, linkEl);
      }

      if (linkTextRow) {
        linkEl.textContent = linkTextRow.textContent.trim() || titleRow?.textContent.trim() || '';
      }

      // Wrap content in link if it exists
      const linkWrapper = document.createElement('div');
      linkWrapper.className = 'carousel-slide-link';
      linkWrapper.appendChild(linkEl);
      content.appendChild(linkWrapper);
      slide.classList.add('has-link');
    }

    slide.appendChild(content);
    slidesContainer.appendChild(slide);
  });

  track.appendChild(slidesContainer);
  wrapper.appendChild(track);

  // Navigation
  const nav = document.createElement('nav');
  nav.className = 'carousel-nav';
  nav.setAttribute('aria-label', 'Carousel navigation');

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav-button carousel-nav-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '<span class="icon icon-chevron-left"></span>';
  nav.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav-button carousel-nav-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '<span class="icon icon-chevron-right"></span>';
  nav.appendChild(nextBtn);

  wrapper.appendChild(nav);

  // Dots
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  dotsContainer.setAttribute('aria-label', 'Slide indicators');

  slideCols.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    if (index === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
  });

  wrapper.appendChild(dotsContainer);

  // Build final structure
  block.appendChild(wrapper);

  // Clean up source rows
  sourceRows.forEach(row => row.remove());

  // Initialize carousel
  initCarousel(block);
}

function initCarousel(block) {
  const slides = block.querySelectorAll('.carousel-slide');
  const track = block.querySelector('.carousel-track');
  const prevBtn = block.querySelector('.carousel-nav-prev');
  const nextBtn = block.querySelector('.carousel-nav-next');
  const dots = block.querySelectorAll('.carousel-dot');

  if (!slides.length || !track || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const slideCount = slides.length;
  let autoplayInterval;
  let isPaused = false;
  let isTransitioning = false;

  // Check for autoplay settings
  const autoplay = block.classList.contains('autoplay') ||
    block.querySelector('[data-autoplay="true"]') !== null;
  const interval = parseInt(block.dataset.autoplayInterval) || 5000;

  // Set up slide positions
  function updateSlides() {
    if (isTransitioning) return;

    isTransitioning = true;
    track.style.transition = 'transform 0.5s ease-in-out';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
      dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
    });

    // Update aria attributes
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== currentIndex ? 'true' : 'false');
      slide.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
    });

    // Reset transition flag after animation completes
    setTimeout(() => {
      isTransitioning = false;
      // Handle infinite loop positioning
      if (currentIndex === 0) {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0%)';
      } else if (currentIndex === slideCount - 1) {
        track.style.transition = 'none';
        track.style.transform = `translateX(-${(slideCount - 1) * 100}%)`;
      }
    }, 500);
  }

  // Clone slides for infinite loop effect
  function setupInfiniteLoop() {
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slideCount - 1].cloneNode(true);

    firstClone.classList.add('carousel-slide-clone');
    lastClone.classList.add('carousel-slide-clone');

    slidesContainer.prepend(lastClone);
    slidesContainer.append(firstClone);

    // Re-query slides after cloning
    return block.querySelectorAll('.carousel-slide:not(.carousel-slide-clone)');
  }

  const slidesContainer = block.querySelector('.carousel-slides');
  const actualSlides = setupInfiniteLoop();

  // Initialize
  updateSlides();

  // Auto-advance
  function startAutoplay() {
    if (!autoplay || isPaused) return;
    autoplayInterval = setInterval(() => {
      if (!isTransitioning) {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlides();
      }
    }, interval);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Pause on hover
  track.addEventListener('mouseenter', () => {
    isPaused = true;
    stopAutoplay();
  });

  track.addEventListener('mouseleave', () => {
    isPaused = false;
    startAutoplay();
  });

  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isPaused = true;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    isPaused = false;
    startAutoplay();
  }, { passive: true });

  function handleSwipe() {
    if (isTransitioning) return;

    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next
        currentIndex = (currentIndex + 1) % slideCount;
      } else {
        // Swipe right - prev
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      }
      updateSlides();
    }
  }

  // Keyboard navigation
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      updateSlides();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % slideCount;
      updateSlides();
    } else if (e.key === 'Home') {
      e.preventDefault();
      currentIndex = 0;
      updateSlides();
    } else if (e.key === 'End') {
      e.preventDefault();
      currentIndex = slideCount - 1;
      updateSlides();
    }
  });

  // Button handlers
  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateSlides();
    isPaused = true;
    stopAutoplay();
    setTimeout(() => {
      isPaused = false;
      startAutoplay();
    }, 1000);
  });

  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    currentIndex = (currentIndex + 1) % slideCount;
    updateSlides();
    isPaused = true;
    stopAutoplay();
    setTimeout(() => {
      isPaused = false;
      startAutoplay();
    }, 1000);
  });

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (isTransitioning || index === currentIndex) return;
      currentIndex = index;
      updateSlides();
      isPaused = true;
      stopAutoplay();
      setTimeout(() => {
        isPaused = false;
        startAutoplay();
      }, 1000);
    });
  });

  // Start autoplay if enabled
  startAutoplay();

  // Decorate buttons and icons
  decorateButtons(block);
  decorateIcons(block);
}
  