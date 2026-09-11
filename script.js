const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    });
  });
}

/* Keep the journal identity consistent on legacy internal pages. */
document.querySelectorAll('.brand').forEach((brand) => {
  if (!brand.querySelector('img')) {
    const image = document.createElement('img');
    image.className = brand.classList.contains('footer-brand') ? 'footer-logo' : 'site-logo';
    image.src = 'assets/expanding-horizon-logo.svg';
    image.alt = 'Expanding Horizon Journal';
    brand.replaceChildren(image);
  }
});

/* Prevent accidental double submission while a form is being sent. */
document.querySelectorAll('form.journal-form').forEach((form) => {
  form.addEventListener('submit', () => {
    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Sending…';
    }
  });
});
