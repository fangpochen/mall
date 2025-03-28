<template>
  <div class="feeding-plan-container">
    <el-card class="header-card">
      <div class="header-content">
        <div>
          <h1>智能喂养计划</h1>
          <p>为您的宠物定制专属喂养方案</p>
        </div>
        <el-button type="primary" @click="goBack">返回宠物档案</el-button>
      </div>
    </el-card>

    <!-- 宠物信息卡片 -->
    <el-card class="pet-info-card" v-if="currentPet">
      <div class="pet-info">
        <div class="pet-avatar">
          <img :src="currentPet.avatar" :alt="currentPet.name" />
        </div>
        <div class="pet-details">
          <h2>{{ currentPet.name }}
            <el-tag size="small" effect="dark" :type="getTagType(currentPet.type)">{{ currentPet.type === 'cat' ? '猫' : currentPet.type === 'dog' ? '狗' : '其他' }}</el-tag>
          </h2>
          <div class="pet-attributes">
            <div class="attribute">
              <span class="label">品种</span>
              <span class="value">{{ currentPet.breed }}</span>
            </div>
            <div class="attribute">
              <span class="label">年龄</span>
              <span class="value">{{ currentPet.age }}岁</span>
            </div>
            <div class="attribute">
              <span class="label">体重</span>
              <span class="value">{{ currentPet.weight }}kg</span>
            </div>
            <div class="attribute">
              <span class="label">性别</span>
              <span class="value">{{ currentPet.gender === 'male' ? '公' : '母' }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 喂养计划内容 -->
    <div class="plan-content">
      <!-- 每日喂食计划 -->
      <el-card class="plan-card">
        <template #header>
          <div class="card-header">
            <h3>每日喂食计划</h3>
            <el-button type="primary" plain size="small" @click="customizePlan">自定义</el-button>
          </div>
        </template>
        <div class="daily-feeding-schedule">
          <div v-for="(meal, index) in feedingPlan.meals" :key="index" class="meal-item">
            <div class="meal-time">
              <el-icon><Clock /></el-icon>
              <span>{{ meal.time }}</span>
            </div>
            <div class="meal-content">
              <h4>{{ meal.name }}</h4>
              <p>{{ meal.description }}</p>
              <div class="meal-amount">
                <span>食量: {{ meal.amount }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 喂食推荐 -->
      <el-card class="plan-card">
        <template #header>
          <div class="card-header">
            <h3>推荐食品</h3>
          </div>
        </template>
        <div class="recommended-food">
          <el-row :gutter="20">
            <el-col :span="8" v-for="(food, index) in feedingPlan.recommendedFood" :key="index">
              <div class="food-card">
                <div class="food-image">
                  <img :src="food.image" :alt="food.name" />
                </div>
                <div class="food-info">
                  <h4>{{ food.name }}</h4>
                  <p>{{ food.description }}</p>
                  <div class="food-price">
                    <span>¥{{ food.price }}</span>
                    <el-button type="primary" size="small" @click="addToCart(food)">加入购物车</el-button>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <!-- 健康建议 -->
      <el-card class="plan-card">
        <template #header>
          <div class="card-header">
            <h3>健康建议</h3>
          </div>
        </template>
        <div class="health-tips">
          <el-collapse accordion>
            <el-collapse-item v-for="(tip, index) in feedingPlan.healthTips" :key="index" :title="tip.title">
              <div class="tip-content">
                <p>{{ tip.content }}</p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-card>
    </div>

    <!-- 自定义喂养计划对话框 -->
    <el-dialog
      title="自定义喂养计划"
      v-model="customDialogVisible"
      width="600px"
    >
      <div class="customize-form">
        <div v-for="(meal, index) in editingPlan.meals" :key="index" class="meal-edit-item">
          <div class="meal-header">
            <h4>{{ meal.name }}</h4>
            <el-button 
              type="danger" 
              icon="Delete" 
              circle 
              size="small" 
              @click="removeMeal(index)"
              v-if="editingPlan.meals.length > 1"
            ></el-button>
          </div>
          <el-form :model="meal" label-width="80px">
            <el-form-item label="时间">
              <el-time-picker 
                v-model="meal.timeObj" 
                format="HH:mm" 
                placeholder="选择时间" 
                @change="updateMealTime(index)"
              ></el-time-picker>
            </el-form-item>
            <el-form-item label="名称">
              <el-input v-model="meal.name" placeholder="例：早餐"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="meal.description" placeholder="简短描述"></el-input>
            </el-form-item>
            <el-form-item label="食量">
              <el-input v-model="meal.amount" placeholder="例：100克"></el-input>
            </el-form-item>
          </el-form>
          <el-divider v-if="index < editingPlan.meals.length - 1"></el-divider>
        </div>
        <div class="add-meal">
          <el-button type="primary" plain icon="Plus" @click="addMeal">添加喂食时间</el-button>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="customDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePlan">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// 当前宠物信息
const currentPet = ref(null)

// 喂养计划数据
const feedingPlan = reactive({
  meals: [
    {
      name: '早餐',
      time: '07:00',
      description: '优质蛋白质，助力一天精力充沛',
      amount: '100克'
    },
    {
      name: '午餐',
      time: '12:00',
      description: '均衡营养，维持能量',
      amount: '80克'
    },
    {
      name: '晚餐',
      time: '18:00',
      description: '易消化食物，促进睡眠',
      amount: '120克'
    }
  ],
  recommendedFood: [
    {
      id: 1,
      name: '皇家幼猫粮',
      description: '针对生长期猫咪特别调配',
      price: 198.00,
      image: 'https://example.com/food1.jpg'
    },
    {
      id: 2,
      name: '冻干牛肉粒',
      description: '天然无添加，营养丰富',
      price: 88.00,
      image: 'https://example.com/food2.jpg'
    },
    {
      id: 3,
      name: '鸡肉罐头',
      description: '100%纯肉制作，口感鲜美',
      price: 15.80,
      image: 'https://example.com/food3.jpg'
    }
  ],
  healthTips: [
    {
      title: '定时定量喂食的重要性',
      content: '定时定量喂食可以帮助宠物养成良好的饮食习惯，预防肥胖，保持消化系统健康。建议每天固定时间喂食，控制食量，避免过量。'
    },
    {
      title: '水分摄入',
      content: '确保您的宠物随时有新鲜的饮用水。对于猫咪，可以考虑使用流动饮水机，增加饮水量，预防泌尿系统问题。'
    },
    {
      title: '零食控制',
      content: '零食应该控制在日常饮食的10%以内，过多的零食会导致营养不均衡和肥胖。选择低脂肪、低盐分的健康零食。'
    },
    {
      title: '运动与喂食的关系',
      content: '饭后避免立即进行剧烈运动，可能导致胃扭转等问题。喂食前后30分钟内应保持相对安静的环境。'
    }
  ]
})

// 编辑相关
const customDialogVisible = ref(false)
const editingPlan = reactive({
  meals: []
})

/**
 * 页面加载时获取宠物信息
 */
onMounted(() => {
  const petId = route.query.petId
  if (petId) {
    fetchPetInfo(petId)
  } else {
    ElMessage.warning('未找到宠物信息')
    router.push('/user/pet')
  }
})

/**
 * 获取宠物信息
 * @param petId 宠物ID
 */
const fetchPetInfo = (petId) => {
  // 这里模拟API调用获取宠物信息
  // 实际项目中应该调用后端API
  currentPet.value = {
    id: 1,
    name: '球球',
    type: 'cat',
    breed: '英国短毛猫',
    age: 3,
    gender: 'female',
    weight: 4.5,
    avatar: 'https://example.com/pet1.jpg'
  }
  
  // 根据宠物信息生成喂养计划
  generateFeedingPlan()
}

/**
 * 根据宠物信息生成智能喂养计划
 */
const generateFeedingPlan = () => {
  // 实际项目中应该根据宠物的种类、年龄、体重等信息
  // 调用智能推荐算法或API生成个性化的喂养计划
  // 这里仅做示例
  
  if (currentPet.value.type === 'cat') {
    // 猫咪喂养计划
    if (currentPet.value.age < 1) {
      // 幼猫
      feedingPlan.meals = [
        { name: '早餐', time: '07:00', description: '幼猫专用奶糕', amount: '50克' },
        { name: '午餐', time: '12:00', description: '湿粮', amount: '40克' },
        { name: '下午茶', time: '15:00', description: '幼猫零食', amount: '20克' },
        { name: '晚餐', time: '19:00', description: '幼猫专用奶糕', amount: '50克' }
      ]
    } else if (currentPet.value.age > 7) {
      // 老年猫
      feedingPlan.meals = [
        { name: '早餐', time: '07:00', description: '老年猫专用粮', amount: '40克' },
        { name: '午餐', time: '13:00', description: '湿粮', amount: '30克' },
        { name: '晚餐', time: '19:00', description: '老年猫专用粮', amount: '40克' }
      ]
    }
  } else if (currentPet.value.type === 'dog') {
    // 狗狗喂养计划
    if (currentPet.value.weight > 15) {
      // 大型犬
      feedingPlan.meals = [
        { name: '早餐', time: '06:30', description: '大型犬专用粮', amount: '200克' },
        { name: '晚餐', time: '18:30', description: '大型犬专用粮+肉类', amount: '250克' }
      ]
    } else {
      // 小型犬
      feedingPlan.meals = [
        { name: '早餐', time: '07:00', description: '小型犬专用粮', amount: '60克' },
        { name: '午餐', time: '12:30', description: '鲜肉/湿粮', amount: '40克' },
        { name: '晚餐', time: '19:00', description: '小型犬专用粮', amount: '50克' }
      ]
    }
  }
}

/**
 * 获取宠物类型对应的标签类型
 * @param type 宠物类型
 * @return 标签类型
 */
const getTagType = (type: string) => {
  switch (type) {
    case 'cat':
      return 'success'
    case 'dog':
      return 'primary'
    default:
      return 'info'
  }
}

/**
 * 返回宠物档案页面
 */
const goBack = () => {
  router.push('/user/pet')
}

/**
 * 自定义喂养计划
 */
const customizePlan = () => {
  // 复制当前喂养计划到编辑对象
  editingPlan.meals = feedingPlan.meals.map(meal => ({
    ...meal,
    timeObj: new Date(`2023-01-01T${meal.time}:00`) // 转换时间字符串为Date对象
  }))
  customDialogVisible.value = true
}

/**
 * 更新喂食时间
 * @param index 喂食时间索引
 */
const updateMealTime = (index: number) => {
  if (editingPlan.meals[index].timeObj) {
    const hours = editingPlan.meals[index].timeObj.getHours().toString().padStart(2, '0')
    const minutes = editingPlan.meals[index].timeObj.getMinutes().toString().padStart(2, '0')
    editingPlan.meals[index].time = `${hours}:${minutes}`
  }
}

/**
 * 添加喂食时间
 */
const addMeal = () => {
  editingPlan.meals.push({
    name: '新增喂食',
    time: '12:00',
    timeObj: new Date('2023-01-01T12:00:00'),
    description: '请输入描述',
    amount: '100克'
  })
}

/**
 * 移除喂食时间
 * @param index 喂食时间索引
 */
const removeMeal = (index: number) => {
  editingPlan.meals.splice(index, 1)
}

/**
 * 保存喂养计划
 */
const savePlan = () => {
  // 将编辑后的计划更新到主计划
  feedingPlan.meals = editingPlan.meals.map(meal => ({
    name: meal.name,
    time: meal.time,
    description: meal.description,
    amount: meal.amount
  }))
  
  ElMessage.success('喂养计划已更新')
  customDialogVisible.value = false
}

/**
 * 添加商品到购物车
 * @param food 食品对象
 */
const addToCart = (food) => {
  // TODO: 实际添加到购物车逻辑
  ElMessage.success(`已添加 ${food.name} 到购物车`)
}
</script>

<style scoped>
.feeding-plan-container {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content p {
  color: #909399;
  margin-top: 5px;
}

.pet-info-card {
  margin-bottom: 20px;
}

.pet-info {
  display: flex;
  gap: 20px;
}

.pet-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.pet-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pet-details {
  flex: 1;
}

.pet-details h2 {
  margin-top: 0;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.pet-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.attribute {
  display: flex;
  flex-direction: column;
}

.label {
  color: #909399;
  font-size: 12px;
}

.value {
  font-weight: 500;
}

.plan-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.plan-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.daily-feeding-schedule {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.meal-item {
  display: flex;
  border-left: 3px solid #409EFF;
  padding-left: 15px;
}

.meal-time {
  min-width: 80px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #409EFF;
}

.meal-content {
  flex: 1;
}

.meal-content h4 {
  margin: 0 0 5px 0;
}

.meal-content p {
  margin: 0 0 10px 0;
  color: #606266;
}

.meal-amount {
  font-weight: 500;
}

.recommended-food {
  margin-top: 10px;
}

.food-card {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
  height: 100%;
}

.food-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.food-image {
  height: 150px;
  overflow: hidden;
}

.food-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.food-info {
  padding: 15px;
}

.food-info h4 {
  margin: 0 0 10px 0;
}

.food-info p {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
}

.food-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.food-price span {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.health-tips {
  margin-top: 10px;
}

.tip-content {
  padding: 10px 0;
}

.tip-content p {
  margin: 0;
  line-height: 1.6;
}

.meal-edit-item {
  margin-bottom: 20px;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.meal-header h4 {
  margin: 0;
}

.add-meal {
  margin-top: 20px;
  text-align: center;
}

@media (min-width: 768px) {
  .plan-content {
    grid-template-columns: 1fr 1fr;
  }
  
  .plan-content .plan-card:first-child {
    grid-column: 1;
  }
  
  .plan-content .plan-card:last-child {
    grid-column: 1 / span 2;
  }
}

@media (min-width: 1200px) {
  .plan-content {
    grid-template-columns: 1fr 1fr 1fr;
  }
  
  .plan-content .plan-card {
    grid-column: auto;
  }
}
</style> 