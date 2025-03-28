<template>
  <div class="payment-page">
    <el-card class="payment-card">
      <template #header>
        <div class="payment-header">
          <h2>订单支付</h2>
        </div>
      </template>

      <!-- 订单信息 -->
      <div class="order-info">
        <div class="info-item">
          <span class="label">订单编号：</span>
          <span class="value">{{ orderInfo.orderNo }}</span>
        </div>
        <div class="info-item">
          <span class="label">支付金额：</span>
          <span class="value price">¥{{ orderInfo.totalAmount.toFixed(2) }}</span>
        </div>
        <div class="info-item">
          <span class="label">支付方式：</span>
          <span class="value">{{ paymentMethodText }}</span>
        </div>
      </div>

      <!-- 支付二维码 -->
      <div class="payment-qrcode">
        <div class="qrcode-container">
          <img :src="qrcodeUrl" alt="支付二维码" class="qrcode-image">
          <div class="qrcode-tip">
            <p>请使用{{ paymentMethodText }}扫码支付</p>
            <p class="countdown">支付倒计时：{{ formatTime(countdown) }}</p>
          </div>
        </div>
      </div>

      <!-- 支付结果 -->
      <div v-if="showResult" class="payment-result">
        <el-result
          :icon="paymentSuccess ? 'success' : 'error'"
          :title="paymentSuccess ? '支付成功' : '支付失败'"
          :sub-title="paymentSuccess ? '感谢您的购买' : '请重新尝试支付'"
        >
          <template #extra>
            <el-button type="primary" @click="handleViewOrder">
              查看订单
            </el-button>
            <el-button @click="handleBackToHome">
              返回首页
            </el-button>
          </template>
        </el-result>
      </div>

      <!-- 支付操作 -->
      <div v-else class="payment-actions">
        <el-button @click="handleCancelPayment">
          取消支付
        </el-button>
        <el-button type="primary" @click="handleRefreshPayment">
          刷新二维码
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getOrderDetail,
  getPaymentQrcode,
  checkPaymentStatus
} from '@/utils/api'

const route = useRoute()
const router = useRouter()

// 订单信息
const orderInfo = ref({
  orderNo: '',
  totalAmount: 0,
  paymentMethod: ''
})

// 支付二维码
const qrcodeUrl = ref('')

// 支付结果
const showResult = ref(false)
const paymentSuccess = ref(false)

// 倒计时
const countdown = ref(1800) // 30分钟
let timer: NodeJS.Timer | null = null

// 支付方式文本
const paymentMethodText = computed(() => {
  return orderInfo.value.paymentMethod === 'alipay' ? '支付宝' : '微信'
})

// 格式化时间
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 获取订单详情
const fetchOrderDetail = async () => {
  try {
    const res = await getOrderDetail(route.query.orderId as string)
    if (res.code === 200) {
      orderInfo.value = res.data
      fetchPaymentQrcode()
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  }
}

// 获取支付二维码
const fetchPaymentQrcode = async () => {
  try {
    const res = await getPaymentQrcode({
      orderId: route.query.orderId as string,
      paymentMethod: orderInfo.value.paymentMethod
    })
    if (res.code === 200) {
      qrcodeUrl.value = res.data.qrcodeUrl
      startCountdown()
      startCheckPayment()
    }
  } catch (error) {
    console.error('获取支付二维码失败:', error)
    ElMessage.error('获取支付二维码失败')
  }
}

// 开始倒计时
const startCountdown = () => {
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      stopCountdown()
      handlePaymentTimeout()
    }
  }, 1000)
}

// 停止倒计时
const stopCountdown = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 开始检查支付状态
const startCheckPayment = () => {
  const checkInterval = setInterval(async () => {
    try {
      const res = await checkPaymentStatus(route.query.orderId as string)
      if (res.code === 200) {
        if (res.data.paid) {
          clearInterval(checkInterval)
          handlePaymentSuccess()
        }
      }
    } catch (error) {
      console.error('检查支付状态失败:', error)
    }
  }, 3000) // 每3秒检查一次
}

// 处理支付成功
const handlePaymentSuccess = () => {
  stopCountdown()
  showResult.value = true
  paymentSuccess.value = true
}

// 处理支付超时
const handlePaymentTimeout = () => {
  showResult.value = true
  paymentSuccess.value = false
}

// 刷新支付二维码
const handleRefreshPayment = () => {
  countdown.value = 1800
  fetchPaymentQrcode()
}

// 取消支付
const handleCancelPayment = () => {
  router.push('/order/list')
}

// 查看订单
const handleViewOrder = () => {
  router.push('/order/list')
}

// 返回首页
const handleBackToHome = () => {
  router.push('/home')
}

onMounted(() => {
  fetchOrderDetail()
})

onUnmounted(() => {
  stopCountdown()
})
</script>

<style scoped>
.payment-page {
  padding: 20px;
}

.payment-card {
  max-width: 800px;
  margin: 0 auto;
}

.payment-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.order-info {
  margin-bottom: 30px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.info-item {
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  color: #606266;
  margin-right: 10px;
}

.info-item .value {
  color: #303133;
}

.info-item .price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 20px;
}

.payment-qrcode {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.qrcode-container {
  text-align: center;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
}

.qrcode-tip {
  color: #606266;
}

.qrcode-tip p {
  margin: 5px 0;
}

.countdown {
  color: #f56c6c;
  font-weight: bold;
}

.payment-result {
  margin: 40px 0;
}

.payment-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}
</style> 