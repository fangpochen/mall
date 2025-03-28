<template>
  <div class="home-container">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ShoppingCart, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const searchKeyword = ref('')

// 轮播图数据
const banners = ref([
  {
    id: 1,
    title: '宠物用品新品特惠',
    description: '全场新品八折起，多买多省',
    imageUrl: 'https://img2.baidu.com/it/u=1576561052,2344850446&fm=253&fmt=auto&app=138&f=JPEG?w=1180&h=500',
    link: '/category/new'
  },
  {
    id: 2,
    title: '精选猫粮专场',
    description: '健康优质猫粮，给爱宠最好的选择',
    imageUrl: 'https://img1.baidu.com/it/u=2361628334,2482205648&fm=253&fmt=auto&app=138&f=JPEG?w=1000&h=500',
    link: '/category/cat-food'
  },
  {
    id: 3,
    title: '宠物医疗服务',
    description: '专业兽医在线咨询，为爱宠健康保驾护航',
    imageUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.hhsc.site%2Fwp-content%2Fuploads%2F2020%2F06%2F7.jpg&refer=http%3A%2F%2Fwww.hhsc.site&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1713597709&t=c9d6318fdd2b4ba3c7e8a5bf8d66a0a5',
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
    imageUrl: 'https://img0.baidu.com/it/u=1820520028,3412001317&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
  },
  {
    id: 2,
    name: '狗狗洗澡露',
    description: '温和配方，不刺激皮肤，香味持久',
    price: 58.00,
    sales: 965,
    isNew: true,
    imageUrl: 'https://img2.baidu.com/it/u=1652754868,2594800513&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
  },
  {
    id: 3,
    name: '猫咪爬架',
    description: '多层设计，稳固耐用，满足猫咪攀爬需求',
    price: 299.00,
    sales: 752,
    isNew: false,
    imageUrl: 'https://img0.baidu.com/it/u=2731124371,2172906173&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
  },
  {
    id: 4,
    name: '宠物智能喂食器',
    description: '智能定时定量，手机APP远程控制',
    price: 399.00,
    sales: 521,
    isNew: false,
    imageUrl: 'https://img0.baidu.com/it/u=4054409821,1781854245&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
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
    imageUrl: 'https://img1.baidu.com/it/u=3021883720,1528492552&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
  },
  {
    id: 6,
    name: '狗狗磨牙棒',
    description: '耐咬耐磨，有效清洁牙齿，预防牙结石',
    price: 29.90,
    sales: 1892,
    isHot: true,
    imageUrl: 'https://img1.baidu.com/it/u=1663577596,2267039039&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
  },
  {
    id: 7,
    name: '宠物指甲剪',
    description: '安全设计，不伤爪，轻松修剪',
    price: 38.00,
    sales: 1285,
    isHot: true,
    imageUrl: 'https://img0.baidu.com/it/u=780548818,3728889984&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
  },
  {
    id: 8,
    name: '猫砂盆',
    description: '全封闭设计，防臭防漏，好清理',
    price: 89.00,
    sales: 1654,
    isHot: false,
    imageUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.alicdn.com%2Fbao%2Fuploaded%2Fi3%2F1664456115%2FO1CN01bLPQqZ1uIOIYhHnkv_%21%210-item_pic.jpg&refer=http%3A%2F%2Fimg.alicdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1713597814&t=a48e47ed32d94e05dc9889303dd6dccd'
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
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
}
</style> 