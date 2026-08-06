export default function decorate(block) {
  [...block.children].forEach((item) => {
    item.classList.add('cards-item');

    item.querySelectorAll('picture img').forEach((img) => {
      img.classList.add('cards-item-img');
    });
  });
}