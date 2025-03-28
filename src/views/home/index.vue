<template>
  <div class="home-container">
    <!-- 轮播图 -->
    <div class="banner-section">
      <el-carousel height="400px">
        <el-carousel-item v-for="item in banners" :key="item.id">
          <img :src="item.imgUrl" :alt="item.title" class="banner-image">
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 分类导航 -->
    <div class="category-section">
      <div class="section-container">
        <div class="category-item" v-for="category in categories" :key="category.id">
          <router-link :to="`/category/${category.id}`">
            <img :src="category.icon" :alt="category.name" class="category-icon">
            <p>{{ category.name }}</p>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 推荐商品 -->
    <div class="recommend-section">
      <div class="section-container">
        <div class="section-header">
          <h2>热门推荐</h2>
          <router-link to="/recommend" class="more-link">查看更多</router-link>
        </div>
        <div class="product-list">
          <div class="product-card" v-for="product in recommendProducts" :key="product.id">
            <router-link :to="`/product/${product.id}`">
              <div class="product-img">
                <img :src="product.imgUrl" :alt="product.name">
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-desc">{{ product.desc }}</p>
                <p class="product-price">¥{{ product.price }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 新品上市 -->
    <div class="new-section">
      <div class="section-container">
        <div class="section-header">
          <h2>新品上市</h2>
          <router-link to="/new" class="more-link">查看更多</router-link>
        </div>
        <div class="product-list">
          <div class="product-card" v-for="product in newProducts" :key="product.id">
            <router-link :to="`/product/${product.id}`">
              <div class="product-img">
                <img :src="product.imgUrl" :alt="product.name">
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-desc">{{ product.desc }}</p>
                <p class="product-price">¥{{ product.price }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 轮播图数据
const banners = ref([
  {
    id: 1,
    title: '宠物用品大促',
    imgUrl: 'https://example.com/banner1.jpg'
  },
  {
    id: 2,
    title: '狗粮品牌折扣',
    imgUrl: 'https://example.com/banner2.jpg'
  },
  {
    id: 3,
    title: '猫咪玩具特价',
    imgUrl: 'https://example.com/banner3.jpg'
  }
])

// 分类数据
const categories = ref([
  {
    id: 1,
    name: '狗粮',
    icon: 'https://example.com/category1.png'
  },
  {
    id: 2,
    name: '猫粮',
    icon: 'https://example.com/category2.png'
  },
  {
    id: 3,
    name: '玩具',
    icon: 'https://example.com/category3.png'
  },
  {
    id: 4,
    name: '日用品',
    icon: 'https://example.com/category4.png'
  },
  {
    id: 5,
    name: '医疗',
    icon: 'https://example.com/category5.png'
  }
])

// 推荐商品
const recommendProducts = ref([
  {
    id: 1,
    name: '优质狗粮5kg',
    desc: '适合成年犬的全营养配方',
    price: 199.00,
    imgUrl: 'https://example.com/product1.jpg'
  },
  {
    id: 2,
    name: '猫咪磨爪玩具',
    desc: '耐磨耐用，保护家具',
    price: 59.00,
    imgUrl: 'https://example.com/product2.jpg'
  },
  {
    id: 3,
    name: '宠物洗澡沐浴露',
    desc: '温和配方，不刺激皮肤',
    price: 39.90,
    imgUrl: 'https://example.com/product3.jpg'
  },
  {
    id: 4,
    name: '自动喂食器',
    desc: '智能定时，远程控制',
    price: 299.00,
    imgUrl: 'https://example.com/product4.jpg'
  }
])

// 新品商品
const newProducts = ref([
  {
    id: 5,
    name: '便携宠物水杯',
    desc: '外出必备，方便饮水',
    price: 49.00,
    imgUrl: 'https://example.com/product5.jpg'
  },
  {
    id: 6,
    name: '猫咪隧道玩具',
    desc: '多通道设计，满足猫咪好奇心',
    price: 89.00,
    imgUrl: 'https://example.com/product6.jpg'
  },
  {
    id: 7,
    name: '宠物牙刷套装',
    desc: '呵护口腔健康，预防牙结石',
    price: 29.90,
    imgUrl: 'https://example.com/product7.jpg'
  },
  {
    id: 8,
    name: '犬用关节保健品',
    desc: '维护关节健康，适合老年犬',
    price: 128.00,
    imgUrl: 'https://example.com/product8.jpg'
  }
])
</script>

<style scoped>
.home-container {
  width: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.category-section {
  padding: 30px 0;
  background: #fff;
}

.category-section .section-container {
  display: flex;
  justify-content: space-between;
}

.category-item {
  text-align: center;
  width: 20%;
}

.category-item a {
  display: block;
  color: #333;
  text-decoration: none;
}

.category-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.category-item p {
  font-size: 14px;
}

.recommend-section,
.new-section {
  padding: 40px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.more-link {
  color: #409EFF;
  text-decoration: none;
  font-size: 14px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-card a {
  text-decoration: none;
  color: #333;
}

.product-img {
  height: 200px;
  overflow: hidden;
}

.product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-img img {
  transform: scale(1.05);
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 16px;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-desc {
  font-size: 14px;
  color: #999;
  margin: 0 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
  margin: 0;
}
</style> 