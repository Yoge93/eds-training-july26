export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'dummy-block-wrapper';

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    item.className = 'dummy-block-item';
    while (row.firstElementChild) item.append(row.firstElementChild);
    wrapper.append(item);
  });

  block.replaceChildren(wrapper);
}
