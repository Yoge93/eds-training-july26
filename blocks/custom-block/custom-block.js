export default function decorate(block) {
  [...block.children].forEach((item) => {
    item.classList.add('cards-item');

    item.querySelectorAll('picture img').forEach((img) => {
      img.classList.add('cards-item-img');
    });

    const paragraphs=item.querySelectorAll('p');
      const firstChild = paragraphs[0];
      const firstChildText = firstChild.textContent.trim();
      const h5=document.createElement('h5');
      h5.innerHTML = firstChildText;
      firstChild.replaceWith(h5);  
  });
}