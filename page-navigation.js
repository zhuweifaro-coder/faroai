// Navigation for content pages that do not need the homepage runtime.
(() => {
    const nav = document.querySelector('.navbar');
    const toggle = nav?.querySelector('.mobile-menu-btn');
    const menu = nav?.querySelector('.nav-menu');
    const actions = nav?.querySelector('.nav-actions');
    if (!toggle || !menu) return;

    const mobile = window.matchMedia('(max-width: 768px)');
    nav.classList.add('content-navigation');
    menu.id ||= 'mobile-menu';
    toggle.type = 'button';
    toggle.setAttribute('aria-controls', menu.id);
    // Put header actions in the same scrollable mobile list to avoid overlapping panels.
    actions?.querySelectorAll('a').forEach(link => {
        const item = document.createElement('li');
        item.className = 'content-mobile-link';
        item.append(link.cloneNode(true));
        menu.append(item);
    });

    function setOpen(open, restoreFocus = false) {
        open = mobile.matches && open;
        menu.classList.toggle('active', open);
        actions?.classList.remove('active');
        menu.inert = mobile.matches && !open;
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
        toggle.innerHTML = open
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
        if (restoreFocus) toggle.focus();
    }

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', event => {
        if (event.target.closest('a')) setOpen(false);
    });
    nav.addEventListener('click', event => {
        if (event.target.closest('[data-command-launcher]')) setOpen(false);
    });
    document.addEventListener('click', event => {
        // The toggle swaps its SVG; the original click target may already be detached.
        if (!event.composedPath().includes(nav)) setOpen(false);
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    mobile.addEventListener('change', () => setOpen(false));
    setOpen(false);
})();
