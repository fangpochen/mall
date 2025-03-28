<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-card class="filter-container">
      <div class="filter-title">筛选搜索</div>
      <el-form :inline="true" :model="listQuery" size="small">
        <el-form-item label="商品名称：">
          <el-input v-model="listQuery.keyword" placeholder="商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品货号：">
          <el-input v-model="listQuery.productSn" placeholder="商品货号" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类：">
          <el-cascader
            v-model="listQuery.categoryId"
            :options="categoryOptions"
            placeholder="请选择分类"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品品牌：">
          <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
            <el-option
              v-for="item in brandOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上架状态：">
          <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
            <el-option :value="1" label="上架"></el-option>
            <el-option :value="0" label="下架"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 操作按钮 -->
    <el-card class="operate-container">
      <el-button type="primary" size="small" @click="handleAdd">添加商品</el-button>
      <el-button type="danger" size="small" @click="handleBatchDelete">批量删除</el-button>
      <el-button size="small" @click="handleBatchPublish(1)">批量上架</el-button>
      <el-button size="small" @click="handleBatchPublish(0)">批量下架</el-button>
    </el-card>

    <!-- 数据列表 -->
    <el-card>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template #default="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template #default="scope">
            <el-image 
              :src="scope.row.pic"
              :preview-src-list="[scope.row.pic]"
              fit="contain"
              style="width: 80px; height: 80px">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template #default="scope">
            <p>{{scope.row.name}}</p>
            <p class="product-brand">品牌：{{scope.row.brand}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="180" align="center">
          <template #default="scope">
            <p class="price">价格：¥{{scope.row.price}}</p>
            <p>货号：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="库存" width="100" align="center">
          <template #default="scope">{{scope.row.stock}}</template>
        </el-table-column>
        <el-table-column label="状态" width="140" align="center">
          <template #default="scope">
            <p>上架：
              <el-switch
                v-model="scope.row.publishStatus"
                :active-value="1"
                :inactive-value="0"
                @change="handlePublishStatusChange(scope.$index, scope.row)">
              </el-switch>
            </p>
            <p>新品：
              <el-switch
                v-model="scope.row.isNew"
                @change="handleNewStatusChange(scope.$index, scope.row)">
              </el-switch>
            </p>
            <p>热卖：
              <el-switch
                v-model="scope.row.isHot"
                @change="handleHotStatusChange(scope.$index, scope.row)">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button 
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleShowProduct(scope.$index, scope.row)">查看
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.pageNum"
        :page-sizes="[5,10,15]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  getProductList, 
  updatePublishStatus, 
  deleteProduct,
  batchDeleteProduct,
  batchUpdatePublishStatus,
  updateNewStatus,
  updateHotStatus,
  type ProductInfo,
  type ProductQuery,
  categoryOptions,
  brandOptions
} from '@/api/product'
import { ElMessage, ElMessageBox } from 'element-plus'

// 查询参数
const listQuery = ref<ProductQuery>({
  keyword: '',
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  brandId: null,
  categoryId: null,
  productSn: null
})

// 列表数据
const list = ref<ProductInfo[]>([])
const total = ref(0)
const listLoading = ref(false)
const multipleSelection = ref<ProductInfo[]>([])

// 获取商品列表
const getList = async () => {
  try {
    listLoading.value = true
    const res = await getProductList(listQuery.value)
    list.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    console.error('获取商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
  } finally {
    listLoading.value = false
  }
}

// 搜索
const handleSearch = () => {
  listQuery.value.pageNum = 1
  getList()
}

// 重置
const handleReset = () => {
  listQuery.value = {
    keyword: '',
    pageNum: 1,
    pageSize: 5,
    publishStatus: null,
    brandId: null,
    categoryId: null,
    productSn: null
  }
  getList()
}

// 多选
const handleSelectionChange = (val: ProductInfo[]) => {
  multipleSelection.value = val
}

// 批量删除
const handleBatchDelete = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请选择要删除的商品')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定要删除选中的商品吗?', '提示', {
      type: 'warning'
    })
    
    const ids = multipleSelection.value.map(item => item.id)
    await batchDeleteProduct(ids)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    console.error('批量删除失败:', error)
  }
}

// 批量更新上架状态
const handleBatchPublish = async (status: number) => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning('请选择要操作的商品')
    return
  }
  
  try {
    const ids = multipleSelection.value.map(item => item.id)
    await batchUpdatePublishStatus(ids, status)
    ElMessage.success('操作成功')
    getList()
  } catch (error) {
    console.error('批量更新状态失败:', error)
    ElMessage.error('操作失败')
  }
}

// 更新上架状态
const handlePublishStatusChange = async (index: number, row: ProductInfo) => {
  try {
    await updatePublishStatus(row.id, { publishStatus: row.publishStatus })
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新状态失败:', error)
    ElMessage.error('更新失败')
    row.publishStatus = row.publishStatus === 1 ? 0 : 1
  }
}

// 更新新品状态
const handleNewStatusChange = async (index: number, row: ProductInfo) => {
  try {
    await updateNewStatus(row.id, row.isNew)
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新新品状态失败:', error)
    ElMessage.error('更新失败')
    row.isNew = !row.isNew
  }
}

// 更新热卖状态
const handleHotStatusChange = async (index: number, row: ProductInfo) => {
  try {
    await updateHotStatus(row.id, row.isHot)
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新热卖状态失败:', error)
    ElMessage.error('更新失败')
    row.isHot = !row.isHot
  }
}

// 删除商品
const handleDelete = async (index: number, row: ProductInfo) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗?', '提示', {
      type: 'warning'
    })
    
    await deleteProduct(row.id)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

// 分页
const handleSizeChange = (val: number) => {
  listQuery.value.pageSize = val
  getList()
}

const handleCurrentChange = (val: number) => {
  listQuery.value.pageNum = val
  getList()
}

// 初始化
onMounted(() => {
  getList()
})
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}

.filter-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.operate-container {
  margin-bottom: 20px;
}

.product-brand {
  margin-top: 5px;
  color: #999;
  font-size: 13px;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style> 