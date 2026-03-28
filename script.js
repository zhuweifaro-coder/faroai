// 主题切换功能
class ThemeManager {
    constructor() {
        this.themeToggle = null;
        this.currentTheme = this.getTheme();
        this.initialize();
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
        } else {
            this.menuToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        }
    }
}

// 平滑滚动
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.initialize();
    }

    initialize() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
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
}

// 滚动动画
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.feature-card, .use-case-card, .pricing-card');
        this.initialize();
    }

    initialize() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }
}

// 动态统计数字
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
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
            const target = parseFloat(counter.getAttribute('data-target') || counter.textContent.replace(/[^0-9]/g, ''));
            this.animate(counter);
            observer.observe(counter);
        });
    }

    animate(element) {
        const text = element.textContent;
        const numberMatch = text.match(/[\d,]+/);
        if (!numberMatch) return;

        const suffix = text.replace(numberMatch[0], '');
        const target = parseInt(numberMatch[0].replace(',', ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString() + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString() + suffix;
            }
        };

        updateCounter();
    }
}

// 响应式导航优化
class ResponsiveNav {
    constructor() {
        this.initialize();
    }

    initialize() {
        // 在屏幕尺寸变化时重置菜单
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                document.querySelector('.nav-menu')?.classList.remove('active');
                document.querySelector('.nav-actions')?.classList.remove('active');
                document.querySelector('.mobile-menu-btn')?.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
            }
        });
    }
}

// 订阅表单
class SubscribeForm {
    constructor() {
        this.form = document.querySelector('.subscribe-form');
        this.initialize();
    }

    initialize() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = this.form.querySelector('input[type="email"]').value;
                
                if (email && this.validateEmail(email)) {
                    alert(`感谢订阅！我们会将最新资讯发送到 ${email}`);
                    this.form.reset();
                } else {
                    alert('请输入有效的邮箱地址');
                }
            });
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 OpenClaw Clone 网站已加载');
    
    new ThemeManager();
    new MobileMenu();
    new SmoothScroll();
    new ScrollAnimations();
    new CounterAnimation();
    new ResponsiveNav();
    new SubscribeForm();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease-in';
    }, 100);
});

// 触摸支持
if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch');
}
