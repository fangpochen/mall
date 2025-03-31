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
              <img :src="product.pic || `https://picsum.photos/300/300?random=${product.id}`" :alt="product.name" />
              <div v-if="product.promotionType > 0" class="product-tag discount">促销</div>
              <div v-if="product.newStatus === 1" class="product-tag new">新品</div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-price-row">
                <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
                <div v-if="product.promotionPrice && product.promotionPrice < product.price" class="product-original-price">
                  ¥{{ product.originalPrice ? product.originalPrice.toFixed(2) : product.price.toFixed(2) }}
                </div>
              </div>
              <div class="product-rating">
                <el-rate :value="product.rating || 5" disabled text-color="#ff9900" />
                <span class="sales-count">已售{{ product.sale || 0 }}+</span>
              </div>
              <div class="product-actions">
                <el-button type="primary" size="small" @click.stop="goToDetail(product.id)">查看详情</el-button>
                <el-button size="small" @click.stop="addToCart(product.id)">加入购物车</el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        
        <!-- 空状态 -->
        <el-empty 
          v-if="!loading && productList.length === 0" 
          description="暂无相关商品" 
          :image-size="200"
        />
        
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
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
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import productApi from '../../api/product'
import cartApi from '../../api/cart'

const router = useRouter()
const route = useRoute()

// 加载状态
const loading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
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
 * 获取商品分类
 */
const fetchCategories = async () => {
  try {
    const result = await productApi.getCategoryTreeList()
    if (result.code === 200 && result.data) {
      // 将树形结构的分类转换为一级列表供筛选使用
      const flattenCategories = []
      const traverse = (categories: any[], parentName = '') => {
        categories.forEach(cat => {
          flattenCategories.push({
            id: cat.id,
            name: parentName ? `${parentName} - ${cat.name}` : cat.name
          })
          if (cat.children && cat.children.length > 0) {
            traverse(cat.children, cat.name)
          }
        })
      }
      traverse(result.data)
      categories.value = flattenCategories
    }
  } catch (error) {
    console.error('获取商品分类失败:', error)
  }
}

/**
 * 获取品牌列表
 */
const fetchBrands = async () => {
  try {
    const result = await productApi.getBrandList({
      pageSize: 50,  // 获取足够多的品牌
      pageNum: 1
    })
    if (result.code === 200 && result.data) {
      brands.value = result.data.map((brand: any) => ({
        id: brand.id,
        name: brand.name
      }))
    }
  } catch (error) {
    console.error('获取品牌列表失败:', error)
    // 如果API不存在，使用默认品牌列表
  }
}

/**
 * 处理筛选
 */
const handleFilter = () => {
  currentPage.value = 1
  fetchProductList()
}

/**
 * 重置筛选
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
 */
const handleSort = () => {
  fetchProductList()
}

/**
 * 处理页码变化
 * @param page 页码
 */
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchProductList()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * 处理每页数量变化
 * @param size 每页数量
 */
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchProductList()
}

/**
 * 跳转到商品详情页
 * @param productId 商品ID
 */
const goToDetail = (productId: string | number) => {
  router.push(`/product/${productId}`)
}

/**
 * 添加商品到购物车
 * @param productId 商品ID
 */
const addToCart = async (productId: string | number) => {
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
    console.error('添加到购物车失败:', error)
    ElMessage.error('添加失败，请稍后重试')
  }
}

/**
 * 获取商品列表
 */
const fetchProductList = async () => {
  loading.value = true
  
  try {
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
    
    // 调用搜索API
    const result = await productApi.searchProducts(params)
    
    if (result.code === 200) {
      // 设置商品列表和总数
      productList.value = result.data.list || []
      totalCount.value = result.data.total || 0
      
      // 处理商品数据，添加额外展示所需的属性
      productList.value.forEach((product: any) => {
        // 为商品添加评分（后端可能没有）
        if (!product.rating) {
          product.rating = 4 + Math.random()
        }
        
        // 如果没有商品图片，使用占位图
        if (!product.pic) {
          product.pic = `https://picsum.photos/300/300?random=${product.id}`
        }
      })
    } else {
      ElMessage.error(result.message || '获取商品列表失败')
      productList.value = []
      totalCount.value = 0
    }
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败，请稍后重试')
    
    // 出错时使用默认空数据
    productList.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

// 监听路由参数变化
watch(() => route.query, (newQuery) => {
  // 如果URL参数中有category，更新筛选
  if (newQuery.category) {
    filterParams.category = newQuery.category as string
  }
  
  // 如果URL参数中有keyword，更新关键词
  // 直接使用关键词搜索
  
  fetchProductList()
}, { immediate: true })

onMounted(() => {
  // 初始化从URL获取筛选参数
  if (route.query.category) {
    filterParams.category = route.query.category as string
  }
  
  // 获取分类和品牌数据
  fetchCategories()
  fetchBrands()
  
  // 获取商品列表
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
  
  .loading-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 30px;
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