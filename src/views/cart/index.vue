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
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

// 页面状态
const loading = ref(false)
const submitting = ref(false)
const cartItems = ref([])
const cartPromotions = ref([])
const selectedItems = ref([])

// 计算总价
const totalPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})

// 计算总数
const totalCount = computed(() => {
  if (!selectedItems.value.length) return 0
  
  return selectedItems.value.reduce((sum, id) => {
    const item = cartItems.value.find(item => item.id === id)
    return sum + (item ? item.quantity : 0)
  }, 0)
})

// 是否全选
const isAllSelected = computed(() => {
  return cartItems.value.length > 0 && selectedItems.value.length === cartItems.value.length
})

// 获取购物车列表
const fetchCartList = async () => {
  loading.value = true
  try {
    const res = await getCartList()
    if (res.code === 200) {
      cartItems.value = res.data || []
      
      // 默认全选
      selectedItems.value = cartItems.value.map(item => item.id)
      
      // 获取促销信息
      fetchCartPromotions()
    }
  } catch (error) {
    console.error('获取购物车列表失败', error)
    ElMessage.error('获取购物车列表失败')
  } finally {
    loading.value = false
  }
}

// 获取促销信息
const fetchCartPromotions = async () => {
  if (cartItems.value.length === 0) return
  
  try {
    const cartIds = cartItems.value.map(item => item.id)
    const res = await cartListPromotion(cartIds)
    if (res.code === 200) {
      cartPromotions.value = res.data || []
      
      // 更新购物车项的促销信息
      cartItems.value = cartItems.value.map(item => {
        const promotionItem = cartPromotions.value.find(p => p.id === item.id)
        if (promotionItem) {
          return {
            ...item,
            promotionMessage: promotionItem.promotionMessage,
            reduceAmount: promotionItem.reduceAmount
          }
        }
        return item
      })
    }
  } catch (error) {
    console.error('获取促销信息失败', error)
  }
}

// 更新购物车商品数量
const handleUpdateQuantity = async (item, quantity) => {
  if (quantity < 1) {
    ElMessage.warning('数量不能小于1')
    return
  }
  
  if (quantity > 99) {
    ElMessage.warning('数量不能大于99')
    return
  }
  
  try {
    const res = await updateQuantity(item.id, quantity)
    if (res.code === 200) {
      // 更新本地数据
      const index = cartItems.value.findIndex(i => i.id === item.id)
      if (index !== -1) {
        cartItems.value[index].quantity = quantity
      }
      ElMessage.success('更新数量成功')
    }
  } catch (error) {
    console.error('更新购物车数量失败', error)
    ElMessage.error('更新购物车数量失败')
  }
}

// 删除购物车商品
const handleDeleteItem = async (item) => {
  ElMessageBox.confirm('确定要删除这件商品吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteCartItem([item.id])
      if (res.code === 200) {
        // 移除本地数据
        cartItems.value = cartItems.value.filter(i => i.id !== item.id)
        // 同时从选中项中移除
        selectedItems.value = selectedItems.value.filter(id => id !== item.id)
        ElMessage.success('删除成功')
      }
    } catch (error) {
      console.error('删除购物车商品失败', error)
      ElMessage.error('删除购物车商品失败')
    }
  }).catch(() => {})
}

// 清空购物车
const handleClearCart = () => {
  if (cartItems.value.length === 0) {
    ElMessage.warning('购物车已经是空的了')
    return
  }
  
  ElMessageBox.confirm('确定要清空购物车吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await clear()
      if (res.code === 200) {
        cartItems.value = []
        selectedItems.value = []
        ElMessage.success('购物车已清空')
      }
    } catch (error) {
      console.error('清空购物车失败', error)
      ElMessage.error('清空购物车失败')
    }
  }).catch(() => {})
}

// 处理选择所有项
const handleSelectAll = (value) => {
  selectedItems.value = value ? cartItems.value.map(item => item.id) : []
}

// 处理选择单个项
const handleSelectItem = (item, selected) => {
  if (selected) {
    selectedItems.value.push(item.id)
  } else {
    selectedItems.value = selectedItems.value.filter(id => id !== item.id)
  }
}

// 是否选中
const isItemSelected = (item) => {
  return selectedItems.value.includes(item.id)
}

// 去结算
const handleCheckout = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请至少选择一件商品')
    return
  }
  
  router.push({
    path: '/order/confirm',
    query: { cartIds: selectedItems.value.join(',') }
  })
}

// 继续购物
const handleContinueShopping = () => {
  router.push('/')
}

// 页面初始化
onMounted(() => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push({
      path: '/login',
      query: { redirect: '/cart' }
    })
    return
  }
  
  // 获取购物车列表
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