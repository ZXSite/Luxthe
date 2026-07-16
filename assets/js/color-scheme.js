(() => {
  const key = 'LuxtheColorScheme';
  const fallback = {{ .Site.Params.colorScheme.default | default "auto" | jsonify | safeJS }};
  const toggleEnabled = {{ .Site.Params.colorScheme.toggle | default false }};
  let preference = localStorage.getItem(key);

  if (!toggleEnabled) {
    preference = fallback;
    localStorage.setItem(key, preference);
  } else if (!preference) {
    preference = fallback;
  }

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.scheme =
    preference === 'dark' || (preference === 'auto' && systemDark) ? 'dark' : 'light';
})();
