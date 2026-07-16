(() => {
  const pagination = document.querySelector('.pagination');
  const dialog = document.querySelector('#pagination-jump-dialog');
  if (!pagination || !dialog) return;

  const form = dialog.querySelector('form');
  const input = dialog.querySelector('#pagination-jump-input');
  const total = Number(pagination.dataset.total);
  const firstUrl = pagination.dataset.firstUrl;
  const formatUrl = pagination.dataset.formatUrl;
  if (!form || !input || !Number.isInteger(total) || !firstUrl || !formatUrl) return;

  pagination.querySelectorAll('.pagination-jump-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      input.value = '';
      input.removeAttribute?.('aria-invalid');
      dialog.showModal();
      input.focus();
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const page = Number(input.value);
    if (!Number.isInteger(page) || page < 1 || page > total) {
      input.setAttribute?.('aria-invalid', 'true');
      input.focus();
      return;
    }

    input.removeAttribute?.('aria-invalid');
    const target = page === 1 ? firstUrl : formatUrl.replace('PAGE_NUMBER', String(page));
    dialog.close();
    window.location.assign(target);
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
