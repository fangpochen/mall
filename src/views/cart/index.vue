<template>
  <div class="cart-container">
    <h2>我的购物车</h2>
    
    <!-- 购物车列表 -->
    <div class="cart-list" v-if="cartItems.length">
      <el-table
        :data="cartItems"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品信息">
          <template #default="{ row }">
            <div class="product-info">
              <img :src="row.imageUrl" :alt="row.name" class="product-image">
              <div class="product-detail">
                <h3>{{ row.name }}</h3>
                <p class="spec">{{ row.spec }}</p>
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
              @click="handleRemove(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 空购物车 -->
    <div v-else class="empty-cart">
      <el-empty description="购物车是空的">
        <el-button type="primary" @click="$router.push('/products')">
          去购物
        </el-button>
      </el-empty>
    </div>

    <!-- 购物车底部 -->
    <div v-if="cartItems.length" class="cart-footer">
      <div class="cart-footer-left">
        <el-checkbox
          v-model="isAllSelected"
          @change="handleSelectAll"
        >
          全选
        </el-checkbox>
        <el-button
          type="danger"
          link
          @click="handleClearSelected"
        >
          删除选中商品
        </el-button>
      </div>
      <div class="cart-footer-right">
        <div class="total-info">
          <span>已选择 {{ selectedItems.length }} 件商品</span>
          <span class="total-price">
            合计：<span class="price">¥{{ totalPrice.toFixed(2) }}</span>
          </span>
        </div>
        <el-button
          type="primary"
          size="large"
          :disabled="!selectedItems.length"
          @click="handleCheckout"
        >
          结算
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 购物车数据
const cartItems = ref([
  {
    id: 1,
    name: '优质狗粮',
    spec: '2kg',
    price: 99.00,
    quantity: 2,
    stock: 10,
    imageUrl: 'https://example.com/product1.jpg'
  },
  {
    id: 2,
    name: '猫咪玩具',
    spec: '标准款',
    price: 29.00,
    quantity: 1,
    stock: 20,
    imageUrl: 'https://example.com/product2.jpg'
  }
])

// 选中的商品
const selectedItems = ref<any[]>([])

// 是否全选
const isAllSelected = computed(() => {
  return cartItems.value.length > 0 && selectedItems.value.length === cartItems.value.length
})

// 总价
const totalPrice = computed(() => {
  return selectedItems.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})

// 选择商品
const handleSelectionChange = (selection: any[]) => {
  selectedItems.value = selection
}

// 全选/取消全选
const handleSelectAll = (val: boolean) => {
  if (val) {
    selectedItems.value = [...cartItems.value]
  } else {
    selectedItems.value = []
  }
}

// 修改商品数量
const handleQuantityChange = (item: any) => {
  // TODO: 调用API更新购物车商品数量
  // updateCartItemQuantity(item.id, item.quantity)
}

// 删除商品
const handleRemove = (item: any) => {
  ElMessageBox.confirm(
    '确定要删除这个商品吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用API删除购物车商品
    // removeCartItem(item.id)
    const index = cartItems.value.findIndex(i => i.id === item.id)
    if (index > -1) {
      cartItems.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}

// 删除选中商品
const handleClearSelected = () => {
  if (!selectedItems.value.length) {
    ElMessage.warning('请选择要删除的商品')
    return
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedItems.value.length} 件商品吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用API批量删除购物车商品
    // removeCartItems(selectedItems.value.map(item => item.id))
    const selectedIds = selectedItems.value.map(item => item.id)
    cartItems.value = cartItems.value.filter(item => !selectedIds.includes(item.id))
    selectedItems.value = []
    ElMessage.success('删除成功')
  })
}

// 结算
const handleCheckout = () => {
  if (!selectedItems.value.length) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  router.push('/checkout')
}

// 获取购物车数据
const fetchCartItems = async () => {
  try {
    // TODO: 调用API获取购物车数据
    // const res = await getCartItems()
    // cartItems.value = res.data
  } catch (error) {
    console.error('获取购物车数据失败:', error)
  }
}

onMounted(() => {
  fetchCartItems()
})
</script>

<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #303133;
}

.cart-list {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-detail h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.spec {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.subtotal {
  color: #f56c6c;
  font-weight: bold;
}

.empty-cart {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
}

.cart-footer {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-footer-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.cart-footer-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-info {
  text-align: right;
}

.total-info span {
  display: block;
  color: #606266;
  margin-bottom: 5px;
}

.total-price {
  font-size: 18px;
}

.total-price .price {
  font-size: 24px;
}
</style> 