<template>
  <div class="article-page">
    <el-card class="article-card">
      <!-- 文章头部 -->
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <div class="meta-left">
            <el-avatar :src="article.authorAvatar" size="small" />
            <span class="author-name">{{ article.authorName }}</span>
            <span class="category">{{ article.category }}</span>
            <span class="time">{{ article.createTime }}</span>
          </div>
          <div class="meta-right">
            <span class="views">
              <el-icon><View /></el-icon>
              {{ article.views }}
            </span>
            <span class="comments">
              <el-icon><ChatDotRound /></el-icon>
              {{ article.comments }}
            </span>
            <span
              class="likes"
              :class="{ active: article.isLiked }"
              @click="handleLike"
            >
              <el-icon><Star /></el-icon>
              {{ article.likes }}
            </span>
          </div>
        </div>
      </div>

      <!-- 文章内容 -->
      <div class="article-content">
        <div class="cover-image" v-if="article.coverImage">
          <el-image :src="article.coverImage" fit="cover" />
        </div>
        <div class="content" v-html="article.content"></div>
        <div class="tags" v-if="article.tags && article.tags.length">
          <el-tag
            v-for="tag in article.tags"
            :key="tag"
            size="small"
            class="tag"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>

      <!-- 文章操作 -->
      <div class="article-actions">
        <el-button
          type="primary"
          :icon="article.isLiked ? 'Star' : 'StarFilled'"
          @click="handleLike"
        >
          {{ article.isLiked ? '取消点赞' : '点赞' }}
        </el-button>
        <el-button
          type="primary"
          icon="Share"
          @click="handleShare"
        >
          分享
        </el-button>
        <el-button
          v-if="isAuthor"
          type="primary"
          icon="Edit"
          @click="handleEdit"
        >
          编辑
        </el-button>
        <el-button
          v-if="isAuthor"
          type="danger"
          icon="Delete"
          @click="handleDelete"
        >
          删除
        </el-button>
      </div>

      <!-- 评论区 -->
      <div class="comment-section">
        <h2>评论 ({{ article.comments }})</h2>
        <div class="comment-form">
          <el-input
            v-model="commentContent"
            type="textarea"
            :rows="3"
            placeholder="写下你的评论..."
          />
          <div class="form-actions">
            <el-button type="primary" @click="handleComment">
              发表评论
            </el-button>
          </div>
        </div>
        <div class="comment-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <el-avatar :src="comment.userAvatar" size="small" />
              <div class="comment-info">
                <span class="username">{{ comment.username }}</span>
                <span class="time">{{ comment.createTime }}</span>
              </div>
            </div>
            <div class="comment-content">
              {{ comment.content }}
            </div>
            <div class="comment-actions">
              <el-button
                type="primary"
                link
                @click="handleReply(comment)"
              >
                回复
              </el-button>
              <el-button
                type="primary"
                link
                @click="handleLikeComment(comment)"
              >
                {{ comment.isLiked ? '取消点赞' : '点赞' }}
                <span class="count">({{ comment.likes }})</span>
              </el-button>
            </div>
            <!-- 回复列表 -->
            <div v-if="comment.replies && comment.replies.length" class="reply-list">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                <div class="reply-header">
                  <el-avatar :src="reply.userAvatar" size="small" />
                  <div class="reply-info">
                    <span class="username">{{ reply.username }}</span>
                    <span class="time">{{ reply.createTime }}</span>
                  </div>
                </div>
                <div class="reply-content">
                  <span class="reply-to">@{{ reply.replyTo }}</span>
                  {{ reply.content }}
                </div>
                <div class="reply-actions">
                  <el-button
                    type="primary"
                    link
                    @click="handleLikeReply(reply)"
                  >
                    {{ reply.isLiked ? '取消点赞' : '点赞' }}
                    <span class="count">({{ reply.likes }})</span>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 评论分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  View,
  ChatDotRound,
  Star,
  StarFilled,
  Share,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import {
  getArticleDetail,
  getCommentList,
  likeArticle,
  likeComment,
  likeReply,
  addComment,
  addReply,
  deleteArticle
} from '@/utils/api'

const route = useRoute()
const router = useRouter()

// 文章数据
const article = ref({
  id: '',
  title: '',
  authorId: '',
  authorName: '',
  authorAvatar: '',
  category: '',
  createTime: '',
  views: 0,
  comments: 0,
  likes: 0,
  isLiked: false,
  coverImage: '',
  content: '',
  tags: []
})

// 评论数据
const comments = ref([])
const commentContent = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 是否为作者
const isAuthor = computed(() => {
  // TODO: 从用户状态获取当前用户ID
  const currentUserId = ''
  return currentUserId === article.value.authorId
})

// 获取文章详情
const fetchArticleDetail = async () => {
  try {
    const res = await getArticleDetail(route.params.id as string)
    if (res.code === 200) {
      article.value = res.data
      fetchComments()
    }
  } catch (error) {
    console.error('获取文章详情失败:', error)
    ElMessage.error('获取文章详情失败')
  }
}

// 获取评论列表
const fetchComments = async () => {
  try {
    const res = await getCommentList({
      articleId: article.value.id,
      page: currentPage.value,
      pageSize: pageSize.value
    })
    if (res.code === 200) {
      comments.value = res.data.list
      total.value = res.data.total
    }
  } catch (error) {
    console.error('获取评论列表失败:', error)
    ElMessage.error('获取评论列表失败')
  }
}

// 点赞文章
const handleLike = async () => {
  try {
    const res = await likeArticle(article.value.id)
    if (res.code === 200) {
      article.value.isLiked = !article.value.isLiked
      article.value.likes += article.value.isLiked ? 1 : -1
      ElMessage.success(article.value.isLiked ? '点赞成功' : '已取消点赞')
    }
  } catch (error) {
    console.error('点赞失败:', error)
    ElMessage.error('点赞失败')
  }
}

// 分享文章
const handleShare = () => {
  // TODO: 实现分享功能
  ElMessage.success('分享链接已复制到剪贴板')
}

// 编辑文章
const handleEdit = () => {
  router.push(`/community/edit/${article.value.id}`)
}

// 删除文章
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      type: 'warning'
    })
    const res = await deleteArticle(article.value.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      router.push('/community')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文章失败:', error)
      ElMessage.error('删除文章失败')
    }
  }
}

// 发表评论
const handleComment = async () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  try {
    const res = await addComment({
      articleId: article.value.id,
      content: commentContent.value
    })
    if (res.code === 200) {
      ElMessage.success('评论成功')
      commentContent.value = ''
      article.value.comments++
      fetchComments()
    }
  } catch (error) {
    console.error('评论失败:', error)
    ElMessage.error('评论失败')
  }
}

// 回复评论
const handleReply = (comment: any) => {
  // TODO: 实现回复功能
  ElMessage.info('回复功能开发中')
}

// 点赞评论
const handleLikeComment = async (comment: any) => {
  try {
    const res = await likeComment(comment.id)
    if (res.code === 200) {
      comment.isLiked = !comment.isLiked
      comment.likes += comment.isLiked ? 1 : -1
      ElMessage.success(comment.isLiked ? '点赞成功' : '已取消点赞')
    }
  } catch (error) {
    console.error('点赞失败:', error)
    ElMessage.error('点赞失败')
  }
}

// 点赞回复
const handleLikeReply = async (reply: any) => {
  try {
    const res = await likeReply(reply.id)
    if (res.code === 200) {
      reply.isLiked = !reply.isLiked
      reply.likes += reply.isLiked ? 1 : -1
      ElMessage.success(reply.isLiked ? '点赞成功' : '已取消点赞')
    }
  } catch (error) {
    console.error('点赞失败:', error)
    ElMessage.error('点赞失败')
  }
}

// 评论分页
const handlePageChange = (val: number) => {
  currentPage.value = val
  fetchComments()
}

onMounted(() => {
  fetchArticleDetail()
})
</script>

<style scoped>
.article-page {
  padding: 20px;
}

.article-card {
  max-width: 1000px;
  margin: 0 auto;
}

.article-header {
  margin-bottom: 30px;
}

.article-title {
  margin: 0 0 20px 0;
  font-size: 24px;
  color: #303133;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #909399;
  font-size: 14px;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-name {
  color: #303133;
  font-weight: bold;
}

.category {
  padding: 2px 8px;
  background: #f0f2f5;
  border-radius: 4px;
}

.meta-right {
  display: flex;
  gap: 15px;
}

.meta-right span {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.meta-right span.active {
  color: var(--el-color-primary);
}

.article-content {
  margin-bottom: 30px;
}

.cover-image {
  margin-bottom: 20px;
  border-radius: 4px;
  overflow: hidden;
}

.cover-image .el-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}

.content {
  color: #303133;
  line-height: 1.8;
  font-size: 16px;
}

.tags {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.article-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.comment-section {
  margin-top: 30px;
}

.comment-section h2 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #303133;
}

.comment-form {
  margin-bottom: 30px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.comment-list {
  margin-bottom: 20px;
}

.comment-item {
  padding: 20px 0;
  border-bottom: 1px solid #ebeef5;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.comment-info {
  display: flex;
  flex-direction: column;
}

.username {
  color: #303133;
  font-weight: bold;
}

.time {
  color: #909399;
  font-size: 12px;
}

.comment-content {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 10px;
}

.comment-actions {
  display: flex;
  gap: 15px;
}

.reply-list {
  margin-top: 15px;
  padding-left: 40px;
}

.reply-item {
  padding: 10px 0;
  border-bottom: 1px dashed #ebeef5;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.reply-info {
  display: flex;
  flex-direction: column;
}

.reply-content {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 5px;
}

.reply-to {
  color: var(--el-color-primary);
  margin-right: 5px;
}

.reply-actions {
  display: flex;
  gap: 15px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style> 