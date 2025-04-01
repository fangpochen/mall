<template>
  <div class="user-favorites">
    <div class="section-header">
      <h2>我的收藏</h2>
      <div class="filter-actions">
        <el-select v-model="sortType" placeholder="排序方式" size="small">
          <el-option label="最近收藏" value="recent" />
          <el-option label="价格从高到低" value="price-desc" />
          <el-option label="价格从低到高" value="price-asc" />
        </el-select>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="3" animated />
    </div>

    <div v-else-if="favoriteList.length === 0" class="empty-favorites">
      <el-empty description="暂无收藏商品" :image-size="120">
        <template #default>
          <el-button type="primary" @click="goToProducts">去选购商品</el-button>
        </template>
      </el-empty>
    </div>

    <div v-else class="favorite-grid">
      <div v-for="item in favoriteList" :key="item.id" class="favorite-item">
        <div class="favorite-item-inner">
          <div class="favorite-actions">
            <el-button 
              circle 
              size="small" 
              class="favorite-action-btn"
              @click="removeFavorite(item.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <div class="product-image" @click="goToProductDetail(item.productId)">
            <img :src="item.productPic || 'https://picsum.photos/200/200?random=' + item.id" :alt="item.productName" />
          </div>
          <div class="product-info">
            <div class="product-name" @click="goToProductDetail(item.productId)">{{ item.productName }}</div>
            <div class="product-price">¥{{ item.productPrice.toFixed(2) }}</div>
            <div class="product-actions">
              <el-button type="primary" size="small" @click="addToCart(item)">加入购物车</el-button>
              <el-button size="small" @click="removeFavorite(item.id)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-container">
      <el-pagination
        v-if="total > 0"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[12, 24, 36, 48]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { getFavoriteList, deleteFavorite } from '@/api/user';
import { addToCart } from '@/api/cart';

const router = useRouter();

// 状态变量
const loading = ref(true);
const favoriteList = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(0);
const sortType = ref('recent');

/**
 * 获取收藏列表
 * @example
 * fetchFavorites()
 */
const fetchFavorites = async () => {
  loading.value = true;
  try {
    const res = await getFavoriteList({
      pageNum: currentPage.value,
      pageSize: pageSize.value
    });
    favoriteList.value = res.data.list;
    total.value = res.data.total;
  } catch (error) {
    console.error('获取收藏列表失败:', error);
    ElMessage.error('获取收藏列表失败');
  } finally {
    loading.value = false;
  }
};

/**
 * 将商品添加到购物车
 * @param item 收藏的商品
 * @example
 * addToCart({productId: 1, productName: '测试商品'})
 */
const addToCart = async (item: any) => {
  try {
    await addToCart({
      productId: item.productId,
      quantity: 1
    });
    ElMessage.success('已添加到购物车');
  } catch (error) {
    console.error('添加到购物车失败:', error);
    ElMessage.error('添加到购物车失败');
  }
};

/**
 * 移除收藏
 * @param id 收藏ID
 * @example
 * removeFavorite(1)
 */
const removeFavorite = (id: number) => {
  ElMessageBox.confirm('确定要移除这个收藏吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteFavorite({ids: [id]});
      ElMessage.success('已从收藏中移除');
      fetchFavorites();
    } catch (error) {
      console.error('移除收藏失败:', error);
      ElMessage.error('移除收藏失败');
    }
  }).catch(() => {
    // 用户取消操作
  });
};

/**
 * 跳转到商品详情页
 * @param productId 商品ID
 * @example
 * goToProductDetail(1)
 */
const goToProductDetail = (productId: number) => {
  router.push(`/product/${productId}`);
};

/**
 * 跳转到商品列表页
 * @example
 * goToProducts()
 */
const goToProducts = () => {
  router.push('/products');
};

/**
 * 处理分页大小变化
 * @param size 页面大小
 * @example
 * handleSizeChange(20)
 */
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  fetchFavorites();
};

/**
 * 处理页码变化
 * @param page 页码
 * @example
 * handleCurrentChange(2)
 */
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  fetchFavorites();
};

// 监听排序方式变化
watch(sortType, () => {
  fetchFavorites();
});

// 组件挂载时获取收藏列表
onMounted(() => {
  fetchFavorites();
});
</script>

<style lang="scss" scoped>
.user-favorites {
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
    
    .filter-actions {
      display: flex;
      gap: 10px;
    }
  }
  
  .loading-container {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .empty-favorites {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .favorite-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    
    .favorite-item {
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s, box-shadow 0.3s;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
      
      .favorite-item-inner {
        position: relative;
        
        .favorite-actions {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 2;
          
          .favorite-action-btn {
            background-color: rgba(255, 255, 255, 0.8);
            border: none;
            color: #f56c6c;
            
            &:hover {
              background-color: rgba(255, 255, 255, 1);
            }
          }
        }
        
        .product-image {
          height: 220px;
          overflow: hidden;
          cursor: pointer;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s;
            
            &:hover {
              transform: scale(1.05);
            }
          }
        }
        
        .product-info {
          padding: 15px;
          
          .product-name {
            font-size: 14px;
            margin-bottom: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            height: 42px;
            line-height: 1.5;
            cursor: pointer;
            
            &:hover {
              color: #7e57c2;
            }
          }
          
          .product-price {
            color: #f56c6c;
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 12px;
          }
          
          .product-actions {
            display: flex;
            gap: 8px;
          }
        }
      }
    }
  }
  
  .pagination-container {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
}
</style> 