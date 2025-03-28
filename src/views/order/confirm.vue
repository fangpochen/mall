<template>
  <div class="order-confirm">
    <el-card class="confirm-card">
      <template #header>
        <div class="confirm-header">
          <h2>确认订单</h2>
        </div>
      </template>

      <!-- 收货地址 -->
      <div class="section">
        <div class="section-header">
          <h3>收货地址</h3>
          <el-button type="primary" link @click="handleAddAddress">
            添加新地址
          </el-button>
        </div>
        <div class="address-list">
          <el-radio-group v-model="selectedAddress">
            <el-radio
              v-for="address in addresses"
              :key="address.id"
              :label="address.id"
              class="address-item"
            >
              <div class="address-content">
                <div class="address-info">
                  <span class="name">{{ address.name }}</span>
                  <span class="phone">{{ address.phone }}</span>
                </div>
                <div class="address-detail">
                  {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
                </div>
              </div>
            </el-radio>
          </el-radio-group>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="section">
        <div class="section-header">
          <h3>商品信息</h3>
        </div>
        <el-table :data="orderItems" style="width: 100%">
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
          <el-table-column label="数量" width="120">
            <template #default="{ row }">
              <span>{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column label="小计" width="120">
            <template #default="{ row }">
              <span class="subtotal">¥{{ (row.price * row.quantity).toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 订单备注 -->
      <div class="section">
        <div class="section-header">
          <h3>订单备注</h3>
        </div>
        <el-input
          v-model="remark"
          type="textarea"
          :rows="3"
          placeholder="请输入订单备注（选填）"
        />
      </div>

      <!-- 支付方式 -->
      <div class="section">
        <div class="section-header">
          <h3>支付方式</h3>
        </div>
        <el-radio-group v-model="paymentMethod">
          <el-radio label="alipay">支付宝</el-radio>
          <el-radio label="wechat">微信支付</el-radio>
        </el-radio-group>
      </div>

      <!-- 订单金额 -->
      <div class="order-amount">
        <div class="amount-item">
          <span>商品总额：</span>
          <span>¥{{ totalAmount.toFixed(2) }}</span>
        </div>
        <div class="amount-item">
          <span>运费：</span>
          <span>¥{{ shippingFee.toFixed(2) }}</span>
        </div>
        <div class="amount-item total">
          <span>实付金额：</span>
          <span class="price">¥{{ actualAmount.toFixed(2) }}</span>
        </div>
      </div>

      <!-- 提交订单 -->
      <div class="submit-order">
        <el-button
          type="primary"
          size="large"
          :disabled="!selectedAddress"
          @click="handleSubmitOrder"
        >
          提交订单
        </el-button>
      </div>
    </el-card>

    <!-- 添加地址对话框 -->
    <el-dialog
      v-model="addressDialogVisible"
      title="添加收货地址"
      width="500px"
    >
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        :rules="addressRules"
        label-width="100px"
      >
        <el-form-item label="收货人" prop="name">
          <el-input v-model="addressForm.name" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addressForm.phone" />
        </el-form-item>
        <el-form-item label="所在地区" prop="region">
          <el-cascader
            v-model="addressForm.region"
            :options="regionOptions"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input
            v-model="addressForm.detail"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addressDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveAddress">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getAddressList,
  addAddress,
  createOrder
} from '@/utils/api'

const route = useRoute()
const router = useRouter()

// 订单商品
const orderItems = ref([])

// 收货地址
const addresses = ref([])
const selectedAddress = ref('')
const addressDialogVisible = ref(false)
const addressFormRef = ref()
const addressForm = ref({
  name: '',
  phone: '',
  region: [],
  detail: ''
})

// 地址表单验证规则
const addressRules = {
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  region: [
    { required: true, message: '请选择所在地区', trigger: 'change' }
  ],
  detail: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
}

// 订单备注
const remark = ref('')

// 支付方式
const paymentMethod = ref('alipay')

// 运费
const shippingFee = ref(0)

// 计算总金额
const totalAmount = computed(() => {
  return orderItems.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})

// 计算实付金额
const actualAmount = computed(() => {
  return totalAmount.value + shippingFee.value
})

// 获取收货地址列表
const fetchAddressList = async () => {
  try {
    const res = await getAddressList()
    if (res.code === 200) {
      addresses.value = res.data
      if (res.data.length > 0) {
        selectedAddress.value = res.data[0].id
      }
    }
  } catch (error) {
    console.error('获取收货地址失败:', error)
    ElMessage.error('获取收货地址失败')
  }
}

// 添加新地址
const handleAddAddress = () => {
  addressDialogVisible.value = true
  addressForm.value = {
    name: '',
    phone: '',
    region: [],
    detail: ''
  }
}

// 保存地址
const handleSaveAddress = async () => {
  if (!addressFormRef.value) return
  
  try {
    await addressFormRef.value.validate()
    const res = await addAddress({
      name: addressForm.value.name,
      phone: addressForm.value.phone,
      province: addressForm.value.region[0],
      city: addressForm.value.region[1],
      district: addressForm.value.region[2],
      detail: addressForm.value.detail
    })
    
    if (res.code === 200) {
      ElMessage.success('添加成功')
      addressDialogVisible.value = false
      fetchAddressList()
    } else {
      ElMessage.error(res.message || '添加失败')
    }
  } catch (error) {
    console.error('添加地址失败:', error)
    ElMessage.error('添加地址失败')
  }
}

// 提交订单
const handleSubmitOrder = async () => {
  try {
    const res = await createOrder({
      addressId: selectedAddress.value,
      items: orderItems.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      remark: remark.value,
      paymentMethod: paymentMethod.value
    })
    
    if (res.code === 200) {
      ElMessage.success('订单创建成功')
      router.push({
        path: '/order/payment',
        query: {
          orderId: res.data.orderId
        }
      })
    } else {
      ElMessage.error(res.message || '订单创建失败')
    }
  } catch (error) {
    console.error('创建订单失败:', error)
    ElMessage.error('创建订单失败')
  }
}

onMounted(() => {
  // 解析路由参数中的商品信息
  const items = JSON.parse(route.query.items as string)
  orderItems.value = items
  
  // 获取收货地址列表
  fetchAddressList()
})
</script>

<style scoped>
.order-confirm {
  padding: 20px;
}

.confirm-card {
  max-width: 1200px;
  margin: 0 auto;
}

.confirm-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.address-list {
  margin-top: 10px;
}

.address-item {
  display: block;
  margin-bottom: 10px;
  padding: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.address-item.is-checked {
  border-color: var(--el-color-primary);
}

.address-content {
  margin-left: 10px;
}

.address-info {
  margin-bottom: 5px;
}

.address-info .name {
  font-weight: bold;
  margin-right: 20px;
}

.address-info .phone {
  color: #606266;
}

.address-detail {
  color: #606266;
  font-size: 14px;
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

.order-amount {
  margin-top: 30px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.amount-item {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  color: #606266;
}

.amount-item.total {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #dcdfe6;
  font-size: 16px;
}

.submit-order {
  margin-top: 30px;
  text-align: right;
}
</style> 