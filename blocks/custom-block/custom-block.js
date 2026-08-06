export default function decorate(block) {
[...block.children].forEach((card) => {
  
  card.classList.add('custom-block-container');
  card.querySelectorAll('[data-aue-model="custom-block-item"]').forEach((div) => {
    div.classList.add('custom-cards');
    console.log(div); 
  });
});
}
