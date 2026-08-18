import { isDesktop } from '../../../scripts/scripts.js'; // EDS-018: use project-standard 900px breakpoint

// Recursively adds BEM-style class names based on tag and block base name (EDS-030: dead commented-out implementations removed)
const dataMapMoObj = {
  addIndexed(parentElement, level = 0) {
    if (!parentElement || !parentElement.children.length) return;

    // Destructure first class name
    let baseName;
    if (level === 0) {
      const [firstClass] = parentElement.classList;
      baseName = firstClass;
      this.baseBlockName = firstClass; // renamed — no underscore
    } else {
      baseName = this.baseBlockName;
    }

    // Convert children to array and iterate
    const childrenArray = [...parentElement.children];

    childrenArray.forEach(child => {
      const { tagName } = child;
      const tag = tagName.toLowerCase();

      const newClass = `${baseName}-${tag}`;

      if (!child.classList.contains(newClass)) {
        child.classList.add(newClass);
      }

      this.addIndexed(child, level + 1);
    });
  },
};

export default function decorate(block) {
  const section = block.closest('.section');
  const isRealAccordionTwo = section.classList.contains('real-accordion-two');
  const isRealEstateAcc = section.classList.contains('real-estate-accordion');

  [...block.children].forEach((row, index) => {
    const [label, body] = row.children;
    let summaryVal = 'summary';
    let detailsVal = 'details';

    if (section.classList.contains('disabled')) {
      summaryVal = 'summary';
      detailsVal = 'details';
    } else if (
      section.classList.contains('mobile-disabled') &&
      !isDesktop.matches
    ) {
      summaryVal = 'div';
      detailsVal = 'div';
    } else if (
      section.classList.contains('desktop-disabled') &&
      isDesktop.matches
    ) {
      summaryVal = 'div';
      detailsVal = 'div';
    }

    const summary = document.createElement(summaryVal);
    summary.className = 'accordion-item-label';
    summary.append(label);

    body.className = 'accordion-item-body';
    body.classList.add('accordion-body-inactive');

    const details = document.createElement(detailsVal);
    details.className = 'accordion-item';
    details.append(summary, body);
    row.append(details);

    // Open first item only for real-accordion-two
    if (isRealAccordionTwo && index === 0) {
      details.open = true;
      body.style.height = 'auto';
      body.style.paddingBottom = '24px';
    }

    if (isRealEstateAcc && index === 0) {
      details.open = true;
      body.style.height = 'auto';
      body.style.paddingBottom = '24px';
    }
  });

  const container = block.closest('.aif-about-accordion');
  if (container) dataMapMoObj.addIndexed(container);
  dataMapMoObj.addIndexed(block);

  const items = block.querySelectorAll('.accordion-item');
  const iconEls = block.querySelectorAll(
    '.accordion-item-label .accordion-ul li',
  );
  iconEls.forEach((icon, index) => {
    icon.classList.add(`icon${index % 2}`);
  });

  items.forEach(item => {
    const summary = item.querySelector('.accordion-item-label');
    const body = item.querySelector('.accordion-item-body');
    const ul = summary.querySelector('.accordion-ul');
    const iconOpenList = ul.querySelectorAll('.icon1');
    const iconCloseList = ul.querySelectorAll('.icon0');

    const showIcons = list => {
      list.forEach(ic => {
        ic.style.display = 'block';
      });
    };

    const hideIcons = list => {
      list.forEach(ic => {
        const parent = ic.closest('.real-accordion-two'); // closest takes a selector string

        if (parent) {
          ic.style.display = 'flex';
        } else {
          ic.style.display = 'none';
        }
      });
    };

    summary.addEventListener('click', e => {
      if (isRealAccordionTwo && item.open) return;

      const isOpen = item.open;
      if (isOpen) {
        e.preventDefault();

        if (isRealAccordionTwo) {
          body.style.transition = 'none';
          body.style.height = '0px';
          body.style.paddingBottom = '0px';
          item.open = false;

          setTimeout(() => {
            body.style.transition = '';
          }, 50);

          showIcons(iconOpenList);
          hideIcons(iconCloseList);

          // Scroll into center when opening
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });

          return;
        }

        // Normal animated close
        const fullHeight = body.scrollHeight;
        body.style.height = `${fullHeight}px`;
        requestAnimationFrame(() => {
          body.style.height = '0px';
          body.style.paddingBottom = '0px';
        });
        body.addEventListener(
          'transitionend',
          () => {
            item.open = false;
          },
          { once: true },
        );
        showIcons(iconOpenList);
        hideIcons(iconCloseList);
      }
    });

    item.addEventListener('toggle', () => {
      if (!item.open) return;

      items.forEach(other => {
        if (other !== item && other.open) {
          const otherBody = other.querySelector('.accordion-item-body');

          if (isRealAccordionTwo) {
            otherBody.style.transition = 'none';
            otherBody.style.height = '0px';
            otherBody.style.paddingBottom = '0px';
            other.open = false;

            setTimeout(() => {
              otherBody.style.transition = '';
            }, 50);

            const oUL = other.querySelector('.accordion-ul');
            showIcons(oUL.querySelectorAll('.icon1'));
            hideIcons(oUL.querySelectorAll('.icon0'));
            return;
          }

          const fullHeight = otherBody.scrollHeight;
          otherBody.style.height = `${fullHeight}px`;
          requestAnimationFrame(() => {
            otherBody.style.height = '0px';
            otherBody.style.paddingBottom = '0px';
          });
          otherBody.addEventListener(
            'transitionend',
            () => {
              other.open = false;
            },
            { once: true },
          );

          const oUL = other.querySelector('.accordion-ul');
          showIcons(oUL.querySelectorAll('.icon1'));
          hideIcons(oUL.querySelectorAll('.icon0'));
        }
      });

      const newHeight = `${body.scrollHeight}px`;
      body.style.height = newHeight;
      body.addEventListener(
        'transitionend',
        () => {
          body.style.height = 'auto';
          body.style.paddingBottom = '24px';
        },
        { once: true },
      );
      hideIcons(iconOpenList);
      showIcons(iconCloseList);

      if (item.closest('.section.to-center')) {
        body.addEventListener(
          'transitionend',
          () => {
            const offset = 80;

            const y =
              item.getBoundingClientRect().top + window.scrollY - offset;
            const max =
              document.documentElement.scrollHeight - window.innerHeight;

            const finalY = Math.min(Math.max(0, y), max);

            window.scrollTo({
              top: finalY,
              behavior: 'smooth',
            });
          },
          { once: true },
        );
      }

      item.open = true;
    });
  });
}
