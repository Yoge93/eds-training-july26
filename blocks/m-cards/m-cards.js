export default function decorate(block) {
  [...block.children].forEach((card) => {
    card.classList.add('m-cards-slide');

    const [imgWrapper, contentWrapper] = [...card.children];
    if (!imgWrapper || !contentWrapper) return;

    imgWrapper.classList.add('m-card-img');
    contentWrapper.classList.add('m-card-content');

    const [name, designation, description, buttonContainer] = [
      ...contentWrapper.children,
    ];

    name?.classList.add('m-card-name');
    designation?.classList.add('m-card-designation');
    description?.classList.add('m-card-description');
    buttonContainer?.classList.add('m-card-btn-text');
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
