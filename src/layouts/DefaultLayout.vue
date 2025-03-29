<template>
  <div class="app-layout">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <router-link to="/">宠物商城</router-link>
        </div>
        
        <nav class="main-nav">
          <ul class="nav-list">
            <li><router-link to="/" :class="{ active: isActive('/') }">首页</router-link></li>
            <li><router-link to="/products" :class="{ active: isActive('/products') }">商品</router-link></li>
            <li><router-link to="/categories" :class="{ active: isActive('/categories') }">分类</router-link></li>
            <li><router-link to="/community" :class="{ active: isActive('/community') }">社区</router-link></li>
          </ul>
        </nav>
        
        <div class="user-area">
          <template v-if="userStore.isLoggedIn">
            <el-badge v-if="cartCount > 0" :value="cartCount" class="cart-badge">
              <el-button 
                type="primary" 
                circle 
                class="cart-btn"
                @click="$router.push('/cart')"
              >
                <el-icon><ShoppingCart /></el-icon>
              </el-button>
            </el-badge>
            <el-button 
              v-else
              type="primary" 
              circle 
              class="cart-btn"
              @click="$router.push('/cart')"
            >
              <el-icon><ShoppingCart /></el-icon>
            </el-button>
            
            <el-dropdown @command="handleUserCommand" trigger="click">
              <div class="user-dropdown">
                <el-avatar 
                  :size="32" 
                  :src="userStore.userInfo?.icon || defaultAvatar"
                />
                <span class="username">{{ userStore.displayName }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                  <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                  <el-dropdown-item command="favorites">我的收藏</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          
          <template v-else-if="userStore.isGuest">
            <div class="guest-mode">
              <el-tag size="small" type="info">访客模式</el-tag>
              <el-button type="primary" link @click="$router.push('/user/login')">
                登录
              </el-button>
            </div>
          </template>
          
          <template v-else>
            <el-button 
              type="primary" 
              link 
              class="login-btn"
              @click="$router.push('/user/login')"
            >
              登录
            </el-button>
            <el-button 
              type="primary" 
              class="register-btn"
              @click="$router.push('/user/register')"
            >
              注册
            </el-button>
          </template>
        </div>
      </div>
    </header>
    
    <!-- 主要内容区 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <div class="footer-section">
            <h4>购物指南</h4>
            <ul>
              <li><a href="#">购物流程</a></li>
              <li><a href="#">会员介绍</a></li>
              <li><a href="#">常见问题</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>配送方式</h4>
            <ul>
              <li><a href="#">上门自提</a></li>
              <li><a href="#">配送服务</a></li>
              <li><a href="#">配送费用</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>支付方式</h4>
            <ul>
              <li><a href="#">在线支付</a></li>
              <li><a href="#">货到付款</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4>售后服务</h4>
            <ul>
              <li><a href="#">退换货政策</a></li>
              <li><a href="#">退款说明</a></li>
              <li><a href="#">联系客服</a></li>
            </ul>
          </div>
        </div>
        
        <div class="copyright">
          <p>© 2024 宠物商城. 版权所有</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ShoppingCart, ArrowDown } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/user';
import { getCartList } from '@/api/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';

// 购物车商品数量
const cartCount = ref(0);

// 检查当前路由是否激活
const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};

// 用户下拉菜单命令处理
const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile');
      break;
    case 'orders':
      router.push('/user/orders');
      break;
    case 'favorites':
      router.push('/user/favorites');
      break;
    case 'logout':
      userStore.logoutAction();
      break;
  }
};

// 获取购物车商品数量
const fetchCartCount = async () => {
  if (userStore.isLoggedIn) {
    try {
      const res = await getCartList();
      if (res.code === 200 && res.data) {
        cartCount.value = Array.isArray(res.data) ? res.data.length : 0;
      }
    } catch (error) {
      console.error('获取购物车数据失败:', error);
    }
  }
};

// 初始化
onMounted(() => {
  fetchCartCount();
});
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  position: sticky;
  top: 0;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  z-index: 100;
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
  font-size: 22px;
  font-weight: bold;
  color: #409EFF;
  text-decoration: none;
}

.main-nav {
  flex: 1;
  margin: 0 40px;
}

.nav-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-right: 25px;
}

.nav-list a {
  color: #606266;
  text-decoration: none;
  font-size: 16px;
  padding: 5px 0;
  position: relative;
}

.nav-list a:hover, 
.nav-list a.active {
  color: #409EFF;
}

.nav-list a.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409EFF;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
}

.username {
  margin: 0 5px;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-badge :deep(.el-badge__content) {
  background-color: #F56C6C;
}

.cart-btn {
  font-size: 18px;
}

.guest-mode {
  display: flex;
  align-items: center;
  gap: 10px;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  background-color: #f5f7fa;
  padding: 40px 0 20px;
  margin-top: 40px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 30px;
}

.footer-section {
  flex: 1;
  min-width: 200px;
  margin-bottom: 20px;
}

.footer-section h4 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #303133;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 10px;
}

.footer-section a {
  color: #606266;
  text-decoration: none;
  font-size: 14px;
}

.footer-section a:hover {
  color: #409EFF;
}

.copyright {
  border-top: 1px solid #E4E7ED;
  padding-top: 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 10px;
  }
  
  .main-nav {
    display: none;
  }
  
  .user-area {
    gap: 10px;
  }
  
  .username {
    display: none;
  }
  
  .footer-section {
    min-width: 140px;
  }
}
</style> 