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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ShoppingCart, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { ProductInfo } from '@/api/product'
import type { BannerInfo, CategoryInfo } from '@/api/home'
import { getBannerList, getCategoryList, getRecommendProducts } from '@/api/home'

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
const carouselList = ref<BannerInfo[]>([
  {
    id: 1,
    imgUrl: '/images/banner/banner1.jpg',
    link: '/product/1',
    sort: 1
  },
  {
    id: 2,
    imgUrl: '/images/banner/banner2.jpg',
    link: '/product/2',
    sort: 2
  },
  {
    id: 3,
    imgUrl: '/images/banner/banner3.jpg',
    link: '/product/3',
    sort: 3
  }
])

// 分类数据
const categoryList = ref<CategoryInfo[]>([
  { id: 1, name: '猫粮', iconClass: 'icon-cat-food', sort: 1 },
  { id: 2, name: '狗粮', iconClass: 'icon-dog-food', sort: 2 },
  { id: 3, name: '玩具', iconClass: 'icon-toy', sort: 3 },
  { id: 4, name: '护理', iconClass: 'icon-care', sort: 4 },
  { id: 5, name: '医疗', iconClass: 'icon-medical', sort: 5 },
  { id: 6, name: '清洁', iconClass: 'icon-clean', sort: 6 }
])

// 推荐商品数据
const recommendList = ref<ProductInfo[]>([])
const loading = ref(false)

// 获取轮播图数据
const getBanners = async () => {
  try {
    const res = await getBannerList()
    carouselList.value = res.data
  } catch (error) {
    console.error('获取轮播图失败:', error)
  }
}

// 获取分类数据
const getCategories = async () => {
  try {
    const res = await getCategoryList()
    categoryList.value = res.data
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

// 获取推荐商品列表
const getRecommendList = async () => {
  try {
    loading.value = true
    const res = await getRecommendProducts()
    recommendList.value = res.data
  } catch (error) {
    console.error('获取推荐商品失败:', error)
    ElMessage.error('获取推荐商品失败')
  } finally {
    loading.value = false
  }
}

// 初始化数据
const initData = async () => {
  await Promise.all([
    getBanners(),
    getCategories(),
    getRecommendList()
  ])
}

onMounted(() => {
  initData()
})

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