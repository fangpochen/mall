<template>
  <div class="shopping-cart">
    <div class="container">
      <div class="cart-header">
        <h2>我的购物车</h2>
        <div class="cart-steps">
          <el-steps :active="1" simple>
            <el-step title="购物车" icon="ShoppingCart" />
            <el-step title="确认订单" icon="List" />
            <el-step title="付款" icon="Money" />
            <el-step title="完成" icon="Check" />
          </el-steps>
        </div>
      </div>
      
      <div v-if="cartItems.length" class="cart-content">
        <div class="cart-list-section">
          <el-table
            ref="cartTable"
            :data="cartItems"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="商品信息" min-width="400">
              <template #default="scope">
                <div class="product-info">
                  <img :src="scope.row.imageUrl" :alt="scope.row.name" class="product-image" />
                  <div class="product-details">
                    <div class="product-name">{{ scope.row.name }}</div>
                    <div v-if="scope.row.specs" class="product-specs">{{ scope.row.specs }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="120">
              <template #default="scope">
                <div class="product-price">¥{{ scope.row.price.toFixed(2) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="150">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.quantity"
                  :min="1"
                  :max="99"
                  size="small"
                  @change="handleQuantityChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="小计" width="120">
              <template #default="scope">
                <div class="subtotal">¥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  text 
                  @click="handleRemoveItem(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <div class="cart-actions">
          <div class="left-actions">
            <el-button @click="handleSelectAll" size="small">
              {{ isAllSelected ? '取消全选' : '全选' }}
            </el-button>
            <el-button @click="handleBatchDelete" size="small" :disabled="selectedItems.length === 0">
              批量删除
            </el-button>
            <el-button @click="handleClearCart" size="small" :disabled="cartItems.length === 0">
              清空购物车
            </el-button>
          </div>
          <div class="cart-summary">
            <div class="summary-item">
              <span>已选商品:</span>
              <span class="value">{{ totalSelectedCount }}件</span>
            </div>
            <div class="summary-item">
              <span>合计:</span>
              <span class="total-price">¥{{ totalAmount.toFixed(2) }}</span>
            </div>
            <el-button
              type="primary"
              size="large"
              :disabled="selectedItems.length === 0"
              @click="handleCheckout"
            >
              去结算
            </el-button>
          </div>
        </div>
      </div>
      
      <div v-else class="empty-cart">
        <el-empty description="购物车还是空的哦，快去选购心仪的商品吧~" :image-size="200">
          <template #default>
            <el-button type="primary" @click="goToHome">
              去购物
            </el-button>
          </template>
        </el-empty>
      </div>
      
      <div class="recommend-section">
        <div class="section-title">
          <h3>猜你喜欢</h3>
        </div>
        <div class="recommend-products">
          <div
            v-for="product in recommendProducts"
            :key="product.id"
            class="recommend-item"
            @click="goToDetail(product.id)"
          >
            <div class="recommend-image">
              <img :src="product.imageUrl" :alt="product.name" />
            </div>
            <div class="recommend-info">
              <div class="recommend-name">{{ product.name }}</div>
              <div class="recommend-price">¥{{ product.price.toFixed(2) }}</div>
              <el-button size="small" type="primary" @click.stop="addToCart(product)">
                加入购物车
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ShoppingCart, List, Money, Check } from '@element-plus/icons-vue'

const router = useRouter()
const cartTable = ref()
const cartItems = ref<any[]>([])
const selectedItems = ref<any[]>([])
const isAllSelected = ref(false)

/**
 * 计算所选商品总数量
 */
const totalSelectedCount = computed(() => {
  return selectedItems.value.reduce((acc, item) => acc + item.quantity, 0)
})

/**
 * 计算所选商品总金额
 */
const totalAmount = computed(() => {
  return selectedItems.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
})

/**
 * 处理商品选择变化
 * @param selection 选中的商品
 * @example
 * handleSelectionChange([{id: '1', name: '商品1', quantity: 2, price: 100}])
 */
const handleSelectionChange = (selection: any[]) => {
  selectedItems.value = selection
  isAllSelected.value = selection.length === cartItems.value.length
}

/**
 * 处理全选/取消全选
 * @example
 * handleSelectAll()
 */
const handleSelectAll = () => {
  if (isAllSelected.value) {
    cartTable.value.clearSelection()
  } else {
    cartItems.value.forEach(item => {
      cartTable.value.toggleRowSelection(item, true)
    })
  }
}

/**
 * 处理数量变化
 * @param item 商品项
 * @example
 * handleQuantityChange({id: '1', quantity: 3})
 */
const handleQuantityChange = (item: any) => {
  // 更新购物车商品数量，这里应该是API调用
  console.log('更新商品数量:', item.id, item.quantity)
  ElMessage.success('商品数量已更新')
}

/**
 * 删除单个商品
 * @param item 商品项
 * @example
 * handleRemoveItem({id: '1'})
 */
const handleRemoveItem = (item: any) => {
  ElMessageBox.confirm('确定要移除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 从购物车移除商品，这里应该是API调用
    cartItems.value = cartItems.value.filter(cartItem => cartItem.id !== item.id)
    ElMessage.success('商品已移除')
  }).catch(() => {
    // 取消操作
  })
}

/**
 * 批量删除所选商品
 * @example
 * handleBatchDelete()
 */
const handleBatchDelete = () => {
  if (selectedItems.value.length === 0) return
  
  ElMessageBox.confirm('确定要移除选中的商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 批量移除商品，这里应该是API调用
    const selectedIds = selectedItems.value.map(item => item.id)
    cartItems.value = cartItems.value.filter(item => !selectedIds.includes(item.id))
    ElMessage.success('已成功移除选中商品')
  }).catch(() => {
    // 取消操作
  })
}

/**
 * 清空购物车
 * @example
 * handleClearCart()
 */
const handleClearCart = () => {
  ElMessageBox.confirm('确定要清空购物车吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 清空购物车，这里应该是API调用
    cartItems.value = []
    ElMessage.success('购物车已清空')
  }).catch(() => {
    // 取消操作
  })
}

/**
 * 跳转到结算页面
 * @example
 * handleCheckout()
 */
const handleCheckout = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请至少选择一件商品')
    return
  }
  
  // 跳转到结算页面，将选中的商品ID传过去
  const selectedIds = selectedItems.value.map(item => item.id).join(',')
  router.push({
    path: '/checkout',
    query: { items: selectedIds }
  })
}

/**
 * 跳转到首页
 * @example
 * goToHome()
 */
const goToHome = () => {
  router.push('/')
}

/**
 * 跳转到商品详情页
 * @param productId 商品ID
 * @example
 * goToDetail('1')
 */
const goToDetail = (productId: string) => {
  router.push(`/product/${productId}`)
}

/**
 * 添加商品到购物车
 * @param product 商品信息
 * @example
 * addToCart({id: '1', name: '商品1', price: 100, imageUrl: 'https://example.com/image.jpg'})
 */
const addToCart = (product: any) => {
  // 检查商品是否已在购物车中
  const existItem = cartItems.value.find(item => item.id === product.id)
  
  if (existItem) {
    existItem.quantity += 1
    ElMessage.success('商品数量已增加')
  } else {
    // 添加新商品到购物车
    cartItems.value.push({
      ...product,
      quantity: 1
    })
    ElMessage.success('商品已添加到购物车')
  }
}

// 推荐商品列表
const recommendProducts = ref([
  {
    id: '101',
    name: '宠物磨牙玩具',
    price: 29.90,
    imageUrl: 'https://picsum.photos/200/200?random=101'
  },
  {
    id: '102',
    name: '猫抓板',
    price: 39.90,
    imageUrl: 'https://picsum.photos/200/200?random=102'
  },
  {
    id: '103',
    name: '宠物训练零食',
    price: 25.80,
    imageUrl: 'https://picsum.photos/200/200?random=103'
  },
  {
    id: '104',
    name: '宠物窝',
    price: 99.00,
    imageUrl: 'https://picsum.photos/200/200?random=104'
  },
  {
    id: '105',
    name: '自动喂食器',
    price: 199.00,
    imageUrl: 'https://picsum.photos/200/200?random=105'
  }
])

/**
 * 获取购物车商品
 * @example
 * fetchCartItems()
 */
const fetchCartItems = () => {
  // 这里应该是API调用获取购物车商品
  // 模拟API请求
  setTimeout(() => {
    cartItems.value = [
      {
        id: '1',
        name: '比瑞吉猫粮10kg',
        price: 299.00,
        quantity: 1,
        specs: '成猫全价粮，鸡肉口味',
        imageUrl: 'https://picsum.photos/200/200?random=1'
      },
      {
        id: '2',
        name: '猫咪自动饮水机',
        price: 129.00,
        quantity: 2,
        specs: '2.4L容量，白色',
        imageUrl: 'https://picsum.photos/200/200?random=2'
      },
      {
        id: '3',
        name: '宠物零食大礼包',
        price: 59.90,
        quantity: 1,
        specs: '混合口味，500g',
        imageUrl: 'https://picsum.photos/200/200?random=3'
      }
    ]
  }, 500)
}

onMounted(() => {
  fetchCartItems()
})
</script>

<style lang="scss" scoped>
.shopping-cart {
  background-color: #f5f5f5;
  padding: 20px 0;
  min-height: calc(100vh - 70px - 230px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.cart-header {
  margin-bottom: 20px;
  
  h2 {
    font-size: 24px;
    font-weight: 500;
    margin: 0 0 20px;
    color: #333;
  }
  
  .cart-steps {
    margin-bottom: 20px;
  }
}

.cart-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  
  .cart-list-section {
    padding: 0;
    
    .product-info {
      display: flex;
      align-items: center;
      
      .product-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 15px;
      }
      
      .product-details {
        .product-name {
          font-size: 14px;
          color: #333;
          margin-bottom: 5px;
        }
        
        .product-specs {
          font-size: 12px;
          color: #999;
        }
      }
    }
    
    .product-price {
      color: #606266;
    }
    
    .subtotal {
      color: #f56c6c;
      font-weight: bold;
    }
  }
  
  .cart-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-top: 1px solid #ebeef5;
    
    .left-actions {
      display: flex;
      gap: 10px;
    }
    
    .cart-summary {
      display: flex;
      align-items: center;
      
      .summary-item {
        margin-right: 20px;
        
        .value {
          color: #f56c6c;
          margin-left: 5px;
        }
        
        .total-price {
          font-size: 20px;
          font-weight: bold;
          color: #f56c6c;
          margin-left: 5px;
        }
      }
    }
  }
}

.empty-cart {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 50px 0;
  margin-bottom: 30px;
}

.recommend-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
  
  .section-title {
    margin-bottom: 20px;
    
    h3 {
      font-size: 18px;
      font-weight: 500;
      color: #333;
      margin: 0;
      position: relative;
      padding-left: 12px;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        background-color: #7e57c2;
        border-radius: 2px;
      }
    }
  }
  
  .recommend-products {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f5f5f5;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: #dcdfe6;
      border-radius: 3px;
    }
    
    .recommend-item {
      flex: 0 0 200px;
      background-color: #fff;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s;
      cursor: pointer;
      
      &:hover {
        transform: translateY(-5px);
      }
      
      .recommend-image {
        height: 150px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .recommend-info {
        padding: 10px;
        
        .recommend-name {
          font-size: 14px;
          color: #333;
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .recommend-price {
          color: #f56c6c;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .el-button {
          width: 100%;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .cart-actions {
    flex-direction: column;
    
    .left-actions {
      margin-bottom: 15px;
      width: 100%;
      justify-content: space-between;
    }
    
    .cart-summary {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style> 