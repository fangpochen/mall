<template>
  <div class="favorite-page">
    <el-card class="favorite-card">
      <template #header>
        <div class="favorite-header">
          <h2>我的收藏</h2>
          <el-button
            type="danger"
            :disabled="!selectedProducts.length"
            @click="handleBatchRemove"
          >
            批量取消收藏
          </el-button>
        </div>
      </template>

      <!-- 收藏商品列表 -->
      <div class="favorite-content">
        <div v-if="favoriteList.length > 0">
          <el-table
            :data="favoriteList"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="商品信息" min-width="400">
              <template #default="{ row }">
                <div class="product-info">
                  <el-image
                    :src="row.productImage"
                    :alt="row.productName"
                    class="product-image"
                  />
                  <div class="product-detail">
                    <h3 class="product-name">{{ row.productName }}</h3>
                    <p class="product-spec">{{ row.spec }}</p>
                    <div class="product-price">
                      <span class="price">¥{{ row.price }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="收藏时间" width="180">
              <template #default="{ row }">
                {{ row.createTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  link
                  @click="handleViewProduct(row)"
                >
                  查看商品
                </el-button>
                <el-button
                  type="danger"
                  link
                  @click="handleRemove(row)"
                >
                  取消收藏
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>

        <!-- 空收藏 -->
        <el-empty
          v-else
          description="暂无收藏商品"
        >
          <el-button type="primary" @click="$router.push('/home')">
            去购物
          </el-button>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getFavoriteList,
  removeFavorite,
  batchRemoveFavorite
} from '@/utils/api'

const router = useRouter()

// 收藏列表数据
const favoriteList = ref([])
const selectedProducts = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取收藏列表
const fetchFavoriteList = async () => {
  try {
    const res = await getFavoriteList({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    if (res.code === 200) {
      favoriteList.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取收藏列表失败:', error)
    ElMessage.error('获取收藏列表失败')
  }
}

// 选择商品变化
const handleSelectionChange = (selection: any[]) => {
  selectedProducts.value = selection
}

// 查看商品
const handleViewProduct = (product: any) => {
  router.push(`/product/detail/${product.productId}`)
}

// 取消收藏
const handleRemove = async (product: any) => {
  try {
    await ElMessageBox.confirm('确定要取消收藏该商品吗？', '提示', {
      type: 'warning'
    })
    const res = await removeFavorite(product.id)
    if (res.code === 200) {
      ElMessage.success('取消收藏成功')
      fetchFavoriteList()
    } else {
      ElMessage.error(res.message || '取消收藏失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消收藏失败:', error)
      ElMessage.error('取消收藏失败')
    }
  }
}

// 批量取消收藏
const handleBatchRemove = async () => {
  if (!selectedProducts.value.length) {
    ElMessage.warning('请选择要取消收藏的商品')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要取消收藏选中的 ${selectedProducts.value.length} 件商品吗？`,
      '提示',
      {
        type: 'warning'
      }
    )
    const res = await batchRemoveFavorite(
      selectedProducts.value.map(product => product.id)
    )
    if (res.code === 200) {
      ElMessage.success('取消收藏成功')
      fetchFavoriteList()
    } else {
      ElMessage.error(res.message || '取消收藏失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量取消收藏失败:', error)
      ElMessage.error('批量取消收藏失败')
    }
  }
}

// 分页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchFavoriteList()
}

// 当前页变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchFavoriteList()
}

onMounted(() => {
  fetchFavoriteList()
})
</script>

<style scoped>
.favorite-page {
  padding: 20px;
}

.favorite-card {
  max-width: 1200px;
  margin: 0 auto;
}

.favorite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.favorite-content {
  min-height: 400px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
}

.product-detail {
  flex: 1;
}

.product-name {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #303133;
}

.product-spec {
  margin: 0 0 5px 0;
  font-size: 12px;
  color: #909399;
}

.product-price {
  color: #f56c6c;
  font-weight: bold;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 