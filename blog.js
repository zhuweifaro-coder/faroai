// 博客页面交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 文章筛选
    const filterBtns = document.querySelectorAll('.filter-btn');
    const articles = document.querySelectorAll('.article-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新激活状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 筛选文章
            const category = this.dataset.category;
            articles.forEach(article => {
                if (category === 'all' || article.dataset.category === category) {
                    article.style.display = 'flex';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    });
    
    // 文章排序
    const sortSelect = document.querySelector('.sort-select');
    
    sortSelect.addEventListener('change', function() {
        const container = document.querySelector('.articles');
        const articles = Array.from(container.querySelectorAll('.article-card'));
        const sortBy = this.value;
        
        articles.sort((a, b) => {
            switch(sortBy) {
                case 'date':
                    const dateA = new Date(a.querySelector('.article-date').textContent);
                    const dateB = new Date(b.querySelector('.article-date').textContent);
                    return dateB - dateA;
                case 'popular':
                    const upvotesA = parseInt(a.dataset.upvotes);
                    const upvotesB = parseInt(b.dataset.upvotes);
                    return upvotesB - upvotesA;
                case 'comments':
                    const commentsA = parseInt(a.dataset.comments);
                    const commentsB = parseInt(b.dataset.comments);
                    return commentsB - commentsA;
                default:
                    return 0;
            }
        });
        
        articles.forEach(article => container.appendChild(article));
    });
    
    // 投票功能
    const voteBtns = document.querySelectorAll('.vote-btn');
    
    voteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const voteBtn = this;
            const voteContainer = this.closest('.article-vote');
            const voteCount = voteContainer.querySelector('.vote-count');
            let count = parseInt(voteCount.textContent);
            
            if (voteBtn.classList.contains('up')) {
                count++;
                voteContainer.querySelector('.down').style.opacity = '0.5';
            } else {
                count--;
                voteContainer.querySelector('.up').style.opacity = '0.5';
            }
            
            voteCount.textContent = count;
            
            // 添加点击动画
            voteBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                voteBtn.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // 移动端菜单
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        navMenu.style.display = !expanded ? 'flex' : 'none';
    });
    
    // 文章卡片点击跳转
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.vote-btn') && !e.target.closest('.article-tags .tag')) {
                const title = this.querySelector('.article-title');
                if (title) {
                    window.location.href = title.getAttribute('href');
                }
            }
        });
    });
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 文章计数初始化
    const commentLinks = document.querySelectorAll('.article-comments');
    
    commentLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 显示评论数量动画
            const container = this.closest('.article-meta');
            const count = this.textContent.split(' ')[0];
            
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // 响应式优化
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // 移动端菜单调整
            if (window.innerWidth > 768) {
                document.querySelector('.nav-menu').style.display = 'flex';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }, 250);
    });
    
    // 页面加载动画
    articles.forEach((article, index) => {
        article.style.opacity = '0';
        article.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            article.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            article.style.opacity = '1';
            article.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

/* ─────────── P2 #14: 自动生成博客目录 ─────────── */
(function buildTOC() {
    const tocNav = document.getElementById('tocNav');
    if (!tocNav) return;
    const articles = document.querySelectorAll('.article-card');
    if (articles.length === 0) return;

    const ol = document.createElement('ol');
    const links = [];

    articles.forEach((article, idx) => {
        // 给每个 article 一个稳定 id 用于锚点跳转
        if (!article.id) article.id = 'article-' + (idx + 1);

        const titleEl = article.querySelector('.article-title');
        if (!titleEl) return;

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + article.id;
        a.textContent = titleEl.textContent.trim();
        a.title = titleEl.textContent.trim();

        a.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(article.id);
            if (target) {
                const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
                window.scrollTo({ top, behavior: 'smooth' });
                history.replaceState(null, '', '#' + article.id);
            }
        });

        li.appendChild(a);
        ol.appendChild(li);
        links.push({ a, article });
    });

    tocNav.appendChild(ol);

    // 滚动同步：当前可视的文章对应 toc 链接高亮
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    links.forEach(({a, article}) => {
                        a.classList.toggle('active', article.id === id);
                    });
                }
            });
        }, { rootMargin: '-100px 0px -60% 0px' });
        articles.forEach(a => obs.observe(a));
    }
})();
