document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('articles');
    const search = document.getElementById('blogSearch');
    if (!container || !search) return;

    const pageSize = 8;
    const filters = Array.from(document.querySelectorAll('.filter-btn'));
    const categories = new Set(filters.map(button => button.dataset.category));
    const sortSelect = document.getElementById('blogSort');
    const clearButton = document.getElementById('clearBlogSearch');
    const resetButton = document.getElementById('resetBlogFilters');
    const resultCount = document.getElementById('blogResultCount');
    const pageSummary = document.getElementById('blogPageSummary');
    const resultsTitle = document.getElementById('blogResultsTitle');
    const empty = document.getElementById('blogEmpty');
    const pagination = document.getElementById('blogPagination');
    const toc = document.getElementById('tocNav');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const normalize = value => value.normalize('NFKC').toLocaleLowerCase('zh-CN');
    const articles = Array.from(container.querySelectorAll('.article-card')).map((element, index) => {
        if (!element.id) element.id = `article-${index + 1}`;
        element.tabIndex = -1;
        return {
            element,
            id: element.id,
            title: element.querySelector('.article-title').textContent.trim(),
            category: element.dataset.category,
            text: normalize(element.textContent),
            date: element.querySelector('.article-date')?.textContent.trim() || '',
            index
        };
    });
    let state = { query: '', category: 'all', sort: 'date', page: 1 };
    let filtered = articles;
    let searchTimer;

    filters.forEach(button => {
        const count = document.createElement('span');
        count.className = 'filter-category-count';
        button.append(' ', count);
    });

    function getTarget(hash = window.location.hash) {
        try {
            const id = decodeURIComponent(hash.slice(1));
            return articles.find(article => article.id === id);
        } catch {
            return undefined;
        }
    }

    function matchesQuery(article) {
        const words = normalize(state.query).trim().split(/\s+/).filter(Boolean);
        return words.every(word => article.text.includes(word));
    }

    function matchingArticles() {
        return articles.filter(article => matchesQuery(article)
            && (state.category === 'all' || article.category === state.category))
            .sort((a, b) => (state.sort === 'oldest'
                ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)) || a.index - b.index);
    }

    function writeUrl(mode, hash = '') {
        const url = new URL(window.location.href);
        const values = {
            q: state.query || null,
            category: state.category === 'all' ? null : state.category,
            sort: state.sort === 'date' ? null : state.sort,
            page: state.page > 1 ? String(state.page) : null
        };
        Object.entries(values).forEach(([key, value]) => {
            if (value === null) url.searchParams.delete(key);
            else url.searchParams.set(key, value);
        });
        url.hash = hash;
        if (url.href !== window.location.href) {
            history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', url);
        }
    }

    function markTarget(id) {
        articles.forEach(article => article.element.classList.toggle('is-targeted', article.id === id));
        document.querySelectorAll('.source-ledger-card').forEach(link => {
            link.classList.toggle('is-targeted', link.hash === `#${id}`);
        });
        toc.querySelectorAll('a').forEach(link => {
            const active = link.hash === `#${id}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }

    function renderDirectory() {
        const list = document.createElement('ol');
        filtered.forEach(article => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${article.id}`;
            link.textContent = article.title;
            item.appendChild(link);
            list.appendChild(item);
        });
        toc.replaceChildren(list);
        document.querySelector('.blog-toc').hidden = !filtered.length;
    }

    function moveTo(element) {
        element.focus({ preventScroll: true });
        element.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    }

    function changePage(page) {
        clearTimeout(searchTimer);
        state.page = page;
        render();
        writeUrl('push');
        markTarget();
        moveTo(resultsTitle);
    }

    function renderPagination(pageCount) {
        pagination.replaceChildren();
        pagination.hidden = pageCount <= 1;
        if (pageCount <= 1) return;

        const addButton = (text, label, page, disabled = false, current = false) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `page-btn${current ? ' active' : ''}`;
            button.textContent = text;
            button.setAttribute('aria-label', label);
            button.title = label;
            button.disabled = disabled;
            if (current) button.setAttribute('aria-current', 'page');
            button.addEventListener('click', () => changePage(page));
            pagination.appendChild(button);
        };
        addButton('←', '上一页', state.page - 1, state.page === 1);
        const pages = new Set([1, pageCount, state.page - 1, state.page, state.page + 1]);
        let previous = 0;
        Array.from(pages).filter(page => page > 0 && page <= pageCount).sort((a, b) => a - b).forEach(page => {
            if (previous && page - previous > 1) {
                const gap = document.createElement('span');
                gap.className = 'page-ellipsis';
                gap.textContent = '…';
                pagination.appendChild(gap);
            }
            addButton(String(page), `第 ${page} 页`, page, false, page === state.page);
            previous = page;
        });
        addButton('→', '下一页', state.page + 1, state.page === pageCount);
    }

    function render() {
        filtered = matchingArticles();
        const pageCount = Math.ceil(filtered.length / pageSize);
        state.page = Math.min(Math.max(1, state.page), Math.max(1, pageCount));
        const start = (state.page - 1) * pageSize;
        const shown = new Set(filtered.slice(start, start + pageSize));
        articles.forEach(article => { article.element.hidden = !shown.has(article); });
        filtered.forEach(article => container.appendChild(article.element));
        filters.forEach(button => {
            const category = button.dataset.category;
            const active = category === state.category;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
            button.querySelector('.filter-category-count').textContent = articles.filter(article =>
                matchesQuery(article) && (category === 'all' || article.category === category)).length;
        });
        resultCount.textContent = `共 ${filtered.length} 篇文章`;
        pageSummary.textContent = filtered.length
            ? `${start + 1}–${Math.min(start + pageSize, filtered.length)} / ${filtered.length}` : '';
        empty.hidden = filtered.length > 0;
        clearButton.hidden = !state.query;
        search.value = state.query;
        sortSelect.value = state.sort;
        renderDirectory();
        renderPagination(pageCount);
        markTarget(getTarget()?.id);
    }

    // Reveal deep links even when a saved category, query, or page excludes their article.
    function revealArticle(article) {
        filtered = matchingArticles();
        if (!filtered.includes(article)) {
            state.query = '';
            state.category = 'all';
            filtered = matchingArticles();
        }
        state.page = Math.floor(filtered.indexOf(article) / pageSize) + 1;
        render();
        markTarget(article.id);
    }

    function readUrl(scroll = false) {
        clearTimeout(searchTimer);
        const params = new URL(window.location.href).searchParams;
        const page = Number(params.get('page'));
        state = {
            query: (params.get('q') || '').slice(0, 200),
            category: categories.has(params.get('category')) ? params.get('category') : 'all',
            sort: params.get('sort') === 'oldest' ? 'oldest' : 'date',
            page: Number.isSafeInteger(page) && page > 0 ? page : 1
        };
        const target = getTarget();
        if (target) revealArticle(target);
        else render();
        writeUrl('replace', window.location.hash);
        if (target) requestAnimationFrame(() => moveTo(target.element));
        else if (scroll) moveTo(resultsTitle);
    }

    function updateFilters(mode = 'push') {
        clearTimeout(searchTimer);
        state.query = search.value.slice(0, 200);
        state.page = 1;
        render();
        writeUrl(mode);
        markTarget();
    }

    filters.forEach(button => button.addEventListener('click', () => {
        state.category = button.dataset.category;
        updateFilters();
    }));
    sortSelect.addEventListener('change', () => {
        state.sort = sortSelect.value;
        updateFilters();
    });
    search.addEventListener('input', event => {
        clearTimeout(searchTimer);
        if (!event.isComposing) searchTimer = setTimeout(() => updateFilters('replace'), 120);
    });
    search.addEventListener('compositionend', () => updateFilters('replace'));
    search.addEventListener('keydown', event => {
        if (event.isComposing || !['Enter', 'Escape'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Escape') search.value = '';
        updateFilters('replace');
    });
    clearButton.addEventListener('click', () => {
        search.value = '';
        updateFilters('replace');
        search.focus();
    });
    resetButton.addEventListener('click', () => {
        search.value = '';
        state.category = 'all';
        state.sort = 'date';
        updateFilters();
        search.focus();
    });
    document.addEventListener('click', event => {
        const link = event.target.closest('a[href^="#"]');
        if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const article = getTarget(link.getAttribute('href'));
        if (!article) return;
        event.preventDefault();
        clearTimeout(searchTimer);
        revealArticle(article);
        writeUrl('push', `#${article.id}`);
        moveTo(article.element);
    });
    window.addEventListener('popstate', () => readUrl(true));
    window.addEventListener('hashchange', () => readUrl());

    const menuButton = document.querySelector('.mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const mobile = window.matchMedia('(max-width: 768px)');
    function setMenu(open) {
        menu.classList.toggle('active', open);
        menuButton.setAttribute('aria-expanded', String(open));
        menu.inert = mobile.matches && !open;
    }
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
    document.addEventListener('click', event => {
        if (!menu.contains(event.target) && !menuButton.contains(event.target)) setMenu(false);
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            menuButton.focus();
        }
    });
    mobile.addEventListener('change', () => setMenu(false));
    setMenu(false);
    document.getElementById('blogFilters').hidden = false;
    readUrl();
});
