// 打开视频弹窗功能
function openVideo(url, event) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    
    if (!url) {
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
        desc.textContent = '账号系统正在接入中，请先查看配置文档，或通过联系方式申请试用。';

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
        const isOpen = this.navMenu.classList.contains('active');
        this.menuToggle.setAttribute('aria-expanded', String(isOpen));
        
        if (isOpen) {
            this.menuToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
        } else {
            this.menuToggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        }
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    new SmoothScroll();
    new MobileMenu();
    
    // 视频按钮点击处理
    var demoBtn = document.getElementById('demoBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', function(e) {
            openVideo('https://youtu.be/st534T7-mdE?si=mwsBvhXpfbUbUZNj', e);
        });
    }
    
    // 响应式导航优化
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            var navMenu = document.querySelector('.nav-menu');
            var navActions = document.querySelector('.nav-actions');
            if (navMenu) navMenu.classList.remove('active');
            if (navActions) navActions.classList.remove('active');
            var menuBtn = document.querySelector('.mobile-menu-btn');
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', 'false');
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

    // 表单提交：显示账号系统接入说明
    ['loginForm', 'forgotForm'].forEach(id => {
        const form = document.getElementById(id);
        form?.addEventListener('submit', e => {
            e.preventDefault();
            const errorEl = form.querySelector('.form-error');
            const message = '账号系统正在接入中，请先查看配置文档或通过联系方式申请试用。';
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.hidden = false;
                errorEl.style.color = 'var(--primary-color, #2563eb)';
            } else {
                alert(message);
            }
        });
    });
})();

/* ─────────── 联系表单：静态站使用 mailto 发送 ─────────── */
(function bindContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = form.querySelector('#contactName')?.value.trim();
        const email = form.querySelector('#contactEmail')?.value.trim();
        const subjectValue = form.querySelector('#contactSubject')?.value || 'other';
        const message = form.querySelector('#contactMessage')?.value.trim();

        if (!name || !email || !message) {
            alert('请填写姓名、邮箱和内容。');
            return;
        }

        const subjectMap = {
            bug: '问题反馈',
            feature: '功能建议',
            business: '商务合作',
            billing: '费用咨询',
            other: '其他'
        };
        const subject = `FaroAI 联系表单 - ${subjectMap[subjectValue] || '其他'}`;
        const body = [
            `姓名：${name}`,
            `邮箱：${email}`,
            `主题：${subjectMap[subjectValue] || '其他'}`,
            '',
            message
        ].join('\n');
        window.location.href = `mailto:faro@vip.163.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
})();

/* ─────────── GitHub / Google OAuth 状态提示 ─────────── */
(function bindOAuth() {
    const oauthButtons = document.querySelectorAll('.btn-social');
    oauthButtons.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const status = document.getElementById('authStatus');
            if (status) {
                status.textContent = 'Google/GitHub 登录正在接入中，当前不会发起 OAuth 授权请求。';
            }
        });
    });
})();

/* ─────────── 首页背景音乐：Ocean (Little End) ─────────── */
(function bindHomeBgm() {
    function onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
            return;
        }
        callback();
    }

    onReady(() => {
        const audio = document.getElementById('homeBgm');
        const toggle = document.getElementById('musicToggle');
        if (!audio || !toggle) return;

        const text = toggle.querySelector('.music-toggle-text');

        function setState(state) {
            const isPlaying = state === 'playing';
            const unavailable = state === 'unavailable';
            toggle.classList.toggle('is-playing', isPlaying);
            toggle.classList.toggle('is-unavailable', unavailable);
            toggle.hidden = unavailable;
            toggle.setAttribute('aria-pressed', String(isPlaying));
            toggle.disabled = unavailable;

            if (text) {
                if (isPlaying) text.textContent = '暂停背景音乐';
                else if (unavailable) text.textContent = '音乐文件待上传';
                else text.textContent = '播放背景音乐';
            }
        }

        function pauseMusic() {
            audio.pause();
            setState('paused');
        }

        async function playMusic() {
            if (toggle.disabled) return;
            audio.volume = 0.42;

            try {
                await audio.play();
                setState('playing');
            } catch (error) {
                setState('paused');
            }
        }

        audio.addEventListener('playing', () => setState('playing'));
        audio.addEventListener('pause', () => setState('paused'));
        audio.addEventListener('error', () => setState('unavailable'));

        toggle.addEventListener('click', () => {
            if (audio.paused) {
                playMusic();
            } else {
                pauseMusic();
            }
        });

        setState('paused');
        playMusic();

        const unlockOnce = () => {
            if (audio.paused && !toggle.disabled) {
                playMusic();
            }
            window.removeEventListener('pointerdown', unlockOnce);
            window.removeEventListener('keydown', unlockOnce);
        };
        window.addEventListener('pointerdown', unlockOnce, { once: true });
        window.addEventListener('keydown', unlockOnce, { once: true });
    });
})();

/* ─────────── 每次进入首页播放技术流开场动画 ─────────── */
(function bindTechIntro() {
    function onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
            return;
        }
        callback();
    }

    onReady(() => {
        const intro = document.getElementById('techIntro');
        if (!intro) return;

        const skipButton = document.getElementById('techIntroSkip');
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        let closeTimer;

        function removeIntro() {
            if (intro.parentNode) {
                intro.parentNode.removeChild(intro);
            }
        }

        function closeIntro() {
            if (!intro.classList.contains('is-visible')) return;
            window.clearTimeout(closeTimer);
            intro.classList.add('is-closing');
            intro.classList.remove('is-visible');
            intro.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('intro-active');
            window.setTimeout(removeIntro, 420);
        }

        document.body.classList.add('intro-active');
        intro.setAttribute('aria-hidden', 'false');
        window.requestAnimationFrame(() => intro.classList.add('is-visible'));
        closeTimer = window.setTimeout(closeIntro, prefersReducedMotion ? 1800 : 5200);

        skipButton?.addEventListener('click', closeIntro);
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeIntro();
            }
        });
    });
})();
