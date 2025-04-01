<template>
  <div class="home-page">
    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel height="400px">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <img :src="banner.imgUrl" :alt="banner.title" class="banner-img" />
          <div class="banner-content">
            <h2>{{ banner.title }}</h2>
            <p>{{ banner.description }}</p>
            <el-button type="primary" @click="goToLink(banner.link)">{{ banner.buttonText }}</el-button>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 商品分类 -->
    <div class="category-section container">
      <div class="category-title">
        <h2>商品分类</h2>
      </div>
      <div class="category-list">
        <div v-for="category in categories" :key="category.id" class="category-item" @click="goToCategory(category.id)">
          <div class="category-icon" :style="{ backgroundColor: category.bgColor }">
            <el-icon><component :is="category.icon" /></el-icon>
          </div>
          <div class="category-name">{{ category.name }}</div>
        </div>
      </div>
    </div>

    <!-- 推荐商品 -->
    <div class="recommended-section container">
      <div class="section-header">
        <h2>推荐商品</h2>
        <router-link to="/products" class="view-more">查看更多 <el-icon><ArrowRight /></el-icon></router-link>
      </div>
      <div class="product-list">
        <div v-for="product in recommendedProducts" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="product.imageUrl" :alt="product.name" />
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
            <div class="product-sales">已售 {{ product.sales }}+</div>
          </div>
          <div class="product-actions">
            <el-button type="primary" size="small" @click="goToDetail(product.id)">查看详情</el-button>
            <el-button size="small" @click="addToCart(product.id)">加入购物车</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 特价商品 -->
    <div class="special-section container">
      <div class="section-header">
        <h2>特价商品</h2>
        <router-link to="/products?special=true" class="view-more">查看更多 <el-icon><ArrowRight /></el-icon></router-link>
      </div>
      <div class="product-list">
        <div v-for="product in specialProducts" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="product.imageUrl" :alt="product.name" />
            <div class="product-tag">特价</div>
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">
              <span class="current-price">¥{{ product.price.toFixed(2) }}</span>
              <span class="original-price">¥{{ product.originalPrice.toFixed(2) }}</span>
            </div>
            <div class="product-sales">已售 {{ product.sales }}+</div>
          </div>
          <div class="product-actions">
            <el-button type="primary" size="small" @click="goToDetail(product.id)">查看详情</el-button>
            <el-button size="small" @click="addToCart(product.id)">加入购物车</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 宠物科普 -->
    <div class="pet-guide-section container">
      <div class="section-header">
        <h2>宠物科普</h2>
        <router-link to="/community" class="view-more">更多内容 <el-icon><ArrowRight /></el-icon></router-link>
      </div>
      <div class="article-list">
        <div v-for="article in articles" :key="article.id" class="article-card">
          <div class="article-image">
            <img :src="article.coverUrl" :alt="article.title" />
          </div>
          <div class="article-info">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-meta">
              <span class="article-author">{{ article.author }}</span>
              <span class="article-time">{{ article.publishTime }}</span>
              <span class="article-views">{{ article.views }} 浏览</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载中状态 -->
    <div v-if="loading" class="loading-container">
      <el-loading :fullscreen="true" text="加载中..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Promotion, ShoppingBag, Box, Star, Goods, Food, Trophy, Briefcase } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import homeApi from '../../api/home'
import productApi from '../../api/product'
import cartApi from '../../api/cart'
import type { HomeContentResult, Product, ProductCategory } from '../../api/index.d'

const router = useRouter()
const loading = ref(false)

// 轮播图数据
const banners = ref([
  {
    imgUrl: 'https://picsum.photos/1200/400?random=1',
    title: '宠物用品新品特惠',
    description: '全场新品八折起，多买多省',
    buttonText: '立即抢购',
    link: '/products?tag=new'
  },
  {
    imgUrl: 'https://picsum.photos/1200/400?random=2',
    title: '比瑞吉天然狗粮',
    description: '尊重天然习性，健康喂养爱宠',
    buttonText: '了解更多',
    link: '/product/101'
  },
  {
    imgUrl: 'https://picsum.photos/1200/400?random=3',
    title: '宠物医疗服务',
    description: '专业兽医团队，呵护爱宠健康',
    buttonText: '预约服务',
    link: '/service'
  }
])

// 将静态商品分类改为空数组，后续从API获取
const categories = ref<any[]>([])

// 推荐商品
const recommendedProducts = ref<any[]>([])
// 特价商品
const specialProducts = ref<any[]>([])
// 宠物科普文章
const articles = ref([
  {
    id: 1,
    title: '如何选择适合自家猫咪的猫粮',
    summary: '猫粮的选择要根据猫咪的年龄、体重、活动量等因素来确定，本文将为您详细介绍...',
    author: '宠物营养师小王',
    publishTime: '2023-05-20',
    views: 15362,
    coverUrl: 'https://picsum.photos/300/200?random=1'
  },
  {
    id: 2,
    title: '狗狗常见皮肤病的预防与治疗',
    summary: '狗狗皮肤病是常见的健康问题，本文介绍几种常见皮肤病的症状、原因及预防方法...',
    author: '宠物医生小李',
    publishTime: '2023-05-15',
    views: 12893,
    coverUrl: 'https://picsum.photos/300/200?random=2'
  },
  {
    id: 3,
    title: '新手铲屎官必备的养猫知识',
    summary: '第一次养猫需要准备什么？日常护理有哪些要点？本文为新手铲屎官提供全面指南...',
    author: '资深猫奴大熊',
    publishTime: '2023-05-10',
    views: 20152,
    coverUrl: 'https://picsum.photos/300/200?random=3'
  }
])

/**
 * 跳转到链接
 * @param link 链接地址
 */
const goToLink = (link: string) => {
  router.push(link)
}

/**
 * 跳转到分类页面
 * @param categoryId 分类ID
 */
const goToCategory = (categoryId: number) => {
  router.push({
    path: '/products',
    query: { category: categoryId.toString() }
  })
}

/**
 * 跳转到商品详情页
 * @param productId 商品ID
 */
const goToDetail = (productId: number) => {
  router.push(`/product/${productId}`)
}

/**
 * 添加商品到购物车
 * @param productId 商品ID
 */
const addToCart = async (productId: number) => {
  try {
    const result = await cartApi.addToCart({
      productId,
      quantity: 1
    })
    
    if (result.code === 200) {
      ElMessage.success('已添加到购物车')
    } else {
      ElMessage.error(result.message || '添加失败')
    }
  } catch (error) {
    console.error('添加到购物车失败', error)
    ElMessage.error('添加失败，请稍后重试')
  }
}

/**
 * 转换后端商品数据为前端展示数据
 * @param products 后端商品数据
 * @returns 前端展示数据
 */
const transformProductData = (products: Product[]) => {
  return products.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    originalPrice: item.originalPrice || (item.price * 1.2),
    sales: item.sale || 0,
    imageUrl: item.pic || `https://picsum.photos/200/200?random=${item.id}`
  }))
}

/**
 * 获取首页数据
 */
const fetchHomeData = async () => {
  loading.value = true
  try {
    // 获取首页内容数据
    const result = await homeApi.getHomeContent()
    if (result.code === 200) {
      const data: HomeContentResult = result.data
      
      // 轮播广告
      if (data.advertiseList && data.advertiseList.length > 0) {
        banners.value = data.advertiseList.map(item => ({
          imgUrl: item.pic || 'https://picsum.photos/1200/400?random=1',
          title: item.name,
          description: item.note || '精选商品，品质保障',
          buttonText: '立即抢购',
          link: item.url || '/products'
        }))
      }
      
      // 推荐商品（使用人气推荐）
      if (data.hotProductList && data.hotProductList.length > 0) {
        recommendedProducts.value = transformProductData(data.hotProductList)
      } else {
        // 如果没有数据，需要额外调用推荐商品接口
        const recommendResult = await homeApi.getRecommendProductList({ pageSize: 4, pageNum: 1 })
        if (recommendResult.code === 200) {
          recommendedProducts.value = transformProductData(recommendResult.data)
        }
      }
      
      // 特价商品（使用新品推荐，因为没有特价商品API）
      if (data.newProductList && data.newProductList.length > 0) {
        specialProducts.value = transformProductData(data.newProductList)
      } else {
        // 额外获取新品推荐
        const newProductResult = await homeApi.getNewProductList({ pageSize: 4, pageNum: 1 })
        if (newProductResult.code === 200) {
          specialProducts.value = transformProductData(newProductResult.data)
        }
      }

      // 获取商品分类
      await fetchCategories()
    } else {
      // 如果获取首页内容失败，则分别调用API获取数据
      await fetchRecommendProducts()
      await fetchSpecialProducts()
      await fetchCategories() // 获取商品分类
    }
  } catch (error) {
    console.error('获取首页数据失败', error)
    ElMessage.error('获取数据失败，请稍后重试')
    // 出错时使用默认的静态数据
    await fetchDefaultData()
  } finally {
    loading.value = false
  }
}

/**
 * 获取推荐商品数据
 */
const fetchRecommendProducts = async () => {
  try {
    const result = await homeApi.getHotProductList({ pageSize: 4, pageNum: 1 })
    if (result.code === 200) {
      recommendedProducts.value = transformProductData(result.data)
    }
  } catch (error) {
    console.error('获取推荐商品失败', error)
  }
}

/**
 * 获取特价商品数据
 */
const fetchSpecialProducts = async () => {
  try {
    const result = await homeApi.getNewProductList({ pageSize: 4, pageNum: 1 })
    if (result.code === 200) {
      specialProducts.value = transformProductData(result.data)
    }
  } catch (error) {
    console.error('获取特价商品失败', error)
  }
}

/**
 * 获取商品分类数据
 */
const fetchCategories = async () => {
  try {
    // 调用商品分类API
    const result = await productApi.getCategoryTreeList()
    if (result.code === 200 && result.data && result.data.length > 0) {
      // 获取一级分类作为首页分类展示
      const firstLevelCategories = result.data.slice(0, 6) // 最多取6个
      
      // 为分类定义背景颜色和图标
      const bgColors = ['#FFD0D0', '#D0E6FF', '#D0FFDB', '#F1D0FF', '#FFE8D0', '#D0FAFF']
      const icons = ['Food', 'Food', 'Goods', 'Star', 'Briefcase', 'Box']
      
      categories.value = firstLevelCategories.map((item: any, index: number) => {
        // 根据分类名称智能选择图标
        let icon = icons[index % icons.length]
        if (item.name.includes('猫') || item.name.includes('狗') || item.name.includes('粮')) {
          icon = 'Food'
        } else if (item.name.includes('玩具')) {
          icon = 'Goods'
        } else if (item.name.includes('护理')) {
          icon = 'Star'
        } else if (item.name.includes('医')) {
          icon = 'Briefcase'
        } else if (item.name.includes('清洁')) {
          icon = 'Box'
        }
        
        return {
          id: item.id,
          name: item.name,
          icon: icon,
          bgColor: bgColors[index % bgColors.length]
        }
      })
    } else {
      // 如果API返回错误或没有数据，使用默认分类
      useDefaultCategories()
    }
  } catch (error) {
    console.error('获取分类数据失败', error)
    // 出错时使用默认分类
    useDefaultCategories()
  }
}

/**
 * 使用默认分类数据
 */
const useDefaultCategories = () => {
  categories.value = [
    { id: 1, name: '猫粮', icon: 'Food', bgColor: '#FFD0D0' },
    { id: 2, name: '狗粮', icon: 'Food', bgColor: '#D0E6FF' },
    { id: 3, name: '玩具', icon: 'Goods', bgColor: '#D0FFDB' },
    { id: 4, name: '护理', icon: 'Star', bgColor: '#F1D0FF' },
    { id: 5, name: '医疗', icon: 'Briefcase', bgColor: '#FFE8D0' },
    { id: 6, name: '清洁', icon: 'Box', bgColor: '#D0FAFF' }
  ]
}

/**
 * 加载默认数据（当API调用失败时使用）
 */
const fetchDefaultData = async () => {
  // 推荐商品默认数据
  recommendedProducts.value = [
    {
      id: 101,
      name: '进口猫粮10kg',
      price: 299.00,
      sales: 2543,
      imageUrl: 'https://picsum.photos/200/200?random=101'
    },
    {
      id: 102,
      name: '狗狗洗澡露',
      price: 69.90,
      sales: 1892,
      imageUrl: 'https://picsum.photos/200/200?random=102'
    },
    {
      id: 103,
      name: '猫咪爬架',
      price: 159.00,
      sales: 986,
      imageUrl: 'https://picsum.photos/200/200?random=103'
    },
    {
      id: 104,
      name: '宠物智能喂食器',
      price: 299.00,
      sales: 756,
      imageUrl: 'https://picsum.photos/200/200?random=104'
    }
  ]
  
  // 特价商品默认数据
  specialProducts.value = [
    {
      id: 201,
      name: '猫咪磨爪玩具',
      price: 39.90,
      originalPrice: 59.90,
      sales: 1245,
      imageUrl: 'https://picsum.photos/200/200?random=201'
    },
    {
      id: 202,
      name: '狗狗牵引绳',
      price: 29.90,
      originalPrice: 49.90,
      sales: 2367,
      imageUrl: 'https://picsum.photos/200/200?random=202'
    },
    {
      id: 203,
      name: '宠物指甲剪',
      price: 19.90,
      originalPrice: 29.90,
      sales: 3421,
      imageUrl: 'https://picsum.photos/200/200?random=203'
    },
    {
      id: 204,
      name: '猫厕所',
      price: 89.90,
      originalPrice: 129.90,
      sales: 1879,
      imageUrl: 'https://picsum.photos/200/200?random=204'
    }
  ]

  // 使用默认分类数据
  useDefaultCategories()
}

onMounted(() => {
  // 页面加载完成后获取数据
  fetchHomeData()
})
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.banner-section {
  margin-bottom: 40px;
  
  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .banner-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0 10%;
    background: linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%);
    color: #fff;
    
    h2 {
      font-size: 36px;
      margin: 0 0 15px;
      font-weight: bold;
    }
    
    p {
      font-size: 18px;
      margin: 0 0 20px;
      max-width: 60%;
    }
  }
}

.category-section {
  margin-bottom: 40px;
  
  .category-title {
    margin-bottom: 20px;
    
    h2 {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
  }
  
  .category-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    
    .category-item {
      width: calc(16.666% - 15px);
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: transform 0.3s;
      margin-bottom: 20px;
      
      &:hover {
        transform: translateY(-5px);
      }
      
      .category-icon {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        
        .el-icon {
          font-size: 30px;
          color: #444;
        }
      }
      
      .category-name {
        font-size: 16px;
        color: #333;
      }
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .view-more {
    display: flex;
    align-items: center;
    color: #7e57c2;
    text-decoration: none;
    font-size: 14px;
    
    .el-icon {
      margin-left: 5px;
    }
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.recommended-section, .special-section {
  margin-bottom: 40px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
  
  .product-card {
    width: calc(25% - 20px);
    margin: 0 10px 20px;
    background-color: #fff;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    transition: transform 0.3s, box-shadow 0.3s;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
    }
    
    .product-image {
      height: 200px;
      overflow: hidden;
      position: relative;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
      }
      
      .product-tag {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #ff5722;
        color: #fff;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 4px;
      }
      
      &:hover img {
        transform: scale(1.05);
      }
    }
    
    .product-info {
      padding: 15px;
      
      .product-name {
        font-size: 16px;
        margin: 0 0 10px;
        font-weight: 500;
        color: #333;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        height: 42px;
      }
      
      .product-price {
        color: #f56c6c;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
        
        .original-price {
          font-size: 14px;
          color: #999;
          text-decoration: line-through;
          margin-left: 5px;
          font-weight: normal;
        }
      }
      
      .product-sales {
        font-size: 12px;
        color: #999;
      }
    }
    
    .product-actions {
      padding: 0 15px 15px;
      display: flex;
      justify-content: space-between;
    }
  }
}

.pet-guide-section {
  margin-bottom: 40px;
  
  .article-list {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;
    
    .article-card {
      width: calc(33.333% - 20px);
      margin: 0 10px 20px;
      background-color: #fff;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      transition: transform 0.3s, box-shadow 0.3s;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
      }
      
      .article-image {
        height: 180px;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        
        &:hover img {
          transform: scale(1.05);
        }
      }
      
      .article-info {
        padding: 15px;
        
        .article-title {
          font-size: 18px;
          margin: 0 0 10px;
          font-weight: 500;
          color: #333;
        }
        
        .article-summary {
          font-size: 14px;
          color: #666;
          margin: 0 0 15px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 42px;
        }
        
        .article-meta {
          display: flex;
          font-size: 12px;
          color: #999;
          
          span {
            margin-right: 10px;
          }
        }
      }
    }
  }
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

@media (max-width: 768px) {
  .category-list .category-item {
    width: calc(33.333% - 10px);
  }
  
  .product-list .product-card {
    width: calc(50% - 20px);
  }
  
  .article-list .article-card {
    width: calc(50% - 20px);
  }
  
  .banner-content {
    h2 {
      font-size: 24px;
    }
    
    p {
      font-size: 14px;
      max-width: 80%;
    }
  }
}

@media (max-width: 576px) {
  .category-list .category-item {
    width: calc(50% - 10px);
  }
  
  .product-list .product-card {
    width: calc(100% - 20px);
  }
  
  .article-list .article-card {
    width: calc(100% - 20px);
  }
}
</style> 