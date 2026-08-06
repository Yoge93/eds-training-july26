export default function decorate(block) {
[...block.children].forEach((card) => {
  console.log(block);
  card.classList.add('custom-block-container');
  card.querySelectorAll('[data-aue-model="custom-block-item"]').forEach((div) => {
    div.classList.add('custom-cards');
  });
});
}
