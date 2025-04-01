<template>
  <div class="message-list">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>
    
    <div v-else-if="messages.length === 0" class="empty-message">
      <el-empty description="暂无消息" :image-size="100" />
    </div>
    
    <div v-else class="message-items">
      <div
        v-for="item in messages"
        :key="item.id"
        class="message-item"
        :class="{ 'is-read': item.isRead }"
      >
        <div class="message-item-inner" @click="handleMessageClick(item)">
          <div class="message-header">
            <div class="message-title">
              <el-badge v-if="!item.isRead" is-dot class="message-badge" />
              <span>{{ item.title }}</span>
            </div>
            <div class="message-time">{{ item.createTime }}</div>
          </div>
          <div class="message-content" v-html="formatContent(item.content)"></div>
          <div class="message-actions">
            <el-button 
              v-if="!item.isRead" 
              type="text" 
              size="small" 
              @click.stop="handleRead(item.id)"
            >
              标为已读
            </el-button>
            <el-button 
              type="text" 
              size="small" 
              @click.stop="handleDelete(item.id)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 消息详情对话框 -->
    <el-dialog
      v-model="messageDialogVisible"
      :title="currentMessage.title"
      width="500px"
    >
      <div class="message-detail">
        <div class="message-time">{{ currentMessage.createTime }}</div>
        <div class="message-content" v-html="formatContent(currentMessage.content)"></div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="messageDialogVisible = false">关闭</el-button>
          <el-button v-if="!isCurrentMessageRead" type="primary" @click="handleReadCurrent">
            标为已读
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';

// 定义props
const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits(['read', 'delete']);

// 状态变量
const messageDialogVisible = ref(false);
const currentMessage = ref<any>({});

// 计算当前消息是否已读
const isCurrentMessageRead = computed(() => {
  return currentMessage.value.isRead || false;
});

/**
 * 格式化消息内容
 * @param content 消息内容
 * @returns 格式化后的内容
 * @example
 * formatContent('这是一条\n消息')
 */
const formatContent = (content: string) => {
  if (!content) return '';
  // 将换行符转换为HTML换行标签
  return content.replace(/\n/g, '<br>');
};

/**
 * 处理消息点击
 * @param message 消息对象
 * @example
 * handleMessageClick({id: 1, title: '系统通知'})
 */
const handleMessageClick = (message: any) => {
  currentMessage.value = message;
  messageDialogVisible.value = true;
  
  // 如果消息未读，自动标记为已读
  if (!message.isRead) {
    handleRead(message.id);
  }
};

/**
 * 标记消息为已读
 * @param id 消息ID
 * @example
 * handleRead(1)
 */
const handleRead = (id: number) => {
  emit('read', id);
};

/**
 * 标记当前查看的消息为已读
 * @example
 * handleReadCurrent()
 */
const handleReadCurrent = () => {
  if (currentMessage.value && currentMessage.value.id) {
    handleRead(currentMessage.value.id);
    currentMessage.value.isRead = true;
    messageDialogVisible.value = false;
  }
};

/**
 * 删除消息
 * @param id 消息ID
 * @example
 * handleDelete(1)
 */
const handleDelete = (id: number) => {
  emit('delete', id);
};
</script>

<style lang="scss" scoped>
.message-list {
  .loading-container {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .empty-message {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .message-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
    
    .message-item {
      background-color: #f9f9f9;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s;
      border-left: 3px solid #7e57c2;
      
      &:hover {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }
      
      &.is-read {
        border-left-color: #dcdfe6;
        background-color: #fff;
        opacity: 0.8;
      }
      
      .message-item-inner {
        padding: 15px 20px;
        cursor: pointer;
        
        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          
          .message-title {
            font-size: 16px;
            font-weight: 500;
            color: #303133;
            display: flex;
            align-items: center;
            
            .message-badge {
              margin-right: 8px;
            }
          }
          
          .message-time {
            font-size: 12px;
            color: #909399;
          }
        }
        
        .message-content {
          font-size: 14px;
          color: #606266;
          line-height: 1.5;
          margin-bottom: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .message-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          
          .el-button {
            padding: 0;
            
            &:first-child {
              color: #7e57c2;
            }
            
            &:last-child {
              color: #f56c6c;
            }
          }
        }
      }
    }
  }
}

.message-detail {
  padding: 0 10px;
  
  .message-time {
    font-size: 12px;
    color: #909399;
    margin-bottom: 15px;
    text-align: right;
  }
  
  .message-content {
    font-size: 14px;
    color: #606266;
    line-height: 1.6;
    white-space: pre-line;
  }
}
</style> 