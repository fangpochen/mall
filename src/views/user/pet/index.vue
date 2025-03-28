<template>
  <div class="pet-profile-container">
    <el-card class="pet-header">
      <div class="pet-header-content">
        <h1>我的宠物档案</h1>
        <el-button type="primary" @click="showAddPetDialog">添加宠物</el-button>
      </div>
    </el-card>

    <!-- 宠物列表 -->
    <div class="pet-list" v-if="pets.length > 0">
      <el-card v-for="pet in pets" :key="pet.id" class="pet-card">
        <div class="pet-info">
          <div class="pet-avatar">
            <img :src="pet.avatar" :alt="pet.name" />
          </div>
          <div class="pet-details">
            <h2>{{ pet.name }} <el-tag size="small" effect="dark" :type="getTagType(pet.type)">{{ pet.type }}</el-tag></h2>
            <p><span class="label">品种：</span>{{ pet.breed }}</p>
            <p><span class="label">年龄：</span>{{ pet.age }}岁</p>
            <p><span class="label">性别：</span>{{ pet.gender === 'male' ? '公' : '母' }}</p>
            <p><span class="label">体重：</span>{{ pet.weight }}kg</p>
            <div class="pet-actions">
              <el-button type="primary" plain size="small" @click="viewFeedingPlan(pet)">查看喂养计划</el-button>
              <el-button type="info" plain size="small" @click="editPet(pet)">编辑</el-button>
              <el-button type="danger" plain size="small" @click="confirmDeletePet(pet)">删除</el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 无宠物提示 -->
    <el-empty v-else description="暂无宠物档案，点击添加宠物开始创建">
      <el-button type="primary" @click="showAddPetDialog">添加宠物</el-button>
    </el-empty>

    <!-- 添加/编辑宠物对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="petForm" :rules="rules" ref="petFormRef" label-width="80px">
        <el-form-item label="宠物名称" prop="name">
          <el-input v-model="petForm.name" placeholder="请输入宠物名称"></el-input>
        </el-form-item>
        <el-form-item label="宠物类型" prop="type">
          <el-select v-model="petForm.type" placeholder="请选择宠物类型" style="width: 100%">
            <el-option label="猫" value="cat"></el-option>
            <el-option label="狗" value="dog"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宠物品种" prop="breed">
          <el-input v-model="petForm.breed" placeholder="请输入宠物品种"></el-input>
        </el-form-item>
        <el-form-item label="宠物年龄" prop="age">
          <el-input-number v-model="petForm.age" :min="0" :max="30" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="宠物性别" prop="gender">
          <el-radio-group v-model="petForm.gender">
            <el-radio label="male">公</el-radio>
            <el-radio label="female">母</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="宠物体重" prop="weight">
          <el-input-number v-model="petForm.weight" :min="0.1" :max="100" :precision="1" :step="0.1" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="宠物头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="petForm.avatar" :src="petForm.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePet">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除确认对话框 -->
    <el-dialog
      title="删除宠物"
      v-model="deleteDialogVisible"
      width="400px"
    >
      <p>确定要删除宠物"{{ currentPet?.name }}"吗？此操作不可恢复。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="deletePet">确认删除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()

// 宠物列表数据
const pets = ref([
  {
    id: 1,
    name: '球球',
    type: 'cat',
    breed: '英国短毛猫',
    age: 3,
    gender: 'female',
    weight: 4.5,
    avatar: 'https://example.com/pet1.jpg'
  },
  {
    id: 2,
    name: '旺财',
    type: 'dog',
    breed: '金毛寻回犬',
    age: 2,
    gender: 'male',
    weight: 18.2,
    avatar: 'https://example.com/pet2.jpg'
  }
])

// 表单相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加宠物')
const petFormRef = ref()
const isEdit = ref(false)
const editId = ref(0)

// 删除相关
const deleteDialogVisible = ref(false)
const currentPet = ref(null)

// 宠物表单
const petForm = reactive({
  name: '',
  type: '',
  breed: '',
  age: 0,
  gender: 'male',
  weight: 0,
  avatar: ''
})

// 表单验证规则
const rules = {
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
 * 显示添加宠物对话框
 */
const showAddPetDialog = () => {
  dialogTitle.value = '添加宠物'
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

/**
 * 编辑宠物信息
 * @param pet 宠物信息对象
 */
const editPet = (pet) => {
  dialogTitle.value = '编辑宠物'
  isEdit.value = true
  editId.value = pet.id
  Object.keys(petForm).forEach(key => {
    petForm[key] = pet[key]
  })
  dialogVisible.value = true
}

/**
 * 确认删除宠物
 * @param pet 宠物信息对象
 */
const confirmDeletePet = (pet) => {
  currentPet.value = pet
  deleteDialogVisible.value = true
}

/**
 * 删除宠物
 */
const deletePet = () => {
  // TODO: 实际删除逻辑，调用API
  const index = pets.value.findIndex(p => p.id === currentPet.value.id)
  if (index !== -1) {
    pets.value.splice(index, 1)
    ElMessage.success('宠物删除成功')
    deleteDialogVisible.value = false
  }
}

/**
 * 保存宠物信息
 */
const savePet = () => {
  petFormRef.value.validate(valid => {
    if (valid) {
      if (isEdit.value) {
        // 编辑模式
        const index = pets.value.findIndex(p => p.id === editId.value)
        if (index !== -1) {
          const updatedPet = { ...pets.value[index], ...petForm, id: editId.value }
          pets.value.splice(index, 1, updatedPet)
          ElMessage.success('宠物信息更新成功')
        }
      } else {
        // 添加模式
        const newId = pets.value.length > 0 ? Math.max(...pets.value.map(p => p.id)) + 1 : 1
        pets.value.push({ ...petForm, id: newId })
        ElMessage.success('宠物添加成功')
      }
      dialogVisible.value = false
    }
  })
}

/**
 * 查看喂养计划
 * @param pet 宠物信息对象
 */
const viewFeedingPlan = (pet) => {
  router.push({ 
    path: '/user/pet/feeding-plan',
    query: { petId: pet.id }
  })
}

/**
 * 重置表单
 */
const resetForm = () => {
  petForm.name = ''
  petForm.type = ''
  petForm.breed = ''
  petForm.age = 0
  petForm.gender = 'male'
  petForm.weight = 0
  petForm.avatar = ''
}

/**
 * 处理头像上传成功事件
 * @param res 上传响应结果
 */
const handleAvatarSuccess = (res) => {
  // TODO: 实际处理上传成功逻辑
  petForm.avatar = res.url
}

/**
 * 上传头像前的处理
 * @param file 文件对象
 */
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传头像图片只能是图片格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isImage && isLt2M
}
</script>

<style scoped>
.pet-profile-container {
  padding: 20px;
}

.pet-header {
  margin-bottom: 20px;
}

.pet-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pet-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 20px;
}

.pet-card {
  transition: all 0.3s ease;
}

.pet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.pet-info {
  display: flex;
  gap: 20px;
}

.pet-avatar {
  width: 120px;
  height: 120px;
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

.pet-details p {
  margin: 5px 0;
  color: #606266;
}

.label {
  color: #909399;
  display: inline-block;
  width: 60px;
}

.pet-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style> 