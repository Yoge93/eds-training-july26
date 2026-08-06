export default function decorate(block) {
[...block.children].forEach((card) => {
  console.log(card);
const cardWrapper = card.closest('custom-block-node');
cardWrapper.querySelectorAll('custom-block-item').forEach((item) => {
    item.classList.add('cards-item');         
});
});
}
