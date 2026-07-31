export default function decorate(block) {
  [...block.children].forEach(card => {
    card.classList.add('bio-cards-slide');

    const [imgWrapper, contentWrapper] = [...card.children];
    if (!imgWrapper || !contentWrapper) return;

    imgWrapper.classList.add('bio-card-img');
    contentWrapper.classList.add('bio-card-content');

    const [name, designation, description, buttonContainer] = [
      ...contentWrapper.children,
    ];

    name?.classList.add('bio-card-name');
    designation?.classList.add('bio-card-designation');
    description?.classList.add('bio-card-description');
    buttonContainer?.classList.add('bio-card-btn-text');
  });
}