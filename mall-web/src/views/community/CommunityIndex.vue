<template>
  <div class="community-page">
    <div class="container">
      <div class="community-header">
        <div class="left-section">
          <h2>宠物社区</h2>
          <div class="community-tabs">
            <el-tabs v-model="activeTab" @tab-click="handleTabChange">
              <el-tab-pane label="热门" name="hot"></el-tab-pane>
              <el-tab-pane label="最新" name="new"></el-tab-pane>
              <el-tab-pane label="精华" name="top"></el-tab-pane>
              <el-tab-pane label="问答" name="qa"></el-tab-pane>
              <el-tab-pane label="话题" name="topics"></el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="right-section">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章、话题或用户"
            prefix-icon="Search"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
          <el-button type="primary" @click="handleCreatePost">发布内容</el-button>
        </div>
      </div>
      
      <div class="community-content">
        <div class="main-content">
          <!-- 轮播图 -->
          <div class="banner-section">
            <el-carousel height="250px" :interval="4000" indicator-position="outside">
              <el-carousel-item v-for="(item, index) in banners" :key="index">
                <div class="banner-content" @click="goToLink(item.link)">
                  <img :src="item.imageUrl" :alt="item.title" class="banner-image" />
                  <div class="banner-info">
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description }}</p>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
          
          <!-- 文章列表 -->
          <div class="article-list">
            <div 
              v-for="article in articles" 
              :key="article.id" 
              class="article-item"
              @click="goToArticle(article.id)"
            >
              <div class="article-main">
                <div class="article-info">
                  <h3 class="article-title">
                    <el-tag v-if="article.isTop" size="small" type="danger">置顶</el-tag>
                    <el-tag v-if="article.isHot" size="small" type="warning">热门</el-tag>
                    {{ article.title }}
                  </h3>
                  <p class="article-summary">{{ article.summary }}</p>
                  <div class="article-meta">
                    <div class="author-info">
                      <img :src="article.author.avatar" :alt="article.author.name" class="author-avatar" />
                      <span class="author-name">{{ article.author.name }}</span>
                    </div>
                    <div class="article-stats">
                      <span class="time">{{ article.publishTime }}</span>
                      <span class="views"><el-icon><View /></el-icon> {{ article.views }}</span>
                      <span class="comments"><el-icon><ChatDotRound /></el-icon> {{ article.comments }}</span>
                      <span class="likes"><el-icon><Star /></el-icon> {{ article.likes }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="article.coverUrl" class="article-cover">
                  <img :src="article.coverUrl" :alt="article.title" />
                </div>
              </div>
              <div v-if="article.tags && article.tags.length" class="article-tags">
                <el-tag 
                  v-for="tag in article.tags" 
                  :key="tag" 
                  size="small" 
                  effect="plain" 
                  class="tag-item"
                  @click.stop="handleTagClick(tag)"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            
            <!-- 分页 -->
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
        
        <div class="sidebar">
          <!-- 用户信息 -->
          <div v-if="isLoggedIn" class="user-card">
            <div class="user-info">
              <img :src="userInfo.avatar" :alt="userInfo.nickname" class="user-avatar" />
              <div class="user-details">
                <div class="user-name">{{ userInfo.nickname }}</div>
                <div class="user-stats">
                  <span>文章 {{ userInfo.articleCount }}</span>
                  <span>粉丝 {{ userInfo.followerCount }}</span>
                </div>
              </div>
            </div>
            <div class="user-actions">
              <el-button size="small" @click="goToUserPosts">我的文章</el-button>
              <el-button size="small" @click="goToUserMessages">我的消息</el-button>
            </div>
          </div>
          <div v-else class="login-card">
            <p>登录后可以发布内容、参与讨论</p>
            <el-button type="primary" @click="goToLogin">去登录</el-button>
          </div>
          
          <!-- 热门话题 -->
          <div class="hot-topics-card">
            <div class="card-header">
              <h3>热门话题</h3>
              <el-button text @click="goToAllTopics">查看全部</el-button>
            </div>
            <div class="topic-list">
              <div 
                v-for="topic in hotTopics" 
                :key="topic.id" 
                class="topic-item"
                @click="goToTopic(topic.id)"
              >
                <div class="topic-icon">
                  <el-icon><component :is="topic.icon"></component></el-icon>
                </div>
                <div class="topic-info">
                  <div class="topic-name">{{ topic.name }}</div>
                  <div class="topic-count">{{ topic.postCount }}篇内容</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 活跃用户 -->
          <div class="active-users-card">
            <div class="card-header">
              <h3>活跃用户</h3>
            </div>
            <div class="user-list">
              <div 
                v-for="user in activeUsers" 
                :key="user.id" 
                class="active-user-item"
                @click="goToUserProfile(user.id)"
              >
                <img :src="user.avatar" :alt="user.name" class="user-avatar" />
                <div class="user-info">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-bio">{{ user.bio }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 推荐产品 -->
          <div class="recommended-products-card">
            <div class="card-header">
              <h3>推荐产品</h3>
            </div>
            <div class="product-list">
              <div 
                v-for="product in recommendedProducts" 
                :key="product.id" 
                class="product-item"
                @click="goToProduct(product.id)"
              >
                <img :src="product.imageUrl" :alt="product.name" class="product-image" />
                <div class="product-name">{{ product.name }}</div>
                <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 发布内容对话框 -->
    <el-dialog
      v-model="createDialogVisible"
      title="发布内容"
      width="50%"
    >
      <el-form :model="postForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="postForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="postForm.content"
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="话题">
          <el-select
            v-model="postForm.topic"
            placeholder="选择话题"
            style="width: 100%"
          >
            <el-option
              v-for="topic in hotTopics"
              :key="topic.id"
              :label="topic.name"
              :value="topic.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
            class="cover-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
          >
            <img v-if="postForm.coverUrl" :src="postForm.coverUrl" class="cover-image" />
            <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="标签">
          <el-tag
            v-for="tag in postForm.tags"
            :key="tag"
            closable
            @close="handleRemoveTag(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputTagVisible"
            ref="tagInputRef"
            v-model="inputTagValue"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else size="small" @click="showTagInput">+ 添加标签</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPost">发布</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Search, 
  View, 
  ChatDotRound, 
  Star, 
  Plus,
  House,
  Pet,
  Box,
  Food
} from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('hot')
const searchKeyword = ref('')

// 用户信息
const isLoggedIn = computed(() => {
  return localStorage.getItem('token') !== null
})

const userInfo = ref({
  id: '1001',
  nickname: '宠物爱好者',
  avatar: 'https://picsum.photos/100/100?random=1',
  articleCount: 12,
  followerCount: 35
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 轮播图数据
const banners = ref([
  {
    imageUrl: 'https://picsum.photos/1200/400?random=1',
    title: '如何科学喂养新生小狗',
    description: '详细介绍小狗的科学饲养方法，帮助新手铲屎官顺利度过养狗初期',
    link: '/article/1001'
  },
  {
    imageUrl: 'https://picsum.photos/1200/400?random=2',
    title: '宠物摄影技巧分享',
    description: '分享如何用手机拍出高质量的宠物照片，让你的爱宠成为社交媒体明星',
    link: '/article/1002'
  },
  {
    imageUrl: 'https://picsum.photos/1200/400?random=3',
    title: '常见猫咪皮肤病预防指南',
    description: '专业兽医分享猫咪皮肤病的预防和家庭护理知识',
    link: '/article/1003'
  }
])

// 文章列表
const articles = ref<any[]>([])

// 热门话题
const hotTopics = ref([
  {
    id: '101',
    name: '猫咪日常',
    icon: 'Pet',
    postCount: 1254
  },
  {
    id: '102',
    name: '狗狗训练',
    icon: 'House',
    postCount: 982
  },
  {
    id: '103',
    name: '宠物健康',
    icon: 'Star',
    postCount: 876
  },
  {
    id: '104',
    name: '宠物饲养',
    icon: 'Food',
    postCount: 654
  },
  {
    id: '105',
    name: '宠物用品',
    icon: 'Box',
    postCount: 432
  }
])

// 活跃用户
const activeUsers = ref([
  {
    id: '1',
    name: '宠物医生小王',
    avatar: 'https://picsum.photos/100/100?random=10',
    bio: '专业兽医，5年临床经验'
  },
  {
    id: '2',
    name: '猫咪训练师',
    avatar: 'https://picsum.photos/100/100?random=11',
    bio: '专业猫咪行为训练师'
  },
  {
    id: '3',
    name: '萌宠摄影师',
    avatar: 'https://picsum.photos/100/100?random=12',
    bio: '专业宠物摄影，接受预约'
  },
  {
    id: '4',
    name: '狗狗美食家',
    avatar: 'https://picsum.photos/100/100?random=13',
    bio: '自制狗粮达人，分享健康食谱'
  }
])

// 推荐产品
const recommendedProducts = ref([
  {
    id: '101',
    name: '猫咪磨爪器',
    price: 39.90,
    imageUrl: 'https://picsum.photos/200/200?random=101'
  },
  {
    id: '102',
    name: '狗狗洗澡刷',
    price: 29.90,
    imageUrl: 'https://picsum.photos/200/200?random=102'
  },
  {
    id: '103',
    name: '宠物智能喂食器',
    price: 199.00,
    imageUrl: 'https://picsum.photos/200/200?random=103'
  }
])

// 发布内容相关
const createDialogVisible = ref(false)
const postForm = reactive({
  title: '',
  content: '',
  topic: '',
  coverUrl: '',
  tags: [] as string[]
})
const inputTagVisible = ref(false)
const inputTagValue = ref('')
const tagInputRef = ref()

/**
 * 处理标签输入框显示
 * @example
 * showTagInput()
 */
const showTagInput = () => {
  inputTagVisible.value = true
  nextTick(() => {
    tagInputRef.value?.focus()
  })
}

/**
 * 处理标签输入确认
 * @example
 * handleInputConfirm()
 */
const handleInputConfirm = () => {
  if (inputTagValue.value) {
    if (postForm.tags.length < 5) {
      postForm.tags.push(inputTagValue.value)
    } else {
      ElMessage.warning('最多添加5个标签')
    }
  }
  inputTagVisible.value = false
  inputTagValue.value = ''
}

/**
 * 移除标签
 * @param tag 标签内容
 * @example
 * handleRemoveTag('宠物')
 */
const handleRemoveTag = (tag: string) => {
  postForm.tags = postForm.tags.filter(t => t !== tag)
}

/**
 * 处理封面上传成功
 * @param res 上传结果
 * @example
 * handleCoverSuccess({ code: 200, data: { url: 'https://example.com/image.jpg' } })
 */
const handleCoverSuccess = (res: any) => {
  if (res.code === 200) {
    postForm.coverUrl = res.data.url
  } else {
    ElMessage.error('上传失败')
  }
}

/**
 * 提交文章
 * @example
 * submitPost()
 */
const submitPost = () => {
  if (!postForm.title.trim()) {
    ElMessage.warning('请输入标题')
    return
  }
  
  if (!postForm.content.trim()) {
    ElMessage.warning('请输入内容')
    return
  }
  
  // 这里应该是API调用发布文章
  ElMessage.success('发布成功')
  createDialogVisible.value = false
  
  // 重置表单
  postForm.title = ''
  postForm.content = ''
  postForm.topic = ''
  postForm.coverUrl = ''
  postForm.tags = []
  
  // 刷新文章列表
  fetchArticles()
}

/**
 * 切换标签
 * @example
 * handleTabChange()
 */
const handleTabChange = () => {
  currentPage.value = 1
  fetchArticles()
}

/**
 * 处理搜索
 * @example
 * handleSearch()
 */
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  router.push({
    path: '/community/search',
    query: { keyword: searchKeyword.value }
  })
}

/**
 * 处理创建文章
 * @example
 * handleCreatePost()
 */
const handleCreatePost = () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    router.push('/login?redirect=/community')
    return
  }
  
  createDialogVisible.value = true
}

/**
 * 处理标签点击
 * @param tag 标签内容
 * @example
 * handleTagClick('宠物')
 */
const handleTagClick = (tag: string) => {
  router.push({
    path: '/community/tag',
    query: { tag }
  })
}

/**
 * 跳转到链接
 * @param link 链接地址
 * @example
 * goToLink('/article/1001')
 */
const goToLink = (link: string) => {
  router.push(link)
}

/**
 * 跳转到文章详情
 * @param articleId 文章ID
 * @example
 * goToArticle('1001')
 */
const goToArticle = (articleId: string) => {
  router.push(`/community/article/${articleId}`)
}

/**
 * 跳转到话题页面
 * @param topicId 话题ID
 * @example
 * goToTopic('101')
 */
const goToTopic = (topicId: string) => {
  router.push(`/community/topic/${topicId}`)
}

/**
 * 跳转到用户个人主页
 * @param userId 用户ID
 * @example
 * goToUserProfile('1')
 */
const goToUserProfile = (userId: string) => {
  router.push(`/community/user/${userId}`)
}

/**
 * 跳转到个人文章列表
 * @example
 * goToUserPosts()
 */
const goToUserPosts = () => {
  router.push('/community/my-posts')
}

/**
 * 跳转到个人消息
 * @example
 * goToUserMessages()
 */
const goToUserMessages = () => {
  router.push('/user/messages')
}

/**
 * 跳转到所有话题页
 * @example
 * goToAllTopics()
 */
const goToAllTopics = () => {
  router.push('/community/topics')
}

/**
 * 跳转到商品详情
 * @param productId 商品ID
 * @example
 * goToProduct('101')
 */
const goToProduct = (productId: string) => {
  router.push(`/product/${productId}`)
}

/**
 * 跳转到登录页面
 * @example
 * goToLogin()
 */
const goToLogin = () => {
  router.push('/login?redirect=/community')
}

/**
 * 处理页码变化
 * @param page 页码
 * @example
 * handleCurrentChange(2)
 */
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * 处理每页数量变化
 * @param size 每页数量
 * @example
 * handleSizeChange(20)
 */
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchArticles()
}

/**
 * 获取文章列表
 * @example
 * fetchArticles()
 */
const fetchArticles = () => {
  // 构建请求参数
  const params = {
    page: currentPage.value,
    size: pageSize.value,
    tab: activeTab.value
  }
  
  console.log('请求参数:', params)
  
  // 模拟API调用获取文章列表
  setTimeout(() => {
    // 生成模拟数据
    const mockArticles = []
    for (let i = 1; i <= 50; i++) {
      mockArticles.push({
        id: `article_${i}`,
        title: `宠物文章标题 ${i}`,
        summary: `这是一篇关于宠物的文章，内容简介...这是一篇关于宠物的文章，内容简介...这是一篇关于宠物的文章，内容简介...`,
        coverUrl: i % 3 === 0 ? `https://picsum.photos/300/200?random=${i}` : '',
        author: {
          id: '1',
          name: '宠物爱好者',
          avatar: 'https://picsum.photos/100/100?random=1'
        },
        publishTime: '2023-05-15',
        views: Math.floor(Math.random() * 1000) + 100,
        comments: Math.floor(Math.random() * 50),
        likes: Math.floor(Math.random() * 100),
        isTop: i <= 2,
        isHot: i % 5 === 0,
        tags: i % 2 === 0 ? ['宠物', '养护', '生活'] : ['宠物', '健康']
      })
    }
    
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    articles.value = mockArticles.slice(start, end)
    totalCount.value = mockArticles.length
  }, 500)
}

onMounted(() => {
  fetchArticles()
})
</script>

<style lang="scss" scoped>
.community-page {
  padding: 20px 0;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.community-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .left-section {
    h2 {
      font-size: 24px;
      font-weight: 500;
      margin: 0 0 10px;
      color: #333;
    }
  }
  
  .right-section {
    display: flex;
    gap: 15px;
    
    .el-input {
      width: 250px;
    }
  }
}

.community-content {
  display: flex;
  gap: 20px;
  
  .main-content {
    flex: 1;
    
    .banner-section {
      margin-bottom: 20px;
      
      .banner-content {
        position: relative;
        height: 100%;
        cursor: pointer;
        
        .banner-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .banner-info {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0));
          color: #fff;
          
          h3 {
            font-size: 20px;
            margin: 0 0 10px;
          }
          
          p {
            font-size: 14px;
            margin: 0;
            opacity: 0.9;
          }
        }
      }
    }
    
    .article-list {
      .article-item {
        background-color: #fff;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 15px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        cursor: pointer;
        transition: transform 0.3s;
        
        &:hover {
          transform: translateY(-5px);
        }
        
        .article-main {
          display: flex;
          margin-bottom: 15px;
          
          .article-info {
            flex: 1;
            padding-right: 20px;
            
            .article-title {
              font-size: 18px;
              font-weight: 500;
              margin: 0 0 10px;
              color: #333;
              display: flex;
              align-items: center;
              
              .el-tag {
                margin-right: 8px;
              }
            }
            
            .article-summary {
              font-size: 14px;
              color: #606266;
              margin: 0 0 15px;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              line-height: 1.5;
            }
            
            .article-meta {
              display: flex;
              justify-content: space-between;
              align-items: center;
              
              .author-info {
                display: flex;
                align-items: center;
                
                .author-avatar {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  margin-right: 8px;
                }
                
                .author-name {
                  font-size: 14px;
                  color: #606266;
                }
              }
              
              .article-stats {
                display: flex;
                align-items: center;
                gap: 15px;
                font-size: 12px;
                color: #909399;
                
                .time, .views, .comments, .likes {
                  display: flex;
                  align-items: center;
                  
                  .el-icon {
                    margin-right: 4px;
                  }
                }
              }
            }
          }
          
          .article-cover {
            width: 180px;
            height: 120px;
            border-radius: 6px;
            overflow: hidden;
            flex-shrink: 0;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
        
        .article-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          
          .tag-item {
            cursor: pointer;
          }
        }
      }
      
      .pagination-container {
        display: flex;
        justify-content: center;
        margin-top: 30px;
      }
    }
  }
  
  .sidebar {
    width: 300px;
    
    .user-card, .login-card, .hot-topics-card, .active-users-card, .recommended-products-card {
      background-color: #fff;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    }
    
    .user-card {
      .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        
        .user-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin-right: 15px;
        }
        
        .user-details {
          .user-name {
            font-size: 16px;
            font-weight: 500;
            color: #333;
            margin-bottom: 5px;
          }
          
          .user-stats {
            font-size: 12px;
            color: #909399;
            
            span {
              margin-right: 10px;
            }
          }
        }
      }
      
      .user-actions {
        display: flex;
        justify-content: space-between;
      }
    }
    
    .login-card {
      text-align: center;
      
      p {
        margin: 0 0 15px;
        color: #606266;
      }
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 0;
        color: #333;
      }
    }
    
    .topic-list {
      .topic-item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          background-color: #f9f9f9;
        }
        
        .topic-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #f0e6ff;
          color: #7e57c2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
        }
        
        .topic-info {
          flex: 1;
          
          .topic-name {
            font-size: 14px;
            color: #333;
            margin-bottom: 4px;
          }
          
          .topic-count {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
    
    .user-list {
      .active-user-item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          background-color: #f9f9f9;
        }
        
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-right: 10px;
        }
        
        .user-info {
          flex: 1;
          
          .user-name {
            font-size: 14px;
            color: #333;
            margin-bottom: 4px;
          }
          
          .user-bio {
            font-size: 12px;
            color: #909399;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    
    .product-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      
      .product-item {
        display: flex;
        align-items: center;
        cursor: pointer;
        
        &:hover {
          .product-name {
            color: #7e57c2;
          }
        }
        
        .product-image {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          margin-right: 10px;
          object-fit: cover;
        }
        
        .product-name {
          font-size: 14px;
          color: #333;
          margin-bottom: 5px;
        }
        
        .product-price {
          font-size: 14px;
          color: #f56c6c;
          font-weight: 500;
        }
      }
    }
  }
}

.cover-uploader {
  .cover-image {
    width: 200px;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
  }
  
  .cover-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
}

@media (max-width: 992px) {
  .community-content {
    flex-direction: column;
    
    .sidebar {
      width: 100%;
    }
  }
  
  .article-main {
    flex-direction: column;
    
    .article-cover {
      width: 100% !important;
      height: 200px !important;
      margin-top: 15px;
    }
    
    .article-info {
      padding-right: 0 !important;
    }
  }
  
  .community-header {
    flex-direction: column;
    align-items: flex-start;
    
    .right-section {
      width: 100%;
      margin-top: 15px;
      flex-direction: column;
      
      .el-input {
        width: 100% !important;
      }
    }
  }
}
</style> 