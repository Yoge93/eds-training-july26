export default function decorate(block) {
  [...block.children].forEach((card) => {
    card.classList.add('bhav-cards-slide');

    const [imgWrapper, contentWrapper] = [...card.children];
    if (!imgWrapper || !contentWrapper) return;

    imgWrapper.classList.add('bhav-card-img');
    contentWrapper.classList.add('bhav-card-content');

    const [name, designation, description, buttonContainer] = [
      ...contentWrapper.children,
    ];

    name?.classList.add('bhav-card-name');
    designation?.classList.add('bhav-card-designation');
    description?.classList.add('bhav-card-description');
    buttonContainer?.classList.add('bhav-card-btn-text');
  });

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
