// Media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll(':scope > div > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * Extracts header configuration from block content
 * @param {Element} block The header block element
 * @returns {Object} Configuration object with logoImage, logoLink, logoAlt, searchPlaceholder, searchAction
 */
function extractBlockConfig(block) {
  const config = {};
  
  // Extract from block model attributes
  const rows = block.querySelectorAll(':scope > div > div');
  
  rows.forEach((row) => {
    const text = row.textContent.trim();
    const link = row.querySelector('a');
    const img = row.querySelector('img');
    
    if (img && !config.logoImage) {
      config.logoImage = img;
    }
  });
  
  return config;
}

/**
 * Extracts nav items from the section that contains the header block
 * Looks for table/list structure with link and label
 * @returns {Array} Array of nav items with label and href
 */
function extractNavItems(block) {
  const navItems = [];
  
  // Find the section containing the header block
  const section = block.closest('main > div');
  if (!section) return navItems;
  
  // Look for table or list structure after the header block
  const tables = section.querySelectorAll('table');
  const lists = section.querySelectorAll('ul:not(.nav-sections ul)');
  
  // Parse table (preferred structure)
  if (tables.length > 0) {
    const table = tables[0];
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        const linkCell = cells[0];
        const labelCell = cells[1];
        const link = linkCell.querySelector('a');
        
        if (link) {
          navItems.push({
            href: link.href,
            label: labelCell.textContent.trim() || link.textContent.trim(),
          });
        }
      }
    });
  }
  
  // Fallback: parse list items with links
  if (navItems.length === 0 && lists.length > 0) {
    const list = lists[0];
    const items = list.querySelectorAll(':scope > li');
    
    items.forEach((item) => {
      const link = item.querySelector('a');
      if (link) {
        navItems.push({
          href: link.href,
          label: link.textContent.trim(),
        });
      }
    });
  }
  
  return navItems;
}

/**
 * Loads and decorates the header with logo, nav, and search
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Extract logo image and search config from block
  const blockConfig = extractBlockConfig(block);
  const navItems = extractNavItems(block);
  
  // Get logo from first image in block
  let logoImg = blockConfig.logoImage;
  let logoLink = null;
  let logoAlt = 'Logo';
  let searchPlaceholder = 'Search...';
  let searchAction = '/search';
  
  // Look for link containing image (logo link)
  const brandLinkEl = block.querySelector('a > img');
  if (brandLinkEl) {
    logoLink = brandLinkEl.closest('a');
  }
  
  // Create nav structure
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  
  // Create nav-brand (logo)
  const navBrand = document.createElement('div');
  navBrand.className = 'nav-brand';
  if (logoLink) {
    navBrand.appendChild(logoLink.cloneNode(true));
  } else if (logoImg) {
    navBrand.appendChild(logoImg.cloneNode(true));
  } else {
    // Create empty placeholder
    const emptyBrand = document.createElement('div');
    emptyBrand.style.width = '128px';
    emptyBrand.style.height = '40px';
    emptyBrand.textContent = 'Logo';
    navBrand.appendChild(emptyBrand);
  }
  nav.appendChild(navBrand);
  
  // Create nav-sections
  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';
  const navList = document.createElement('ul');
  
  navItems.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;
    li.appendChild(a);
    navList.appendChild(li);
  });
  
  if (navList.children.length > 0) {
    navSections.appendChild(navList);
  }
  nav.appendChild(navSections);
  
  // Create nav-tools (search)
  const navTools = document.createElement('div');
  navTools.className = 'nav-tools';
  const searchForm = document.createElement('form');
  searchForm.className = 'search-form';
  searchForm.action = searchAction;
  searchForm.method = 'GET';
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.name = 'q';
  searchInput.placeholder = searchPlaceholder;
  searchInput.className = 'search-input';
  searchInput.setAttribute('aria-label', 'Search');
  
  const searchButton = document.createElement('button');
  searchButton.type = 'submit';
  searchButton.className = 'search-button';
  searchButton.setAttribute('aria-label', 'Submit search');
  searchButton.innerHTML = '🔍';
  
  searchForm.appendChild(searchInput);
  searchForm.appendChild(searchButton);
  navTools.appendChild(searchForm);
  nav.appendChild(navTools);
  
  // Create hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  
  // Prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));
  
  // Add click handlers for nav sections
  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      navSection.addEventListener('click', () => {
        if (!isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }
  
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}



