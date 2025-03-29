<template>
  <div class="feeding-plan-section">
    <div class="section-header">
      <h4>智能喂养计划</h4>
      <el-button type="primary" size="small" @click="regeneratePlan">重新生成计划</el-button>
    </div>
    
    <div class="feeding-plan-content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="每日喂养" name="daily">
          <div class="daily-feeding">
            <div class="time-schedule">
              <div 
                v-for="schedule in feedingSchedule" 
                :key="schedule.time" 
                class="schedule-item"
              >
                <div class="time">{{ schedule.time }}</div>
                <div class="divider"></div>
                <div class="content">
                  <div class="food-info">
                    <div class="food-name">{{ schedule.food }}</div>
                    <div class="food-amount">{{ schedule.amount }}</div>
                  </div>
                  <div class="food-note">{{ schedule.note }}</div>
                </div>
              </div>
            </div>
            
            <div class="daily-note">
              <p class="note-title">注意事项：</p>
              <ul class="note-list">
                <li v-for="(note, index) in dailyNotes" :key="index">{{ note }}</li>
              </ul>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="推荐食品" name="food">
          <div class="recommended-food">
            <el-carousel :interval="4000" indicator-position="outside" height="200px">
              <el-carousel-item v-for="food in recommendedFoods" :key="food.id">
                <div class="food-slide">
                  <div class="food-image">
                    <img :src="food.image" :alt="food.name" />
                  </div>
                  <div class="food-info">
                    <h5>{{ food.name }}</h5>
                    <div class="food-description">{{ food.description }}</div>
                    <div class="food-price">¥{{ food.price.toFixed(2) }}</div>
                    <div class="food-actions">
                      <el-button type="primary" size="small" @click="goToProductDetail(food.id)">查看详情</el-button>
                      <el-button size="small" @click="addToCart(food.id)">加入购物车</el-button>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
            
            <div class="food-list">
              <div 
                v-for="food in otherRecommendedFoods" 
                :key="food.id" 
                class="food-item"
                @click="goToProductDetail(food.id)"
              >
                <div class="food-item-image">
                  <img :src="food.image" :alt="food.name" />
                </div>
                <div class="food-item-info">
                  <div class="food-item-name">{{ food.name }}</div>
                  <div class="food-item-price">¥{{ food.price.toFixed(2) }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="健康建议" name="advice">
          <div class="health-advice">
            <div 
              v-for="(advice, index) in healthAdvice" 
              :key="index" 
              class="advice-card"
            >
              <div class="advice-icon">
                <el-icon><component :is="advice.icon"></component></el-icon>
              </div>
              <div class="advice-content">
                <h5>{{ advice.title }}</h5>
                <p>{{ advice.content }}</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="定制计划" name="custom">
          <div class="custom-plan">
            <div class="custom-form">
              <el-form :model="customForm" label-width="100px">
                <el-form-item label="活动水平">
                  <el-select v-model="customForm.activityLevel" placeholder="请选择活动水平">
                    <el-option label="低活动量" value="low" />
                    <el-option label="中等活动量" value="medium" />
                    <el-option label="高活动量" value="high" />
                  </el-select>
                </el-form-item>
                <el-form-item label="健康状况">
                  <el-select v-model="customForm.healthStatus" placeholder="请选择健康状况">
                    <el-option label="健康" value="healthy" />
                    <el-option label="超重" value="overweight" />
                    <el-option label="消化问题" value="digestive" />
                    <el-option label="皮肤问题" value="skin" />
                  </el-select>
                </el-form-item>
                <el-form-item label="喂食次数">
                  <el-slider v-model="customForm.feedingTimes" :min="1" :max="5" show-stops />
                </el-form-item>
                <el-form-item label="饮食偏好">
                  <el-checkbox-group v-model="customForm.preferences">
                    <el-checkbox label="grain_free">无谷配方</el-checkbox>
                    <el-checkbox label="high_protein">高蛋白</el-checkbox>
                    <el-checkbox label="limited_ingredient">低敏配方</el-checkbox>
                    <el-checkbox label="dental_care">牙齿护理</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="generateCustomPlan">生成定制计划</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Food, 
  Timer, 
  Star, 
  Apple, 
  Watermelon,
  Chicken
} from '@element-plus/icons-vue'

const props = defineProps<{
  pet: any
}>()

const router = useRouter()
const activeTab = ref('daily')

// 喂养计划
const feedingSchedule = ref([
  {
    time: '07:30',
    food: '天然粮',
    amount: '30g',
    note: '早晨喂食，保持精力充沛'
  },
  {
    time: '12:00',
    food: '罐头',
    amount: '1/3罐',
    note: '午餐加餐，增加水分摄入'
  },
  {
    time: '18:30',
    food: '天然粮',
    amount: '40g',
    note: '晚餐主食，提供足够营养'
  },
  {
    time: '21:00',
    food: '零食',
    amount: '少量',
    note: '睡前小食，控制热量'
  }
])

// 每日喂养注意事项
const dailyNotes = ref([
  '始终保证新鲜水源供应',
  '严格控制喂食量，避免过度喂食',
  '定期检查体重变化，及时调整食量',
  '避免喂食人类食物，特别是巧克力、葡萄等有毒食物',
  '如有胃肠不适，请减少食量并咨询兽医'
])

// 推荐食品
const recommendedFoods = ref([
  {
    id: '101',
    name: '比瑞吉天然粮 10kg',
    description: '专为成年猫设计，富含优质蛋白质，提供全面营养',
    price: 299.00,
    image: 'https://picsum.photos/300/200?random=101'
  },
  {
    id: '102',
    name: '皇家处方粮 2kg',
    description: '专为消化敏感猫设计，易消化配方，减轻胃肠负担',
    price: 189.00,
    image: 'https://picsum.photos/300/200?random=102'
  },
  {
    id: '103',
    name: '希尔思成猫粮 3.5kg',
    description: '科学配方，均衡营养，促进毛发健康',
    price: 249.00,
    image: 'https://picsum.photos/300/200?random=103'
  }
])

// 其他推荐食品
const otherRecommendedFoods = ref([
  {
    id: '201',
    name: '伟嘉猫罐头（金枪鱼）',
    price: 9.90,
    image: 'https://picsum.photos/300/200?random=201'
  },
  {
    id: '202',
    name: '贵族优质猫条（鸡肉味）',
    price: 15.90,
    image: 'https://picsum.photos/300/200?random=202'
  },
  {
    id: '203',
    name: '妙鲜包（三文鱼）',
    price: 6.50,
    image: 'https://picsum.photos/300/200?random=203'
  },
  {
    id: '204',
    name: '猫草种植套装',
    price: 29.90,
    image: 'https://picsum.photos/300/200?random=204'
  }
])

// 健康建议
const healthAdvice = ref([
  {
    icon: 'Timer',
    title: '规律喂食',
    content: '每天固定时间喂食，帮助宠物建立良好的饮食习惯，促进消化系统健康。'
  },
  {
    icon: 'Food',
    title: '营养均衡',
    content: '确保食物中含有足够的蛋白质、脂肪、碳水化合物、维生素和矿物质。'
  },
  {
    icon: 'Star',
    title: '体重管理',
    content: '定期监测体重，保持理想体重，避免肥胖引起的健康问题。'
  },
  {
    icon: 'Apple',
    title: '零食控制',
    content: '零食应控制在每日总热量的10%以内，避免影响主食摄入。'
  },
  {
    icon: 'Watermelon',
    title: '水分摄入',
    content: '保证充足的水分摄入，湿粮和干粮搭配，促进泌尿系统健康。'
  },
  {
    icon: 'Chicken',
    title: '食物多样性',
    content: '适当提供多样化的食物，但需要注意不要频繁更换主食，以免引起消化问题。'
  }
])

// 定制计划表单
const customForm = reactive({
  activityLevel: 'medium',
  healthStatus: 'healthy',
  feedingTimes: 3,
  preferences: []
})

/**
 * 跳转到商品详情页
 * @param productId 商品ID
 * @example
 * goToProductDetail('101')
 */
const goToProductDetail = (productId: string) => {
  router.push(`/product/${productId}`)
}

/**
 * 添加商品到购物车
 * @param productId 商品ID
 * @example
 * addToCart('101')
 */
const addToCart = (productId: string) => {
  ElMessage.success('已添加到购物车')
}

/**
 * 重新生成喂养计划
 * @example
 * regeneratePlan()
 */
const regeneratePlan = () => {
  ElMessage.success('正在根据宠物信息重新生成喂养计划')
  // 这里应该调用API重新生成喂养计划
  // 模拟重新生成
  if (props.pet.type === 'cat') {
    feedingSchedule.value = [
      {
        time: '08:00',
        food: '天然粮',
        amount: '25g',
        note: '早晨适量喂食'
      },
      {
        time: '13:00',
        food: '鲜肉零食',
        amount: '10g',
        note: '午间加餐，增加活力'
      },
      {
        time: '19:00',
        food: '罐头',
        amount: '1/2罐',
        note: '晚餐喂食湿粮，增加水分摄入'
      }
    ]
  } else if (props.pet.type === 'dog') {
    feedingSchedule.value = [
      {
        time: '07:00',
        food: '天然粮',
        amount: '100g',
        note: '早晨喂食，保持精力充沛'
      },
      {
        time: '17:00',
        food: '天然粮',
        amount: '120g',
        note: '晚餐主食，提供足够营养'
      },
      {
        time: '20:30',
        food: '狗零食',
        amount: '少量',
        note: '睡前小食，增进感情'
      }
    ]
  }
}

/**
 * 生成定制喂养计划
 * @example
 * generateCustomPlan()
 */
const generateCustomPlan = () => {
  ElMessage.success('已生成定制喂养计划')
  // 这里应该调用API根据表单信息生成定制喂养计划
  
  // 根据表单参数调整喂养计划
  const times = customForm.feedingTimes
  const newSchedule = []
  
  if (times === 1) {
    newSchedule.push({
      time: '18:00',
      food: '天然粮',
      amount: props.pet.type === 'cat' ? '80g' : '250g',
      note: '一次性提供全天所需营养'
    })
  } else if (times === 2) {
    newSchedule.push({
      time: '08:00',
      food: '天然粮',
      amount: props.pet.type === 'cat' ? '35g' : '120g',
      note: '早晨喂食，提供能量'
    })
    newSchedule.push({
      time: '18:00',
      food: '天然粮',
      amount: props.pet.type === 'cat' ? '45g' : '130g',
      note: '晚餐喂食，补充营养'
    })
  } else if (times === 3) {
    newSchedule.push({
      time: '07:30',
      food: '天然粮',
      amount: props.pet.type === 'cat' ? '25g' : '85g',
      note: '早餐喂食'
    })
    newSchedule.push({
      time: '13:00',
      food: '零食/罐头',
      amount: props.pet.type === 'cat' ? '15g' : '40g',
      note: '午餐加餐'
    })
    newSchedule.push({
      time: '19:00',
      food: '天然粮',
      amount: props.pet.type === 'cat' ? '40g' : '125g',
      note: '晚餐主食'
    })
  } else {
    // 4-5次喂食
    const baseTime = 7
    const interval = 24 / times
    
    for (let i = 0; i < times; i++) {
      let time = Math.floor(baseTime + i * interval)
      let minutes = Math.round((baseTime + i * interval - time) * 60)
      
      if (time > 23) time -= 24
      
      const timeStr = `${time.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      const amount = props.pet.type === 'cat' 
        ? `${Math.round(80 / times)}g` 
        : `${Math.round(250 / times)}g`
      
      newSchedule.push({
        time: timeStr,
        food: i % 2 === 0 ? '天然粮' : '罐头/零食',
        amount: amount,
        note: `第${i + 1}次喂食`
      })
    }
  }
  
  // 按时间排序
  newSchedule.sort((a, b) => {
    const timeA = parseInt(a.time.replace(':', ''))
    const timeB = parseInt(b.time.replace(':', ''))
    return timeA - timeB
  })
  
  feedingSchedule.value = newSchedule
  activeTab.value = 'daily'
}

// 根据宠物类型初始化推荐食品
onMounted(() => {
  // 这里可以根据宠物信息调整推荐食品和喂养计划
  if (props.pet.type === 'dog') {
    recommendedFoods.value = [
      {
        id: '301',
        name: '皇家狗粮 10kg',
        description: '专为成年犬设计，支持健康消化和免疫系统',
        price: 359.00,
        image: 'https://picsum.photos/300/200?random=301'
      },
      {
        id: '302',
        name: '冠能狗粮 7.5kg',
        description: '均衡营养配方，促进健康成长和活力',
        price: 329.00,
        image: 'https://picsum.photos/300/200?random=302'
      },
      {
        id: '303',
        name: '宝路狗粮 5kg',
        description: '优质蛋白质和纤维，改善消化和便便',
        price: 199.00,
        image: 'https://picsum.photos/300/200?random=303'
      }
    ]
    
    otherRecommendedFoods.value = [
      {
        id: '401',
        name: '宝路狗罐头（牛肉）',
        price: 12.90,
        image: 'https://picsum.photos/300/200?random=401'
      },
      {
        id: '402',
        name: '麦富迪狗狗鸡肉干',
        price: 29.90,
        image: 'https://picsum.photos/300/200?random=402'
      },
      {
        id: '403',
        name: '洁齿骨',
        price: 19.90,
        image: 'https://picsum.photos/300/200?random=403'
      },
      {
        id: '404',
        name: '训练奖励零食',
        price: 25.90,
        image: 'https://picsum.photos/300/200?random=404'
      }
    ]
  }
})
</script>

<style lang="scss" scoped>
.feeding-plan-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    h4 {
      font-size: 16px;
      margin: 0;
      font-weight: 500;
    }
  }
  
  .feeding-plan-content {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 20px;
  }
  
  .daily-feeding {
    .time-schedule {
      margin-bottom: 30px;
      
      .schedule-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 15px;
        
        .time {
          width: 60px;
          font-weight: 500;
          color: #333;
          font-size: 15px;
        }
        
        .divider {
          width: 2px;
          height: 50px;
          background-color: #dcdfe6;
          margin: 0 15px;
          position: relative;
          
          &::before, &::after {
            content: '';
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #7e57c2;
          }
          
          &::before {
            top: 0;
          }
          
          &::after {
            bottom: 0;
          }
        }
        
        .content {
          flex: 1;
          
          .food-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            
            .food-name {
              font-weight: 500;
              font-size: 15px;
            }
            
            .food-amount {
              color: #7e57c2;
              font-weight: 500;
            }
          }
          
          .food-note {
            font-size: 13px;
            color: #909399;
          }
        }
      }
    }
    
    .daily-note {
      background-color: #fff;
      border-radius: 6px;
      padding: 15px;
      border: 1px solid #ebeef5;
      
      .note-title {
        font-weight: 500;
        margin: 0 0 10px;
        color: #333;
      }
      
      .note-list {
        margin: 0;
        padding-left: 20px;
        
        li {
          margin-bottom: 5px;
          font-size: 14px;
          color: #606266;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
  
  .recommended-food {
    .food-slide {
      display: flex;
      height: 100%;
      
      .food-image {
        width: 40%;
        height: 100%;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px 0 0 8px;
        }
      }
      
      .food-info {
        flex: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        
        h5 {
          font-size: 18px;
          margin: 0 0 10px;
        }
        
        .food-description {
          flex: 1;
          font-size: 14px;
          color: #606266;
          margin-bottom: 10px;
        }
        
        .food-price {
          font-size: 20px;
          font-weight: 500;
          color: #f56c6c;
          margin-bottom: 15px;
        }
        
        .food-actions {
          display: flex;
          gap: 10px;
        }
      }
    }
    
    .food-list {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 20px;
      
      .food-item {
        width: calc(25% - 12px);
        background-color: #fff;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;
        
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
        }
        
        .food-item-image {
          height: 120px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s;
          }
          
          &:hover img {
            transform: scale(1.05);
          }
        }
        
        .food-item-info {
          padding: 10px;
          
          .food-item-name {
            font-size: 14px;
            margin-bottom: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .food-item-price {
            color: #f56c6c;
            font-weight: 500;
          }
        }
      }
    }
  }
  
  .health-advice {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    
    .advice-card {
      display: flex;
      background-color: #fff;
      border-radius: 6px;
      padding: 15px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      
      .advice-icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #f0e6ff;
        color: #7e57c2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin-right: 15px;
        flex-shrink: 0;
      }
      
      .advice-content {
        flex: 1;
        
        h5 {
          font-size: 16px;
          margin: 0 0 10px;
        }
        
        p {
          font-size: 14px;
          color: #606266;
          margin: 0;
          line-height: 1.5;
        }
      }
    }
  }
  
  .custom-plan {
    .custom-form {
      max-width: 500px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 6px;
      padding: 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    }
  }
}

@media (max-width: 768px) {
  .health-advice {
    grid-template-columns: 1fr !important;
  }
  
  .food-slide {
    flex-direction: column;
    
    .food-image {
      width: 100% !important;
      height: 150px !important;
      
      img {
        border-radius: 8px 8px 0 0 !important;
      }
    }
  }
  
  .food-list .food-item {
    width: calc(50% - 8px) !important;
  }
}
</style> 