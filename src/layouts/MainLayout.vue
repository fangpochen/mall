<template>
  <div class="app-container">
    <!-- 头部导航 -->
    <header class="app-header">
      <div class="header-container">
        <div class="logo">
          <router-link to="/">宠物商城</router-link>
        </div>
        <div class="nav-menu">
          <router-link to="/">首页</router-link>
          <router-link to="/category">商品分类</router-link>
          <router-link to="/community">社区</router-link>
        </div>
      </div>
    </header>
    
    <!-- 内容区域 -->
    <main class="app-main">
      <router-view></router-view>
    </main>
    
    <!-- 简化的页脚 -->
    <footer class="app-footer">
      <div class="footer-container">
        <p>© 2024 宠物商城 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 简化版MainLayout
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo a {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-menu a {
  color: #333;
  text-decoration: none;
  font-size: 16px;
  padding: 5px 0;
}

.app-main {
  flex: 1;
  background-color: #f5f5f5;
  padding: 20px;
}

.app-footer {
  background-color: #f8f8f8;
  padding: 20px 0;
  text-align: center;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 