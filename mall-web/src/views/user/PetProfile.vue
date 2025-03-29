<template>
  <div class="pet-profile">
    <div class="section-header">
      <h2>宠物档案</h2>
      <el-button type="primary" @click="dialogVisible = true">添加宠物</el-button>
    </div>

    <!-- 宠物列表 -->
    <div v-if="petList.length > 0" class="pet-list">
      <el-tabs v-model="activePet" type="card">
        <el-tab-pane 
          v-for="pet in petList" 
          :key="pet.id" 
          :label="pet.name" 
          :name="pet.id"
        >
          <div class="pet-info-card">
            <div class="pet-basic-info">
              <div class="pet-avatar">
                <img :src="pet.avatar" :alt="pet.name" />
              </div>
              <div class="pet-details">
                <h3>{{ pet.name }} <el-tag size="small">{{ getPetTypeName(pet.type) }}</el-tag></h3>
                <div class="pet-attributes">
                  <div class="attribute">
                    <span class="label">品种：</span>
                    <span>{{ pet.breed }}</span>
                  </div>
                  <div class="attribute">
                    <span class="label">年龄：</span>
                    <span>{{ pet.age }}岁</span>
                  </div>
                  <div class="attribute">
                    <span class="label">性别：</span>
                    <span>{{ pet.gender === 'male' ? '公' : '母' }}</span>
                  </div>
                  <div class="attribute">
                    <span class="label">体重：</span>
                    <span>{{ pet.weight }}kg</span>
                  </div>
                  <div class="attribute">
                    <span class="label">绝育：</span>
                    <span>{{ pet.neutered ? '是' : '否' }}</span>
                  </div>
                </div>
                <div class="pet-actions">
                  <el-button size="small" @click="editPet(pet)">编辑信息</el-button>
                  <el-button size="small" type="danger" @click="confirmDelete(pet)">删除</el-button>
                </div>
              </div>
            </div>
            
            <!-- 健康状况 -->
            <div class="pet-health-section">
              <h4>健康状况</h4>
              <div class="health-info">
                <el-progress 
                  type="dashboard" 
                  :percentage="pet.healthScore || 85" 
                  :color="getHealthColor(pet.healthScore || 85)"
                >
                  <template #default="{ percentage }">
                    <span class="progress-value">{{ percentage }}</span>
                    <span class="progress-label">健康指数</span>
                  </template>
                </el-progress>
                <div class="health-details">
                  <div class="health-item">
                    <div class="health-item-title">上次体检</div>
                    <div class="health-item-value">{{ pet.lastCheckup || '暂无记录' }}</div>
                  </div>
                  <div class="health-item">
                    <div class="health-item-title">疫苗接种</div>
                    <div class="health-item-value">{{ pet.vaccineStatus || '已完成' }}</div>
                  </div>
                  <div class="health-item">
                    <div class="health-item-title">驱虫状态</div>
                    <div class="health-item-value">{{ pet.dewormStatus || '已完成' }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 智能喂养计划 -->
            <pet-feeding-plan :pet="pet" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <!-- 没有宠物时的提示 -->
    <div v-else class="empty-pets">
      <el-empty description="您还没有添加宠物，点击上方"添加宠物"按钮添加您的爱宠">
        <el-button type="primary" @click="dialogVisible = true">添加宠物</el-button>
      </el-empty>
    </div>
    
    <!-- 添加/编辑宠物对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑宠物信息' : '添加宠物'"
      width="500px"
    >
      <el-form :model="petForm" :rules="petRules" ref="petFormRef" label-width="80px">
        <el-form-item label="宠物头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="/api/pet/upload-avatar"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="petForm.avatar" :src="petForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="宠物名称" prop="name">
          <el-input v-model="petForm.name" placeholder="请输入宠物名称" />
        </el-form-item>
        <el-form-item label="宠物类型" prop="type">
          <el-select v-model="petForm.type" placeholder="请选择宠物类型" style="width: 100%">
            <el-option label="猫" value="cat" />
            <el-option label="狗" value="dog" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="品种" prop="breed">
          <el-input v-model="petForm.breed" placeholder="请输入宠物品种" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="petForm.age" :min="0" :max="30" style="width: 100%" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="petForm.gender">
            <el-radio label="male">公</el-radio>
            <el-radio label="female">母</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="体重(kg)" prop="weight">
          <el-input-number v-model="petForm.weight" :precision="1" :step="0.1" :min="0.1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="是否绝育" prop="neutered">
          <el-switch v-model="petForm.neutered" />
        </el-form-item>
        <el-form-item label="健康状况" prop="healthNote">
          <el-input v-model="petForm.healthNote" type="textarea" placeholder="请描述宠物健康状况" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePet">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import PetFeedingPlan from './components/PetFeedingPlan.vue'

// 宠物列表
const petList = ref<any[]>([])
const activePet = ref('')
const dialogVisible = ref(false)
const isEditing = ref(false)
const petFormRef = ref<FormInstance>()

// 宠物表单
const petForm = reactive({
  id: '',
  name: '',
  type: '',
  breed: '',
  age: 1,
  gender: 'male',
  weight: 5,
  neutered: false,
  avatar: '',
  healthNote: ''
})

// 表单验证规则
const petRules: FormRules = {
  name: [
    { required: true, message: '请输入宠物名称', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择宠物类型', trigger: 'change' }
  ],
  breed: [
    { required: true, message: '请输入宠物品种', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入宠物年龄', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择宠物性别', trigger: 'change' }
  ],
  weight: [
    { required: true, message: '请输入宠物体重', trigger: 'blur' }
  ]
}

/**
 * 获取宠物类型名称
 * @param type 宠物类型
 * @returns 宠物类型名称
 * @example
 * getPetTypeName('cat') // '猫'
 */
const getPetTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    cat: '猫',
    dog: '狗',
    other: '其他'
  }
  return typeMap[type] || '未知'
}

/**
 * 获取健康指数颜色
 * @param score 健康得分
 * @returns 健康指数颜色
 * @example
 * getHealthColor(85) // '#67c23a'
 */
const getHealthColor = (score: number) => {
  if (score >= 80) return '#67c23a'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

/**
 * 编辑宠物信息
 * @param pet 宠物信息
 * @example
 * editPet({ id: '1', name: '咪咪', type: 'cat' })
 */
const editPet = (pet: any) => {
  isEditing.value = true
  Object.assign(petForm, pet)
  dialogVisible.value = true
}

/**
 * 确认删除宠物
 * @param pet 宠物信息
 * @example
 * confirmDelete({ id: '1', name: '咪咪' })
 */
const confirmDelete = (pet: any) => {
  ElMessageBox.confirm(
    `确定要删除宠物"${pet.name}"吗？`,
    '删除宠物',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 这里应该调用API删除宠物
    const index = petList.value.findIndex(item => item.id === pet.id)
    if (index !== -1) {
      petList.value.splice(index, 1)
      if (petList.value.length > 0) {
        activePet.value = petList.value[0].id
      }
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    // 取消删除
  })
}

/**
 * 头像上传前验证
 * @param file 文件对象
 * @returns 是否通过验证
 * @example
 * beforeAvatarUpload(file)
 */
const beforeAvatarUpload = (file: File) => {
  const isImage = /\.(jpeg|jpg|png|gif)$/.test(file.name.toLowerCase())
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  
  return isImage && isLt2M
}

/**
 * 头像上传成功回调
 * @param res 上传结果
 * @example
 * handleAvatarSuccess({ code: 200, data: { url: 'https://example.com/avatar.jpg' } })
 */
const handleAvatarSuccess = (res: any) => {
  if (res.code === 200) {
    petForm.avatar = res.data.url
  } else {
    ElMessage.error(res.message || '上传失败')
  }
}

/**
 * 保存宠物信息
 * @example
 * savePet()
 */
const savePet = async () => {
  if (!petFormRef.value) return
  
  await petFormRef.value.validate((valid) => {
    if (valid) {
      if (isEditing.value) {
        // 更新宠物信息
        const index = petList.value.findIndex(item => item.id === petForm.id)
        if (index !== -1) {
          petList.value[index] = { ...petForm }
          ElMessage.success('更新成功')
        }
      } else {
        // 添加新宠物
        const newPet = {
          ...petForm,
          id: `pet_${Date.now()}`,
          healthScore: Math.floor(Math.random() * 20) + 80, // 模拟健康分数
          lastCheckup: '2023-05-15',
          vaccineStatus: '已完成',
          dewormStatus: '已完成'
        }
        petList.value.push(newPet)
        activePet.value = newPet.id
        ElMessage.success('添加成功')
      }
      
      dialogVisible.value = false
      resetForm()
    }
  })
}

/**
 * 重置表单
 * @example
 * resetForm()
 */
const resetForm = () => {
  isEditing.value = false
  petForm.id = ''
  petForm.name = ''
  petForm.type = ''
  petForm.breed = ''
  petForm.age = 1
  petForm.gender = 'male'
  petForm.weight = 5
  petForm.neutered = false
  petForm.avatar = ''
  petForm.healthNote = ''
}

/**
 * 获取宠物列表
 * @example
 * fetchPetList()
 */
const fetchPetList = () => {
  // 模拟API调用获取宠物列表
  setTimeout(() => {
    petList.value = [
      {
        id: 'pet_1',
        name: '咪咪',
        type: 'cat',
        breed: '英短蓝猫',
        age: 2,
        gender: 'female',
        weight: 4.5,
        neutered: true,
        avatar: 'https://picsum.photos/200/200?random=10',
        healthNote: '健康状况良好',
        healthScore: 92,
        lastCheckup: '2023-05-15',
        vaccineStatus: '已完成',
        dewormStatus: '已完成'
      },
      {
        id: 'pet_2',
        name: '旺财',
        type: 'dog',
        breed: '金毛寻回犬',
        age: 3,
        gender: 'male',
        weight: 25.5,
        neutered: false,
        avatar: 'https://picsum.photos/200/200?random=11',
        healthNote: '近期有轻微皮肤问题',
        healthScore: 85,
        lastCheckup: '2023-04-20',
        vaccineStatus: '已完成',
        dewormStatus: '需要更新'
      }
    ]
    
    if (petList.value.length > 0) {
      activePet.value = petList.value[0].id
    }
  }, 1000)
}

onMounted(() => {
  fetchPetList()
})
</script>

<style lang="scss" scoped>
.pet-profile {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      font-size: 20px;
      font-weight: 500;
      margin: 0;
    }
  }
  
  .pet-list {
    margin-bottom: 30px;
  }
  
  .pet-info-card {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    padding: 20px;
  }
  
  .pet-basic-info {
    display: flex;
    margin-bottom: 30px;
    
    .pet-avatar {
      width: 120px;
      height: 120px;
      margin-right: 20px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .pet-details {
      flex: 1;
      
      h3 {
        font-size: 18px;
        margin: 0 0 15px;
        display: flex;
        align-items: center;
        
        .el-tag {
          margin-left: 10px;
        }
      }
      
      .pet-attributes {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 20px;
        
        .attribute {
          display: flex;
          
          .label {
            color: #909399;
            margin-right: 5px;
          }
        }
      }
    }
  }
  
  .pet-health-section {
    margin-bottom: 30px;
    
    h4 {
      font-size: 16px;
      margin: 0 0 15px;
      font-weight: 500;
    }
    
    .health-info {
      display: flex;
      align-items: center;
      
      .el-progress {
        margin-right: 40px;
        
        .progress-value {
          font-size: 28px;
          font-weight: bold;
          display: block;
        }
        
        .progress-label {
          font-size: 14px;
          color: #909399;
        }
      }
      
      .health-details {
        display: flex;
        gap: 40px;
        
        .health-item {
          .health-item-title {
            font-size: 14px;
            color: #909399;
            margin-bottom: 5px;
          }
          
          .health-item-value {
            font-size: 16px;
            font-weight: 500;
          }
        }
      }
    }
  }
  
  .empty-pets {
    padding: 60px 0;
    text-align: center;
  }
}

.avatar-uploader {
  display: flex;
  justify-content: center;
  
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 6px;
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .pet-basic-info {
    flex-direction: column;
    
    .pet-avatar {
      margin: 0 auto 20px;
    }
  }
  
  .pet-attributes {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .health-info {
    flex-direction: column;
    align-items: flex-start !important;
    
    .el-progress {
      margin: 0 auto 20px !important;
      display: block;
    }
    
    .health-details {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style> 