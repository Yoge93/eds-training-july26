export default function decorate(block) {
[...block.children].forEach((card) => {
  console.log(card);
const cardWrapper = card.closest('.custom-block-node');
cardWrapper.querySelectorAll('div').forEach((item) => {
    item.classList.add('cards-item');    
   if(item.classList.contains('cards-item')){
    item.querySelectorAll('.cards-item picture img').forEach((img) => {
        img.classList.add('cards-item-img');
    });
  }
});
});
}
