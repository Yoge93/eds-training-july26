export default function decorate(block) {
  const leftCol = document.createElement('div');
  leftCol.className = 'accordion-col-left';

  const rightCol = document.createElement('div');
  rightCol.className = 'accordion-col-right';

  let currentColumn = leftCol;

  [...block.children].forEach(row => {
    const divs = [...row.children];

    if (divs.length === 0) return;

    const questionWrapper = divs[0];
    const answerWrapper = divs[divs.length - 1];

    const titleText = questionWrapper.textContent.trim();
    const hasImg = row.querySelector('picture, img');

    if (!titleText && hasImg) {
      currentColumn = rightCol;
      row.classList.add('static-image-row');

      divs.forEach(div => {
        if (!div.querySelector('picture, img')) {
          div.style.display = 'none';
        }
      });
    } else {
      row.classList.add('accordion-item');

      row.classList.add(
        currentColumn === leftCol ? 'blue-accordion' : 'grey-accordion',
      );

      questionWrapper.classList.add('accordion-title');

      if (answerWrapper !== questionWrapper) {
        answerWrapper.classList.add('accordion-content');
      }

      for (let i = 1; i < divs.length - 1; i += 1) {
        divs[i].style.display = 'none';
      }

      if (titleText.toLowerCase() === 'our pedigree') {
        row.classList.add('expanded');
        questionWrapper.style.cursor = 'default';
      }

      questionWrapper.addEventListener('click', () => {
        if (titleText.toLowerCase() === 'our pedigree') {
          return;
        }

        row.classList.toggle('expanded');
      });
    }

    currentColumn.appendChild(row);
  });

  block.textContent = '';
  block.appendChild(leftCol);
  block.appendChild(rightCol);
}
