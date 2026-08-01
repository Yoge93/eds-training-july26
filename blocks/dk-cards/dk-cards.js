export default function decorate(block) {
  console.log('Decorating dk-cards block:', block);
  [...block.children].forEach((card) => {
    // 1. Update the base card slide class
    card.classList.add('dk-card-slide');

    const [imgWrapper, contentWrapper] = [...card.children];
    if (!imgWrapper || !contentWrapper) return;

    // 2. Update wrappers
    imgWrapper.classList.add('dk-card-img');
    contentWrapper.classList.add('dk-card-content');

    // 3. Update the destructuring to match the new JSON fields order
    // Order based on JSON: Name, Designation, Description, Keywords, Socials, Link
    const [name, designation, description, keywords, socials, buttonContainer] = [
      ...contentWrapper.children,
    ];

    // 4. Apply classes safely using optional chaining
    name?.classList.add('dk-card-name');
    designation?.classList.add('dk-card-designation');
    description?.classList.add('dk-card-description');

    // For Multi-fields, AEM renders a <ul>.
    // We add the class directly to the UL so the CSS applies correctly.
    if (keywords) {
      const keywordsList = keywords.tagName === 'UL' ? keywords : keywords.querySelector('ul');
      keywordsList?.classList.add('dk-card-keywords');
    }

    if (socials) {
      const socialsList = socials.tagName === 'UL' ? socials : socials.querySelector('ul');
      socialsList?.classList.add('dk-card-socials');
    }

    buttonContainer?.classList.add('dk-card-btn-container');

    // AEM automatically wraps primary/secondary links in a structured way.
    // If you need to ensure the link itself gets a button class:
    const link = buttonContainer?.querySelector('a');
    if (link && !link.classList.contains('button')) {
      link.classList.add('button');
    }
  });

  // ==========================================================
  // Drag to Scroll Logic (Remains mostly unchanged)
  // ==========================================================
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  const startDrag = (x) => {
    isDragging = true;
    startX = x;
    scrollLeft = block.scrollLeft;
    block.classList.add('dragging');
  };

  const drag = (x) => {
    if (!isDragging) return;

    const walk = startX - x;
    block.scrollLeft = scrollLeft + walk;
  };

  const stopDrag = () => {
    isDragging = false;
    block.classList.remove('dragging');
  };

  block.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startDrag(e.pageX);
  });

  window.addEventListener('mousemove', (e) => drag(e.pageX));
  window.addEventListener('mouseup', stopDrag);

  block.addEventListener(
    'touchstart',
    (e) => startDrag(e.touches[0].pageX),
    { passive: true },
  );

  block.addEventListener(
    'touchmove',
    (e) => drag(e.touches[0].pageX),
    { passive: true },
  );

  window.addEventListener('touchend', stopDrag);
}
