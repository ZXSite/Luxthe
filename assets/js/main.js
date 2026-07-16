(() => {
  const colorKey = 'LuxtheColorScheme';
  const menuButton = document.getElementById('toggle-menu');
  const mainMenu = document.getElementById('main-menu');
  const colorButton = document.getElementById('dark-mode-toggle');
  const backToTop = document.getElementById('back-to-top');

  document.querySelector('[data-language-switch]')?.addEventListener('change', (event) => {
    const target = event.currentTarget;
    if (target.value) window.location.assign(target.value);
  });

  menuButton?.addEventListener('click', () => {
    const open = mainMenu?.classList.toggle('show') ?? false;
    menuButton.classList.toggle('is-active', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });

  if (colorButton) {
    colorButton.setAttribute('aria-pressed', String(document.documentElement.dataset.scheme === 'dark'));
  }

  colorButton?.addEventListener('click', () => {
    const next = document.documentElement.dataset.scheme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.scheme = next;
    localStorage.setItem(colorKey, next);
    colorButton.setAttribute('aria-pressed', String(next === 'dark'));
    document.dispatchEvent(new CustomEvent('luxthe:color-scheme', { detail: next }));
  });

  if (backToTop) {
    const updateBackToTop = () => { backToTop.hidden = window.scrollY <= 320; };
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  }

  const copyLabel = {{ i18n "article.codeblock.copy" | default "Copy" | jsonify | safeJS }};
  const copiedLabel = {{ i18n "article.codeblock.copied" | default "Copied" | jsonify | safeJS }};
  document.querySelectorAll('.article-content .highlight').forEach((block) => {
    const code = block.querySelector('code');
    if (!code || block.querySelector('.copyCodeButton')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copyCodeButton';
    button.textContent = copyLabel;
    button.setAttribute('aria-label', copyLabel);
    button.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(code.textContent || '');
        button.textContent = copiedLabel;
        window.setTimeout(() => { button.textContent = copyLabel; }, 1600);
      } catch {
        button.focus();
      }
    });
    block.appendChild(button);
  });
})();
