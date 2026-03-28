// 打开视频弹窗功能
function openVideo(url, event) {
    event.preventDefault();
    
    const videoModal = document.createElement('div');
    videoModal.id = 'videoModal';
    videoModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
        animation: fadeIn 0.3s ease;
    `;

    const videoContainer = document.createElement('div');
    videoContainer.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 25px 50px rgba(0,0,0,0.3);
    `;

    const videoWrapper = document.createElement('div');
    videoWrapper.style.cssText = `
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        background: #000;
    `;

    const iframe = document.createElement('iframe');
    const videoId = url.split('v=')[1] || url.split('/').pop().split('?')[0];
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.setAttribute('src', embedUrl);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: #ff4444;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        z-index: 10002;
        transition: all 0.2s;
        font-weight: bold;
        line-height: 1;
    `;
    closeBtn.onmouseover = () => closeBtn.style.transform = 'scale(1.1)';
    closeBtn.onmouseout = () => closeBtn.style.transform = 'scale(1)';
    closeBtn.onclick = () => closeVideo();

    videoWrapper.appendChild(iframe);
    videoContainer.appendChild(videoWrapper);
    videoContainer.appendChild(closeBtn);
    videoModal.appendChild(videoContainer);
    document.body.appendChild(videoModal);

    // 点击背景关闭
    videoModal.onclick = (e) => {
        if (e.target === videoModal) {
            closeVideo();
        }
    };

    // ESC 键关闭
    const closeVideo = () => {
        videoModal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(videoModal)) {
                document.body.removeChild(videoModal);
            }
        }, 300);
    };

    document.addEventListener('keydown', function escListener(e) {
        if (e.key === 'Escape') {
            closeVideo();
            document.removeEventListener('keydown', escListener);
        }
    });
}

// 平滑滚动导航
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.header = document.querySelector('.header');
        this.initialize();
    }

    initialize() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#login' || targetId === '#signup') {
                    e.preventDefault();
                    this.showModal(targetId);
                    return;
                }
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    showModal(type) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            max-width: 400px;
            width: 90%;
            text-align: center;
        `;

        const title = document.createElement('h3');
        title.style.cssText = 'margin-bottom: 1rem; color: #0f172a;';
        title.textContent = type === '#login' ? '欢迎登录' : '开始使用';

        const desc = document.createElement('p');
        desc.style.cssText = 'color: #64748b; margin-bottom: 1.5rem;';
        desc.textContent = '此功能正在开发中，敬请期待！';

        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = `
            background: #6366f1;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
        `;
        closeBtn.textContent = '关闭';
        closeBtn.onclick = () => document.body.removeChild(modal);

        content.appendChild(title);
        content.appendChild(desc);
        content.appendChild(closeBtn);
        modal.appendChild(content);
        document.body.appendChild(modal);

        // 点击背景关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }
}

// 移动端菜单
class MobileMenu {
    constructor() {
        this.menuToggle = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.navActions = document.querySelector('.nav-actions');
        
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        this.navMenu.classList.toggle('active');
        this.navActions.classList.toggle('active');
        
        if (this.navMenu.classList.contains('active')) {
            this.menuToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
            this.navMenu.style.display = 'flex';
            this.navMenu.style.flexDirection = 'column';
            this.navMenu.style.position = 'absolute';
            this.navMenu.style.top = '70px';
            this.navMenu.style.left = '0';
            this.navMenu.style.right = '0';
            this.navMenu.style.background = 'white';
            this.navMenu.style.padding = '1rem';
            this.navMenu.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            this.navMenu.style.borderRadius = '0 0 12px 12px';
        } else {
            this.menuToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
            this.navMenu.style.display = 'flex';
            this.navMenu.style.flexDirection = 'row';
            this.navMenu.style.position = 'static';
            this.navMenu.style.background = 'none';
            this.navMenu.style.padding = '0';
            this.navMenu.style.boxShadow = 'none';
            this.navMenu.style.borderRadius = '0';
        }
    }
}

// 动态统计数据
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat[data-count]');
        this.initialize();
    }

    initialize() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animate(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.querySelector('.stat-number').textContent = Math.floor(current).toLocaleString() + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.querySelector('.stat-number').textContent = target.toLocaleString() + suffix;
            }
        };

        updateCounter();
    }
}

// 主题切换功能
class ThemeManager {
    constructor() {
        this.themeToggle = null;
        this.currentTheme = this.getTheme();
        this.initialize();
        
        // 添加主题切换按钮到导航栏
        this.addThemeToggle();
    }

    getTheme() {
        if (localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    }

    initialize() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const sunIcon = this.themeToggle.querySelector('.sun-icon');
        const moonIcon = this.themeToggle.querySelector('.moon-icon');
        
        if (this.currentTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    addThemeToggle() {
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            const themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = `
                <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
                <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
            `;
            themeToggle.style.marginLeft = '10px';
            themeToggle.style.cursor = 'pointer';
            navActions.insertBefore(themeToggle, navActions.firstChild);
            this.themeToggle = themeToggle;
            this.updateThemeIcon();
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// 视频按钮点击事件处理
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 FaroAI - OpenClaw Clone 网站已加载');
    
    // 视频按钮点击处理
    const demoBtn = document.getElementById('demoBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('视频按钮被点击');
            openVideo('https://youtu.be/st534T7-mdE?si=mwsBvhXpfbUbUZNj', e);
        });
    }
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease-in';
    }, 100);
    
    // 响应式导航优化
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.querySelector('.nav-menu')?.classList.remove('active');
            document.querySelector('.nav-actions')?.classList.remove('active');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            if (menuBtn) {
                menuBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
            }
        }
    });
});

// 添加淡入淡出动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
