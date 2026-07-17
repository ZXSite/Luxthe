(() => {
  const colorKey = 'LuxtheColorScheme';
  const menuButton = document.getElementById('toggle-menu');
  const mainMenu = document.getElementById('main-menu');
  const schemeButtons = [...document.querySelectorAll('#dark-mode-toggle, #dark-mode-toggle-mobile')];
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const backToTop = document.getElementById('back-to-top');

  const syncSchemeControls = () => {
    const dark = document.documentElement.dataset.scheme === 'dark';
    schemeButtons.forEach((button) => button.setAttribute('aria-pressed', String(dark)));
    themeColorMeta?.setAttribute('content', dark ? '#131b20' : '#f4f7f9');
  };

  const setScheme = (next) => {
    document.documentElement.dataset.scheme = next;
    try {
      localStorage.setItem(colorKey, next);
    } catch {
      // Storage unavailable: keep the in-session scheme without breaking other scripts.
    }
    syncSchemeControls();
    document.dispatchEvent(new CustomEvent('luxthe:color-scheme', { detail: next }));
  };

  document.querySelector('[data-language-switch]')?.addEventListener('change', (event) => {
    const target = event.currentTarget;
    if (target.value) window.location.assign(target.value);
  });

  // Keyboard: Escape closes menu
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainMenu?.classList.contains('show')) {
      mainMenu.classList.remove('show');
      menuButton?.classList.remove('is-active');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.focus();
    }
  });

  menuButton?.addEventListener('click', () => {
    const open = mainMenu?.classList.toggle('show') ?? false;
    menuButton.classList.toggle('is-active', open);
    menuButton.setAttribute('aria-expanded', String(open));
  });

  syncSchemeControls();
  schemeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setScheme(document.documentElement.dataset.scheme === 'dark' ? 'light' : 'dark');
    });
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
