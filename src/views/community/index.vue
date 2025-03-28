<template>
  <div class="community-page">
    <h1>测试内容 - 这是社区页面</h1>

    <!-- 顶部操作栏 -->
    <div class="top-bar">
      <div class="search-filter">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索文章"
          class="search-input"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select
          v-model="selectedCategory"
          placeholder="选择分类"
          clearable
          @change="handleCategoryChange"
        >
          <el-option
            v-for="category in categories"
            :key="category.id"
            :label="category.name"
            :value="category.id"
          />
        </el-select>
        <el-select
          v-model="sortBy"
          placeholder="排序方式"
          @change="handleSortChange"
        >
          <el-option label="最新发布" value="createTime" />
          <el-option label="最多浏览" value="views" />
          <el-option label="最多评论" value="comments" />
          <el-option label="最多点赞" value="likes" />
        </el-select>
      </div>
      <el-button type="primary" @click="handlePublish">
        <el-icon><Edit /></el-icon>
        发布文章
      </el-button>
    </div>

    <!-- 文章列表 -->
    <div class="article-list" v-loading="loading">
      <el-empty v-if="articles.length === 0" description="暂无文章" />
      <el-card v-else v-for="article in articles" :key="article.id" class="article-item">
        <div class="article-content">
          <div class="article-main">
            <h3 class="title" @click="handleArticleClick(article.id)">
              {{ article.title }}
            </h3>
            <p class="summary">{{ article.summary }}</p>
            <div class="meta">
              <el-avatar :src="article.authorAvatar" :size="24" />
              <span class="author">{{ article.authorName }}</span>
              <span class="category">{{ article.category }}</span>
              <span class="time">{{ article.createTime }}</span>
              <div class="stats">
                <span>
                  <el-icon><View /></el-icon>
                  {{ article.views }}
                </span>
                <span>
                  <el-icon><ChatDotRound /></el-icon>
                  {{ article.comments }}
                </span>
                <span>
                  <el-icon><Star /></el-icon>
                  {{ article.likes }}
                </span>
              </div>
            </div>
          </div>
          <div class="article-cover" v-if="article.coverImage">
            <el-image
              :src="article.coverImage"
              fit="cover"
              @click="handleArticleClick(article.id)"
            />
          </div>
        </div>
        <div class="article-tags" v-if="article.tags && article.tags.length">
          <el-tag
            v-for="tag in article.tags"
            :key="tag"
            size="small"
            class="tag"
          >
            {{ tag }}
          </el-tag>
        </div>
      </el-card>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Search,
  Edit,
  View,
  ChatDotRound,
  Star
} from '@element-plus/icons-vue'
import { getArticleList, getCategories } from '@/utils/api'

const router = useRouter()
const loading = ref(false)

// 搜索和过滤
const searchKeyword = ref('')
const selectedCategory = ref('')
const sortBy = ref('createTime')
const categories = ref([
  { id: '1', name: '养护指南' },
  { id: '2', name: '健康知识' },
  { id: '3', name: '美容护理' },
  { id: '4', name: '训练技巧' },
  { id: '5', name: '日常分享' }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 文章列表
const articles = ref([
  {
    id: '1',
    title: '如何照顾金毛幼犬？',
    summary: '金毛幼犬的饮食、运动和训练要点，帮助你的金毛健康成长。分享一些实用的养护经验和注意事项。',
    authorName: '宠物达人',
    authorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    category: '养护指南',
    createTime: '2024-03-15',
    views: 1234,
    comments: 32,
    likes: 88,
    coverImage: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: ['金毛', '幼犬', '养护']
  },
  {
    id: '2',
    title: '猫咪常见疾病预防',
    summary: '介绍猫咪最常见的几种疾病，以及如何预防和早期发现。包括定期体检、疫苗接种等重要事项。',
    authorName: '猫咪医生',
    authorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    category: '健康知识',
    createTime: '2024-03-14',
    views: 2156,
    comments: 45,
    likes: 120,
    coverImage: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    tags: ['猫咪', '疾病预防', '健康']
  },
  {
    id: '3',
    title: '宠物美容的正确步骤',
    summary: '专业宠物美容师分享宠物美容的详细步骤和注意事项，让你的爱宠时刻保持整洁美丽。',
    authorName: '美容师小王',
    authorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    category: '美容护理',
    createTime: '2024-03-13',
    views: 1876,
    comments: 28,
    likes: 95,
    coverImage: '',
    tags: ['美容', '护理', '技巧']
  }
])

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    // 使用模拟数据，实际项目中这里会调用API
    total.value = articles.value.length
  } catch (error) {
    console.error('获取文章列表失败:', error)
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    // 使用模拟数据，实际项目中这里会调用API
    await new Promise(resolve => setTimeout(resolve, 300))
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchArticles()
}

// 分类变化
const handleCategoryChange = () => {
  currentPage.value = 1
  fetchArticles()
}

// 排序变化
const handleSortChange = () => {
  currentPage.value = 1
  fetchArticles()
}

// 页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchArticles()
}

// 每页条数变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchArticles()
}

// 发布文章
const handlePublish = () => {
  router.push('/community/edit')
}

// 点击文章
const handleArticleClick = (id: string) => {
  router.push(`/community/article/${id}`)
}

onMounted(() => {
  fetchCategories()
  fetchArticles()
})
</script>

<style scoped>
.community-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-filter {
  display: flex;
  gap: 15px;
  flex: 1;
  margin-right: 20px;
}

.search-input {
  width: 300px;
}

.article-list {
  min-height: 400px;
}

.article-item {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-content {
  display: flex;
  gap: 20px;
}

.article-main {
  flex: 1;
}

.title {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #303133;
  line-height: 1.5;
}

.title:hover {
  color: var(--el-color-primary);
}

.summary {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.meta {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 13px;
  color: #909399;
}

.author {
  color: #303133;
  font-weight: 500;
}

.category {
  padding: 2px 8px;
  background: #f0f2f5;
  border-radius: 4px;
}

.stats {
  display: flex;
  gap: 15px;
}

.stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-cover {
  width: 200px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
}

.article-cover .el-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s;
}

.article-cover .el-image:hover {
  transform: scale(1.05);
}

.article-tags {
  margin-top: 15px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>
