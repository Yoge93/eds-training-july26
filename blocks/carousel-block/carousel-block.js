export default function decorate(block) {
  const slides = [...block.querySelectorAll(':scope > div')];

  // Build slide elements
  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((slide, i) => {
    slide.className = 'carousel-slide';
    slide.setAttribute('aria-hidden', i !== 0);
    const img = slide.querySelector('img');
    if (img) img.loading = i === 0 ? 'eager' : 'lazy';
    track.append(slide);
  });

  // Build dots
  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  dots.setAttribute('role', 'tablist');
  dots.setAttribute('aria-label', 'Carousel navigation');

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0);
    dot.dataset.index = i;
    if (i === 0) dot.classList.add('active');
    dots.append(dot);
  });

  block.innerHTML = '';
  block.append(track, dots);

  let current = 0;

  function goTo(index) {
    slides[current].setAttribute('aria-hidden', true);
    dots.children[current].classList.remove('active');
    dots.children[current].setAttribute('aria-selected', false);

    current = index;
    slides[current].setAttribute('aria-hidden', false);
    dots.children[current].classList.add('active');
    dots.children[current].setAttribute('aria-selected', true);
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  dots.addEventListener('click', (e) => {
    const dot = e.target.closest('.carousel-dot');
    if (dot) goTo(Number(dot.dataset.index));
  });
}
