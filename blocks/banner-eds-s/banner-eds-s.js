import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * loads and decorates the banner-eds-s block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const [imageRow, ...contentRows] = [...block.children];

  // Extract and optimize the background image
  let picture = imageRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, true, [
        { width: '750' },
        { media: '(min-width: 900px)', width: '1440' },
      ]);
      picture.replaceWith(optimizedPic);
      picture = optimizedPic;
    }
  }

  // Build content wrapper from remaining rows (title, description, button)
  const content = document.createElement('div');
  content.className = 'banner-eds-s-content';

  contentRows.forEach((row) => {
    const cell = row.firstElementChild;
    if (cell) {
      [...cell.children].forEach((el) => content.append(el));
    }
  });

  // Rebuild block DOM
  block.innerHTML = '';
  if (picture) block.append(picture);
  block.append(content);
}
