<template>
  <div class="product-recommendations">
    <div class="section-header">
      <h3 class="section-title">{{ title }}</h3>
      <div v-if="showViewMore" class="view-more" @click="handleViewMore">
        更多推荐 <el-icon><ArrowRight /></el-icon>
      </div>
    </div>
    
    <div class="products-container">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="1" animated />
      </div>
      
      <template v-else>
        <div v-if="products.length === 0" class="empty-state">
          <el-empty description="暂无推荐商品" />
        </div>
        
        <el-carousel 
          v-else-if="carousel" 
          :interval="5000" 
          type="card" 
          :autoplay="true"
          indicator-position="none"
          class="product-carousel"
        >
          <el-carousel-item v-for="product in products" :key="product.id">
            <div class="product-card carousel-card" @click="goToProductDetail(product.id)">
              <div class="product-image">
                <img :src="product.image" :alt="product.name">
                <div v-if="product.tag" class="product-tag" :class="getTagClass(product.tag)">
                  {{ product.tag }}
                </div>
              </div>
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-brief">{{ product.brief }}</div>
                <div class="product-price-row">
                  <div class="product-price">
                    ¥{{ product.price.toFixed(2) }}
                    <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice.toFixed(2) }}</span>
                  </div>
                  <div class="product-sales">{{ product.salesCount }}人已购买</div>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        
        <div v-else class="product-grid">
          <div 
            v-for="product in products" 
            :key="product.id" 
            class="product-card" 
            @click="goToProductDetail(product.id)"
          >
            <div class="product-image">
              <img :src="product.image" :alt="product.name">
              <div v-if="product.tag" class="product-tag" :class="getTagClass(product.tag)">
                {{ product.tag }}
              </div>
            </div>
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-brief">{{ product.brief }}</div>
              <div class="product-price-row">
                <div class="product-price">
                  ¥{{ product.price.toFixed(2) }}
                  <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice.toFixed(2) }}</span>
                </div>
                <div class="product-sales">{{ product.salesCount }}人已购买</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

// 定义组件属性
const props = defineProps({
  // 当前商品ID，用于排除自身
  currentProductId: {
    type: String,
    default: ''
  },
  // 推荐类型: 'similar', 'combo', 'history', 'popular'
  type: {
    type: String,
    default: 'similar'
  },
  // 自定义标题
  customTitle: {
    type: String,
    default: ''
  },
  // 是否使用轮播模式
  carousel: {
    type: Boolean,
    default: false
  },
  // 最大显示商品数
  limit: {
    type: Number,
    default: 6
  },
  // 是否显示"更多"按钮
  showViewMore: {
    type: Boolean,
    default: true
  },
  // 宠物类型ID，用于筛选推荐
  petTypeId: {
    type: String,
    default: ''
  },
  // 商品类别ID，用于筛选推荐
  categoryId: {
    type: String,
    default: ''
  }
})

// 定义事件
const emit = defineEmits(['view-more'])

const router = useRouter()

// 加载状态
const loading = ref(true)

// 推荐商品列表
const products = ref<any[]>([])

/**
 * 根据推荐类型计算标题
 * @returns 显示的标题文本
 * @example
 * // 返回 "猜你喜欢"
 * title.value
 */
const title = computed(() => {
  if (props.customTitle) {
    return props.customTitle
  }
  
  switch (props.type) {
    case 'similar':
      return '相似商品推荐'
    case 'combo':
      return '组合购买推荐'
    case 'history':
      return '浏览历史推荐'
    case 'popular':
      return '热门商品推荐'
    default:
      return '猜你喜欢'
  }
})

/**
 * 获取标签样式类
 * @param tag 标签文本
 * @returns 对应的CSS类名
 * @example
 * // 返回 "tag-hot"
 * getTagClass('热销')
 */
const getTagClass = (tag: string) => {
  if (tag === '热销' || tag === '爆款') {
    return 'tag-hot'
  } else if (tag === '新品') {
    return 'tag-new'
  } else if (tag === '促销' || tag === '折扣') {
    return 'tag-promotion'
  } else if (tag === '限量') {
    return 'tag-limited'
  } else {
    return 'tag-default'
  }
}

/**
 * 跳转到商品详情页
 * @param productId 商品ID
 * @example
 * goToProductDetail('123')
 */
const goToProductDetail = (productId: string) => {
  router.push(`/product/${productId}`)
}

/**
 * 查看更多商品
 * @example
 * handleViewMore()
 */
const handleViewMore = () => {
  emit('view-more', props.type)
  
  // 根据不同推荐类型，跳转到不同页面
  let path = '/products'
  let query: Record<string, string> = {}
  
  switch (props.type) {
    case 'similar':
      if (props.categoryId) {
        query.category = props.categoryId
      }
      if (props.petTypeId) {
        query.petType = props.petTypeId
      }
      break
    case 'popular':
      query.sort = 'sales'
      break
    default:
      break
  }
  
  router.push({ path, query })
}

/**
 * 获取推荐商品数据
 * @example
 * fetchRecommendations()
 */
const fetchRecommendations = () => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    // 生成测试数据
    const mockProducts = []
    
    // 产品名前缀
    let namePrefix = ''
    switch (props.type) {
      case 'similar':
        namePrefix = '相似'
        break
      case 'combo':
        namePrefix = '套装'
        break
      case 'history':
        namePrefix = '推荐'
        break
      case 'popular':
        namePrefix = '热销'
        break
      default:
        namePrefix = ''
    }
    
    // 生成随机商品
    for (let i = 1; i <= props.limit + 2; i++) {
      // 排除当前商品
      if (`product_${i}` === props.currentProductId) {
        continue
      }
      
      // 随机价格
      const price = Math.floor(Math.random() * 200) + 50
      const hasDiscount = Math.random() > 0.6
      
      // 随机标签
      let tag = null
      const tagRandom = Math.random()
      if (tagRandom > 0.8) {
        tag = '热销'
      } else if (tagRandom > 0.6) {
        tag = '新品'
      } else if (tagRandom > 0.4) {
        tag = '促销'
      } else if (tagRandom > 0.2) {
        tag = '限量'
      }
      
      mockProducts.push({
        id: `product_${i}`,
        name: `${namePrefix}宠物用品${i}`,
        brief: `高品质宠物用品，让您的爱宠更健康快乐`,
        price: price,
        originalPrice: hasDiscount ? price * 1.2 : null,
        salesCount: Math.floor(Math.random() * 10000),
        image: `https://picsum.photos/300/300?random=${props.type}_${i}`,
        tag
      })
      
      // 达到限制数量时停止
      if (mockProducts.length >= props.limit) {
        break
      }
    }
    
    products.value = mockProducts
    loading.value = false
  }, 800)
}

onMounted(() => {
  fetchRecommendations()
})
</script>

<style lang="scss" scoped>
.product-recommendations {
  margin: 30px 0;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
      position: relative;
      padding-left: 12px;
      
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 18px;
        background-color: #7e57c2;
        border-radius: 2px;
      }
    }
    
    .view-more {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #7e57c2;
      cursor: pointer;
      
      .el-icon {
        margin-left: 4px;
        transition: transform 0.3s;
      }
      
      &:hover {
        .el-icon {
          transform: translateX(3px);
        }
      }
    }
  }
  
  .loading-container {
    padding: 20px 0;
  }
  
  .product-carousel {
    height: 340px;
    
    :deep(.el-carousel__item) {
      border-radius: 8px;
      overflow: hidden;
      
      &.is-active {
        .carousel-card {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }
      }
    }
    
    .carousel-card {
      transition: all 0.3s;
      height: 100%;
      
      .product-image {
        height: 220px;
        
        img {
          height: 100%;
        }
      }
    }
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .product-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    cursor: pointer;
    background-color: #fff;
    
    &:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
      transform: translateY(-5px);
    }
    
    .product-image {
      position: relative;
      height: 200px;
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
      
      .product-tag {
        position: absolute;
        top: 10px;
        right: 0;
        padding: 4px 10px;
        font-size: 12px;
        color: #fff;
        border-radius: 4px 0 0 4px;
        
        &.tag-hot {
          background-color: #ff4d4f;
        }
        
        &.tag-new {
          background-color: #52c41a;
        }
        
        &.tag-promotion {
          background-color: #faad14;
        }
        
        &.tag-limited {
          background-color: #722ed1;
        }
        
        &.tag-default {
          background-color: #1890ff;
        }
      }
    }
    
    .product-info {
      padding: 12px;
      
      .product-name {
        font-size: 14px;
        color: #333;
        font-weight: 500;
        margin-bottom: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .product-brief {
        font-size: 12px;
        color: #999;
        margin-bottom: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .product-price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .product-price {
          font-size: 16px;
          color: #ff6b6b;
          font-weight: 600;
          
          .original-price {
            font-size: 12px;
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
    }
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .product-carousel {
    height: 300px !important;
  }
}
</style> 