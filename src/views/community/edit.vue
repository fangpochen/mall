<template>
  <div class="edit-page">
    <el-card class="edit-card">
      <template #header>
        <div class="edit-header">
          <h2>{{ isEdit ? '编辑文章' : '发布文章' }}</h2>
        </div>
      </template>

      <el-form
        ref="articleFormRef"
        :model="articleForm"
        :rules="articleRules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-select v-model="articleForm.category" placeholder="请选择分类">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="封面" prop="coverImage">
          <el-upload
            class="cover-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
          >
            <img v-if="articleForm.coverImage" :src="articleForm.coverImage" class="cover-image" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <div class="editor-container">
            <el-input
              v-model="articleForm.content"
              type="textarea"
              :rows="15"
              placeholder="请输入文章内容"
            />
          </div>
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-select
            v-model="articleForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择或输入标签"
          >
            <el-option
              v-for="tag in tags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">发布</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getArticleDetail,
  getCategories,
  getTags,
  publishArticle,
  updateArticle
} from '@/utils/api'

const route = useRoute()
const router = useRouter()
const articleFormRef = ref()

// 是否为编辑模式
const isEdit = computed(() => {
  return !!route.params.id
})

// 文章表单
const articleForm = ref({
  title: '',
  category: '',
  coverImage: '',
  content: '',
  tags: []
})

// 表单验证规则
const articleRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 10, message: '内容不能少于 10 个字符', trigger: 'blur' }
  ]
}

// 分类和标签
const categories = ref([])
const tags = ref([])

// 获取文章详情
const fetchArticleDetail = async () => {
  try {
    const res = await getArticleDetail(route.params.id as string)
    if (res.code === 200) {
      articleForm.value = {
        title: res.data.title,
        category: res.data.category,
        coverImage: res.data.coverImage,
        content: res.data.content,
        tags: res.data.tags
      }
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
    ElMessage.error('获取文章详情失败')
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const res = await getCategories()
    if (res.code === 200) {
      categories.value = res.data
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  }
}

// 获取标签列表
const fetchTags = async () => {
  try {
    const res = await getTags()
    if (res.code === 200) {
      tags.value = res.data
    }
  } catch (error) {
    console.error('获取标签列表失败:', error)
    ElMessage.error('获取标签列表失败')
  }
}

// 封面图片上传成功
const handleCoverSuccess = (response: any) => {
  if (response.code === 200) {
    articleForm.value.coverImage = response.data
    ElMessage.success('封面上传成功')
  } else {
    ElMessage.error('封面上传失败')
  }
}

// 封面图片上传前校验
const beforeCoverUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传封面图片只能是图片格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传封面图片大小不能超过 2MB!')
  }
  return isImage && isLt2M
}

// 提交表单
const handleSubmit = async () => {
  if (!articleFormRef.value) return
  
  try {
    await articleFormRef.value.validate()
    const api = isEdit.value ? updateArticle : publishArticle
    const res = await api({
      ...articleForm.value,
      id: route.params.id
    })
    
    if (res.code === 200) {
      ElMessage.success(isEdit.value ? '更新成功' : '发布成功')
      router.push(`/community/article/${res.data.id}`)
    } else {
      ElMessage.error(res.message || (isEdit.value ? '更新失败' : '发布失败'))
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败')
  }
}

// 取消
const handleCancel = () => {
  router.back()
}

onMounted(() => {
  fetchCategories()
  fetchTags()
  if (isEdit.value) {
    fetchArticleDetail()
  }
})
</script>

<style scoped>
.edit-page {
  padding: 20px;
}

.edit-card {
  max-width: 1000px;
  margin: 0 auto;
}

.edit-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.editor-container {
  margin-bottom: 20px;
}

.cover-uploader {
  text-align: center;
}

.cover-uploader .cover-image {
  width: 200px;
  height: 150px;
  display: block;
  border-radius: 4px;
}

.cover-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.cover-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 150px;
  text-align: center;
  line-height: 150px;
}
</style>
