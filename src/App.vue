<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <!-- 导航栏 -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg animate-pulse-glow"></div>
            <span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">我的网站</span>
          </div>
          
          <div class="hidden md:flex items-center space-x-8">
            <a href="#home" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">首页</a>
            <a href="#features" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">特点</a>
            <a href="#portfolio" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">作品</a>
            <a href="#services" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">服务</a>
            <a href="#contact" class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">联系</a>
          </div>
          
          <div class="flex items-center space-x-4">
            <button @click="toggleDark" class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <svg v-if="isDark" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            </button>
            <button class="hidden sm:block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
              开始使用
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 首页 Hero 区域 -->
    <section id="home" class="pt-32 pb-20 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse-glow">
          欢迎来到我的网站
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          使用现代技术栈构建的精美网站，支持响应式设计、暗色模式、流畅动画
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all transform hover:scale-105 font-semibold text-lg">
            开始探索
          </button>
          <button class="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all font-semibold text-lg">
            了解更多
          </button>
        </div>
        
        <!-- 装饰元素 -->
        <div class="mt-20 flex justify-center space-x-8">
          <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl animate-float"></div>
          <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl animate-float" style="animation-delay: 0.5s"></div>
          <div class="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl animate-float" style="animation-delay: 1s"></div>
        </div>
      </div>
    </section>

    <!-- 特点区域 -->
    <section id="features" class="py-20 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">核心特点</h2>
        <p class="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          使用最新技术构建，具备现代化网站的所有必备功能
        </p>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="index" 
               class="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 cursor-pointer border border-gray-100 dark:border-gray-700">
            <div class="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center text-2xl">
              {{ feature.icon }}
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{{ feature.title }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 作品集区域 -->
    <section id="portfolio" class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">精选作品</h2>
        <p class="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          展示一些令人印象深刻的项目案例
        </p>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(project, index) in projects" :key="index" 
               class="group relative overflow-hidden rounded-2xl cursor-pointer">
            <div class="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-6xl">
              {{ project.image }}
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <h3 class="text-xl font-bold text-white mb-2">{{ project.title }}</h3>
                <p class="text-gray-300 text-sm">{{ project.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 服务区域 -->
    <section id="services" class="py-20 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">服务项目</h2>
        <p class="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          提供全方位的数字化解决方案
        </p>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(service, index) in services" :key="index"
               class="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-750 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all transform hover:scale-105">
            <div class="text-4xl mb-4">{{ service.icon }}</div>
            <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{{ service.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA 区域 -->
    <section class="py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <div class="p-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">准备好开始了吗？</h2>
          <p class="text-blue-100 mb-8 text-lg">
            立即联系我们，让我们共同打造你的数字化产品
          </p>
          <button class="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg">
            立即咨询
          </button>
        </div>
      </div>
    </section>

    <!-- 联系区域 -->
    <section id="contact" class="py-20 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">联系我们</h2>
        <p class="text-gray-600 dark:text-gray-400 text-center mb-12">
          有任何问题或项目需求？随时联系我们！
        </p>
        
        <form class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">姓名</label>
              <input type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="你的名字">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">邮箱</label>
              <input type="email" class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="your@email.com">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">主题</label>
            <input type="text" class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="想了解什么？">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">留言</label>
            <textarea rows="5" class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none" placeholder="详细描述你的需求..."></textarea>
          </div>
          <button type="submit" class="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] font-semibold text-lg">
            发送消息
          </button>
        </form>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="py-12 px-4 bg-gray-900 dark:bg-black">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-white font-semibold mb-4">关于我们</h3>
            <p class="text-gray-400 text-sm">使用现代技术栈打造的精美网站，专注于用户体验和功能完整性。</p>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">快速链接</h3>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#home" class="hover:text-blue-400 transition-colors">首页</a></li>
              <li><a href="#features" class="hover:text-blue-400 transition-colors">特点</a></li>
              <li><a href="#portfolio" class="hover:text-blue-400 transition-colors">作品</a></li>
              <li><a href="#services" class="hover:text-blue-400 transition-colors">服务</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">服务</h3>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-blue-400 transition-colors">Web 开发</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">移动应用</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">UI/UX 设计</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">技术咨询</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">联系方式</h3>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>📧 hello@example.com</li>
              <li>📱 +86 138 0000 0000</li>
              <li>📍 中国·上海</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center">
          <p class="text-gray-400 text-sm">© 2024 我的网站。保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 暗色模式
const isDark = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('darkMode', isDark.value)
}

// 加载保存的暗色模式偏好
if (localStorage.getItem('darkMode') === 'true') {
  isDark.value = true
  document.documentElement.classList.add('dark')
}

// 特点数据
const features = [
  { icon: '⚡', title: '极速加载', description: '使用 Vite 构建，实现 instant 开发体验和超快生产构建' },
  { icon: '📱', title: '响应式设计', description: '完美适配手机、平板、桌面等各种设备' },
  { icon: '🌓', title: '暗色模式', description: '一键切换亮色/暗色主题，保护眼睛' },
  { icon: '🎨', title: '精美设计', description: '采用现代渐变色彩和流畅动画效果' },
  { icon: '🚀', title: '性能优化', description: '优化的加载速度和渲染性能' },
  { icon: '💡', title: '易于扩展', description: '模块化架构，轻松添加新功能' },
]

// 作品数据
const projects = [
  { image: '🎯', title: '品牌网站', description: '企业级品牌官网设计与开发' },
  { image: '🛒', title: '电商平台', description: '全功能在线购物平台' },
  { image: '📊', title: '数据仪表盘', description: '实时数据可视化系统' },
  { image: '📱', title: '移动应用', description: '跨平台移动应用解决方案' },
  { image: '🎮', title: '互动游戏', description: 'WebGL 互动网页游戏' },
  { image: '🎨', title: '作品集', description: '创意设计师个人作品集' },
]

// 服务数据
const services = [
  { icon: '💻', title: 'Web 开发', description: '现代前端与后端开发' },
  { icon: '📱', title: '移动开发', description: 'iOS & Android 应用' },
  { icon: '🎨', title: 'UI/UX 设计', description: '用户界面与体验设计' },
  { icon: '☁️', title: '云服务', description: '云部署与运维服务' },
]
</script>
