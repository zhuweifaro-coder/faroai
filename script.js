// 打开视频弹窗功能
function openVideo(url, event) {
    console.log('✅ openVideo 函数被调用');
    console.log('URL:', url);
    
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    
    if (!url) {
        console.error('⚠️ URL 未定义');
        alert('视频链接无效');
        return;
    }
    
    var videoId = '';
    var parts = url.split('v=');
    if (parts.length > 1) {
        videoId = parts[1].split('&')[0];
    } else {
        var lastPart = url.split('/').pop();
        videoId = lastPart.split('?')[0];
    }
    
    console.log('🎬 提取的视频 ID:', videoId);
    
    var videoModal = document.createElement('div');
    videoModal.setAttribute('id', 'videoModal');
    videoModal.style.position = 'fixed';
    videoModal.style.top = '0';
    videoModal.style.left = '0';
    videoModal.style.width = '100%';
    videoModal.style.height = '100%';
    videoModal.style.background = 'rgba(0,0,0,0.9)';
    videoModal.style.display = 'flex';
    videoModal.style.alignItems = 'center';
    videoModal.style.justifyContent = 'center';
    videoModal.style.zIndex = '10001';
    
    var videoContainer = document.createElement('div');
    videoContainer.style.maxWidth = '90%';
    videoContainer.style.maxHeight = '90%';
    videoContainer.style.background = 'white';
    videoContainer.style.borderRadius = '16px';
    videoContainer.style.overflow = 'hidden';
    videoContainer.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
    
    var videoWrapper = document.createElement('div');
    videoWrapper.style.position = 'relative';
    videoWrapper.style.paddingBottom = '56.25%';
    videoWrapper.style.height = '0';
    videoWrapper.style.background = '#000';
    
    var iframe = document.createElement('iframe');
    var embedUrl = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
    iframe.setAttribute('src', embedUrl);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    
    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '-40px';
    closeBtn.style.right = '0';
    closeBtn.style.background = '#ff4444';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.width = '40px';
    closeBtn.style.height = '40px';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '10002';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.lineHeight = '1';
    
    var closeVideo = function() {
        videoModal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(function() {
            if (document.body.contains(videoModal)) {
                document.body.removeChild(videoModal);
            }
        }, 300);
    };
    
    closeBtn.onclick = closeVideo;
    videoModal.onclick = function(e) {
        if (e.target === videoModal) {
            closeVideo();
        }
    };
    
    var escListener = function(e) {
        if (e.key === 'Escape') {
            closeVideo();
            document.removeEventListener('keydown', escListener);
        }
    };
    document.addEventListener('keydown', escListener);
    
    videoWrapper.appendChild(iframe);
    videoContainer.appendChild(videoWrapper);
    videoContainer.appendChild(closeBtn);
    videoModal.appendChild(videoContainer);
    document.body.appendChild(videoModal);
    console.log('✅ 视频弹窗已创建并添加到 DOM');
}

// 平滑滚动导航
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.header = document.querySelector('.header');
        this.initialize();
    }

    initialize() {
        this.links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var targetId = link.getAttribute('href');
                if (targetId === '#login' || targetId === '#signup') {
                    e.preventDefault();
                    this.showModal(targetId);
                    return;
                }
                
                if (targetId === '#') return;
                
                var targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    var headerOffset = 80;
                    var elementPosition = targetElement.getBoundingClientRect().top;
                    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }.bind(this));
        }.bind(this));
    }

    showModal(type) {
        var modal = document.createElement('div');
        modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';

        var content = document.createElement('div');
        content.style.cssText = 'background: white; padding: 2rem; border-radius: 1rem; max-width: 400px; width: 90%; text-align: center;';

        var title = document.createElement('h3');
        title.style.cssText = 'margin-bottom: 1rem; color: #0f172a;';
        title.textContent = type === '#login' ? '欢迎登录' : '开始使用';

        var desc = document.createElement('p');
        desc.style.cssText = 'color: #64748b; margin-bottom: 1.5rem;';
        desc.textContent = '此功能正在开发中，敬请期待！';

        var closeBtn = document.createElement('button');
        closeBtn.style.cssText = 'background: #6366f1; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-weight: 600;';
        closeBtn.textContent = '关闭';
        closeBtn.onclick = function() { document.body.removeChild(modal); };

        content.appendChild(title);
        content.appendChild(desc);
        content.appendChild(closeBtn);
        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.onclick = function(e) {
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
            this.menuToggle.addEventListener('click', this.toggle.bind(this));
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

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 FaroAI - OpenClaw Clone 网站已加载');
    
    // 视频按钮点击处理
    var demoBtn = document.getElementById('demoBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', function(e) {
            console.log('视频按钮被点击');
            openVideo('https://youtu.be/st534T7-mdE?si=mwsBvhXpfbUbUZNj', e);
        });
    }
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    setTimeout(function() {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.3s ease-in';
    }, 100);
    
    // 响应式导航优化
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            var navMenu = document.querySelector('.nav-menu');
            var navActions = document.querySelector('.nav-actions');
            if (navMenu) navMenu.classList.remove('active');
            if (navActions) navActions.classList.remove('active');
            var menuBtn = document.querySelector('.mobile-menu-btn');
            if (menuBtn) {
                menuBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
            }
        }
    });
});

// 添加淡入淡出动画样式
var style = document.createElement('style');
style.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes fadeOut{from{opacity:1}to{opacity:0}}';
document.head.appendChild(style);

/* ─────────── 修复：登录/忘记密码模态框事件绑定 ─────────── */
(function bindAuthModals() {
    const loginModal = document.getElementById('loginModal');
    const forgotModal = document.getElementById('forgotPasswordModal');
    if (!loginModal) return;

    function openModal(m) {
        document.querySelectorAll('.modal').forEach(x => x.setAttribute('aria-hidden', 'true'));
        m.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        const firstInput = m.querySelector('input, button');
        firstInput && firstInput.focus();
    }
    function closeModal(m) {
        m.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }
    function closeAll() {
        document.querySelectorAll('.modal[aria-hidden="false"]').forEach(closeModal);
    }

    // 登录触发器（header + 任何 .btn-login-trigger）
    document.querySelectorAll('.btn-login-trigger').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            openModal(loginModal);
        });
    });

    // "立即注册" link 也跳到 pricing.html (a 标签自然处理) 或者切到登录
    // 这里不做特殊处理（href="pricing.html" 已是真页面）

    // "忘记密码" → forgot 模态
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink && forgotModal) {
        forgotLink.addEventListener('click', e => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(forgotModal);
        });
    }
    // "返回登录" link
    document.querySelectorAll('.link-back-login').forEach(l => {
        l.addEventListener('click', e => {
            e.preventDefault();
            if (forgotModal) closeModal(forgotModal);
            openModal(loginModal);
        });
    });

    // 关闭：close button / backdrop / ESC
    document.querySelectorAll('.modal').forEach(m => {
        m.querySelector('.modal-close')?.addEventListener('click', () => closeModal(m));
        m.querySelector('.modal-backdrop')?.addEventListener('click', () => closeModal(m));
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeAll();
    });

    // 密码可见性切换
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.closest('.form-group')?.querySelector('input[type="password"], input[type="text"]');
            if (!input) return;
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    });

    // 表单提交：显示"功能开发中"占位提示
    ['loginForm', 'forgotForm'].forEach(id => {
        const form = document.getElementById(id);
        form?.addEventListener('submit', e => {
            e.preventDefault();
            const errorEl = form.querySelector('.form-error');
            if (errorEl) {
                errorEl.textContent = '后端登录服务尚未上线，敬请期待 🦞';
                errorEl.hidden = false;
                errorEl.style.color = 'var(--primary-color, #6366f1)';
            } else {
                alert('后端登录服务尚未上线，敬请期待 🦞');
            }
        });
    });
})();
