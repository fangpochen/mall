<template>
  <div class="product-list-page">
    <div class="container">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <el-card class="filter-card">
          <div class="filter-group category-filter">
            <div class="filter-label">商品分类：</div>
            <div class="filter-options">
              <el-radio-group v-model="filterParams.category" @change="handleFilter">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button v-for="category in categories" :key="category.id" :label="category.id">
                  {{ category.name }}
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>
          
          <div class="filter-group">
            <div class="filter-label">适用对象：</div>
            <div class="filter-options">
              <el-checkbox-group v-model="filterParams.petType" @change="handleFilter">
                <el-checkbox label="cat">猫咪</el-checkbox>
                <el-checkbox label="dog">狗狗</el-checkbox>
                <el-checkbox label="other">其他宠物</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          
          <div class="filter-group">
            <div class="filter-label">价格区间：</div>
            <div class="filter-options">
              <el-slider
                v-model="filterParams.priceRange"
                range
                :min="0"
                :max="1000"
                :step="10"
                @change="handleFilter"
              />
              <div class="price-inputs">
                <el-input-number
                  v-model="filterParams.priceRange[0]"
                  :min="0"
                  :max="filterParams.priceRange[1]"
                  size="small"
                  controls-position="right"
                  @change="handleFilter"
                />
                <span class="separator">-</span>
                <el-input-number
                  v-model="filterParams.priceRange[1]"
                  :min="filterParams.priceRange[0]"
                  :max="1000"
                  size="small"
                  controls-position="right"
                  @change="handleFilter"
                />
              </div>
            </div>
          </div>
          
          <div class="filter-group">
            <div class="filter-label">品牌：</div>
            <div class="filter-options">
              <el-select
                v-model="filterParams.brand"
                placeholder="选择品牌"
                clearable
                @change="handleFilter"
              >
                <el-option
                  v-for="brand in brands"
                  :key="brand.id"
                  :label="brand.name"
                  :value="brand.id"
                />
              </el-select>
            </div>
          </div>
          
          <div class="filter-actions">
            <el-button type="primary" @click="handleFilter">筛选</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </div>
        </el-card>
      </div>
      
      <!-- 商品列表 -->
      <div class="products-section">
        <div class="products-header">
          <div class="total-count">
            共 <span class="count">{{ totalCount }}</span> 件商品
          </div>
          <div class="sort-options">
            <span class="sort-label">排序：</span>
            <el-radio-group v-model="sortOption" size="small" @change="handleSort">
              <el-radio-button label="default">默认</el-radio-button>
              <el-radio-button label="sales">销量</el-radio-button>
              <el-radio-button label="price_asc">价格低到高</el-radio-button>
              <el-radio-button label="price_desc">价格高到低</el-radio-button>
              <el-radio-button label="rating">评分</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        
        <!-- 商品网格 -->
        <div v-if="productList.length > 0" class="product-grid">
          <div 
            v-for="product in productList" 
            :key="product.id" 
            class="product-card"
            @click="goToDetail(product.id)"
          >
            <div class="product-image">
              <img :src="product.imageUrl" :alt="product.name" />
              <div v-if="product.discount" class="product-tag discount">{{ product.discount }}折</div>
              <div v-if="product.isNew" class="product-tag new">新品</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-price-row">
                <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
                <div v-if="product.originalPrice" class="product-original-price">¥{{ product.originalPrice.toFixed(2) }}</div>
              </div>
              <div class="product-rating">
                <el-rate v-model="product.rating" disabled text-color="#ff9900" />
                <span class="sales-count">已售{{ product.sales }}+</span>
              </div>
              <div class="product-actions">
                <el-button type="primary" size="small" @click.stop="goToDetail(product.id)">查看详情</el-button>
                <el-button size="small" @click.stop="addToCart(product.id)">加入购物车</el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <el-empty 
          v-else 
          description="暂无相关商品" 
          :image-size="200"
        />
        
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[12, 24, 36, 48]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

// 分页相关
const currentPage = ref(1)
const pageSize = ref(12)
const totalCount = ref(0)

// 商品列表
const productList = ref<any[]>([])

// 排序选项
const sortOption = ref('default')

// 筛选参数
const filterParams = reactive({
  category: '',
  petType: [] as string[],
  priceRange: [0, 1000],
  brand: ''
})

// 分类列表
const categories = ref([
  { id: '1', name: '猫粮' },
  { id: '2', name: '狗粮' },
  { id: '3', name: '玩具' },
  { id: '4', name: '护理' },
  { id: '5', name: '医疗' },
  { id: '6', name: '清洁' }
])

// 品牌列表
const brands = ref([
  { id: '1', name: '皇家' },
  { id: '2', name: '比瑞吉' },
  { id: '3', name: '冠能' },
  { id: '4', name: '希尔思' },
  { id: '5', name: '伟嘉' },
  { id: '6', name: '宝路' },
  { id: '7', name: '麦富迪' }
])

/**
 * 处理筛选
 * @example
 * handleFilter()
 */
const handleFilter = () => {
  currentPage.value = 1
  fetchProductList()
}

/**
 * 重置筛选
 * @example
 * resetFilter()
 */
const resetFilter = () => {
  filterParams.category = ''
  filterParams.petType = []
  filterParams.priceRange = [0, 1000]
  filterParams.brand = ''
  currentPage.value = 1
  fetchProductList()
}

/**
 * 处理排序
 * @example
 * handleSort('price_asc')
 */
const handleSort = () => {
  fetchProductList()
}

/**
 * 处理页码变化
 * @param page 页码
 * @example
 * handleCurrentChange(2)
 */
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchProductList()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * 处理每页数量变化
 * @param size 每页数量
 * @example
 * handleSizeChange(24)
 */
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchProductList()
}

/**
 * 跳转到商品详情页
 * @param productId 商品ID
 * @example
 * goToDetail('123')
 */
const goToDetail = (productId: string) => {
  router.push(`/product/${productId}`)
}

/**
 * 添加商品到购物车
 * @param productId 商品ID
 * @example
 * addToCart('123')
 */
const addToCart = (productId: string) => {
  // 这里应该是API调用添加购物车
  ElMessage.success('已添加到购物车')
}

/**
 * 获取商品列表
 * @example
 * fetchProductList()
 */
const fetchProductList = () => {
  // 构建请求参数
  const params = {
    page: currentPage.value,
    size: pageSize.value,
    sort: sortOption.value,
    category: filterParams.category,
    petType: filterParams.petType.join(','),
    minPrice: filterParams.priceRange[0],
    maxPrice: filterParams.priceRange[1],
    brand: filterParams.brand,
    keyword: route.query.keyword as string
  }
  
  console.log('请求参数:', params)
  
  // 模拟API调用获取商品列表
  setTimeout(() => {
    // 模拟数据
    const mockProducts = []
    const basePrice = Math.floor(Math.random() * 100) + 50
    
    for (let i = 1; i <= 48; i++) {
      const hasDiscount = Math.random() > 0.7
      const price = basePrice + Math.floor(Math.random() * 150)
      const originalPrice = hasDiscount ? price * 1.2 : null
      const discount = hasDiscount ? '8' : null
      
      mockProducts.push({
        id: `product_${i}`,
        name: `宠物商品 ${i}`,
        price: price,
        originalPrice: originalPrice,
        imageUrl: `https://picsum.photos/300/300?random=${i}`,
        rating: (3 + Math.random() * 2).toFixed(1),
        sales: Math.floor(Math.random() * 1000),
        isNew: Math.random() > 0.8,
        discount: discount
      })
    }
    
    // 应用排序
    if (sortOption.value === 'price_asc') {
      mockProducts.sort((a, b) => a.price - b.price)
    } else if (sortOption.value === 'price_desc') {
      mockProducts.sort((a, b) => b.price - a.price)
    } else if (sortOption.value === 'sales') {
      mockProducts.sort((a, b) => b.sales - a.sales)
    } else if (sortOption.value === 'rating') {
      mockProducts.sort((a, b) => b.rating - a.rating)
    }
    
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    productList.value = mockProducts.slice(start, end)
    totalCount.value = mockProducts.length
  }, 500)
}

// 监听路由参数变化
watch(() => route.query, (newQuery) => {
  // 如果URL参数中有category，更新筛选
  if (newQuery.category) {
    filterParams.category = newQuery.category as string
  }
  
  // 如果URL参数中有keyword，更新关键词
  if (newQuery.keyword) {
    // 这里可以添加关键词搜索逻辑
  }
  
  fetchProductList()
}, { immediate: true })

onMounted(() => {
  // 初始化从URL获取筛选参数
  if (route.query.category) {
    filterParams.category = route.query.category as string
  }
  
  fetchProductList()
})
</script>

<style lang="scss" scoped>
.product-list-page {
  padding: 20px 0;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.filter-section {
  margin-bottom: 20px;
  
  .filter-card {
    border-radius: 8px;
    
    .filter-group {
      display: flex;
      margin-bottom: 15px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .filter-label {
        width: 100px;
        color: #606266;
        padding-top: 5px;
        flex-shrink: 0;
      }
      
      .filter-options {
        flex: 1;
      }
      
      &.category-filter {
        margin-bottom: 20px;
        
        .el-radio-button {
          margin-bottom: 10px;
        }
      }
    }
    
    .price-inputs {
      display: flex;
      align-items: center;
      margin-top: 10px;
      
      .separator {
        margin: 0 10px;
      }
    }
    
    .filter-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      gap: 10px;
    }
  }
}

.products-section {
  .products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .total-count {
      font-size: 14px;
      color: #606266;
      
      .count {
        color: #f56c6c;
        font-weight: bold;
      }
    }
    
    .sort-options {
      display: flex;
      align-items: center;
      
      .sort-label {
        margin-right: 10px;
        color: #606266;
      }
    }
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
    
    .product-card {
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
      }
      
      .product-image {
        height: 200px;
        position: relative;
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
          right: 10px;
          padding: 2px 8px;
          color: #fff;
          font-size: 12px;
          border-radius: 4px;
          
          &.discount {
            background-color: #f56c6c;
          }
          
          &.new {
            background-color: #67c23a;
          }
        }
      }
      
      .product-info {
        padding: 15px;
        
        .product-name {
          font-size: 16px;
          margin: 0 0 10px;
          color: #333;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 42px;
        }
        
        .product-price-row {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          
          .product-price {
            color: #f56c6c;
            font-size: 18px;
            font-weight: bold;
          }
          
          .product-original-price {
            margin-left: 10px;
            font-size: 14px;
            color: #999;
            text-decoration: line-through;
          }
        }
        
        .product-rating {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          
          .sales-count {
            margin-left: 10px;
            font-size: 12px;
            color: #999;
          }
        }
        
        .product-actions {
          display: flex;
          justify-content: space-between;
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

@media (max-width: 1200px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }
}

@media (max-width: 992px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 576px) {
  .product-grid {
    grid-template-columns: repeat(1, 1fr) !important;
  }
  
  .filter-group {
    flex-direction: column;
    
    .filter-label {
      width: 100% !important;
      margin-bottom: 10px;
    }
  }
  
  .products-header {
    flex-direction: column;
    align-items: flex-start !important;
    
    .total-count {
      margin-bottom: 10px;
    }
  }
}
</style> 