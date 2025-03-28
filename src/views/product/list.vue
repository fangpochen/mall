<template>
  <div class="product-list-container">
    <!-- 搜索和筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="关键词">
          <el-input
            v-model="filterForm.keyword"
            placeholder="搜索商品名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filterForm.category" placeholder="选择分类" clearable>
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格区间">
          <el-input-number v-model="filterForm.minPrice" :min="0" placeholder="最低价" />
          <span class="price-separator">-</span>
          <el-input-number v-model="filterForm.maxPrice" :min="0" placeholder="最高价" />
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="filterForm.sort" placeholder="选择排序方式">
            <el-option label="默认排序" value="" />
            <el-option label="价格从低到高" value="price_asc" />
            <el-option label="价格从高到低" value="price_desc" />
            <el-option label="销量优先" value="sales_desc" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 商品列表 -->
    <div class="product-list">
      <el-row :gutter="20">
        <el-col v-for="product in products" :key="product.id" :xs="24" :sm="12" :md="8" :lg="6">
          <el-card class="product-card" :body-style="{ padding: '0px' }">
            <img :src="product.imageUrl" class="product-image">
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="description">{{ product.description }}</p>
              <div class="price-row">
                <span class="price">¥{{ product.price }}</span>
                <span class="sales">销量: {{ product.sales }}</span>
              </div>
              <div class="product-actions">
                <el-button type="primary" size="small" @click="viewProduct(product.id)">查看详情</el-button>
                <el-button type="success" size="small" @click="addToCart(product.id)">加入购物车</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[12, 24, 36, 48]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 筛选表单
const filterForm = reactive({
  keyword: '',
  category: '',
  minPrice: undefined,
  maxPrice: undefined,
  sort: ''
})

// 分类数据
const categories = ref([
  { id: 1, name: '狗粮' },
  { id: 2, name: '猫粮' },
  { id: 3, name: '宠物玩具' },
  { id: 4, name: '宠物用品' }
])

// 商品数据
const products = ref([
  {
    id: 1,
    name: '优质狗粮',
    description: '精选优质原料，营养均衡',
    price: 99.00,
    sales: 1000,
    imageUrl: 'https://example.com/product1.jpg'
  },
  {
    id: 2,
    name: '猫咪玩具',
    description: '趣味性强，耐玩',
    price: 29.00,
    sales: 800,
    imageUrl: 'https://example.com/product2.jpg'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(12)
const total = ref(100)

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchProducts()
}

// 重置筛选
const resetFilter = () => {
  Object.keys(filterForm).forEach(key => {
    filterForm[key] = ''
  })
  handleSearch()
}

// 查看商品详情
const viewProduct = (id: number) => {
  router.push(`/products/${id}`)
}

// 加入购物车
const addToCart = (id: number) => {
  // TODO: 实现加入购物车逻辑
  ElMessage.success('已添加到购物车')
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchProducts()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchProducts()
}

// 获取商品列表
const fetchProducts = async () => {
  try {
    // TODO: 调用API获取商品列表
    // const res = await getProducts({
    //   ...filterForm,
    //   page: currentPage.value,
    //   pageSize: pageSize.value
    // })
    // products.value = res.data.list
    // total.value = res.data.total
  } catch (error) {
    console.error('获取商品列表失败:', error)
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.product-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.filter-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.price-separator {
  margin: 0 10px;
}

.product-list {
  margin-bottom: 20px;
}

.product-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 14px;
}

.product-info h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.description {
  color: #909399;
  font-size: 14px;
  margin: 8px 0;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
}

.sales {
  color: #909399;
  font-size: 14px;
}

.product-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style> 