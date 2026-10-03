(function bindCommandPalette() {
    const onReady = callback => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
            return;
        }
        callback();
    };

    onReady(() => {
        const navbar = document.querySelector('.navbar');
        if (!navbar || document.querySelector('[data-command-launcher]')) return;

        const destinations = [
            { label: '首页', detail: 'FaroAI 工作台概览', href: 'index.html', group: '页面', keywords: 'home 首页 工作台' },
            { label: '功能特性', detail: '模型、微信、知识库与自动化', href: 'features.html', group: '页面', keywords: 'feature 功能 模型 微信 知识库' },
            { label: '文档中心', detail: '安装、配置与使用指南', href: 'docs.html', group: '页面', keywords: 'docs 文档 安装 配置 教程' },
            { label: '模型耗时排查', detail: '区分加载、输入处理与生成耗时', href: 'docs.html#model-performance', group: '指南', keywords: 'Ollama GPU 模型 性能 慢 耗时' },
            { label: '发布与缓存检查', detail: '核对网站部署和页面更新', href: 'docs.html#deployment', group: '指南', keywords: 'GitHub Pages Cloudflare 缓存 部署 发布' },
            { label: '更新日志', detail: '已发布的网站维护记录', href: 'changelog.html', group: '项目', keywords: 'changelog 更新 日志 维护 版本' },
            { label: '技术博客', detail: 'OpenClaw、OpenAI 与实践记录', href: 'blog.html', group: '内容', keywords: 'blog 博客 文章 新闻 教程' },
            { label: '投资研究', detail: '7月投资标的筛选逻辑视频', href: 'investment.html', group: '内容', keywords: 'investment 投资 股票 筛选 视频 7月' },
            { label: '站内搜索', detail: '检索全站公开内容', href: 'search.html', group: '内容', keywords: 'search 搜索 查找' },
            { label: '使用场景', detail: '个人与小团队工作流案例', href: 'usecases.html', group: '页面', keywords: 'use case 场景 案例' },
            { label: 'API 参考', detail: '接口能力与调用边界', href: 'api.html', group: '开发', keywords: 'api 接口 开发' },
            { label: '路线图', detail: '产品演进与规划', href: 'roadmap.html', group: '项目', keywords: 'roadmap 路线图 规划' },
            { label: '联系我们', detail: '邮件、微信与反馈入口', href: 'contact.html', group: '项目', keywords: 'contact 联系 邮件 微信' },
            { label: '项目简介', detail: '发起人经历与实践方向', href: '个人概况_2026_v3.html', group: '项目', keywords: 'about 简介 关于我 发起人' },
            { label: '运行态势', detail: '查看最近验收快照与能力边界', href: 'index.html#ops-radar', group: '首页模块', keywords: 'status 运行 状态 网关' },
            { label: '配置诊断台', detail: '按入口、模型和安全边界生成部署建议', href: 'index.html#config-lab', group: '首页模块', keywords: 'config 配置 诊断 部署 模型 微信 安全' },
            { label: 'AI 指挥台', detail: '查看任务路由与安全边界', href: 'index.html#command-deck', group: '首页模块', keywords: 'command ai 指挥台 路由' },
            { label: '工作流演示', detail: '切换真实自动化场景', href: 'index.html#workflow-lab', group: '首页模块', keywords: 'workflow 工作流 演示 自动化' },
            { label: '快速开始', detail: '从安装到首个任务', href: 'index.html#quickstart', group: '首页模块', keywords: 'quickstart 快速开始 安装' },
            { label: '功能状态', detail: '核验已实现与接入中的能力', href: 'index.html#site-status', group: '首页模块', keywords: '功能 状态 可用性' }
        ];

        const createLauncher = className => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `command-launcher ${className}`.trim();
            button.dataset.commandLauncher = '';
            button.setAttribute('aria-label', '打开快速导航');
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-controls', 'commandPalette');
            button.title = '快速导航';
            button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>';
            return button;
        };

        const navActions = navbar.querySelector('.nav-actions');
        const mobileButton = navbar.querySelector('.mobile-menu-btn');
        const desktopLauncher = createLauncher('command-launcher-desktop');
        const mobileLauncher = createLauncher('command-launcher-mobile');
        if (navActions) navActions.prepend(desktopLauncher);
        else navbar.insertBefore(desktopLauncher, mobileButton || null);
        navbar.insertBefore(mobileLauncher, mobileButton || null);
        const launchers = [desktopLauncher, mobileLauncher];

        const palette = document.createElement('div');
        palette.className = 'command-palette';
        palette.id = 'commandPalette';
        palette.setAttribute('aria-hidden', 'true');
        palette.innerHTML = `
            <div class="command-palette-backdrop" data-command-close></div>
            <section class="command-palette-dialog" role="dialog" aria-modal="true" aria-labelledby="commandPaletteTitle">
                <h2 class="sr-only" id="commandPaletteTitle">快速导航</h2>
                <div class="command-search-row">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>
                    <input type="search" class="command-search-input" placeholder="搜索页面或功能" autocomplete="off" aria-label="搜索页面或功能" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="commandResults" aria-describedby="commandHint">
                    <button type="button" class="command-close" data-command-close aria-label="关闭快速导航">×</button>
                </div>
                <p class="sr-only" id="commandHint">输入关键词筛选，上下方向键选择，回车打开，Esc 关闭。</p>
                <div class="command-results" id="commandResults" role="listbox" aria-label="导航结果"></div>
                <p class="sr-only" role="status" aria-live="polite" data-command-status></p>
                <p class="command-empty" hidden>没有匹配结果</p>
            </section>`;
        document.body.appendChild(palette);

        const input = palette.querySelector('.command-search-input');
        const results = palette.querySelector('.command-results');
        const empty = palette.querySelector('.command-empty');
        const status = palette.querySelector('[data-command-status]');
        const closeButton = palette.querySelector('.command-close');
        let visibleItems = [];
        let activeIndex = 0;
        let previousFocus = null;
        let composing = false;
        const backgroundState = new Map();
        const normalize = value => value.normalize('NFKC').toLocaleLowerCase('zh-CN').trim();
        palette.inert = true;

        function render(query = '') {
            const normalized = normalize(query);
            const terms = normalized.split(/\s+/).filter(Boolean);
            visibleItems = destinations.filter(item => {
                const haystack = normalize(`${item.label} ${item.detail} ${item.group} ${item.keywords}`);
                return terms.every(term => haystack.includes(term));
            });
            if (normalized) {
                const relevance = item => {
                    const label = normalize(item.label);
                    const keywords = normalize(item.keywords);
                    const detail = normalize(item.detail);
                    if (label.startsWith(normalized)) return 0;
                    if (label.includes(normalized)) return 1;
                    if (keywords.includes(normalized)) return 2;
                    if (detail.includes(normalized)) return 3;
                    return 4;
                };
                visibleItems.sort((a, b) => relevance(a) - relevance(b));
            }
            activeIndex = 0;
            results.innerHTML = visibleItems.map((item, index) => `
                <a class="command-result${index === activeIndex ? ' is-active' : ''}" id="command-result-${index}" href="${item.href}" role="option" tabindex="-1" aria-selected="${index === activeIndex}">
                    <span class="command-result-mark" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
                    <span class="command-result-copy"><strong>${item.label}</strong><small>${item.detail}</small></span>
                    <em>${item.group}</em>
                </a>`).join('');
            empty.hidden = visibleItems.length !== 0;
            status.textContent = visibleItems.length ? `找到 ${visibleItems.length} 个导航结果` : '没有匹配结果，请尝试其他关键词';
            results.scrollTop = 0;
            syncActive(false);
        }

        function syncActive(scroll = true) {
            const links = results.querySelectorAll('.command-result');
            links.forEach((link, index) => {
                const isActive = index === activeIndex;
                link.classList.toggle('is-active', isActive);
                link.setAttribute('aria-selected', String(isActive));
            });
            const active = links[activeIndex];
            if (active) input.setAttribute('aria-activedescendant', active.id);
            else input.removeAttribute('aria-activedescendant');
            if (scroll) active?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        }

        function openPalette() {
            if (palette.classList.contains('is-open')) return;
            previousFocus = document.activeElement;
            // Use the page's own menu handler so its icon, inert and ARIA state stay in sync.
            if (mobileButton?.getAttribute('aria-expanded') === 'true') mobileButton.click();
            palette.inert = false;
            palette.classList.add('is-open');
            palette.setAttribute('aria-hidden', 'false');
            input.setAttribute('aria-expanded', 'true');
            launchers.forEach(button => button.setAttribute('aria-expanded', 'true'));
            document.body.classList.add('command-palette-active');
            input.value = '';
            activeIndex = 0;
            composing = false;
            render();
            for (const element of document.body.children) {
                if (element === palette || !(element instanceof HTMLElement)) continue;
                backgroundState.set(element, element.inert);
                element.inert = true;
            }
            // Visibility transitions can reject focus in the opening frame.
            window.requestAnimationFrame(function focusInput() {
                if (!palette.classList.contains('is-open')) return;
                if (getComputedStyle(input).visibility !== 'visible') {
                    window.requestAnimationFrame(focusInput);
                    return;
                }
                if (!palette.contains(document.activeElement)) input.focus({ preventScroll: true });
            });
        }

        function closePalette() {
            if (!palette.classList.contains('is-open')) return;
            for (const [element, wasInert] of backgroundState) element.inert = wasInert;
            backgroundState.clear();
            composing = false;
            palette.classList.remove('is-open');
            input.setAttribute('aria-expanded', 'false');
            input.removeAttribute('aria-activedescendant');
            launchers.forEach(button => button.setAttribute('aria-expanded', 'false'));
            document.body.classList.remove('command-palette-active');
            const target = previousFocus?.isConnected && !previousFocus.closest('[inert]') && previousFocus.getClientRects().length
                ? previousFocus : launchers.find(button => button.getClientRects().length);
            target?.focus({ preventScroll: true });
            palette.setAttribute('aria-hidden', 'true');
            palette.inert = true;
        }

        launchers.forEach(button => button.addEventListener('click', openPalette));
        palette.querySelectorAll('[data-command-close]').forEach(element => element.addEventListener('click', closePalette));
        input.addEventListener('input', event => { if (!composing && !event.isComposing) render(input.value); });
        input.addEventListener('compositionstart', () => { composing = true; });
        input.addEventListener('compositionend', () => { composing = false; render(input.value); });
        results.addEventListener('mousemove', event => {
            const link = event.target.closest('.command-result');
            if (!link) return;
            const links = Array.from(results.querySelectorAll('.command-result'));
            activeIndex = links.indexOf(link);
            syncActive(false);
        });
        results.addEventListener('click', closePalette);

        document.addEventListener('keydown', event => {
            // Enter/Escape and arrows belong to the input method while choosing Chinese text.
            if (composing || event.isComposing || event.keyCode === 229) return;
            const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k';
            const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
            if (isShortcut || (event.key === '/' && !isTyping && !palette.classList.contains('is-open'))) {
                event.preventDefault();
                openPalette();
                return;
            }
            if (!palette.classList.contains('is-open')) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                closePalette();
            } else if (event.target === input && event.key === 'ArrowDown' && visibleItems.length) {
                event.preventDefault();
                activeIndex = (activeIndex + 1) % visibleItems.length;
                syncActive();
            } else if (event.target === input && event.key === 'ArrowUp' && visibleItems.length) {
                event.preventDefault();
                activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
                syncActive();
            } else if (event.target === input && event.key === 'Enter' && visibleItems[activeIndex]) {
                event.preventDefault();
                results.querySelectorAll('.command-result')[activeIndex]?.click();
            } else if (event.key === 'Tab') {
                const focusable = [input, closeButton];
                if (!focusable.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    });
})();
