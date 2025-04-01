<template>
  <div class="main-layout">
    <!-- 头部导航 -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <router-link to="/">宠物商城</router-link>
        </div>
        <div class="nav">
          <router-link to="/home" class="nav-link" :class="{ active: $route.path === '/home' }">首页</router-link>
          <router-link to="/products" class="nav-link" :class="{ active: $route.path === '/products' }">商品列表</router-link>
          <router-link to="/community" class="nav-link" :class="{ active: $route.path === '/community' }">社区论坛</router-link>
        </div>
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
        <div class="user-actions">
          <router-link v-if="!isLoggedIn" to="/login" class="login-btn">登录</router-link>
          <router-link v-if="!isLoggedIn" to="/register" class="register-btn">注册</router-link>
          <div v-else class="user-dropdown">
            <el-dropdown>
              <span class="user-info">
                {{ userName }}
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <router-link to="/user/profile">个人资料</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link to="/user/pet">宠物档案</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link to="/order">我的订单</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link to="/user/favorites">我的收藏</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <router-link to="/user/messages">我的消息</router-link>
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="notification-icon">
            <router-link to="/user/messages">
              <el-badge :value="9" class="notification-badge">
                <el-icon><ChatDotRound /></el-icon>
              </el-badge>
            </router-link>
          </div>
          <div class="cart-icon">
            <router-link to="/cart">
              <el-badge :value="cartCount" :hidden="cartCount === 0">
                <el-icon><ShoppingCart /></el-icon>
              </el-badge>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-links">
          <div class="footer-section">
            <h3>帮助中心</h3>
            <ul>
              <li><a href="#">购物指南</a></li>
              <li><a href="#">支付方式</a></li>
              <li><a href="#">配送方式</a></li>
              <li><a href="#">常见问题</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>关于我们</h3>
            <ul>
              <li><a href="#">公司简介</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">加入我们</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>商家服务</h3>
            <ul>
              <li><a href="#">商家入驻</a></li>
              <li><a href="#">商家中心</a></li>
              <li><a href="#">运营服务</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>关注我们</h3>
            <div class="social-links">
              <a href="#"><el-icon><Promotion /></el-icon></a>
              <a href="#"><el-icon><ChatDotRound /></el-icon></a>
              <a href="#"><el-icon><Share /></el-icon></a>
            </div>
          </div>
        </div>
        <div class="copyright">
          © {{ new Date().getFullYear() }} 宠物商城 版权所有
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ShoppingCart, ArrowDown, Promotion, ChatDotRound, Share } from '@element-plus/icons-vue'

const router = useRouter()
const searchKeyword = ref('')
const cartCount = ref(0)

// 判断用户是否登录
const isLoggedIn = computed(() => {
  return localStorage.getItem('token') !== null
})

// 获取用户名
const userName = computed(() => {
  return localStorage.getItem('userName') || '用户'
})

/**
 * 处理搜索商品
 */
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/products',
      query: { keyword: searchKeyword.value }
    })
    searchKeyword.value = ''
  }
}

/**
 * 处理退出登录
 */
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  router.push('/login')
}

/**
 * 获取购物车数量
 */
const fetchCartCount = () => {
  // 模拟从服务器获取购物车数量
  if (isLoggedIn.value) {
    // 这里应该是一个API调用
    cartCount.value = Math.floor(Math.random() * 10)
  } else {
    cartCount.value = 0
  }
}

onMounted(() => {
  fetchCartCount()
})
</script>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header {
  background: linear-gradient(135deg, #7952b3, #6840a0);
  color: white;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  
  a {
    color: white;
    text-decoration: none;
  }
}

.nav {
  display: flex;
  gap: 1rem;
  
  .nav-link {
    color: white;
    text-decoration: none;
    padding: 8px 16px;
    font-weight: 500;
    position: relative;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    
    &.active:after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 16px;
      right: 16px;
      height: 2px;
      background: #ffffff;
    }
  }
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .login-btn,
  .register-btn {
    color: white;
    text-decoration: none;
    padding: 5px 15px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .login-btn {
    background-color: transparent;
    border: 1px solid white;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
  
  .register-btn {
    background-color: #ff4757;
    
    &:hover {
      background-color: #ff5e69;
    }
  }
  
  .notification-icon,
  .cart-icon {
    position: relative;
    font-size: 1.25rem;
    cursor: pointer;
    
    a {
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
  
  .notification-badge {
    :deep(.el-badge__content) {
      background-color: #ff4757;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
      transform: scale(1);
      animation: pulse 2s infinite;
    }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  .user-dropdown {
    .user-info {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      color: white;
    }
  }
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

.footer {
  background-color: #f5f5f5;
  padding: 40px 0 20px;
  margin-top: auto;
  
  .footer-links {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    
    .footer-section {
      h3 {
        font-size: 18px;
        margin-bottom: 15px;
        color: #333;
      }
      
      ul {
        list-style: none;
        padding: 0;
        
        li {
          margin-bottom: 10px;
          
          a {
            color: #666;
            text-decoration: none;
            
            &:hover {
              color: #7e57c2;
            }
          }
        }
      }
      
      .social-links {
        display: flex;
        gap: 15px;
        
        a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: #e0e0e0;
          border-radius: 50%;
          color: #666;
          transition: all 0.3s;
          
          &:hover {
            background-color: #7e57c2;
            color: #fff;
          }
        }
      }
    }
  }
  
  .copyright {
    text-align: center;
    color: #999;
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
    font-size: 14px;
  }
}
</style> 