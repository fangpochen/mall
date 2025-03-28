<template>
  <div class="product-detail-container">
    <el-row :gutter="40">
      <!-- 商品图片 -->
      <el-col :span="12">
        <el-carousel height="400px" class="product-carousel">
          <el-carousel-item v-for="(image, index) in product.images" :key="index">
            <img :src="image" :alt="product.name" class="product-image">
          </el-carousel-item>
        </el-carousel>
        <div class="thumbnail-list">
          <img
            v-for="(image, index) in product.images"
            :key="index"
            :src="image"
            :alt="product.name"
            class="thumbnail"
            @click="currentImageIndex = index"
          >
        </div>
      </el-col>

      <!-- 商品信息 -->
      <el-col :span="12">
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <div class="price-box">
            <span class="price">¥{{ product.price }}</span>
            <span class="original-price">¥{{ product.originalPrice }}</span>
            <span class="discount">{{ product.discount }}折</span>
          </div>
          <div class="product-meta">
            <span>销量: {{ product.sales }}</span>
            <span>库存: {{ product.stock }}</span>
            <span>评分: {{ product.rating }}</span>
          </div>
          <div class="product-description">
            <h3>商品描述</h3>
            <p>{{ product.description }}</p>
          </div>
          <div class="product-specs">
            <h3>规格选择</h3>
            <el-radio-group v-model="selectedSpec">
              <el-radio-button
                v-for="spec in product.specs"
                :key="spec.id"
                :label="spec.id"
              >
                {{ spec.name }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="quantity-selector">
            <h3>数量</h3>
            <el-input-number
              v-model="quantity"
              :min="1"
              :max="product.stock"
              size="large"
            />
          </div>
          <div class="product-actions">
            <el-button type="primary" size="large" @click="addToCart">加入购物车</el-button>
            <el-button type="danger" size="large" @click="buyNow">立即购买</el-button>
            <el-button
              :type="isFavorite ? 'danger' : 'default'"
              size="large"
              @click="toggleFavorite"
            >
              {{ isFavorite ? '取消收藏' : '收藏' }}
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 商品详情和评价 -->
    <el-row class="detail-section">
      <el-col :span="24">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="商品详情" name="detail">
            <div class="product-detail" v-html="product.detail"></div>
          </el-tab-pane>
          <el-tab-pane label="商品评价" name="reviews">
            <div class="reviews-section">
              <div class="reviews-summary">
                <div class="rating-overview">
                  <div class="average-rating">
                    <span class="rating-number">{{ product.rating }}</span>
                    <el-rate v-model="product.rating" disabled />
                  </div>
                  <div class="rating-stats">
                    <div v-for="(stat, index) in ratingStats" :key="index" class="rating-stat">
                      <span class="label">{{ stat.label }}</span>
                      <el-progress :percentage="stat.percentage" :color="stat.color" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="reviews-list">
                <div v-for="review in reviews" :key="review.id" class="review-item">
                  <div class="review-header">
                    <el-avatar :src="review.userAvatar" />
                    <div class="review-info">
                      <span class="username">{{ review.username }}</span>
                      <el-rate v-model="review.rating" disabled size="small" />
                    </div>
                    <span class="review-time">{{ review.time }}</span>
                  </div>
                  <div class="review-content">
                    <p>{{ review.content }}</p>
                    <div class="review-images" v-if="review.images && review.images.length">
                      <el-image
                        v-for="(image, index) in review.images"
                        :key="index"
                        :src="image"
                        :preview-src-list="review.images"
                        fit="cover"
                        class="review-image"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="pagination">
                <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :total="totalReviews"
                  layout="prev, pager, next"
                  @current-change="handlePageChange"
                />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// 商品数据
const product = reactive({
  id: 1,
  name: '优质狗粮',
  price: 99.00,
  originalPrice: 129.00,
  discount: 7.7,
  sales: 1000,
  stock: 100,
  rating: 4.5,
  description: '精选优质原料，营养均衡，适合各类犬种',
  images: [
    'https://example.com/product1-1.jpg',
    'https://example.com/product1-2.jpg',
    'https://example.com/product1-3.jpg'
  ],
  specs: [
    { id: 1, name: '2kg' },
    { id: 2, name: '5kg' },
    { id: 3, name: '10kg' }
  ],
  detail: '<div>商品详情HTML内容</div>'
})

// 评价数据
const reviews = ref([
  {
    id: 1,
    username: '用户1',
    userAvatar: 'https://example.com/avatar1.jpg',
    rating: 5,
    content: '狗狗很喜欢吃，质量很好',
    images: ['https://example.com/review1-1.jpg'],
    time: '2024-01-01'
  }
])

// 评分统计
const ratingStats = [
  { label: '5星', percentage: 80, color: '#f56c6c' },
  { label: '4星', percentage: 15, color: '#e6a23c' },
  { label: '3星', percentage: 3, color: '#909399' },
  { label: '2星', percentage: 1, color: '#909399' },
  { label: '1星', percentage: 1, color: '#909399' }
]

// 状态变量
const currentImageIndex = ref(0)
const selectedSpec = ref(1)
const quantity = ref(1)
const isFavorite = ref(false)
const activeTab = ref('detail')
const currentPage = ref(1)
const pageSize = ref(10)
const totalReviews = ref(100)

// 加入购物车
const addToCart = () => {
  // TODO: 实现加入购物车逻辑
  ElMessage.success('已添加到购物车')
}

// 立即购买
const buyNow = () => {
  // TODO: 实现立即购买逻辑
  router.push('/checkout')
}

// 收藏/取消收藏
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  ElMessage.success(isFavorite.value ? '收藏成功' : '已取消收藏')
}

// 评价分页
const handlePageChange = (val: number) => {
  currentPage.value = val
  fetchReviews()
}

// 获取评价列表
const fetchReviews = async () => {
  try {
    // TODO: 调用API获取评价列表
    // const res = await getReviews({
    //   productId: product.id,
    //   page: currentPage.value,
    //   pageSize: pageSize.value
    // })
    // reviews.value = res.data.list
    // totalReviews.value = res.data.total
  } catch (error) {
    console.error('获取评价列表失败:', error)
  }
}

onMounted(() => {
  // TODO: 获取商品详情
  // const productId = route.params.id
  // fetchProductDetail(productId)
  fetchReviews()
})
</script>

<style scoped>
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-carousel {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-list {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
}

.thumbnail:hover {
  border-color: #409EFF;
}

.product-info {
  padding: 20px;
}

.product-info h1 {
  margin: 0 0 20px;
  font-size: 24px;
  color: #303133;
}

.price-box {
  margin-bottom: 20px;
}

.price {
  font-size: 28px;
  color: #f56c6c;
  font-weight: bold;
  margin-right: 10px;
}

.original-price {
  font-size: 16px;
  color: #909399;
  text-decoration: line-through;
  margin-right: 10px;
}

.discount {
  color: #f56c6c;
  font-size: 14px;
}

.product-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: #909399;
}

.product-description {
  margin-bottom: 20px;
}

.product-description h3 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #303133;
}

.product-description p {
  color: #606266;
  line-height: 1.6;
}

.product-specs {
  margin-bottom: 20px;
}

.product-specs h3 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #303133;
}

.quantity-selector {
  margin-bottom: 20px;
}

.quantity-selector h3 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #303133;
}

.product-actions {
  display: flex;
  gap: 20px;
}

.detail-section {
  margin-top: 40px;
}

.product-detail {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.reviews-section {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.reviews-summary {
  margin-bottom: 30px;
}

.rating-overview {
  display: flex;
  gap: 40px;
}

.average-rating {
  text-align: center;
}

.rating-number {
  font-size: 36px;
  color: #f56c6c;
  font-weight: bold;
  margin-right: 10px;
}

.rating-stats {
  flex: 1;
}

.rating-stat {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.rating-stat .label {
  width: 40px;
  color: #606266;
}

.reviews-list {
  margin-bottom: 20px;
}

.review-item {
  padding: 20px 0;
  border-bottom: 1px solid #ebeef5;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.review-info {
  margin-left: 10px;
  flex: 1;
}

.username {
  font-weight: bold;
  color: #303133;
  margin-right: 10px;
}

.review-time {
  color: #909399;
  font-size: 14px;
}

.review-content {
  color: #606266;
  line-height: 1.6;
}

.review-images {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.review-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style> 