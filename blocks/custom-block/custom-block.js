export default function decorate(block) {
[...block.children].forEach((card) => {
  console.log(card);
card.closest('custom-block-node').querySelectorAll('custom-block-item').forEach((item) => {
    item.classList.add('cards-item');         
});
});
}
