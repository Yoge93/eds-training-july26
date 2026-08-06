export default function decorate(block) {
[...block.children].forEach((card) => {
  console.log(block);
});
}
