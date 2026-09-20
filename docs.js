(() => {
    const search = document.getElementById('docSearch');
    if (!search) return;
    const normalize = value => value.normalize('NFKC').toLocaleLowerCase('zh-CN');
    const sections = Array.from(document.querySelectorAll('[data-doc-section]')).map(element => ({
        element,
        text: normalize(element.textContent),
        link: document.querySelector(`.docs-nav a[href="#${element.id}"]`)
    }));
    const status = document.getElementById('docSearchStatus');
    const empty = document.getElementById('docSearchEmpty');
    const reset = document.getElementById('docSearchReset');
    const copyStatus = document.getElementById('docCopyStatus');
    let composing = false;
    let timer;

    function filter() {
        clearTimeout(timer);
        const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
        let count = 0;
        sections.forEach(({ element, text, link }) => {
            const matches = words.every(word => text.includes(word));
            element.hidden = !matches;
            if (link) link.hidden = !matches;
            if (matches) count++;
        });
        status.textContent = words.length ? `找到 ${count} 个章节，共 ${sections.length} 个` : `全部 ${sections.length} 个章节`;
        empty.hidden = count !== 0;
        reset.hidden = !search.value;
    }

    function clearSearch() {
        composing = false;
        search.value = '';
        filter();
    }

    function schedule() {
        clearTimeout(timer);
        if (!composing) timer = setTimeout(filter, 160);
    }
    search.addEventListener('input', schedule);
    search.addEventListener('compositionstart', () => { composing = true; clearTimeout(timer); });
    search.addEventListener('compositionend', () => { composing = false; schedule(); });
    search.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !composing) filter();
        if (event.key === 'Escape' && !composing) { clearSearch(); search.focus(); }
    });
    [reset, document.getElementById('docEmptyReset')].forEach(button => {
        button.addEventListener('click', () => { clearSearch(); search.focus(); });
    });

    function showTarget(hash, focus = false) {
        let target;
        try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
        if (!target?.matches('[data-doc-section]')) return;
        if (target.hidden) clearSearch();
        sections.forEach(({ element, link }) => {
            if (link) {
                if (element === target) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            }
        });
        if (focus) {
            target.tabIndex = -1;
            target.focus({ preventScroll: true });
            target.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    }
    document.addEventListener('click', event => {
        const link = event.target.closest('a[href^="#"]');
        if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        const hash = link.getAttribute('href');
        let target;
        try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { return; }
        if (!target?.matches('[data-doc-section]')) return;
        event.preventDefault();
        clearTimeout(timer);
        // Apply pending input before deciding whether the target needs revealing.
        if (!composing) filter();
        if (window.location.hash !== hash) window.history.pushState(null, '', hash);
        showTarget(hash, true);
    });
    window.addEventListener('hashchange', () => showTarget(window.location.hash, true));
    window.addEventListener('popstate', () => showTarget(window.location.hash, true));

    document.querySelectorAll('.command-block').forEach(block => {
        const code = block.querySelector('code');
        if (!code) return;
        const text = code.textContent.trim();
        const title = block.parentElement.querySelector(':scope > h3, :scope > h2')?.textContent || '本节';
        const toolbar = document.createElement('div');
        toolbar.className = 'command-toolbar';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'command-copy';
        button.textContent = '复制命令';
        button.setAttribute('aria-label', `复制${title}的命令`);
        button.addEventListener('click', async () => {
            button.disabled = true;
            try {
                await navigator.clipboard.writeText(text);
                button.textContent = '已复制';
                copyStatus.textContent = `已复制${title}的命令；请阅读后在终端执行。`;
            } catch {
                const range = document.createRange();
                range.selectNodeContents(code);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                button.textContent = '请手动复制';
                copyStatus.textContent = '浏览器未允许复制，已选中命令，请使用系统复制操作。';
            } finally {
                button.disabled = false;
                setTimeout(() => { button.textContent = '复制命令'; }, 2500);
            }
        });
        toolbar.append(button);
        block.before(toolbar);
    });
    document.querySelector('.docs-search').hidden = false;
    status.hidden = false;
    filter();
    showTarget(window.location.hash);
})();
