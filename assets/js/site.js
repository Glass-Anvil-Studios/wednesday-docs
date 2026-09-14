(() => {
  const input = document.getElementById('docs-search');
  const links = Array.from(document.querySelectorAll('#docs-nav .nav-link'));
  const button = document.querySelector('.menu-button');

  if (input) {
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      links.forEach((link) => {
        link.style.display = !q || link.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== input) {
      event.preventDefault();
      input?.focus();
    }
    if (event.key === 'Escape') {
      document.body.classList.remove('nav-open');
      button?.setAttribute('aria-expanded', 'false');
    }
  });

  button?.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    button.setAttribute('aria-expanded', String(open));
  });
})();
