<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <!-- 左侧菜单 -->
      <el-col :span="6">
        <el-card class="menu-card">
          <el-menu
            :default-active="activeMenu"
            class="profile-menu"
            @select="handleMenuSelect"
          >
            <el-menu-item index="profile">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="pets">
              <el-icon><Pet /></el-icon>
              <span>宠物档案</span>
            </el-menu-item>
            <el-menu-item index="orders">
              <el-icon><List /></el-icon>
              <span>我的订单</span>
            </el-menu-item>
            <el-menu-item index="favorites">
              <el-icon><Star /></el-icon>
              <span>我的收藏</span>
            </el-menu-item>
            <el-menu-item index="address">
              <el-icon><Location /></el-icon>
              <span>收货地址</span>
            </el-menu-item>
            <el-menu-item index="security">
              <el-icon><Lock /></el-icon>
              <span>账号安全</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :span="18">
        <!-- 个人信息 -->
        <el-card v-if="activeMenu === 'profile'" class="content-card">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
              <el-button type="primary" @click="handleEdit">编辑资料</el-button>
            </div>
          </template>
          <div class="profile-info">
            <div class="avatar-section">
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :disabled="!isEditing"
              >
                <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </div>
            <div class="info-section">
              <div class="info-item">
                <span class="label">用户名：</span>
                <span class="value">{{ profileForm.username }}</span>
              </div>
              <div class="info-item">
                <span class="label">昵称：</span>
                <span class="value">{{ profileForm.nickname }}</span>
              </div>
              <div class="info-item">
                <span class="label">手机号：</span>
                <span class="value">{{ profileForm.phone }}</span>
              </div>
              <div class="info-item">
                <span class="label">邮箱：</span>
                <span class="value">{{ profileForm.email }}</span>
              </div>
              <div class="info-item">
                <span class="label">性别：</span>
                <span class="value">{{ profileForm.gender === 1 ? '男' : '女' }}</span>
              </div>
              <div class="info-item">
                <span class="label">生日：</span>
                <span class="value">{{ profileForm.birthday }}</span>
              </div>
              <div class="info-item">
                <span class="label">城市：</span>
                <span class="value">{{ profileForm.city }}</span>
              </div>
              <div class="info-item">
                <span class="label">职业：</span>
                <span class="value">{{ profileForm.job }}</span>
              </div>
              <div class="info-item">
                <span class="label">个性签名：</span>
                <span class="value">{{ profileForm.signature }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 宠物档案 -->
        <el-card v-if="activeMenu === 'pets'" class="content-card">
          <template #header>
            <div class="card-header">
              <span>宠物档案</span>
              <el-button type="primary" @click="handleAddPet">添加宠物</el-button>
            </div>
          </template>
          <div class="pets-list">
            <el-row :gutter="20">
              <el-col v-for="pet in pets" :key="pet.id" :span="8">
                <el-card class="pet-card" :body-style="{ padding: '0px' }">
                  <img :src="pet.image" class="pet-image">
                  <div class="pet-info">
                    <h3>{{ pet.name }}</h3>
                    <p>品种：{{ pet.breed }}</p>
                    <p>年龄：{{ pet.age }}岁</p>
                    <p>体重：{{ pet.weight }}kg</p>
                    <div class="pet-actions">
                      <el-button type="primary" link @click="handleEditPet(pet)">编辑</el-button>
                      <el-button type="danger" link @click="handleDeletePet(pet)">删除</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <!-- 我的订单 -->
        <el-card v-if="activeMenu === 'orders'" class="content-card">
          <template #header>
            <div class="card-header">
              <span>我的订单</span>
            </div>
          </template>
          <el-tabs v-model="activeOrderTab">
            <el-tab-pane label="全部订单" name="all">
              <order-list :orders="orders" />
            </el-tab-pane>
            <el-tab-pane label="待付款" name="unpaid">
              <order-list :orders="unpaidOrders" />
            </el-tab-pane>
            <el-tab-pane label="待发货" name="unshipped">
              <order-list :orders="unshippedOrders" />
            </el-tab-pane>
            <el-tab-pane label="待收货" name="unreceived">
              <order-list :orders="unreceivedOrders" />
            </el-tab-pane>
            <el-tab-pane label="已完成" name="completed">
              <order-list :orders="completedOrders" />
            </el-tab-pane>
          </el-tabs>
        </el-card>

        <!-- 我的收藏 -->
        <el-card v-if="activeMenu === 'favorites'" class="content-card">
          <template #header>
            <div class="card-header">
              <span>我的收藏</span>
            </div>
          </template>
          <div class="favorites-list">
            <el-row :gutter="20">
              <el-col v-for="item in favorites" :key="item.id" :span="6">
                <el-card class="favorite-card" :body-style="{ padding: '0px' }">
                  <img :src="item.imageUrl" class="favorite-image">
                  <div class="favorite-info">
                    <h3>{{ item.name }}</h3>
                    <p class="price">¥{{ item.price }}</p>
                    <div class="favorite-actions">
                      <el-button type="primary" link @click="viewProduct(item.id)">查看</el-button>
                      <el-button type="danger" link @click="removeFavorite(item.id)">取消收藏</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <!-- 收货地址 -->
        <el-card v-if="activeMenu === 'address'" class="content-card">
          <template #header>
            <div class="card-header">
              <span>收货地址</span>
              <el-button type="primary" @click="handleAddAddress">新增地址</el-button>
            </div>
          </template>
          <div class="address-list">
            <el-card v-for="address in addresses" :key="address.id" class="address-card">
              <div class="address-info">
                <div class="address-header">
                  <span class="name">{{ address.name }}</span>
                  <span class="phone">{{ address.phone }}</span>
                  <el-tag v-if="address.isDefault" type="success" size="small">默认地址</el-tag>
                </div>
                <div class="address-detail">
                  {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
                </div>
              </div>
              <div class="address-actions">
                <el-button type="primary" link @click="handleEditAddress(address)">编辑</el-button>
                <el-button type="danger" link @click="handleDeleteAddress(address)">删除</el-button>
                <el-button
                  v-if="!address.isDefault"
                  type="success"
                  link
                  @click="setDefaultAddress(address)"
                >
                  设为默认
                </el-button>
              </div>
            </el-card>
          </div>
        </el-card>

        <!-- 账号安全 -->
        <el-card v-if="activeMenu === 'security'" class="content-card">
          <template #header>
            <div class="card-header">
              <span>账号安全</span>
            </div>
          </template>
          <div class="security-list">
            <div class="security-item">
              <div class="security-info">
                <h3>登录密码</h3>
                <p>定期更换密码可以保护账号安全</p>
              </div>
              <el-button type="primary" @click="handleChangePassword">修改密码</el-button>
            </div>
            <div class="security-item">
              <div class="security-info">
                <h3>手机绑定</h3>
                <p>已绑定手机：{{ profileForm.phone }}</p>
              </div>
              <el-button type="primary" @click="handleChangePhone">更换手机</el-button>
            </div>
            <div class="security-item">
              <div class="security-info">
                <h3>邮箱绑定</h3>
                <p>已绑定邮箱：{{ profileForm.email }}</p>
              </div>
              <el-button type="primary" @click="handleChangeEmail">更换邮箱</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Pet,
  List,
  Star,
  Location,
  Lock,
  Plus
} from '@element-plus/icons-vue'
import { getUserInfo, updateUserInfo } from '@/utils/api'

// 用户信息
const profileFormRef = ref(null)
const isEditing = ref(false)

const profileForm = reactive({
  avatar: '',
  username: '',
  nickname: '',
  phone: '',
  email: '',
  gender: 1,
  birthday: '',
  city: '',
  job: '',
  signature: ''
})

const profileRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
})

// 宠物信息
const pets = ref([
  {
    id: 1,
    name: '小白',
    breed: '金毛',
    age: 2,
    weight: 25,
    image: 'https://example.com/pet1.jpg'
  }
])

// 订单信息
const orders = ref([])
const unpaidOrders = ref([])
const unshippedOrders = ref([])
const unreceivedOrders = ref([])
const completedOrders = ref([])

// 收藏商品
const favorites = ref([
  {
    id: 1,
    name: '优质狗粮',
    price: 99.00,
    imageUrl: 'https://example.com/product1.jpg'
  }
])

// 收货地址
const addresses = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园路123号',
    isDefault: true
  }
])

// 状态变量
const activeMenu = ref('profile')
const activeOrderTab = ref('all')

// 菜单选择
const handleMenuSelect = (index: string) => {
  activeMenu.value = index
}

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await getUserInfo()
    if (res.code === 200) {
      Object.assign(profileForm, res.data)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
}

// 编辑资料
const handleEdit = () => {
  isEditing.value = true
}

// 保存资料
const handleSave = async () => {
  if (!profileFormRef.value) return
  
  try {
    await profileFormRef.value.validate()
    const res = await updateUserInfo(profileForm)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      isEditing.value = false
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请稍后重试')
  }
}

// 取消编辑
const handleCancel = () => {
  isEditing.value = false
  fetchUserInfo() // 重新获取用户信息，放弃修改
}

// 头像上传成功
const handleAvatarSuccess = (response: any) => {
  if (response.code === 200) {
    profileForm.avatar = response.data
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error('头像上传失败')
  }
}

// 头像上传前校验
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 宠物相关操作
const handleAddPet = () => {
  // TODO: 实现添加宠物逻辑
}

const handleEditPet = (pet: any) => {
  // TODO: 实现编辑宠物逻辑
}

const handleDeletePet = (pet: any) => {
  ElMessageBox.confirm(
    '确定要删除这个宠物档案吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除宠物逻辑
    const index = pets.value.findIndex(p => p.id === pet.id)
    if (index > -1) {
      pets.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}

// 收藏相关操作
const viewProduct = (id: number) => {
  // TODO: 实现查看商品逻辑
}

const removeFavorite = (id: number) => {
  ElMessageBox.confirm(
    '确定要取消收藏这个商品吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现取消收藏逻辑
    const index = favorites.value.findIndex(f => f.id === id)
    if (index > -1) {
      favorites.value.splice(index, 1)
      ElMessage.success('已取消收藏')
    }
  })
}

// 地址相关操作
const handleAddAddress = () => {
  // TODO: 实现添加地址逻辑
}

const handleEditAddress = (address: any) => {
  // TODO: 实现编辑地址逻辑
}

const handleDeleteAddress = (address: any) => {
  ElMessageBox.confirm(
    '确定要删除这个地址吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现删除地址逻辑
    const index = addresses.value.findIndex(a => a.id === address.id)
    if (index > -1) {
      addresses.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}

const setDefaultAddress = (address: any) => {
  // TODO: 实现设置默认地址逻辑
  addresses.value.forEach(a => {
    a.isDefault = a.id === address.id
  })
  ElMessage.success('设置成功')
}

// 安全相关操作
const handleChangePassword = () => {
  // TODO: 实现修改密码逻辑
}

const handleChangePhone = () => {
  // TODO: 实现更换手机逻辑
}

const handleChangeEmail = () => {
  // TODO: 实现更换邮箱逻辑
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.menu-card {
  margin-bottom: 20px;
}

.profile-menu {
  border-right: none;
}

.content-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-info {
  display: flex;
  gap: 40px;
}

.avatar-section {
  text-align: center;
}

.avatar-uploader {
  margin-top: 10px;
}

.info-section {
  flex: 1;
}

.info-item {
  margin-bottom: 15px;
}

.info-item .label {
  color: #606266;
  margin-right: 10px;
}

.pets-list {
  margin-top: 20px;
}

.pet-card {
  margin-bottom: 20px;
}

.pet-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.pet-info {
  padding: 14px;
}

.pet-info h3 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #303133;
}

.pet-info p {
  margin: 5px 0;
  color: #606266;
}

.pet-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.favorites-list {
  margin-top: 20px;
}

.favorite-card {
  margin-bottom: 20px;
}

.favorite-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.favorite-info {
  padding: 14px;
}

.favorite-info h3 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #303133;
}

.favorite-info .price {
  color: #f56c6c;
  font-weight: bold;
  margin: 10px 0;
}

.favorite-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.address-list {
  margin-top: 20px;
}

.address-card {
  margin-bottom: 20px;
}

.address-info {
  margin-bottom: 15px;
}

.address-header {
  margin-bottom: 10px;
}

.address-header .name {
  font-weight: bold;
  margin-right: 10px;
}

.address-header .phone {
  color: #606266;
  margin-right: 10px;
}

.address-detail {
  color: #606266;
  line-height: 1.6;
}

.address-actions {
  display: flex;
  gap: 10px;
}

.security-list {
  margin-top: 20px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #ebeef5;
}

.security-item:last-child {
  border-bottom: none;
}

.security-info h3 {
  margin: 0 0 5px;
  font-size: 16px;
  color: #303133;
}

.security-info p {
  margin: 0;
  color: #606266;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 50%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}
</style> 