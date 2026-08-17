export default function decorate(block) {
  const items = [...block.children];

  items.forEach((item) => {
    const rows = [...item.children];

    const title = rows[0];
    const content = rows[1];

    if (!title || !content) return;

    title.classList.add('accordion-title');
    content.classList.add('accordion-content');

    title.addEventListener('click', function () {
      item.classList.toggle('open');
    });
  });
}