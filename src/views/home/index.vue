<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <div class="nav-header">
      <div class="nav-content">
        <div class="nav-left">
          <router-link to="/" class="logo">宠物商城</router-link>
        </div>
        <div class="nav-center">
          <el-menu mode="horizontal" :router="true" class="nav-menu">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/products">商品分类</el-menu-item>
            <el-menu-item index="/community">社区论坛</el-menu-item>
          </el-menu>
        </div>
        <div class="nav-right">
          <template v-if="!isLoggedIn">
            <el-button type="text" @click="handleLogin">登录</el-button>
            <el-button type="primary" @click="handleRegister">注册</el-button>
          </template>
          <template v-else>
            <el-dropdown @command="handleCommand">
              <span class="user-dropdown">
                <el-avatar :size="32" :src="userInfo.avatar"></el-avatar>
                <span class="username">{{ userInfo.nickname }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                  <el-dropdown-item command="pets">宠物档案</el-dropdown-item>
                  <el-dropdown-item command="orders">我的订单</el-dropdown-item>
                  <el-dropdown-item command="favorites">我的收藏</el-dropdown-item>
                  <el-dropdown-item command="messages">我的消息</el-dropdown-item>
                  <el-dropdown-item command="cart">购物车</el-dropdown-item>
                  <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-badge :value="cartCount" class="cart-badge" v-if="cartCount > 0">
              <el-button type="primary" icon="ShoppingCart" circle @click="$router.push('/cart')"></el-button>
            </el-badge>
            <el-button v-else type="primary" icon="ShoppingCart" circle @click="$router.push('/cart')"></el-button>
          </template>
        </div>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索商品"
        class="search-input"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel height="400px" :interval="5000" arrow="always">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <div class="banner-item">
            <img :src="banner.imageUrl" :alt="banner.title" class="banner-image">
            <div class="banner-content">
              <h2>{{ banner.title }}</h2>
              <p>{{ banner.description }}</p>
              <el-button type="primary" size="large" @click="handleBannerClick(banner)">了解更多</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 分类快捷入口 -->
    <div class="category-section">
      <div class="section-header">
        <h2 class="section-title">商品分类</h2>
      </div>
      <div class="category-list">
        <div v-for="category in categories" :key="category.id" class="category-item" @click="handleCategoryClick(category)">
          <div class="category-icon" :style="{backgroundColor: category.color}">
            <i class="el-icon-shopping"></i>
          </div>
          <span>{{ category.name }}</span>
        </div>
      </div>
    </div>

    <!-- 推荐商品 -->
    <div class="recommend-section">
      <div class="section-header">
        <h2 class="section-title">推荐商品</h2>
        <el-link type="primary" :underline="false" @click="handleViewMore('recommend')">查看更多<el-icon><ArrowRight /></el-icon></el-link>
      </div>
      <el-row :gutter="20">
        <el-col v-for="product in recommendProducts" :key="product.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="product-card" shadow="hover" @click="handleProductClick(product)">
            <div class="product-image-container">
              <img :src="product.imageUrl" :alt="product.name" class="product-image">
              <div class="product-badge" v-if="product.isNew">新品</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-desc">{{ product.description }}</p>
              <div class="product-price-row">
                <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
                <span class="product-sales">已售{{ product.sales }}件</span>
              </div>
              <div class="product-action">
                <el-button type="primary" size="small" @click.stop="handleAddToCart(product)">
                  <el-icon><ShoppingCart /></el-icon>
                  加入购物车
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 热卖商品 -->
    <div class="hot-section">
      <div class="section-header">
        <h2 class="section-title">热卖商品</h2>
        <el-link type="primary" :underline="false" @click="handleViewMore('hot')">查看更多<el-icon><ArrowRight /></el-icon></el-link>
      </div>
      <el-row :gutter="20">
        <el-col v-for="product in hotProducts" :key="product.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="product-card" shadow="hover" @click="handleProductClick(product)">
            <div class="product-image-container">
              <img :src="product.imageUrl" :alt="product.name" class="product-image">
              <div class="product-badge hot" v-if="product.isHot">热卖</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-desc">{{ product.description }}</p>
              <div class="product-price-row">
                <span class="product-price">¥{{ product.price.toFixed(2) }}</span>
                <span class="product-sales">已售{{ product.sales }}件</span>
              </div>
              <div class="product-action">
                <el-button type="primary" size="small" @click.stop="handleAddToCart(product)">
                  <el-icon><ShoppingCart /></el-icon>
                  加入购物车
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ShoppingCart, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const searchKeyword = ref('')

// 用户登录状态
const isLoggedIn = ref(false)
const userInfo = ref({
  nickname: '用户名',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})
const cartCount = ref(0)

// 轮播图数据
const banners = ref([
  {
    id: 1,
    title: '宠物用品新品特惠',
    description: '全场新品八折起，多买多省',
    imageUrl: '/images/banners/banner1.jpg',
    link: '/category/new'
  },
  {
    id: 2,
    title: '精选猫粮专场',
    description: '健康优质猫粮，给爱宠最好的选择',
    imageUrl: '/images/banners/banner2.jpg',
    link: '/category/cat-food'
  },
  {
    id: 3,
    title: '宠物医疗服务',
    description: '专业兽医在线咨询，为爱宠健康保驾护航',
    imageUrl: '/images/banners/banner3.jpg',
    link: '/service'
  }
])

// 分类数据
const categories = ref([
  { id: 1, name: '猫粮', color: '#f56c6c' },
  { id: 2, name: '狗粮', color: '#409eff' },
  { id: 3, name: '玩具', color: '#67c23a' },
  { id: 4, name: '护理', color: '#e6a23c' },
  { id: 5, name: '医疗', color: '#909399' },
  { id: 6, name: '清洁', color: '#9c27b0' }
])

// 推荐商品数据
const recommendProducts = ref([
  {
    id: 1,
    name: '进口猫粮10kg',
    description: '天然无谷物配方，适合所有年龄段猫咪',
    price: 199.00,
    sales: 1234,
    isNew: true,
    imageUrl: '/images/products/cat-food1.jpg'
  },
  {
    id: 2,
    name: '狗狗洗澡露',
    description: '温和配方，不刺激皮肤，香味持久',
    price: 58.00,
    sales: 965,
    isNew: true,
    imageUrl: '/images/products/dog-shampoo.jpg'
  },
  {
    id: 3,
    name: '猫咪爬架',
    description: '多层设计，稳固耐用，满足猫咪攀爬需求',
    price: 299.00,
    sales: 752,
    isNew: false,
    imageUrl: '/images/products/cat-tree.jpg'
  },
  {
    id: 4,
    name: '宠物智能喂食器',
    description: '智能定时定量，手机APP远程控制',
    price: 399.00,
    sales: 521,
    isNew: false,
    imageUrl: '/images/products/pet-feeder.jpg'
  }
])

// 热卖商品数据
const hotProducts = ref([
  {
    id: 5,
    name: '猫咪逗猫棒',
    description: '互动玩具，增进感情，锻炼猫咪敏捷度',
    price: 15.90,
    sales: 2530,
    isHot: true,
    imageUrl: '/images/products/cat-toy.jpg'
  },
  {
    id: 6,
    name: '狗狗磨牙棒',
    description: '耐咬耐磨，有效清洁牙齿，预防牙结石',
    price: 29.90,
    sales: 1892,
    isHot: true,
    imageUrl: '/images/products/dog-bone.jpg'
  },
  {
    id: 7,
    name: '宠物指甲剪',
    description: '安全设计，不伤爪，轻松修剪',
    price: 38.00,
    sales: 1285,
    isHot: true,
    imageUrl: '/images/products/nail-clipper.jpg'
  },
  {
    id: 8,
    name: '猫砂盆',
    description: '全封闭设计，防臭防漏，好清理',
    price: 89.00,
    sales: 1654,
    isHot: false,
    imageUrl: '/images/products/litter-box.jpg'
  }
])

// 事件处理
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  router.push({
    path: '/product/list',
    query: { keyword: searchKeyword.value }
  })
}

const handleBannerClick = (banner) => {
  router.push(banner.link)
}

const handleCategoryClick = (category) => {
  router.push(`/category/${category.id}`)
}

const handleProductClick = (product) => {
  router.push(`/product/${product.id}`)
}

const handleAddToCart = (product) => {
  ElMessage.success(`已添加 ${product.name} 到购物车`)
}

const handleViewMore = (type) => {
  router.push({
    path: '/product/list',
    query: { type }
  })
}

// 登录注册处理
const handleLogin = () => {
  router.push('/login')
}

const handleRegister = () => {
  router.push('/register')
}

// 下拉菜单处理
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'pets':
      router.push('/user/pets')
      break
    case 'orders':
      router.push('/user/orders')
      break
    case 'favorites':
      router.push('/user/favorites')
      break
    case 'messages':
      router.push('/user/messages')
      break
    case 'cart':
      router.push('/cart')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  isLoggedIn.value = false
  ElMessage.success('退出登录成功')
  router.push('/')
}

// 页面加载时检查登录状态
onMounted(() => {
  // TODO: 从后端获取登录状态和用户信息
  // checkLoginStatus()
  // getCartCount()
})
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 0;
}

/* 顶部导航栏样式 */
.nav-header {
  background-color: #fff;
  padding: 10px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left {
  flex: 1;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  text-decoration: none;
}

.nav-center {
  flex: 2;
}

.nav-menu {
  display: flex;
  justify-content: center;
}

.nav-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
}

/* 搜索框样式 */
.search-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  width: 500px;
}

/* 轮播图样式 */
.banner-section {
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.banner-item {
  position: relative;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0,0,0,0.6);
  color: white;
  padding: 20px;
  max-width: 400px;
  border-radius: 8px;
}

.banner-content h2 {
  margin-top: 0;
  font-size: 28px;
  margin-bottom: 10px;
}

.banner-content p {
  margin-bottom: 20px;
  font-size: 16px;
}

/* 分类入口样式 */
.category-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 24px;
  color: #303133;
  position: relative;
  padding-left: 15px;
  margin: 0;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: #409EFF;
  border-radius: 2px;
}

.category-list {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.category-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.3s;
}

.category-item:hover {
  transform: translateY(-5px);
}

.category-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
}

/* 商品卡片样式 */
.product-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #f56c6c;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.product-badge.hot {
  background-color: #e6a23c;
}

.product-info {
  padding: 15px;
}

.product-name {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-desc {
  height: 40px;
  color: #909399;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 15px;
}

.product-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.product-price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.product-sales {
  color: #909399;
  font-size: 12px;
}

.product-action {
  display: flex;
  justify-content: center;
}

/* 导航栏用户相关样式 */
.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 10px;
}

.username {
  margin-left: 8px;
  font-size: 14px;
  color: #606266;
}

.nav-right .el-button {
  margin-left: 10px;
}

.cart-badge {
  margin-left: 15px;
}

.cart-badge :deep(.el-badge__content) {
  background-color: #f56c6c;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .search-input {
    width: 100%;
  }
  
  .category-list {
    flex-wrap: wrap;
  }
  
  .category-item {
    flex: 0 0 33.33%;
    margin-bottom: 15px;
  }
  
  .banner-content {
    left: 20px;
    max-width: 300px;
  }
  
  .banner-content h2 {
    font-size: 20px;
  }
  
  .banner-content p {
    font-size: 14px;
  }

  .nav-content {
    padding: 0 15px;
  }
  
  .nav-center {
    display: none;
  }
  
  .nav-right {
    gap: 8px;
  }
  
  .username {
    display: none;
  }
}
</style> 