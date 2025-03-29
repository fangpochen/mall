<template>
  <div class="user-center">
    <div class="container">
      <div class="user-center-content">
        <!-- 侧边栏导航 -->
        <div class="sidebar">
          <div class="user-info">
            <div class="avatar">
              <img :src="userInfo.avatar || 'https://picsum.photos/100/100?random=1'" alt="用户头像" />
              <el-upload
                class="avatar-uploader"
                action="/api/user/upload-avatar"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
              >
                <el-icon class="edit-icon"><Edit /></el-icon>
              </el-upload>
            </div>
            <div class="username">{{ userInfo.nickname || '用户昵称' }}</div>
            <div class="user-level">
              <el-tag size="small">{{ userInfo.level || 'LV1' }}</el-tag>
            </div>
          </div>
          <el-menu
            router
            :default-active="activeMenu"
            class="sidebar-menu"
          >
            <el-menu-item index="/user/profile">
              <el-icon><User /></el-icon>
              <span>个人资料</span>
            </el-menu-item>
            <el-menu-item index="/user/pet">
              <el-icon><Promotion /></el-icon>
              <span>宠物档案</span>
            </el-menu-item>
            <el-menu-item index="/order">
              <el-icon><List /></el-icon>
              <span>我的订单</span>
            </el-menu-item>
            <el-menu-item index="/user/favorites">
              <el-icon><Star /></el-icon>
              <span>我的收藏</span>
            </el-menu-item>
            <el-menu-item index="/user/messages">
              <el-badge :value="unreadCount" :hidden="unreadCount === 0">
                <el-icon><ChatDotRound /></el-icon>
                <span>我的消息</span>
              </el-badge>
            </el-menu-item>
            <el-menu-item index="/user/address">
              <el-icon><Location /></el-icon>
              <span>收货地址</span>
            </el-menu-item>
          </el-menu>
        </div>
        
        <!-- 主内容区域 -->
        <div class="main-content">
          <router-view v-if="userInfo.id" />
          <div v-else class="loading-placeholder">
            <el-skeleton :rows="10" animated />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  User, 
  Promotion, 
  List, 
  Star, 
  ChatDotRound, 
  Location,
  Edit
} from '@element-plus/icons-vue'

const route = useRoute()

// 用户信息
const userInfo = ref({
  id: '',
  username: '',
  nickname: '',
  email: '',
  phone: '',
  avatar: '',
  level: '',
  points: 0,
  gender: '',
  birthday: '',
  address: ''
})

// 未读消息数量
const unreadCount = ref(3)

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

/**
 * 获取用户信息
 * @example
 * fetchUserInfo()
 */
const fetchUserInfo = () => {
  // 模拟API调用获取用户信息
  setTimeout(() => {
    userInfo.value = {
      id: '1001',
      username: 'user123',
      nickname: '宠物爱好者',
      email: 'user@example.com',
      phone: '13800138000',
      avatar: 'https://picsum.photos/100/100?random=1',
      level: 'LV3 资深会员',
      points: 1250,
      gender: '男',
      birthday: '1990-01-01',
      address: '北京市朝阳区'
    }
  }, 1000)
}

/**
 * 处理头像上传成功
 * @param res 上传结果
 * @example
 * handleAvatarSuccess({ data: { url: 'https://example.com/avatar.jpg' }})
 */
const handleAvatarSuccess = (res: any) => {
  if (res.code === 200) {
    userInfo.value.avatar = res.data.url
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error(res.message || '头像上传失败')
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style lang="scss" scoped>
.user-center {
  background-color: #f5f5f5;
  padding: 20px 0;
  min-height: calc(100vh - 70px - 230px); // 减去头部和底部的高度
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.user-center-content {
  display: flex;
  gap: 20px;
}

.sidebar {
  width: 260px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  
  .user-info {
    padding: 30px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
    
    .avatar {
      width: 100px;
      height: 100px;
      margin: 0 auto 15px;
      position: relative;
      
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .avatar-uploader {
        position: absolute;
        right: 0;
        bottom: 0;
        
        .edit-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background-color: #7e57c2;
          color: #fff;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.3s;
          
          &:hover {
            background-color: #6a4caf;
          }
        }
      }
    }
    
    .username {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 8px;
      color: #333;
    }
    
    .user-level {
      .el-tag {
        background-color: #7e57c2;
        border-color: #7e57c2;
      }
    }
  }
  
  .sidebar-menu {
    border-right: none;
    
    .el-menu-item {
      height: 50px;
      line-height: 50px;
      
      &.is-active {
        background-color: #f0e6ff;
        color: #7e57c2;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
          background-color: #7e57c2;
        }
      }
      
      &:hover {
        background-color: #f9f5ff;
      }
      
      .el-icon {
        margin-right: 10px;
      }
    }
  }
}

.main-content {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  min-height: 500px;
  
  .loading-placeholder {
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .user-center-content {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
}
</style> 