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

/* ─────────── 首页动态科技感：粒子背景 + 工作流演示 ─────────── */
(function bindHomepageDynamics() {
    function onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
            return;
        }
        callback();
    }

    onReady(() => {
        const canvas = document.getElementById('heroParticles');
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        if (canvas && !prefersReducedMotion) {
            const ctx = canvas.getContext('2d');
            const particles = [];
            const particleCount = window.innerWidth < 768 ? 36 : 72;
            let width = 0;
            let height = 0;
            let animationFrame;

            function resizeCanvas() {
                const rect = canvas.getBoundingClientRect();
                const ratio = window.devicePixelRatio || 1;
                width = rect.width;
                height = rect.height;
                canvas.width = Math.max(1, Math.floor(width * ratio));
                canvas.height = Math.max(1, Math.floor(height * ratio));
                ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            }

            function createParticle(index) {
                const angle = (index / particleCount) * Math.PI * 2;
                return {
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: Math.cos(angle) * (0.18 + Math.random() * 0.34),
                    vy: Math.sin(angle) * (0.18 + Math.random() * 0.34),
                    r: 1.2 + Math.random() * 2.2,
                    hue: Math.random() > 0.72 ? 5 : Math.random() > 0.42 ? 178 : 218
                };
            }

            function resetParticles() {
                particles.length = 0;
                for (let i = 0; i < particleCount; i += 1) {
                    particles.push(createParticle(i));
                }
            }

            function draw() {
                ctx.clearRect(0, 0, width, height);
                particles.forEach((p, i) => {
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < -20 || p.x > width + 20) p.vx *= -1;
                    if (p.y < -20 || p.y > height + 20) p.vy *= -1;

                    ctx.beginPath();
                    ctx.fillStyle = `hsla(${p.hue}, 78%, 56%, 0.42)`;
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();

                    for (let j = i + 1; j < particles.length; j += 1) {
                        const q = particles[j];
                        const dx = p.x - q.x;
                        const dy = p.y - q.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 118) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(37, 99, 235, ${0.16 * (1 - distance / 118)})`;
                            ctx.lineWidth = 1;
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(q.x, q.y);
                            ctx.stroke();
                        }
                    }
                });
                animationFrame = window.requestAnimationFrame(draw);
            }

            resizeCanvas();
            resetParticles();
            draw();
            window.addEventListener('resize', () => {
                window.cancelAnimationFrame(animationFrame);
                resizeCanvas();
                resetParticles();
                draw();
            });
        }

        const flows = {
            briefing: {
                title: '每日简报工作流',
                command: '微信：整理今天 AI 与自动化领域的重要消息，并按影响程度排序。',
                steps: [
                    ['接收入口', '从微信消息识别简报主题、时间范围和输出格式'],
                    ['资料采集', '检索官方文档、技术博客和可信新闻源，过滤重复内容'],
                    ['模型摘要', '按影响力、可执行性和风险等级整理成短摘要'],
                    ['人工确认', '发送前保留确认节点，避免未经审核自动群发']
                ],
                output: '已生成 5 条高优先级摘要、3 条配置建议和 1 条待人工确认事项，可直接推送到微信。',
                route: '微信 → Gateway → Web/Search → Model',
                automation: '半自动，关键发送前确认',
                status: '适合日常信息简报'
            },
            knowledge: {
                title: '知识库问答工作流',
                command: '微信：根据我的配置文档，说明 OpenClaw Gateway 连接模型失败时怎么排查。',
                steps: [
                    ['意图识别', '判断问题属于配置排障，而不是普通闲聊'],
                    ['知识检索', '检索安装文档、模型配置、日志说明和历史处理记录'],
                    ['引用整合', '保留关键来源，优先输出可操作步骤'],
                    ['结果返回', '按“先检查网关，再检查模型，再检查通道”的顺序回复']
                ],
                output: '已生成一份 6 步排障清单，包含命令、预期结果和异常分支处理方式。',
                route: '微信 → Gateway → Knowledge → Model',
                automation: '自动检索，回复可人工复核',
                status: '适合个人资料库和团队手册'
            },
            stock: {
                title: '市场复盘工作流',
                command: '微信：18:00 汇总跌幅、成交量、涨停板块、量价同步和缩量预警。',
                steps: [
                    ['任务调度', '按交易日和固定时间启动，非交易日自动标记跳过'],
                    ['行情采集', '对接可用行情源，设置超时和备用源，避免单接口卡死'],
                    ['板块归因', '聚合跌幅、成交量、涨停数量和连续量价变化'],
                    ['预警输出', '对突然缩量、异常放量和接口失败分别给出提示']
                ],
                output: '已生成市场复盘模板。真实部署时建议为东财接口增加超时、重试和备用行情源。',
                route: 'Cron → Gateway → Market APIs → Model',
                automation: '定时执行，异常时主动报警',
                status: '适合每日收盘后复盘'
            }
        };

        const tabs = document.querySelectorAll('.workflow-tab');
        const title = document.getElementById('workflowTitle');
        const command = document.getElementById('workflowCommand');
        const steps = document.getElementById('workflowSteps');
        const output = document.getElementById('workflowOutput');
        const metricRoute = document.getElementById('metricRoute');
        const metricAutomation = document.getElementById('metricAutomation');
        const metricStatus = document.getElementById('metricStatus');

        function renderFlow(key) {
            const flow = flows[key] || flows.briefing;
            if (!title || !command || !steps || !output) return;

            title.textContent = flow.title;
            command.textContent = flow.command;
            output.textContent = flow.output;
            if (metricRoute) metricRoute.textContent = flow.route;
            if (metricAutomation) metricAutomation.textContent = flow.automation;
            if (metricStatus) metricStatus.textContent = flow.status;

            steps.innerHTML = '';
            flow.steps.forEach((step, index) => {
                const item = document.createElement('div');
                item.className = 'workflow-step';
                item.style.animationDelay = `${index * 90}ms`;
                item.innerHTML = `
                    <span class="workflow-step-index">${String(index + 1).padStart(2, '0')}</span>
                    <div>
                        <strong>${step[0]}</strong>
                        <span>${step[1]}</span>
                    </div>
                    <span class="workflow-step-state">ready</span>
                `;
                steps.appendChild(item);
            });
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(item => {
                    item.classList.remove('is-active');
                    item.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('is-active');
                tab.setAttribute('aria-selected', 'true');
                renderFlow(tab.dataset.flow);
            });
        });

        renderFlow('briefing');

        const demoButton = document.getElementById('workflowDemoButton');
        const lab = document.getElementById('workflow-lab');
        demoButton?.addEventListener('click', () => {
            lab?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
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

        function shouldSkipIntroForInternalHomeClick() {
            const navigation = performance.getEntriesByType?.('navigation')?.[0];
            const isReload = navigation?.type === 'reload';
            if (isReload) return false;
            if (!document.referrer) return false;

            try {
                const referrer = new URL(document.referrer);
                return referrer.origin === window.location.origin;
            } catch (error) {
                return false;
            }
        }

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

        if (shouldSkipIntroForInternalHomeClick()) {
            removeIntro();
            return;
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
