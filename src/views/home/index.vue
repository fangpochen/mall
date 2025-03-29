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
      
      <!-- 服务状态提示 -->
      <div v-if="!serverStatus.isOnline" class="server-status-alert">
        <el-alert
          title="后端服务暂不可用，已切换到访客模式"
          type="warning"
          :closable="false"
          show-icon
        >
          <template #default>
            <div class="status-content">
              <span>部分功能可能不可用。</span>
              <el-button type="primary" size="small" @click="checkServerStatus">重试连接</el-button>
            </div>
          </template>
        </el-alert>
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
      <el-carousel :interval="4000" type="card" height="280px" class="home-carousel" indicator-position="outside" :autoplay="true">
        <el-carousel-item v-for="banner in bannerList" :key="banner.id">
          <div class="carousel-content" @click="handleBannerClick(banner)">
            <img :src="banner.pic || banner.imgUrl || banner.img || banner.image || ''" class="carousel-image" :alt="banner.name || banner.title || 'Banner'">
            <div class="carousel-title" v-if="banner.name || banner.title">{{ banner.name || banner.title }}</div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 分类快捷入口 -->
    <div class="category-section">
      <div class="section-header">
        <h2 class="section-title">商品分类</h2>
      </div>
      <div v-loading="categoryLoading">
        <el-empty v-if="categories.length === 0 && !categoryLoading" description="暂无分类数据"></el-empty>
        <div class="category-list" v-else>
          <div v-for="category in categories" :key="category.id" class="category-item" @click="handleCategoryClick(category)">
            <div class="category-icon">
              <el-icon>
                <component :is="category.icon || 'ShoppingBag'" />
              </el-icon>
            </div>
            <div class="category-name">{{ category.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐商品 -->
    <div class="recommend-section">
      <div class="section-header">
        <h2 class="section-title">推荐商品</h2>
        <el-link type="primary" :underline="false" @click="handleViewMore('recommend')">查看更多<el-icon><ArrowRight /></el-icon></el-link>
      </div>
      <el-row :gutter="20" v-loading="loading">
        <el-empty v-if="recommendList.length === 0 && !loading" description="暂无推荐商品"></el-empty>
        <el-col v-for="product in recommendList" :key="product.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="product-card" shadow="hover" @click="handleProductClick(product)">
            <div class="product-image-container">
              <img :src="product.pic || product.imgUrl || product.img || product.albumPics || product.image || ''" :alt="product.name" class="product-image">
              <div class="product-badge" v-if="product.isNew || product.newStatus === 1">新品</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-desc">{{ product.description || product.subtitle || product.subTitle || '' }}</p>
              <div class="product-price-row">
                <span class="product-price">¥{{ (product.price || product.originalPrice || 0).toFixed(2) }}</span>
                <span class="product-sales">{{ product.stock ? `库存：${product.stock}` : (product.sale ? `销量：${product.sale}` : '') }}</span>
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
      <el-row :gutter="20" v-loading="hotLoading">
        <el-empty v-if="hotProducts.length === 0 && !hotLoading" description="暂无热卖商品"></el-empty>
        <el-col v-for="product in hotProducts" :key="product.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="product-card" shadow="hover" @click="handleProductClick(product)">
            <div class="product-image-container">
              <img :src="product.pic || product.imgUrl || product.img || ''" :alt="product.name" class="product-image">
              <div class="product-badge hot" v-if="product.isHot">热卖</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-desc">{{ product.description || product.subtitle || '' }}</p>
              <div class="product-price-row">
                <span class="product-price">¥{{ (product.price || 0).toFixed(2) }}</span>
                <span class="product-sales">库存：{{ product.stock || 0 }}</span>
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

    <!-- 调试按钮 -->
    <div class="debug-section">
      <el-button type="primary" @click="toggleDebugMode">调试面板</el-button>
      
      <div class="api-test-area">
        <el-input v-model="apiTestUrl" placeholder="输入API地址" class="api-test-input"></el-input>
        <el-button type="success" @click="testApi" :loading="apiTestLoading">测试API</el-button>
      </div>
    </div>

    <!-- 调试数据对话框 -->
    <el-dialog
      v-model="debugMode"
      title="调试数据"
      width="80%"
      :before-close="closeDebugDialog"
    >
      <div class="debug-content">
        <div class="debug-item">
          <h3>轮播图数据</h3>
          <pre>{{ debugData.banners }}</pre>
        </div>
        <div class="debug-item">
          <h3>分类数据</h3>
          <pre>{{ debugData.categories }}</pre>
        </div>
        <div class="debug-item">
          <h3>推荐商品数据</h3>
          <pre>{{ debugData.recommendProducts }}</pre>
        </div>
        <div class="debug-item">
          <h3>热卖商品数据</h3>
          <pre>{{ debugData.hotProducts }}</pre>
        </div>
        <div class="debug-item">
          <h3>API测试结果</h3>
          <pre>{{ debugData.apiTest }}</pre>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ShoppingCart, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage, ElDialog, ElMessageBox } from 'element-plus'
import type { ProductInfo } from '@/api/product'
import type { BannerInfo, CategoryInfo } from '@/api/home'
import { getBannerList, getCategoryList, getRecommendProducts, getHotProducts, getHomeContent, getRecommendProductList, getHotProductList, getNewProductList } from '@/api/home'
import { getProductCategories } from '@/api/product'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

// 用户登录状态
const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo || {})
const cartCount = ref(0)

// 搜索关键词
const searchKeyword = ref('')

// 页面加载状态
const loading = ref(false)
const hotLoading = ref(false)
const categoryLoading = ref(false)

// 轮播图数据
const bannerList = ref<BannerInfo[]>([])

// 分类数据
const categories = ref<CategoryInfo[]>([])

// 推荐商品数据
const recommendList = ref<ProductInfo[]>([])

// 热卖商品数据
const hotProducts = ref<ProductInfo[]>([])

// 新商品数据
const newProducts = ref<ProductInfo[]>([])

// 添加调试状态
const debugMode = ref(false)
const debugData = reactive({
  banners: '',
  categories: '',
  recommendProducts: '',
  hotProducts: '',
  apiTest: null
})

// 添加API测试相关
const apiTestUrl = ref('')
const apiTestResult = ref(null)
const apiTestLoading = ref(false)

// 添加服务状态检测
const serverStatus = reactive({
  isOnline: true,
  lastCheck: null,
  checkCount: 0
})

// 获取首页内容
const fetchHomeContent = async () => {
  loading.value = true
  try {
    const res = await getHomeContent()
    if (res.code === 200 && res.data) {
      // 轮播图数据
      bannerList.value = res.data.advertiseList || []
      
      // 新品推荐
      newProducts.value = res.data.newProductList || []
      
      // 热卖商品
      hotProducts.value = res.data.hotProductList || []
      
      // 如果后端有返回推荐商品，则使用后端数据
      if (res.data.recommendProductList && res.data.recommendProductList.length > 0) {
        recommendList.value = res.data.recommendProductList
      } else {
        // 否则单独获取推荐商品
        fetchRecommendProducts()
      }
      
      serverStatus.isOnline = true
    }
  } catch (error) {
    console.error('获取首页内容失败', error)
    serverStatus.isOnline = false
    ElMessage.warning('获取首页内容失败，已切换到模拟数据')
    // 加载模拟数据
    loadMockData()
  } finally {
    loading.value = false
  }
}

// 单独获取推荐商品
const fetchRecommendProducts = async () => {
  try {
    const res = await getRecommendProductList(4, 1)
    if (res.code === 200 && res.data) {
      recommendList.value = res.data
    }
  } catch (error) {
    console.error('获取推荐商品失败', error)
  }
}

// 获取热卖商品
const fetchHotProducts = async () => {
  hotLoading.value = true
  try {
    const res = await getHotProductList(1, 4)
    if (res.code === 200 && res.data) {
      hotProducts.value = res.data
    }
  } catch (error) {
    console.error('获取热卖商品失败', error)
  } finally {
    hotLoading.value = false
  }
}

// 获取分类信息
const fetchCategories = async () => {
  categoryLoading.value = true
  try {
    const res = await getProductCategories(0) // 获取一级分类
    if (res.code === 200 && res.data) {
      categories.value = res.data
    }
  } catch (error) {
    console.error('获取分类失败', error)
    // 加载模拟分类数据
    categories.value = [
      { id: 1, name: '猫咪用品', icon: 'Goods' },
      { id: 2, name: '狗狗用品', icon: 'Goods' },
      { id: 3, name: '小宠用品', icon: 'Goods' },
      { id: 4, name: '宠物零食', icon: 'Food' },
      { id: 5, name: '医疗保健', icon: 'FirstAid' },
      { id: 6, name: '清洁护理', icon: 'Brush' }
    ]
  } finally {
    categoryLoading.value = false
  }
}

// 加载模拟数据（当后端服务不可用时）
const loadMockData = () => {
  // 模拟轮播图
  bannerList.value = [
    { id: 1, pic: '/mock/banner1.jpg', name: '宠物主粮大促', link: '/products?category=1' },
    { id: 2, pic: '/mock/banner2.jpg', name: '猫咪玩具特惠', link: '/products?category=3' },
    { id: 3, pic: '/mock/banner3.jpg', name: '狗狗零食专场', link: '/products?category=4' }
  ]
  
  // 模拟推荐商品
  recommendList.value = [
    { id: 101, name: '猫咪主粮10kg', pic: '/mock/product1.jpg', price: 199, description: '天然无谷物配方，适合所有年龄段猫咪', stock: 100 },
    { id: 102, name: '狗狗沐浴露', pic: '/mock/product2.jpg', price: 58, description: '温和配方，不刺激皮肤，香味持久', stock: 200 },
    { id: 103, name: '宠物智能喂食器', pic: '/mock/product3.jpg', price: 358, description: '定时定量，远程操控，让喂养更科学', stock: 50 },
    { id: 104, name: '猫咪爬架', pic: '/mock/product4.jpg', price: 299, description: '多层设计，稳固耐用，满足猫咪攀爬需求', stock: 30 }
  ]
  
  // 模拟热卖商品
  hotProducts.value = [
    { id: 201, name: '狗狗磨牙骨', pic: '/mock/product5.jpg', price: 29.9, description: '健康美味，清洁牙齿', stock: 300, isHot: true },
    { id: 202, name: '猫砂盆全套', pic: '/mock/product6.jpg', price: 138, description: '全封闭设计，防臭防溅', stock: 80, isHot: true },
    { id: 203, name: '宠物尿片100片', pic: '/mock/product7.jpg', price: 69, description: '超强吸水，干爽透气', stock: 500, isHot: true },
    { id: 204, name: '猫咪逗猫棒', pic: '/mock/product8.jpg', price: 19.9, description: '互动玩具，增进感情', stock: 200, isHot: true }
  ]
}

// 检查服务器状态
const checkServerStatus = async () => {
  try {
    serverStatus.checkCount++
    const res = await getHomeContent()
    if (res.code === 200) {
      serverStatus.isOnline = true
      serverStatus.lastCheck = new Date().toLocaleString()
      ElMessage.success('连接服务器成功')
      // 重新加载数据
      fetchHomeContent()
    } else {
      serverStatus.isOnline = false
      ElMessage.warning('服务器响应异常')
    }
  } catch (error) {
    console.error('检查服务器状态失败', error)
    serverStatus.isOnline = false
    ElMessage.error('无法连接到服务器')
  }
}

// 事件处理
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  router.push({
    path: '/products',
    query: { keyword: searchKeyword.value }
  })
}

const handleBannerClick = (banner: BannerInfo) => {
  if (banner.link) {
    router.push(banner.link)
  }
}

const handleCategoryClick = (category: CategoryInfo) => {
  router.push({
    path: '/products',
    query: { categoryId: category.id }
  })
}

const handleProductClick = (product) => {
  router.push(`/product/${product.id}`)
}

const handleAddToCart = async (product) => {
  if (!isLoggedIn.value) {
    ElMessageBox.confirm('请先登录后再添加商品到购物车', '提示', {
      confirmButtonText: '去登录',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      router.push({
        path: '/login',
        query: { redirect: router.currentRoute.value.fullPath }
      })
    }).catch(() => {})
    return
  }
  
  // 添加到购物车的逻辑
  try {
    // 后续实现添加到购物车的API调用
    ElMessage.success('成功添加到购物车')
  } catch (error) {
    console.error('添加到购物车失败', error)
    ElMessage.error('添加到购物车失败')
  }
}

const handleViewMore = (type) => {
  switch (type) {
    case 'recommend':
      router.push('/products?isRecommend=1')
      break
    case 'hot':
      router.push('/products?isHot=1')
      break
    case 'new':
      router.push('/products?isNew=1')
      break
    default:
      router.push('/products')
  }
}

// 登录注册处理
const handleLogin = () => {
  router.push({
    path: '/login',
    query: { redirect: router.currentRoute.value.fullPath }
  })
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
      router.push('/order/list')
      break
    case 'favorites':
      router.push('/member/collection')
      break
    case 'messages':
      router.push('/message/list')
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
  userStore.logout()
  ElMessage.success('退出登录成功')
  router.push('/')
}

// 添加调试相关组件到template
const toggleDebugMode = () => {
  debugMode.value = !debugMode.value
  if (debugMode.value) {
    // 更新调试数据
    debugData.banners = JSON.stringify(bannerList.value, null, 2)
    debugData.recommendProducts = JSON.stringify(recommendList.value, null, 2)
    debugData.hotProducts = JSON.stringify(hotProducts.value, null, 2)
    debugData.categories = JSON.stringify(categories.value, null, 2)
  }
}

const closeDebugDialog = () => {
  debugMode.value = false
}

// 添加API测试相关
const testApi = async () => {
  if (!apiTestUrl.value) {
    ElMessage.warning('请输入API地址')
    return
  }
  
  apiTestLoading.value = true
  try {
    // 这里可以实现API测试逻辑
    ElMessage.info('API测试功能待实现')
  } catch (error) {
    console.error('API测试失败', error)
    ElMessage.error('API测试失败')
  } finally {
    apiTestLoading.value = false
  }
}

onMounted(() => {
  // 获取首页内容（包含轮播图、推荐商品等）
  fetchHomeContent()
  
  // 获取分类信息
  fetchCategories()
  
  // 如果用户已登录，获取购物车数量
  if (isLoggedIn.value) {
    // TODO: 获取购物车数量
  }
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

.carousel-content {
  position: relative;
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-title {
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

.carousel-title h2 {
  margin-top: 0;
  font-size: 28px;
  margin-bottom: 10px;
}

.carousel-title p {
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
  
  .carousel-title {
    left: 20px;
    max-width: 300px;
  }
  
  .carousel-title h2 {
    font-size: 20px;
  }
  
  .carousel-title p {
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

/* 调试样式 */
.debug-content {
  max-height: 600px;
  overflow-y: auto;
}

.debug-item {
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

.debug-item h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #409EFF;
}

.debug-item pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 200px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}

.debug-section {
  margin-top: 30px;
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.api-test-area {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.api-test-input {
  flex-grow: 1;
}

.server-status-alert {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 999;
}

.status-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 