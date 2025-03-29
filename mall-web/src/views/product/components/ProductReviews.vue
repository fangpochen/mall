<template>
  <div class="product-reviews">
    <!-- 评价概览 -->
    <div class="review-overview">
      <div class="rating-stats">
        <div class="overall-rating">
          <div class="rating-value">{{ reviewStats.averageRating.toFixed(1) }}</div>
          <div class="rating-stars">
            <el-rate v-model="reviewStats.averageRating" disabled />
          </div>
          <div class="review-count">{{ reviewStats.totalReviews }}条评价</div>
        </div>
        <div class="rating-bars">
          <div v-for="(count, index) in reviewStats.ratingDistribution" :key="index" class="rating-bar-item">
            <div class="star-label">{{ 5 - index }}星</div>
            <div class="rating-bar">
              <div 
                class="rating-bar-progress" 
                :style="{ width: computeRatingPercentage(count), backgroundColor: getRatingColor(5 - index) }"
              ></div>
            </div>
            <div class="rating-percentage">{{ computeRatingPercentage(count) }}</div>
          </div>
        </div>
      </div>
      <div class="tag-stats">
        <div class="tag-title">评价标签</div>
        <div class="tag-list">
          <el-tag 
            v-for="tag in reviewStats.reviewTags" 
            :key="tag.name"
            :type="activeTag === tag.name ? 'primary' : ''"
            effect="plain"
            @click="handleTagFilter(tag.name)"
          >
            {{ tag.name }} ({{ tag.count }})
          </el-tag>
        </div>
      </div>
    </div>
    
    <!-- 评价筛选 -->
    <div class="review-filter">
      <div class="filter-options">
        <el-radio-group v-model="filterType" @change="handleFilterChange">
          <el-radio-button label="all">全部评价</el-radio-button>
          <el-radio-button label="picture">有图评价</el-radio-button>
          <el-radio-button label="good">好评</el-radio-button>
          <el-radio-button label="neutral">中评</el-radio-button>
          <el-radio-button label="bad">差评</el-radio-button>
        </el-radio-group>
      </div>
      <div class="sort-options">
        <span class="sort-label">排序：</span>
        <el-select v-model="sortType" @change="handleSortChange">
          <el-option label="默认" value="default" />
          <el-option label="最新" value="newest" />
          <el-option label="评分由高到低" value="rating_desc" />
          <el-option label="评分由低到高" value="rating_asc" />
        </el-select>
      </div>
    </div>
    
    <!-- 评价列表 -->
    <div v-if="reviews.length > 0" class="review-list">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="reviewer-info">
          <div class="reviewer-avatar">
            <img :src="review.user.avatar" :alt="review.user.name" />
          </div>
          <div class="reviewer-name">{{ review.user.name }}</div>
        </div>
        
        <div class="review-content">
          <div class="review-header">
            <div class="review-rating">
              <el-rate v-model="review.rating" disabled />
              <span v-if="review.skuInfo" class="review-sku">{{ review.skuInfo }}</span>
            </div>
            <div class="review-time">{{ review.time }}</div>
          </div>
          
          <div class="review-text">{{ review.content }}</div>
          
          <div v-if="review.images && review.images.length > 0" class="review-images">
            <div 
              v-for="(image, index) in review.images" 
              :key="index" 
              class="review-image"
              @click="previewImage(review.images, index)"
            >
              <img :src="image" :alt="'评价图片'" />
            </div>
          </div>
          
          <div v-if="review.tags && review.tags.length > 0" class="review-tags">
            <el-tag 
              v-for="tag in review.tags" 
              :key="tag" 
              size="small" 
              effect="plain"
            >
              {{ tag }}
            </el-tag>
          </div>
          
          <div v-if="review.reply" class="official-reply">
            <div class="reply-title">官方回复：</div>
            <div class="reply-content">{{ review.reply }}</div>
          </div>
          
          <div class="review-actions">
            <div class="action-item" @click="handleLikeReview(review)">
              <el-icon :class="{ active: review.isLiked }"><Star /></el-icon>
              <span>有用 ({{ review.likes }})</span>
            </div>
            <div class="action-item" @click="handleReplyReview(review)">
              <el-icon><ChatDotRound /></el-icon>
              <span>回复</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <el-empty v-else description="暂无相关评价" />
    
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalReviews"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElImageViewer } from 'element-plus'
import { Star, ChatDotRound } from '@element-plus/icons-vue'

const props = defineProps<{
  productId: string
}>()

// 评价分页
const currentPage = ref(1)
const pageSize = ref(10)
const totalReviews = ref(0)

// 筛选相关
const filterType = ref('all')
const sortType = ref('default')
const activeTag = ref('')

// 评价列表
const reviews = ref<any[]>([])

// 评价统计数据
const reviewStats = reactive({
  averageRating: 4.8,
  totalReviews: 245,
  ratingDistribution: [12, 15, 25, 75, 118], // 从1星到5星的分布
  reviewTags: [
    { name: '比想象中好', count: 86 },
    { name: '质量不错', count: 75 },
    { name: '物流很快', count: 62 },
    { name: '性价比高', count: 55 },
    { name: '使用方便', count: 48 },
    { name: '包装完好', count: 32 },
    { name: '外观漂亮', count: 28 }
  ]
})

/**
 * 计算评分百分比
 * @param count 评分计数
 * @returns 百分比字符串
 * @example
 * computeRatingPercentage(50) // "20%"
 */
const computeRatingPercentage = (count: number) => {
  const percentage = (count / reviewStats.totalReviews) * 100
  return `${percentage.toFixed(0)}%`
}

/**
 * 获取评分颜色
 * @param rating 评分
 * @returns 颜色代码
 * @example
 * getRatingColor(5) // "#67c23a"
 */
const getRatingColor = (rating: number) => {
  if (rating >= 4) return '#67c23a'
  if (rating >= 3) return '#e6a23c'
  return '#f56c6c'
}

/**
 * 处理标签筛选
 * @param tag 标签名称
 * @example
 * handleTagFilter('质量不错')
 */
const handleTagFilter = (tag: string) => {
  if (activeTag.value === tag) {
    activeTag.value = ''
  } else {
    activeTag.value = tag
  }
  currentPage.value = 1
  fetchReviews()
}

/**
 * 处理筛选类型变化
 * @example
 * handleFilterChange()
 */
const handleFilterChange = () => {
  currentPage.value = 1
  fetchReviews()
}

/**
 * 处理排序类型变化
 * @example
 * handleSortChange()
 */
const handleSortChange = () => {
  currentPage.value = 1
  fetchReviews()
}

/**
 * 处理页码变化
 * @param page 页码
 * @example
 * handleCurrentChange(2)
 */
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchReviews()
}

/**
 * 处理每页数量变化
 * @param size 每页数量
 * @example
 * handleSizeChange(20)
 */
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchReviews()
}

/**
 * 预览图片
 * @param images 图片列表
 * @param index 当前索引
 * @example
 * previewImage(['url1', 'url2'], 0)
 */
const previewImage = (images: string[], index: number) => {
  const instance = ElImageViewer.new({
    urlList: images,
    initialIndex: index
  })
  instance.onSwitch
}

/**
 * 点赞评价
 * @param review 评价对象
 * @example
 * handleLikeReview({id: '1', isLiked: false})
 */
const handleLikeReview = (review: any) => {
  review.isLiked = !review.isLiked
  if (review.isLiked) {
    review.likes++
    ElMessage.success('点赞成功')
  } else {
    review.likes--
    ElMessage.success('已取消点赞')
  }
}

/**
 * 回复评价
 * @param review 评价对象
 * @example
 * handleReplyReview({id: '1'})
 */
const handleReplyReview = (review: any) => {
  ElMessage.info('回复功能待开发')
}

/**
 * 获取评价列表
 * @example
 * fetchReviews()
 */
const fetchReviews = () => {
  // 构建请求参数
  const params = {
    productId: props.productId,
    page: currentPage.value,
    size: pageSize.value,
    filter: filterType.value,
    sort: sortType.value,
    tag: activeTag.value
  }
  
  console.log('请求参数:', params)
  
  // 模拟API调用
  setTimeout(() => {
    // 生成模拟数据
    const mockReviews = []
    for (let i = 1; i <= 50; i++) {
      const hasImages = Math.random() > 0.6
      const rating = Math.floor(Math.random() * 5) + 1
      
      let images = []
      if (hasImages) {
        const imageCount = Math.floor(Math.random() * 3) + 1
        for (let j = 0; j < imageCount; j++) {
          images.push(`https://picsum.photos/300/300?random=${i * 10 + j}`)
        }
      }
      
      const review = {
        id: `review_${i}`,
        user: {
          id: `user_${i}`,
          name: `用户${i}`,
          avatar: `https://picsum.photos/100/100?random=${i}`
        },
        rating: rating,
        content: rating > 3 
          ? '商品质量很好，物流很快，包装很完整，非常满意，推荐购买！'
          : '商品一般，没有想象中的好用，有点失望。',
        time: '2023-05-15',
        skuInfo: Math.random() > 0.5 ? '白色 2.4L' : '蓝色 3.8L',
        images: images,
        tags: rating > 3 
          ? ['比想象中好', '质量不错', '物流很快'].slice(0, Math.floor(Math.random() * 3) + 1)
          : [],
        reply: rating < 3 ? '非常抱歉给您带来不好的体验，我们会努力改进产品，感谢您的反馈。' : '',
        likes: Math.floor(Math.random() * 20),
        isLiked: false
      }
      
      mockReviews.push(review)
    }
    
    // 应用筛选
    let filteredReviews = [...mockReviews]
    
    if (filterType.value === 'picture') {
      filteredReviews = filteredReviews.filter(review => review.images && review.images.length > 0)
    } else if (filterType.value === 'good') {
      filteredReviews = filteredReviews.filter(review => review.rating >= 4)
    } else if (filterType.value === 'neutral') {
      filteredReviews = filteredReviews.filter(review => review.rating === 3)
    } else if (filterType.value === 'bad') {
      filteredReviews = filteredReviews.filter(review => review.rating <= 2)
    }
    
    // 应用标签筛选
    if (activeTag.value) {
      filteredReviews = filteredReviews.filter(review => 
        review.tags && review.tags.includes(activeTag.value)
      )
    }
    
    // 应用排序
    if (sortType.value === 'newest') {
      // 假设评论数据已经是最新的排在前面
    } else if (sortType.value === 'rating_desc') {
      filteredReviews.sort((a, b) => b.rating - a.rating)
    } else if (sortType.value === 'rating_asc') {
      filteredReviews.sort((a, b) => a.rating - b.rating)
    }
    
    // 更新总数和分页数据
    totalReviews.value = filteredReviews.length
    
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    reviews.value = filteredReviews.slice(start, end)
  }, 500)
}

// 监听商品ID变化
watch(() => props.productId, () => {
  // 重置筛选条件
  filterType.value = 'all'
  sortType.value = 'default'
  activeTag.value = ''
  currentPage.value = 1
  
  fetchReviews()
}, { immediate: true })

onMounted(() => {
  fetchReviews()
})
</script>

<style lang="scss" scoped>
.product-reviews {
  padding: 20px 0;
  
  .review-overview {
    display: flex;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
    
    .rating-stats {
      display: flex;
      width: 60%;
      
      .overall-rating {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: 30px;
        margin-right: 30px;
        border-right: 1px solid #f0f0f0;
        
        .rating-value {
          font-size: 40px;
          font-weight: bold;
          color: #ff9900;
          line-height: 1;
          margin-bottom: 10px;
        }
        
        .rating-stars {
          margin-bottom: 5px;
        }
        
        .review-count {
          font-size: 12px;
          color: #999;
        }
      }
      
      .rating-bars {
        flex: 1;
        
        .rating-bar-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          
          .star-label {
            width: 40px;
            font-size: 12px;
            color: #666;
          }
          
          .rating-bar {
            flex: 1;
            height: 12px;
            background-color: #f0f0f0;
            border-radius: 6px;
            overflow: hidden;
            margin: 0 10px;
            
            .rating-bar-progress {
              height: 100%;
              border-radius: 6px;
            }
          }
          
          .rating-percentage {
            width: 40px;
            font-size: 12px;
            color: #999;
            text-align: right;
          }
        }
      }
    }
    
    .tag-stats {
      flex: 1;
      padding-left: 30px;
      
      .tag-title {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin-bottom: 15px;
      }
      
      .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        
        .el-tag {
          cursor: pointer;
        }
      }
    }
  }
  
  .review-filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .sort-options {
      display: flex;
      align-items: center;
      
      .sort-label {
        font-size: 14px;
        color: #666;
        margin-right: 10px;
      }
    }
  }
  
  .review-list {
    .review-item {
      display: flex;
      padding: 20px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .reviewer-info {
        width: 100px;
        
        .reviewer-avatar {
          width: 60px;
          height: 60px;
          margin: 0 auto 10px;
          
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }
        
        .reviewer-name {
          font-size: 14px;
          color: #666;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      
      .review-content {
        flex: 1;
        
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          
          .review-rating {
            display: flex;
            align-items: center;
            
            .review-sku {
              margin-left: 10px;
              font-size: 12px;
              color: #999;
            }
          }
          
          .review-time {
            font-size: 12px;
            color: #999;
          }
        }
        
        .review-text {
          font-size: 14px;
          color: #333;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        
        .review-images {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          flex-wrap: wrap;
          
          .review-image {
            width: 100px;
            height: 100px;
            border-radius: 4px;
            overflow: hidden;
            cursor: pointer;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.3s;
              
              &:hover {
                transform: scale(1.05);
              }
            }
          }
        }
        
        .review-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .official-reply {
          background-color: #f9f9f9;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 15px;
          
          .reply-title {
            font-size: 12px;
            color: #7e57c2;
            font-weight: 500;
            margin-bottom: 5px;
          }
          
          .reply-content {
            font-size: 13px;
            color: #666;
            line-height: 1.5;
          }
        }
        
        .review-actions {
          display: flex;
          gap: 20px;
          
          .action-item {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: #999;
            cursor: pointer;
            
            &:hover {
              color: #7e57c2;
            }
            
            .el-icon {
              margin-right: 5px;
              
              &.active {
                color: #ff9900;
              }
            }
          }
        }
      }
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}

@media (max-width: 992px) {
  .review-overview {
    flex-direction: column;
    
    .rating-stats {
      width: 100%;
      margin-bottom: 20px;
    }
    
    .tag-stats {
      padding-left: 0;
    }
  }
}

@media (max-width: 768px) {
  .rating-stats {
    flex-direction: column;
    
    .overall-rating {
      padding-right: 0 !important;
      margin-right: 0 !important;
      border-right: none !important;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f0f0f0;
    }
  }
  
  .review-filter {
    flex-direction: column;
    align-items: flex-start;
    
    .filter-options {
      margin-bottom: 15px;
      width: 100%;
      overflow-x: auto;
      white-space: nowrap;
      padding-bottom: 10px;
    }
  }
  
  .review-item {
    flex-direction: column;
    
    .reviewer-info {
      display: flex;
      align-items: center;
      width: 100% !important;
      margin-bottom: 15px;
      
      .reviewer-avatar {
        width: 40px !important;
        height: 40px !important;
        margin: 0 10px 0 0 !important;
      }
      
      .reviewer-name {
        text-align: left !important;
      }
    }
  }
}
</style> 