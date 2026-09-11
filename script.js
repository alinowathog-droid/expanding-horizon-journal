/* Compact navigation and shared journal interactions. */
const compactLink = document.createElement('link');
compactLink.rel = 'stylesheet';
compactLink.href = 'compact.css';
document.head.appendChild(compactLink);

const nav = document.querySelector('#main-nav');
const toggle = document.querySelector('.menu-toggle');

if (nav) {
  nav.innerHTML = `
    <a href="index.html">Home</a>
    <a href="journal.html">Journal</a>
    <a href="archive.html">Articles</a>
    <a href="authors.html">For Authors</a>
    <a href="reviewers.html">For Reviewers</a>
    <a class="nav-button" href="submit.html">Submit</a>`;
}

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

document.querySelectorAll('.brand').forEach((brand) => {
  if (!brand.querySelector('img')) {
    const image = document.createElement('img');
    image.className = brand.classList.contains('footer-brand') ? 'footer-logo' : 'site-logo';
    image.src = 'assets/expanding-horizon-logo.svg';
    image.alt = 'Expanding Horizon Journal';
    brand.replaceChildren(image);
  }
});

document.querySelectorAll('form.journal-form').forEach((form) => {
  form.addEventListener('submit', () => {
    const button = form.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = 'Sending…';
    }
  });
});
