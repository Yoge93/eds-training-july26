
import { createOptimizedPicture, decorateButtons } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Check for style variant (first column if present)
  const VARIANTS = ['light-overlay', 'dark-overlay'];
  let cols = rows;
  if (rows[0] && VARIANTS.some(v => rows[0].textContent.trim().includes(v))) {
    rows[0].textContent.trim().split(/[\s,]+/).forEach(token => {
      if (VARIANTS.includes(token)) block.classList.add(token);
    });
    cols = rows.slice(1);
  }

  // Expected order: [headline, background-image, cta-label, cta-link]
  const [headlineRow, bgImageRow, ctaLabelRow, ctaLinkRow] = cols;

  // Create hero content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero-content';

  // Process headline (richtext)
  if (headlineRow) {
    const headline = document.createElement('h1');
    headline.className = 'hero-headline';
    moveInstrumentation(headlineRow, headline);
    while (headlineRow.firstChild) {
      headline.append(headlineRow.firstChild);
    }
    contentWrapper.appendChild(headline);
  }

  // Process CTA button
  if (ctaLabelRow && ctaLinkRow) {
    const ctaLink = ctaLinkRow.querySelector('a');
    if (ctaLink) {
      const ctaButton = document.createElement('a');
      ctaButton.className = 'hero-cta button primary';
      ctaButton.setAttribute('target', '_self');
      moveInstrumentation(ctaLink, ctaButton);

      // Move label content
      while (ctaLabelRow.firstChild) {
        ctaButton.append(ctaLabelRow.firstChild);
      }

      // Copy href and other attributes from original link
      ctaButton.href = ctaLink.href;
      if (ctaLink.title) ctaButton.title = ctaLink.title;
      if (ctaLink.textContent.trim()) ctaButton.textContent = ctaLink.textContent.trim();

      contentWrapper.appendChild(ctaButton);
    }
  }

  // Process background image
  if (bgImageRow) {
    const bgImage = bgImageRow.querySelector('picture');
    if (bgImage) {
      const optimizedPic = createOptimizedPicture(
        bgImage.querySelector('img')?.src || '',
        bgImage.querySelector('img')?.alt || 'Hero background',
        true,
        [{ width: '600' }, { width: '768' }, { width: '1024' }, { width: '1320' }]
      );
      moveInstrumentation(bgImage, optimizedPic);
      bgImage.replaceWith(optimizedPic);

      // Move picture to be direct child of block (for background)
      block.insertBefore(optimizedPic, block.firstChild);
      optimizedPic.classList.add('hero-background');
    }
  }

  // Append content wrapper
  block.appendChild(contentWrapper);

  // Decorate buttons
  decorateButtons(block);

  // Clean up source rows
  rows.forEach(row => row.remove());
}
  