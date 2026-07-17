(() => {
    const roots = document.querySelectorAll('[data-search-root]');
    if (!roots.length) return;

    const indexes = new Map();

    function loadIndex(url) {
        if (!indexes.has(url)) {
            indexes.set(url, fetch(url, { credentials: 'same-origin' })
                .then((response) => {
                    if (!response.ok) throw new Error(`Search index: ${response.status}`);
                    return response.json();
                })
                .then((documents) => {
                    const index = new FlexSearch.Document({
                        tokenize: 'forward',
                        cache: 100,
                        document: {
                            id: 'id',
                            index: ['title', 'content', 'tags', 'categories'],
                            store: ['id', 'title', 'permalink', 'categories']
                        }
                    });
                    documents.forEach((document) => index.add(document));
                    return index;
                }));
        }
        return indexes.get(url);
    }

    function appendHighlighted(element, text, query) {
        const value = String(text || '');
        const position = value.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
        if (position < 0) {
            element.textContent = value;
            return;
        }
        element.append(document.createTextNode(value.slice(0, position)));
        const mark = document.createElement('mark');
        mark.textContent = value.slice(position, position + query.length);
        element.append(mark, document.createTextNode(value.slice(position + query.length)));
    }

    roots.forEach((root) => {
        const form = root.querySelector('form');
        const input = root.querySelector('input');
        const results = root.querySelector('[data-search-results]');
        const message = root.querySelector('[data-search-message]');
        let indexPromise;
        let active = -1;

        const ensureIndex = () => {
            if (!indexPromise) {
                message.textContent = root.dataset.searchLoading;
                indexPromise = loadIndex(root.dataset.searchIndex).catch((error) => {
                    indexPromise = null;
                    throw error;
                });
            }
            return indexPromise;
        };

        const setActive = (next) => {
            const links = [...results.querySelectorAll('a')];
            links.forEach((link) => link.removeAttribute('aria-current'));
            if (!links.length) return;
            active = (next + links.length) % links.length;
            links[active].setAttribute('aria-current', 'true');
            links[active].scrollIntoView({ block: 'nearest' });
        };

        const render = (records, query) => {
            results.replaceChildren();
            active = -1;
            records.forEach((record) => {
                const link = document.createElement('a');
                link.href = record.permalink;
                link.className = 'search-result-item';

                const title = document.createElement('span');
                title.className = 'search-result-item__title';
                appendHighlighted(title, record.title, query);
                link.append(title);

                if (record.categories && record.categories.length) {
                    const meta = document.createElement('span');
                    meta.className = 'search-result-item__meta';
                    meta.textContent = record.categories.join(' · ');
                    link.append(meta);
                }
                results.append(link);
            });
        };

        const search = async () => {
            const query = input.value.trim();
            if (!query) {
                results.replaceChildren();
                message.textContent = '';
                return;
            }
            try {
                const index = await ensureIndex();
                const groups = index.search(query, { enrich: true, limit: 12 });
                const unique = new Map();
                groups.forEach((group) => group.result.forEach(({ doc }) => unique.set(doc.id, doc)));
                const records = [...unique.values()].slice(0, 12);
                render(records, query);
                message.textContent = records.length
                    ? root.dataset.searchStatus.replace('{count}', records.length)
                    : root.dataset.searchEmpty;
            } catch (error) {
                console.error(error);
                results.replaceChildren();
                message.textContent = root.dataset.searchError;
            }
        };

        let timer;
        input.addEventListener('focus', ensureIndex, { once: true });
        input.addEventListener('input', () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(search, 100);
        });
        input.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                setActive(active + (event.key === 'ArrowDown' ? 1 : -1));
            } else if (event.key === 'Enter' && active >= 0) {
                event.preventDefault();
                results.querySelectorAll('a')[active].click();
            } else if (event.key === 'Escape') {
                input.value = '';
                results.replaceChildren();
                message.textContent = '';
            }
        });
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const first = results.querySelector('a');
            if (first) window.location.assign(first.href);
            else search();
        });
    });

    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
            const input = [...document.querySelectorAll('[data-search-root] input')]
                .find((candidate) => candidate.getClientRects().length > 0);
            if (input) {
                event.preventDefault();
                input.focus();
            }
        }
    });
})();
