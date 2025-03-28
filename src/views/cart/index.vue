<template>
  <div class="cart-page">
    <el-card class="cart-card">
      <template #header>
        <div class="cart-header">
          <h2>我的购物车</h2>
          <el-button type="danger" @click="handleClearCart">清空购物车</el-button>
        </div>
      </template>

      <!-- 购物车列表 -->
      <div v-if="cartItems.length > 0" class="cart-content">
        <el-table
          :data="cartItems"
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
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="120">
            <template #default="{ row }">
              <span class="price">¥{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="200">
            <template #default="{ row }">
              <el-input-number
                v-model="row.quantity"
                :min="1"
                :max="row.stock"
                @change="handleQuantityChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="{ row }">
              <span class="subtotal">¥{{ (row.price * row.quantity).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button
                type="danger"
                link
                @click="handleRemoveItem(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 购物车底部 -->
        <div class="cart-footer">
          <div class="cart-summary">
            <div class="selected-count">
              已选择 <span class="highlight">{{ selectedItems.length }}</span> 件商品
            </div>
            <div class="total-price">
              合计：<span class="highlight">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>
          <el-button
            type="primary"
            size="large"
            :disabled="selectedItems.length === 0"
            @click="handleCheckout"
          >
            结算
          </el-button>
        </div>
      </div>

      <!-- 空购物车 -->
      <div v-else class="empty-cart">
        <el-empty description="购物车是空的">
          <el-button type="primary" @click="$router.push('/home')">
            去购物
          </el-button>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getCartList,
  updateCartQuantity,
  removeCartItem,
  clearCart
} from '@/utils/api'

const router = useRouter()
const cartItems = ref([])
const selectedItems = ref([])

// 计算总价
const totalPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})

// 获取购物车列表
const fetchCartList = async () => {
  try {
    const res = await getCartList()
    if (res.code === 200) {
      cartItems.value = res.data
    }
  } catch (error) {
    console.error('获取购物车列表失败:', error)
    ElMessage.error('获取购物车列表失败')
  }
}

// 选择商品变化
const handleSelectionChange = (selection: any[]) => {
  selectedItems.value = selection
}

// 修改商品数量
const handleQuantityChange = async (item: any) => {
  try {
    const res = await updateCartQuantity({
      id: item.id,
      quantity: item.quantity
    })
    if (res.code === 200) {
      ElMessage.success('更新成功')
    } else {
      ElMessage.error(res.message || '更新失败')
    }
  } catch (error) {
    console.error('更新数量失败:', error)
    ElMessage.error('更新数量失败')
  }
}

// 删除商品
const handleRemoveItem = async (item: any) => {
  try {
    await ElMessageBox.confirm('确定要删除这个商品吗？', '提示', {
      type: 'warning'
    })
    const res = await removeCartItem(item.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchCartList()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除商品失败:', error)
      ElMessage.error('删除商品失败')
    }
  }
}

// 清空购物车
const handleClearCart = async () => {
  try {
    await ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
      type: 'warning'
    })
    const res = await clearCart()
    if (res.code === 200) {
      ElMessage.success('清空成功')
      cartItems.value = []
      selectedItems.value = []
    } else {
      ElMessage.error(res.message || '清空失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('清空购物车失败:', error)
      ElMessage.error('清空购物车失败')
    }
  }
}

// 结算
const handleCheckout = () => {
  const items = selectedItems.value.map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }))
  router.push({
    path: '/order/confirm',
    query: {
      items: JSON.stringify(items)
    }
  })
}

onMounted(() => {
  fetchCartList()
})
</script>

<style scoped>
.cart-page {
  padding: 20px;
}

.cart-card {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
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
  margin: 0;
  font-size: 12px;
  color: #909399;
}

.price,
.subtotal {
  color: #f56c6c;
  font-weight: bold;
}

.cart-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.cart-summary {
  display: flex;
  align-items: center;
  gap: 20px;
}

.highlight {
  color: #f56c6c;
  font-weight: bold;
}

.empty-cart {
  padding: 40px 0;
}
</style> 