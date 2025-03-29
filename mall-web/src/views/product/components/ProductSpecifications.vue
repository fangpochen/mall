<template>
  <div class="product-specifications">
    <el-tabs v-model="activeTab" class="specs-tabs">
      <el-tab-pane label="商品参数" name="parameters">
        <div class="parameters-container">
          <el-table :data="parameters" style="width: 100%" :show-header="false">
            <el-table-column prop="name" label="参数名" width="180">
              <template #default="scope">
                <div class="param-name">{{ scope.row.name }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="value" label="参数值">
              <template #default="scope">
                <div class="param-value">{{ scope.row.value }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="规格与包装" name="specs">
        <div class="specs-container">
          <div class="specs-section">
            <h3 class="section-title">规格参数</h3>
            <div class="specs-table-wrapper">
              <table class="specs-table">
                <tbody>
                  <tr v-for="(spec, index) in specifications" :key="`spec-${index}`">
                    <th>{{ spec.name }}</th>
                    <td>{{ spec.value }}</td>
                    <th v-if="index < specifications.length - 1 && specifications[index + 1]">
                      {{ specifications[index + 1].name }}
                    </th>
                    <td v-if="index < specifications.length - 1 && specifications[index + 1]">
                      {{ specifications[index + 1].value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="specs-section">
            <h3 class="section-title">包装清单</h3>
            <div class="package-content">
              <p v-for="(item, index) in packageList" :key="`package-${index}`">
                {{ item }}
              </p>
            </div>
          </div>
          
          <div v-if="certifications.length > 0" class="specs-section">
            <h3 class="section-title">认证信息</h3>
            <div class="certification-list">
              <div v-for="(cert, index) in certifications" :key="`cert-${index}`" class="certification-item">
                <img :src="cert.image" :alt="cert.name" class="cert-image">
                <div class="cert-name">{{ cert.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="售后保障" name="warranty">
        <div class="warranty-container">
          <div class="warranty-section">
            <h3 class="section-title">保修政策</h3>
            <div class="warranty-content">
              <p>{{ warrantyPolicy }}</p>
            </div>
          </div>
          
          <div class="warranty-section">
            <h3 class="section-title">退换货政策</h3>
            <div class="warranty-items">
              <div v-for="(policy, index) in returnPolicy" :key="`policy-${index}`" class="warranty-item">
                <div class="policy-icon">
                  <el-icon><Check /></el-icon>
                </div>
                <div class="policy-content">
                  <div class="policy-title">{{ policy.title }}</div>
                  <div class="policy-desc">{{ policy.description }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="warranty-section">
            <h3 class="section-title">特殊提示</h3>
            <div class="special-notice">
              <p v-for="(notice, index) in specialNotices" :key="`notice-${index}`">
                {{ notice }}
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="常见问题" name="faq">
        <div class="faq-container">
          <el-collapse>
            <el-collapse-item v-for="(item, index) in faqs" :key="`faq-${index}`" :title="item.question" :name="index">
              <div class="faq-answer">
                <p>{{ item.answer }}</p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { Check } from '@element-plus/icons-vue'

// 接收商品ID作为属性
const props = defineProps<{
  productId: string
}>()

// 当前激活的标签页
const activeTab = ref('parameters')

// 商品参数数据
const parameters = ref([
  { name: '商品名称', value: '宠物智能自动喂食器' },
  { name: '品牌', value: 'PetCare' },
  { name: '型号', value: 'PC-5200' },
  { name: '颜色', value: '白色/蓝色/粉色' },
  { name: '材质', value: '食品级ABS塑料' },
  { name: '电源方式', value: 'DC 5V / 4节5号电池（约可使用3个月）' },
  { name: '容量', value: '5L（约25天用量）' },
  { name: '喂食方式', value: '自动定时/手动喂食/远程控制' },
  { name: '每次投喂量', value: '5g-50g可调' },
  { name: '定时功能', value: '最多10组定时投喂' },
  { name: '适用对象', value: '猫咪/小型犬' },
  { name: '适合粮食', value: '直径5-15mm干粮' },
  { name: '智能功能', value: '手机APP控制/语音提醒/摄像监控/粮食不足提醒' },
  { name: '连接方式', value: 'WiFi 2.4G' },
  { name: '产品尺寸', value: '38 × 25 × 32cm' },
  { name: '产品重量', value: '2.5kg' }
])

// 商品规格
const specifications = ref([
  { name: '品牌', value: 'PetCare' },
  { name: '型号', value: 'PC-5200' },
  { name: '颜色', value: '白色/蓝色/粉色' },
  { name: '规格', value: '标准版/豪华版/尊享版' },
  { name: '尺寸', value: '38 × 25 × 32cm' },
  { name: '重量', value: '2.5kg' },
  { name: '容量', value: '5L' },
  { name: '功耗', value: '3W' },
  { name: '电池', value: '4节5号电池（约可使用3个月）' },
  { name: '适用对象', value: '猫咪/小型犬' }
])

// 包装清单
const packageList = ref([
  '【主机】智能自动喂食器 × 1',
  '【配件】电源适配器 × 1',
  '【配件】USB连接线 × 1',
  '【配件】干燥剂 × 2',
  '【配件】宠物碗 × 1',
  '【说明】使用说明书 × 1',
  '【说明】质保卡 × 1'
])

// 认证信息
const certifications = ref([
  { name: 'CE认证', image: 'https://via.placeholder.com/60x60' },
  { name: 'RoHS认证', image: 'https://via.placeholder.com/60x60' },
  { name: '质量认证', image: 'https://via.placeholder.com/60x60' },
  { name: '食品安全认证', image: 'https://via.placeholder.com/60x60' }
])

// 保修政策
const warrantyPolicy = ref('本产品自购买之日起享受1年的保修服务。保修期内，非人为损坏的产品故障，可享受免费维修或更换服务。电池、宠物碗等易耗品不在保修范围内。')

// 退换货政策
const returnPolicy = ref([
  { 
    title: '7天无理由退货', 
    description: '自收到商品之日起7天内，商品完好无损，可申请无理由退货。'
  },
  { 
    title: '15天产品质量问题换货', 
    description: '自收到商品之日起15天内，如产品出现质量问题，可申请换货服务。'
  },
  { 
    title: '1年质保期内维修', 
    description: '购买日起1年内，产品出现非人为损坏的故障，可享受免费维修服务。'
  },
  { 
    title: '终身技术支持', 
    description: '不限时间提供产品使用咨询及技术支持服务。'
  }
])

// 特殊提示
const specialNotices = ref([
  '商品颜色以实物为准，因拍摄条件和显示器色差会导致与实物有细微色差。',
  '本产品仅适用于干粮投喂，不适用于湿粮或半湿粮。',
  '为保障宠物健康，建议定期清洗喂食器，干粮储存不宜超过1个月。',
  '使用WiFi功能时，需确保家中WiFi信号稳定且为2.4G频段。'
])

// 常见问题
const faqs = ref([
  {
    question: '喂食器可以喂湿粮吗？',
    answer: '不建议使用湿粮，本产品设计主要适用于直径5-15mm的干粮。湿粮容易堵塞出粮口并产生异味，影响设备正常使用。'
  },
  {
    question: '如何连接WiFi？',
    answer: '首先下载"PetCare"APP，注册并登录账号后，按照APP内的引导进行设备配网。请确保您的WiFi为2.4G频段，并且信号稳定。详细步骤请参考说明书第8页。'
  },
  {
    question: '喂食器断电后会怎样？',
    answer: '本产品支持双重供电，接通电源适配器的同时可安装4节5号电池作为备用电源。如果外接电源断电，将自动切换到电池供电模式，确保正常喂食。但请注意，备用电池模式下WiFi功能将暂时不可用。'
  },
  {
    question: '如何清洗喂食器？',
    answer: '清洗前请先断开电源。粮食桶、宠物碗和出粮口可拆卸清洗，用温水和中性清洁剂清洗后彻底晾干。主机请用湿布擦拭，勿直接用水冲洗或浸泡，以免损坏电子元件。'
  },
  {
    question: '为什么APP显示离线？',
    answer: '可能原因：1. 设备断电；2. WiFi信号不稳定；3. 路由器设置问题。建议检查电源和WiFi连接状态，确保路由器正常工作并且未设置MAC地址过滤。如问题持续，可尝试重新配网或联系客服。'
  },
  {
    question: '如何设置定时喂食？',
    answer: '可通过两种方式设置：1. 在设备上长按设置键进入定时模式，按照说明书操作；2. 通过APP设置，在"我的设备"-"定时设置"中添加喂食计划，最多可设置10组定时任务。'
  }
])
</script>

<style lang="scss" scoped>
.product-specifications {
  padding: 20px 0;
  
  .specs-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 25px;
    }
    
    :deep(.el-tabs__item) {
      font-size: 16px;
      padding: 0 25px;
    }
  }
  
  .parameters-container {
    :deep(.el-table) {
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      
      .el-table__row {
        &:nth-child(odd) {
          background-color: #fafafa;
        }
      }
      
      .param-name {
        font-weight: 500;
        color: #606266;
      }
      
      .param-value {
        color: #333;
      }
    }
  }
  
  .specs-container {
    .specs-section {
      margin-bottom: 30px;
      
      .section-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 15px;
        position: relative;
        padding-left: 12px;
        
        &:before {
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
      
      .specs-table-wrapper {
        overflow-x: auto;
        
        .specs-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          
          th, td {
            padding: 12px 15px;
            border: 1px solid #e6e6e6;
            text-align: left;
          }
          
          th {
            background-color: #fafafa;
            width: 120px;
            font-weight: 500;
            color: #606266;
          }
          
          td {
            color: #333;
          }
        }
      }
      
      .package-content, .special-notice {
        p {
          line-height: 1.8;
          margin-bottom: 8px;
          color: #333;
          position: relative;
          padding-left: 15px;
          
          &:before {
            content: '•';
            position: absolute;
            left: 0;
            top: 0;
            color: #7e57c2;
          }
        }
      }
      
      .certification-list {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        
        .certification-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
          
          .cert-image {
            width: 60px;
            height: 60px;
            margin-bottom: 8px;
            object-fit: contain;
          }
          
          .cert-name {
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        }
      }
    }
  }
  
  .warranty-container {
    .warranty-section {
      margin-bottom: 30px;
      
      .warranty-content {
        line-height: 1.8;
        color: #333;
      }
      
      .warranty-items {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        
        .warranty-item {
          display: flex;
          align-items: flex-start;
          padding: 15px;
          border-radius: 6px;
          border: 1px solid #f0f0f0;
          transition: all 0.3s;
          
          &:hover {
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }
          
          .policy-icon {
            margin-right: 12px;
            color: #7e57c2;
            
            .el-icon {
              font-size: 20px;
            }
          }
          
          .policy-content {
            flex: 1;
            
            .policy-title {
              font-weight: 500;
              color: #333;
              margin-bottom: 5px;
            }
            
            .policy-desc {
              font-size: 13px;
              color: #666;
              line-height: 1.6;
            }
          }
        }
      }
    }
  }
  
  .faq-container {
    :deep(.el-collapse) {
      border: none;
      
      .el-collapse-item {
        margin-bottom: 10px;
        
        .el-collapse-item__header {
          font-size: 15px;
          font-weight: 500;
          color: #333;
          padding: 15px;
          background-color: #f9f9f9;
          border-radius: 4px;
          border: none;
        }
        
        .el-collapse-item__wrap {
          border: none;
          
          .el-collapse-item__content {
            padding: 15px;
            color: #666;
          }
        }
      }
    }
    
    .faq-answer {
      line-height: 1.8;
    }
  }
}

@media (max-width: 768px) {
  .product-specifications {
    .specs-tabs {
      :deep(.el-tabs__item) {
        padding: 0 15px;
        font-size: 14px;
      }
    }
    
    .warranty-container {
      .warranty-items {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style> 