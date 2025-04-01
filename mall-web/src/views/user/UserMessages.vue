<template>
  <div class="user-messages">
    <div class="section-header">
      <h2>我的消息</h2>
      <div class="header-actions">
        <el-button type="primary" plain size="small" @click="markAllAsRead">
          全部已读
        </el-button>
        <el-button type="danger" plain size="small" @click="clearMessages">
          清空消息
        </el-button>
      </div>
    </div>
    
    <div class="message-tabs">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="全部消息" name="all">
          <message-list 
            :messages="filteredMessages" 
            :loading="loading"
            @read="markAsRead"
            @delete="deleteMessage"
          />
        </el-tab-pane>
        <el-tab-pane label="系统通知" name="system">
          <message-list 
            :messages="filteredMessages" 
            :loading="loading"
            @read="markAsRead"
            @delete="deleteMessage"
          />
        </el-tab-pane>
        <el-tab-pane label="订单消息" name="order">
          <message-list 
            :messages="filteredMessages" 
            :loading="loading"
            @read="markAsRead"
            @delete="deleteMessage"
          />
        </el-tab-pane>
        <el-tab-pane label="活动消息" name="promotion">
          <message-list 
            :messages="filteredMessages" 
            :loading="loading"
            @read="markAsRead"
            @delete="deleteMessage"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import MessageList from './components/MessageList.vue';

// 状态变量
const loading = ref(true);
const messages = ref<any[]>([]);
const activeTab = ref('all');

/**
 * 根据当前选中标签过滤消息
 */
const filteredMessages = computed(() => {
  if (activeTab.value === 'all') {
    return messages.value;
  }
  return messages.value.filter(item => item.type === activeTab.value);
});

/**
 * 获取消息列表
 * @example
 * fetchMessages()
 */
const fetchMessages = async () => {
  loading.value = true;
  try {
    // 这里应该是API调用，暂时使用模拟数据
    setTimeout(() => {
      messages.value = [
        {
          id: 1,
          title: '系统升级通知',
          content: '尊敬的用户，系统将于2023年12月25日凌晨2点-4点进行升级维护，期间可能无法正常访问，请谅解。',
          type: 'system',
          isRead: false,
          createTime: '2023-12-20 10:30:00'
        },
        {
          id: 2,
          title: '订单已发货',
          content: '您的订单 #1001234 已发货，物流单号：SF1234567890，请留意查收。',
          type: 'order',
          isRead: true,
          createTime: '2023-12-18 15:45:00'
        },
        {
          id: 3,
          title: '元旦促销活动',
          content: '元旦大促销，全场商品8折起，更有多重优惠券可叠加使用，快来抢购吧！',
          type: 'promotion',
          isRead: false,
          createTime: '2023-12-15 09:00:00'
        },
        {
          id: 4,
          title: '账号安全提醒',
          content: '系统检测到您的账号近期在陌生设备登录，如非本人操作，请及时修改密码。',
          type: 'system',
          isRead: false,
          createTime: '2023-12-10 22:15:00'
        },
        {
          id: 5,
          title: '订单待评价',
          content: '您的订单 #1001230 已签收，期待您的评价反馈，评价还可获得额外积分奖励哦！',
          type: 'order',
          isRead: false,
          createTime: '2023-12-08 18:30:00'
        }
      ];
      loading.value = false;
    }, 1000);
  } catch (error) {
    console.error('获取消息列表失败:', error);
    ElMessage.error('获取消息列表失败');
    loading.value = false;
  }
};

/**
 * 切换标签
 * @example
 * handleTabClick()
 */
const handleTabClick = () => {
  // 可以在这里处理标签切换逻辑，如果需要重新加载数据
  console.log('当前标签:', activeTab.value);
};

/**
 * 标记消息为已读
 * @param id 消息ID
 * @example
 * markAsRead(1)
 */
const markAsRead = (id: number) => {
  const index = messages.value.findIndex(item => item.id === id);
  if (index !== -1) {
    messages.value[index].isRead = true;
  }
};

/**
 * 标记全部消息为已读
 * @example
 * markAllAsRead()
 */
const markAllAsRead = () => {
  ElMessageBox.confirm('确定要将全部消息标记为已读吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    // 这里应该是API调用，暂时使用本地数据处理
    messages.value.forEach(item => {
      item.isRead = true;
    });
    ElMessage.success('已将全部消息标记为已读');
  }).catch(() => {
    // 用户取消操作
  });
};

/**
 * 删除消息
 * @param id 消息ID
 * @example
 * deleteMessage(1)
 */
const deleteMessage = (id: number) => {
  const index = messages.value.findIndex(item => item.id === id);
  if (index !== -1) {
    messages.value.splice(index, 1);
    ElMessage.success('删除消息成功');
  }
};

/**
 * 清空消息
 * @example
 * clearMessages()
 */
const clearMessages = () => {
  ElMessageBox.confirm('确定要清空所有消息吗？此操作不可恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该是API调用，暂时使用本地数据处理
    messages.value = [];
    ElMessage.success('已清空所有消息');
  }).catch(() => {
    // 用户取消操作
  });
};

// 组件挂载时获取消息列表
onMounted(() => {
  fetchMessages();
});
</script>

<style lang="scss" scoped>
.user-messages {
  padding: 20px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
    }
    
    .header-actions {
      display: flex;
      gap: 10px;
    }
  }
  
  .message-tabs {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    
    :deep(.el-tabs__header) {
      margin-bottom: 20px;
    }
  }
}
</style> 