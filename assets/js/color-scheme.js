(() => {
  const key = 'LuxtheColorScheme';
  const fallback = {{ .Site.Params.colorScheme.default | default "auto" | jsonify | safeJS }};
  const toggleEnabled = {{ .Site.Params.colorScheme.toggle | default false }};
  let preference = null;
try { preference = localStorage.getItem(key); } catch {}

  if (!toggleEnabled) {
    preference = fallback;
    try { localStorage.setItem(key, preference); } catch {}
  } else if (!preference) {
    preference = fallback;
  }

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.scheme =
    preference === 'dark' || (preference === 'auto' && systemDark) ? 'dark' : 'light';
})();
