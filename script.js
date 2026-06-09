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

            window.FaroAIGsap?.animateWorkflow?.();
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

        const commandDeck = {
            wechat: {
                title: '微信机器人任务舱',
                risk: 'Human confirm',
                line: '用户在微信发来问题，Gateway 识别意图后调用本地模型生成回复。',
                nodes: [
                    ['IN', '微信消息接收'],
                    ['ROUTE', '意图与权限判断'],
                    ['MODEL', 'Ollama / OpenAI 生成'],
                    ['OUT', '回复草稿确认']
                ],
                tools: 'Weixin → Gateway → Ollama → Reply',
                output: '回复草稿 + 发送前确认',
                boundary: '涉及敏感操作时人工确认'
            },
            research: {
                title: '资料研究任务舱',
                risk: 'Cited output',
                line: '输入研究主题后，按来源可信度筛选资料，形成带引用的中文摘要。',
                nodes: [
                    ['QUERY', '拆解研究问题'],
                    ['SEARCH', '搜索与去重'],
                    ['READ', '提取关键段落'],
                    ['WRITE', '生成摘要与引用']
                ],
                tools: 'Search → Extract → Rank → Summary',
                output: '中文摘要 + 来源清单',
                boundary: '实时事实需标注来源和日期'
            },
            market: {
                title: '市场监控任务舱',
                risk: 'Timed alert',
                line: '按交易日触发复盘任务，统计跌幅、成交量、涨停板块与缩量预警。',
                nodes: [
                    ['CRON', '18:00 定时触发'],
                    ['FETCH', '行情源采集'],
                    ['GROUP', '板块归因'],
                    ['ALERT', '异常预警推送']
                ],
                tools: 'Cron → Market APIs → Model → Weixin',
                output: '复盘报告 + 异常告警',
                boundary: '行情接口失败时进入降级提示'
            },
            ops: {
                title: '运维排障任务舱',
                risk: 'Live check',
                line: '从 Gateway 健康、插件状态、模型响应和消息投递四层定位故障。',
                nodes: [
                    ['HEALTH', 'Gateway 探针'],
                    ['PLUGIN', '微信插件检查'],
                    ['MODEL', '模型调用测试'],
                    ['TRACE', '链路日志定位']
                ],
                tools: 'Health → Plugin → Model → Trace',
                output: '排障清单 + 修复建议',
                boundary: '不自动重置配置，先给出确认项'
            }
        };

        const commandChips = document.querySelectorAll('.command-chip');
        const commandTitle = document.getElementById('commandTitle');
        const commandRisk = document.getElementById('commandRisk');
        const commandLine = document.getElementById('commandLine');
        const commandPipeline = document.getElementById('commandPipeline');
        const commandTools = document.getElementById('commandTools');
        const commandOutput = document.getElementById('commandOutput');
        const commandBoundary = document.getElementById('commandBoundary');

        function renderCommandDeck(key) {
            const item = commandDeck[key] || commandDeck.weixin;
            if (!commandTitle || !commandRisk || !commandLine || !commandPipeline) return;

            commandTitle.textContent = item.title;
            commandRisk.textContent = item.risk;
            commandLine.textContent = item.line;
            if (commandTools) commandTools.textContent = item.tools;
            if (commandOutput) commandOutput.textContent = item.output;
            if (commandBoundary) commandBoundary.textContent = item.boundary;

            commandPipeline.innerHTML = '';
            item.nodes.forEach((node, index) => {
                const nodeEl = document.createElement('div');
                nodeEl.className = 'command-node';
                nodeEl.style.animationDelay = `${index * 80}ms`;
                nodeEl.innerHTML = `<small>${node[0]}</small><strong>${node[1]}</strong>`;
                commandPipeline.appendChild(nodeEl);
            });

            window.FaroAIGsap?.animateCommandDeck?.();
        }

        commandChips.forEach(chip => {
            chip.addEventListener('click', () => {
                commandChips.forEach(item => {
                    item.classList.remove('is-active');
                    item.setAttribute('aria-selected', 'false');
                });
                chip.classList.add('is-active');
                chip.setAttribute('aria-selected', 'true');
                renderCommandDeck(chip.dataset.command);
            });
        });

        renderCommandDeck('wechat');

        const demoButton = document.getElementById('workflowDemoButton');
        const lab = document.getElementById('workflow-lab');
        demoButton?.addEventListener('click', () => {
            lab?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        const opsSync = document.getElementById('opsSync');
        if (opsSync) {
            const startedAt = Date.now();
            window.setInterval(() => {
                const elapsed = Math.floor((Date.now() - startedAt) / 1000);
                const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
                const seconds = String(elapsed % 60).padStart(2, '0');
                opsSync.textContent = `SYNC ${minutes}:${seconds}`;
            }, 1000);
        }

        const matrixItems = {
            wechat: {
                title: '微信入口层',
                score: 'Ready 92%',
                description: '把微信消息变成可路由任务，区分闲聊、资料查询、自动化触发和需要人工确认的请求。',
                bars: [92, 78, 86]
            },
            knowledge: {
                title: '知识检索层',
                score: 'Indexed 84%',
                description: '把博客、文档、配置记录和个人知识库接进统一检索路径，回答时保留来源和更新时间。',
                bars: [84, 72, 82]
            },
            automation: {
                title: '自动任务层',
                score: 'Flow 76%',
                description: '把日报、市场复盘、邮件摘要和运维检查做成可复用任务，但关键发送和危险动作仍保留确认。',
                bars: [80, 76, 88]
            },
            safety: {
                title: '安全审计层',
                score: 'Guard 88%',
                description: '对外部输入、工具输出、消息投递和配置修改分层隔离，避免把模型回复直接等同为可执行命令。',
                bars: [86, 70, 88]
            }
        };

        const matrixChips = document.querySelectorAll('.matrix-chip');
        const matrixTitle = document.getElementById('matrixTitle');
        const matrixScore = document.getElementById('matrixScore');
        const matrixDescription = document.getElementById('matrixDescription');
        const matrixBars = [
            document.getElementById('matrixBarAvailability'),
            document.getElementById('matrixBarAutomation'),
            document.getElementById('matrixBarSafety')
        ];

        function renderMatrix(key) {
            const item = matrixItems[key] || matrixItems.weixin;
            if (matrixTitle) matrixTitle.textContent = item.title;
            if (matrixScore) matrixScore.textContent = item.score;
            if (matrixDescription) matrixDescription.textContent = item.description;
            matrixBars.forEach((bar, index) => {
                if (bar) bar.style.width = `${item.bars[index]}%`;
            });
            window.FaroAIGsap?.animateMatrix?.();
        }

        matrixChips.forEach(chip => {
            chip.addEventListener('click', () => {
                matrixChips.forEach(item => {
                    item.classList.remove('is-active');
                    item.setAttribute('aria-selected', 'false');
                });
                chip.classList.add('is-active');
                chip.setAttribute('aria-selected', 'true');
                renderMatrix(chip.dataset.matrix);
            });
        });

        renderMatrix('wechat');
    });
})();

/* ─────────── 首页 GSAP 动效增强：入场、滚动揭示、面板切换 ─────────── */
(function bindGsapHomepageAnimations() {
    function onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
            return;
        }
        callback();
    }

    onReady(() => {
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;
        const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        window.FaroAIGsap = {
            animateWorkflow() {},
            animateCommandDeck() {},
            animateMatrix() {}
        };

        if (!gsap || prefersReducedMotion) return;

        if (ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }

        gsap.defaults({
            ease: 'power3.out',
            duration: 0.72
        });

        const heroItems = [
            '.hero-badge',
            '.hero-title',
            '.hero-description',
            '.hero-audience-chip',
            '.hero-actions .btn',
            '.proof-item',
            '.hero-trust-card',
            '.stat'
        ];

        gsap.from(heroItems, {
            autoAlpha: 0,
            y: 24,
            duration: 0.82,
            stagger: 0.055,
            clearProps: 'opacity,visibility,transform'
        });

        gsap.from('.dashboard-preview', {
            autoAlpha: 0,
            y: 34,
            scale: 0.97,
            rotateX: 4,
            duration: 0.95,
            delay: 0.12,
            transformOrigin: '50% 60%',
            clearProps: 'opacity,visibility,transform'
        });

        gsap.from('.preview-chart .chart-bar', {
            scaleY: 0.28,
            transformOrigin: '50% 100%',
            duration: 0.9,
            delay: 0.42,
            stagger: 0.06,
            clearProps: 'transform'
        });

        if (ScrollTrigger) {
            gsap.to('.dashboard-preview', {
                y: -28,
                rotateZ: -0.8,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.7
                }
            });

            gsap.to('.hero-particles', {
                y: 46,
                opacity: 0.38,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

            const revealItems = gsap.utils.toArray([
                '.credibility-item',
                '.fit-card',
                '.launch-lane',
                '.ops-copy',
                '.ops-console',
                '.command-deck .section-header',
                '.command-chip',
                '.command-holo',
                '.workflow-lab .section-header',
                '.workflow-controls',
                '.workflow-stage',
                '.workflow-metrics',
                '.mission-card',
                '.agent-matrix .section-header',
                '.matrix-orb',
                '.matrix-panel',
                '.feature-card',
                '.quickstart-step',
                '.status-card',
                '.use-case-card',
                '.blog-preview-card',
                '.team-card'
            ].join(','));

            ScrollTrigger.batch(revealItems, {
                start: 'top 86%',
                once: true,
                onEnter(batch) {
                    gsap.fromTo(batch, {
                        autoAlpha: 0,
                        y: 28
                    }, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.68,
                        stagger: 0.06,
                        clearProps: 'opacity,visibility,transform'
                    });
                }
            });

            gsap.to('.holo-orbit span', {
                rotate: 360,
                duration: 18,
                repeat: -1,
                ease: 'none',
                transformOrigin: '50% 50%',
                stagger: 1.2
            });
        }

        function addPointerLift(selector) {
            gsap.utils.toArray(selector).forEach(element => {
                element.addEventListener('pointerenter', () => {
                    gsap.to(element, { y: -4, scale: 1.012, duration: 0.28, overwrite: 'auto' });
                });
                element.addEventListener('pointerleave', () => {
                    gsap.to(element, { y: 0, scale: 1, duration: 0.32, overwrite: 'auto' });
                });
            });
        }

        addPointerLift('.hero-actions .btn, .command-chip, .workflow-tab, .matrix-chip, .matrix-mini-grid article, .feature-card, .blog-preview-card');

        window.FaroAIGsap.animateWorkflow = function animateWorkflow() {
            gsap.fromTo('.workflow-step', {
                autoAlpha: 0,
                x: -18
            }, {
                autoAlpha: 1,
                x: 0,
                duration: 0.42,
                stagger: 0.055,
                clearProps: 'opacity,visibility,transform'
            });
            gsap.fromTo('.workflow-output', {
                autoAlpha: 0.62,
                y: 8
            }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                clearProps: 'opacity,visibility,transform'
            });
        };

        window.FaroAIGsap.animateCommandDeck = function animateCommandDeck() {
            gsap.fromTo('.command-node', {
                autoAlpha: 0,
                y: 12,
                scale: 0.96
            }, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.38,
                stagger: 0.05,
                clearProps: 'opacity,visibility,transform'
            });
            gsap.fromTo('.command-output-grid article', {
                autoAlpha: 0.58,
                y: 8
            }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.42,
                stagger: 0.045,
                clearProps: 'opacity,visibility,transform'
            });
        };

        window.FaroAIGsap.animateMatrix = function animateMatrix() {
            gsap.fromTo('.matrix-panel p, .matrix-bar, .matrix-panel-header em, .matrix-mini-grid article', {
                autoAlpha: 0.62,
                y: 8
            }, {
                autoAlpha: 1,
                y: 0,
                duration: 0.36,
                stagger: 0.045,
                clearProps: 'opacity,visibility,transform'
            });
        };

        window.FaroAIGsap.animateWorkflow();
        window.FaroAIGsap.animateCommandDeck();
        window.FaroAIGsap.animateMatrix();
    });
})();

/* ─────────── 首页快速导航：滚动位置高亮 ─────────── */
(function bindSectionRail() {
    function onReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
            return;
        }
        callback();
    }

    onReady(() => {
        const rail = document.querySelector('.section-rail');
        if (!rail) return;

        const links = Array.from(rail.querySelectorAll('a[href^="#"]'));
        const targets = links
            .map(link => document.querySelector(link.getAttribute('href')))
            .filter(Boolean);

        if (!links.length || !targets.length) return;

        function setActive(id) {
            links.forEach(link => {
                link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
            });
        }

        if (!('IntersectionObserver' in window)) {
            const updateByScroll = () => {
                const current = targets
                    .map(target => ({ target, top: Math.abs(target.getBoundingClientRect().top - 110) }))
                    .sort((a, b) => a.top - b.top)[0]?.target;
                if (current?.id) setActive(current.id);
            };
            window.addEventListener('scroll', updateByScroll, { passive: true });
            updateByScroll();
            return;
        }

        const observer = new IntersectionObserver(entries => {
            const visible = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible?.target?.id) {
                setActive(visible.target.id);
            }
        }, {
            rootMargin: '-42% 0px -48% 0px',
            threshold: [0.01, 0.18, 0.36]
        });

        targets.forEach(target => observer.observe(target));
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
