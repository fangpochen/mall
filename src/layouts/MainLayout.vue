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
          <router-link to="/new">新品上市</router-link>
          <router-link to="/discount">优惠活动</router-link>
        </div>
        <div class="nav-icons">
          <router-link to="/cart" class="icon-item">
            <el-badge :value="cartCount" :hidden="cartCount === 0">
              <el-icon><ShoppingCart /></el-icon>
            </el-badge>
            <span>购物车</span>
          </router-link>
          <router-link to="/user/profile" class="icon-item">
            <el-icon><User /></el-icon>
            <span>个人中心</span>
          </router-link>
        </div>
      </div>
    </header>
    
    <!-- 内容区域 -->
    <main class="app-main">
      <router-view></router-view>
    </main>
    
    <!-- 底部信息 -->
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-links">
          <div class="link-group">
            <h4>购物指南</h4>
            <a href="javascript:;">购物流程</a>
            <a href="javascript:;">会员介绍</a>
            <a href="javascript:;">常见问题</a>
          </div>
          <div class="link-group">
            <h4>配送方式</h4>
            <a href="javascript:;">上门自提</a>
            <a href="javascript:;">211限时达</a>
            <a href="javascript:;">配送服务查询</a>
          </div>
          <div class="link-group">
            <h4>支付方式</h4>
            <a href="javascript:;">货到付款</a>
            <a href="javascript:;">在线支付</a>
            <a href="javascript:;">分期付款</a>
          </div>
          <div class="link-group">
            <h4>售后服务</h4>
            <a href="javascript:;">售后政策</a>
            <a href="javascript:;">价格保护</a>
            <a href="javascript:;">退款说明</a>
          </div>
        </div>
        <div class="footer-copyright">
          <p>© 2024 宠物商城 版权所有</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ShoppingCart, User } from '@element-plus/icons-vue'

// 购物车商品数量
const cartCount = ref(0)

// 获取购物车数量
const getCartCount = () => {
  // TODO: 调用API获取购物车数量
  cartCount.value = 2 // 模拟数据
}

onMounted(() => {
  getCartCount()
})
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
  position: sticky;
  top: 0;
  z-index: 1000;
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

.nav-menu a:hover,
.nav-menu a.router-link-active {
  color: #409EFF;
  border-bottom: 2px solid #409EFF;
}

.nav-icons {
  display: flex;
  gap: 20px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333;
  text-decoration: none;
  font-size: 14px;
}

.icon-item:hover {
  color: #409EFF;
}

.app-main {
  flex: 1;
  background-color: #f5f5f5;
}

.app-footer {
  background-color: #f8f8f8;
  padding: 40px 0;
  margin-top: 50px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-links {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.link-group {
  display: flex;
  flex-direction: column;
}

.link-group h4 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.link-group a {
  color: #666;
  text-decoration: none;
  margin-bottom: 8px;
  font-size: 14px;
}

.link-group a:hover {
  color: #409EFF;
}

.footer-copyright {
  text-align: center;
  color: #999;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style> 