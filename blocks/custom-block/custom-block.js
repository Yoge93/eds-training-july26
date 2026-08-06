export default function decorate(block) {
[...block.children].forEach((card) => {
  
card.querySelectorAll('custom-block-node').forEach((div) => {
    console.log(div);
  });
});
}
