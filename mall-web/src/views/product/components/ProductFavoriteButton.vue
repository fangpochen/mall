<template>
  <div class="product-favorite-button">
    <el-button
      :icon="isFavorite ? 'Star' : 'StarFilled'"
      :type="isFavorite ? 'primary' : 'default'"
      :class="{ 'is-favorite': isFavorite }"
      :loading="loading"
      @click="toggleFavorite"
    >
      {{ isFavorite ? '已收藏' : '收藏' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import { Star, StarFilled } from '@element-plus/icons-vue';
import { addFavorite, deleteFavorite, checkFavorite } from '@/api/user';

// 定义props
const props = defineProps({
  productId: {
    type: Number,
    required: true
  },
  productName: {
    type: String,
    default: ''
  },
  productPic: {
    type: String,
    default: ''
  },
  productPrice: {
    type: Number,
    default: 0
  }
});

// 定义事件
const emit = defineEmits(['favorite-change']);

// 状态变量
const loading = ref(false);
const isFavorite = ref(false);

/**
 * 切换收藏状态
 * @example
 * toggleFavorite()
 */
const toggleFavorite = async () => {
  if (loading.value) return;
  
  loading.value = true;
  try {
    if (isFavorite.value) {
      // 取消收藏
      await deleteFavorite({ ids: [props.productId] });
      isFavorite.value = false;
      ElMessage.success('已取消收藏');
    } else {
      // 添加收藏
      await addFavorite({
        productId: props.productId,
        productName: props.productName,
        productPic: props.productPic,
        productPrice: props.productPrice
      });
      isFavorite.value = true;
      ElMessage.success('收藏成功');
    }
    
    // 触发收藏状态变化事件
    emit('favorite-change', isFavorite.value);
  } catch (error) {
    console.error('操作收藏失败:', error);
    ElMessage.error('操作失败，请稍后再试');
  } finally {
    loading.value = false;
  }
};

/**
 * 检查商品是否已收藏
 * @example
 * checkIsFavorite()
 */
const checkIsFavorite = async () => {
  if (!props.productId) return;
  
  try {
    const res = await checkFavorite(props.productId);
    isFavorite.value = res.data;
  } catch (error) {
    console.error('检查收藏状态失败:', error);
  }
};

// 组件挂载时检查收藏状态
onMounted(() => {
  checkIsFavorite();
});
</script>

<style lang="scss" scoped>
.product-favorite-button {
  .el-button {
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s;
    
    &.is-favorite {
      background-color: #fff;
      color: #ff9800;
      border-color: #ff9800;
      
      &:hover {
        background-color: #fff0db;
      }
    }
  }
}
</style> 