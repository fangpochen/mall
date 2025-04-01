<template>
  <div class="product-detail-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    
    <template v-else>
      <!-- 商品基础信息区域 -->
      <div class="product-info-section">
        <div class="product-gallery">
          <div class="main-image">
            <el-image 
              :src="currentImage" 
              fit="contain"
              :preview-src-list="product.images"
            />
          </div>
          <div class="thumbnail-list">
            <div 
              v-for="(image, index) in product.images" 
              :key="`img-${index}`"
              class="thumbnail-item"
              :class="{ active: currentImageIndex === index }"
              @click="setCurrentImage(index)"
            >
              <img :src="image" :alt="product.name" />
            </div>
          </div>
        </div>
        
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <div class="product-brief">{{ product.brief }}</div>
          
          <div class="product-meta">
            <div class="meta-item">
              <span class="label">商品评分</span>
              <div class="rating">
                <el-rate v-model="product.rating" disabled />
                <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
                <span class="comment-count">{{ product.commentCount }}条评价</span>
              </div>
            </div>
            <div class="meta-item">
              <span class="label">累计销量</span>
              <span class="value sales-count">{{ product.salesCount }}件</span>
            </div>
          </div>
          
          <div class="product-price-section">
            <div class="price-row">
              <span class="price-label">价格</span>
              <span class="price-value">
                <span class="currency">¥</span>
                <span class="amount">{{ selectedSku ? selectedSku.price.toFixed(2) : product.price.toFixed(2) }}</span>
              </span>
              <span v-if="(selectedSku && selectedSku.originalPrice) || (!selectedSku && product.originalPrice)" class="original-price">
                ¥{{ (selectedSku ? selectedSku.originalPrice : product.originalPrice).toFixed(2) }}
              </span>
            </div>
            
            <div class="promotion-tags">
              <el-tag v-if="product.isNew" type="success" effect="plain" size="small">新品</el-tag>
              <el-tag v-if="product.discount > 0" type="danger" effect="plain" size="small">{{ product.discount }}折</el-tag>
              <el-tag v-if="product.hasGift" type="warning" effect="plain" size="small">赠品</el-tag>
            </div>
          </div>
          
          <div class="product-specs">
            <div 
              v-for="(spec, specIndex) in product.specifications" 
              :key="`spec-${specIndex}`"
              class="spec-item"
            >
              <div class="spec-name">{{ spec.name }}</div>
              <div class="spec-values">
                <div 
                  v-for="(value, valueIndex) in spec.values" 
                  :key="`value-${valueIndex}`"
                  class="spec-value"
                  :class="{ active: isSpecSelected(spec.name, value.id) }"
                  @click="selectSpec(spec.name, value.id)"
                >
                  <img v-if="value.image" :src="value.image" :alt="value.name" class="spec-image" />
                  <span>{{ value.name }}</span>
                </div>
              </div>
            </div>
            
            <div class="quantity-section">
              <span class="quantity-label">数量</span>
              <el-input-number 
                v-model="quantity" 
                :min="1" 
                :max="selectedSku ? selectedSku.stock : product.stock"
                size="small"
              />
              <span class="stock-info">库存 {{ selectedSku ? selectedSku.stock : product.stock }} 件</span>
            </div>
          </div>
          
          <div class="product-actions">
            <el-button type="primary" size="large" @click="buyNow">立即购买</el-button>
            <el-button type="danger" size="large" @click="addToCart">加入购物车</el-button>
            <product-favorite-button
              :product-id="Number(productId)"
              :product-name="product.name"
              :product-pic="product.images && product.images.length > 0 ? product.images[0] : ''"
              :product-price="product.price"
              @favorite-change="onFavoriteChange"
            />
            <el-button plain size="large" @click="shareProduct">
              <el-icon><Share /></el-icon>
              分享
            </el-button>
          </div>
          
          <div class="service-promises">
            <div v-for="(promise, index) in servicePromises" :key="`promise-${index}`" class="promise-item">
              <el-icon><Check /></el-icon>
              <span>{{ promise }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 商品详情选项卡 -->
      <div class="product-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="商品详情" name="detail">
            <div class="product-detail-content" v-html="product.detail"></div>
          </el-tab-pane>
          
          <el-tab-pane label="规格参数" name="specs">
            <product-specifications :product-id="productId" />
          </el-tab-pane>
          
          <el-tab-pane label="用户评价" name="reviews">
            <product-reviews :product-id="productId" />
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <!-- 相似商品推荐 -->
      <product-recommendations 
        :current-product-id="productId"
        type="similar"
        :category-id="product.categoryId"
        :pet-type-id="product.petTypeId"
      />
      
      <!-- 套装推荐 -->
      <product-recommendations 
        :current-product-id="productId"
        type="combo"
        custom-title="搭配购买"
        :limit="4"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, Share, Check } from '@element-plus/icons-vue'
import ProductReviews from './components/ProductReviews.vue'
import ProductSpecifications from './components/ProductSpecifications.vue'
import ProductRecommendations from './components/ProductRecommendations.vue'
import ProductFavoriteButton from './components/ProductFavoriteButton.vue'

const route = useRoute()
const router = useRouter()

// 商品ID
const productId = computed(() => route.params.id as string)

// 加载状态
const loading = ref(true)

// 商品数据
const product = ref<any>({})

// 选中的规格
const selectedSpecs = ref<Record<string, string>>({})

// 选中的SKU
const selectedSku = computed(() => {
  if (!product.value || !product.value.skus || product.value.skus.length === 0) {
    return null
  }
  
  // 检查是否所有规格都已选择
  const specs = product.value.specifications || []
  for (const spec of specs) {
    if (!selectedSpecs.value[spec.name]) {
      return null
    }
  }
  
  // 找到匹配所有已选规格的SKU
  return product.value.skus.find((sku: any) => {
    for (const spec of specs) {
      const selectedValueId = selectedSpecs.value[spec.name]
      if (!sku.specs[spec.name] || sku.specs[spec.name] !== selectedValueId) {
        return false
      }
    }
    return true
  })
})

// 购买数量
const quantity = ref(1)

// 当前显示的图片
const currentImageIndex = ref(0)
const currentImage = computed(() => {
  if (!product.value || !product.value.images || product.value.images.length === 0) {
    return ''
  }
  return product.value.images[currentImageIndex.value]
})

// 服务承诺
const servicePromises = ref([
  '正品保证',
  '急速发货',
  '7天无理由退换',
  '售后无忧'
])

// 当前激活的选项卡
const activeTab = ref('detail')

/**
 * 设置当前显示的图片
 * @param index 图片索引
 * @example
 * setCurrentImage(2)
 */
const setCurrentImage = (index: number) => {
  currentImageIndex.value = index
}

/**
 * 检查规格是否被选中
 * @param specName 规格名称
 * @param valueId 规格值ID
 * @returns 是否被选中
 * @example
 * isSpecSelected('颜色', '1')
 */
const isSpecSelected = (specName: string, valueId: string) => {
  return selectedSpecs.value[specName] === valueId
}

/**
 * 选择规格
 * @param specName 规格名称
 * @param valueId 规格值ID
 * @example
 * selectSpec('颜色', '1')
 */
const selectSpec = (specName: string, valueId: string) => {
  // 如果已选中则取消选择
  if (selectedSpecs.value[specName] === valueId) {
    delete selectedSpecs.value[specName]
  } else {
    selectedSpecs.value[specName] = valueId
  }
}

/**
 * 立即购买
 * @example
 * buyNow()
 */
const buyNow = () => {
  if (!validateSelection()) {
    return
  }
  
  // 构建订单项
  const orderItem = {
    productId: productId.value,
    skuId: selectedSku.value ? selectedSku.value.id : null,
    quantity: quantity.value,
    specs: { ...selectedSpecs.value }
  }
  
  // 存储到本地存储，用于结算页面获取
  localStorage.setItem('quickBuyItem', JSON.stringify(orderItem))
  
  // 跳转到结算页面
  router.push('/checkout?type=quick')
}

/**
 * 加入购物车
 * @example
 * addToCart()
 */
const addToCart = () => {
  if (!validateSelection()) {
    return
  }
  
  // 构建购物车项
  const cartItem = {
    id: Date.now().toString(),
    productId: productId.value,
    name: product.value.name,
    image: product.value.images[0],
    price: selectedSku.value ? selectedSku.value.price : product.value.price,
    skuId: selectedSku.value ? selectedSku.value.id : null,
    quantity: quantity.value,
    specs: { ...selectedSpecs.value },
    specText: getSpecText(),
    stock: selectedSku.value ? selectedSku.value.stock : product.value.stock,
    checked: true
  }
  
  // 从本地存储获取购物车
  let cart = JSON.parse(localStorage.getItem('cart') || '[]')
  
  // 检查是否已存在相同商品
  const existingIndex = cart.findIndex((item: any) => {
    return item.productId === cartItem.productId && 
           item.skuId === cartItem.skuId
  })
  
  if (existingIndex >= 0) {
    // 已存在则增加数量
    cart[existingIndex].quantity += cartItem.quantity
  } else {
    // 不存在则添加
    cart.push(cartItem)
  }
  
  // 保存到本地存储
  localStorage.setItem('cart', JSON.stringify(cart))
  
  ElMessage.success('成功加入购物车')
}

/**
 * 切换收藏状态
 * @deprecated 使用ProductFavoriteButton组件替代
 * @example
 * toggleFavorite()
 */
const toggleFavorite = () => {
  // 已被替换为组件，此方法保留以兼容现有代码
  console.warn('toggleFavorite方法已被废弃，请使用ProductFavoriteButton组件');
}

/**
 * 处理收藏状态变化
 * @param isFavorite 是否已收藏
 * @example
 * onFavoriteChange(true)
 */
const onFavoriteChange = (isFavorite: boolean) => {
  product.value.isFavorite = isFavorite;
}

/**
 * 分享商品
 * @example
 * shareProduct()
 */
const shareProduct = () => {
  ElMessage.info('分享功能开发中...')
}

/**
 * 验证是否已选择所有规格
 * @returns 是否验证通过
 * @example
 * validateSelection()
 */
const validateSelection = () => {
  // 检查是否需要选择规格
  if (product.value.specifications && product.value.specifications.length > 0) {
    for (const spec of product.value.specifications) {
      if (!selectedSpecs.value[spec.name]) {
        ElMessage.warning(`请选择${spec.name}`)
        return false
      }
    }
  }
  
  // 检查库存
  const stock = selectedSku.value ? selectedSku.value.stock : product.value.stock
  if (stock < quantity.value) {
    ElMessage.warning('库存不足')
    return false
  }
  
  return true
}

/**
 * 获取已选规格文本
 * @returns 规格文本
 * @example
 * getSpecText()
 */
const getSpecText = () => {
  if (!product.value.specifications || product.value.specifications.length === 0) {
    return ''
  }
  
  const texts = []
  for (const spec of product.value.specifications) {
    const valueId = selectedSpecs.value[spec.name]
    if (valueId) {
      const value = spec.values.find((v: any) => v.id === valueId)
      if (value) {
        texts.push(`${spec.name}: ${value.name}`)
      }
    }
  }
  
  return texts.join(', ')
}

/**
 * 获取商品详情
 * @example
 * fetchProductDetail()
 */
const fetchProductDetail = () => {
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    // 模拟商品数据
    product.value = {
      id: productId.value,
      name: '宠物智能自动喂食器',
      brief: '智能定时，远程控制，4L大容量，多种喂食模式，适合猫咪和小型犬',
      price: 299,
      originalPrice: 399,
      discount: 7.5,
      stock: 100,
      salesCount: 2568,
      commentCount: 245,
      rating: 4.8,
      images: [
        'https://picsum.photos/600/600?random=1',
        'https://picsum.photos/600/600?random=2',
        'https://picsum.photos/600/600?random=3',
        'https://picsum.photos/600/600?random=4',
        'https://picsum.photos/600/600?random=5'
      ],
      isNew: true,
      hasGift: true,
      isFavorite: false,
      categoryId: 'cat123',
      petTypeId: 'pet456',
      specifications: [
        {
          name: '颜色',
          values: [
            { id: 'color1', name: '白色', image: 'https://picsum.photos/40/40?random=white' },
            { id: 'color2', name: '蓝色', image: 'https://picsum.photos/40/40?random=blue' },
            { id: 'color3', name: '粉色', image: 'https://picsum.photos/40/40?random=pink' }
          ]
        },
        {
          name: '容量',
          values: [
            { id: 'size1', name: '2.4L' },
            { id: 'size2', name: '3.8L' },
            { id: 'size3', name: '5.0L' }
          ]
        },
        {
          name: '版本',
          values: [
            { id: 'ver1', name: '标准版' },
            { id: 'ver2', name: '豪华版' },
            { id: 'ver3', name: '尊享版' }
          ]
        }
      ],
      skus: [
        { 
          id: 'sku1', 
          specs: { '颜色': 'color1', '容量': 'size1', '版本': 'ver1' }, 
          price: 299, 
          originalPrice: 399,
          stock: 100 
        },
        { 
          id: 'sku2', 
          specs: { '颜色': 'color1', '容量': 'size2', '版本': 'ver1' }, 
          price: 329, 
          originalPrice: 429,
          stock: 50 
        },
        { 
          id: 'sku3', 
          specs: { '颜色': 'color1', '容量': 'size3', '版本': 'ver1' }, 
          price: 359, 
          originalPrice: 459,
          stock: 30 
        },
        { 
          id: 'sku4', 
          specs: { '颜色': 'color2', '容量': 'size1', '版本': 'ver1' }, 
          price: 299, 
          originalPrice: 399,
          stock: 80 
        },
        { 
          id: 'sku5', 
          specs: { '颜色': 'color2', '容量': 'size2', '版本': 'ver1' }, 
          price: 329, 
          originalPrice: 429,
          stock: 40 
        },
        // 更多SKU组合...
      ],
      detail: `
        <div class="product-detail">
          <h2>产品介绍</h2>
          <p>智能宠物喂食器，满足您爱宠的日常需求。采用高质量食品级材料，安全无毒，让您的爱宠吃得健康。</p>
          
          <h3>产品特点</h3>
          <ul>
            <li>智能定时：可设置多达10组定时喂食计划</li>
            <li>远程控制：随时随地通过APP控制喂食</li>
            <li>大容量：5L容量，可存储约25天的干粮</li>
            <li>多种喂食模式：定时喂食、手动喂食、语音喂食</li>
            <li>摄像监控：实时查看宠物进食情况</li>
            <li>语音提醒：可录制语音，在喂食时播放</li>
            <li>粮食不足提醒：低于设定量时自动提醒</li>
            <li>断电保护：内置电池，断电后仍能正常喂食</li>
          </ul>
          
          <h3>适用范围</h3>
          <p>适合猫咪和小型犬，支持5-15mm直径的干粮。</p>
          
          <div class="detail-images">
            <img src="https://picsum.photos/800/600?random=d1" alt="产品展示图1">
            <img src="https://picsum.photos/800/600?random=d2" alt="产品展示图2">
            <img src="https://picsum.photos/800/600?random=d3" alt="产品展示图3">
          </div>
        </div>
      `
    }
    
    loading.value = false
  }, 1000)
}

// 监听商品ID变化
watch(() => productId.value, () => {
  // 重置数据
  selectedSpecs.value = {}
  quantity.value = 1
  currentImageIndex.value = 0
  activeTab.value = 'detail'
  
  // 获取新商品数据
  fetchProductDetail()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.product-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  .loading-container {
    min-height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .product-info-section {
    display: flex;
    gap: 40px;
    margin-bottom: 40px;
    
    .product-gallery {
      width: 450px;
      
      .main-image {
        height: 450px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 10px;
        
        :deep(.el-image) {
          width: 100%;
          height: 100%;
        }
      }
      
      .thumbnail-list {
        display: flex;
        gap: 10px;
        
        .thumbnail-item {
          width: 80px;
          height: 80px;
          border: 1px solid #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          
          &.active {
            border-color: #7e57c2;
          }
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
    
    .product-info {
      flex: 1;
      
      .product-name {
        font-size: 24px;
        color: #333;
        margin: 0 0 10px;
        line-height: 1.4;
      }
      
      .product-brief {
        font-size: 14px;
        color: #666;
        margin-bottom: 20px;
      }
      
      .product-meta {
        background-color: #f9f9f9;
        padding: 15px;
        border-radius: 4px;
        margin-bottom: 20px;
        
        .meta-item {
          display: flex;
          margin-bottom: 10px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .label {
            width: 80px;
            color: #999;
          }
          
          .rating {
            display: flex;
            align-items: center;
            
            .rating-value {
              margin: 0 5px;
              color: #ff9900;
              font-weight: 500;
            }
            
            .comment-count {
              color: #7e57c2;
              cursor: pointer;
              
              &:hover {
                text-decoration: underline;
              }
            }
          }
          
          .sales-count {
            color: #333;
          }
        }
      }
      
      .product-price-section {
        margin-bottom: 20px;
        
        .price-row {
          display: flex;
          align-items: baseline;
          margin-bottom: 10px;
          
          .price-label {
            width: 80px;
            font-size: 14px;
            color: #999;
          }
          
          .price-value {
            font-size: 28px;
            color: #ff6b6b;
            font-weight: 600;
            
            .currency {
              font-size: 16px;
              margin-right: 2px;
            }
          }
          
          .original-price {
            margin-left: 15px;
            font-size: 14px;
            color: #999;
            text-decoration: line-through;
          }
        }
        
        .promotion-tags {
          margin-left: 80px;
          
          .el-tag {
            margin-right: 10px;
          }
        }
      }
      
      .product-specs {
        margin-bottom: 30px;
        
        .spec-item {
          margin-bottom: 20px;
          
          .spec-name {
            margin-bottom: 10px;
            font-size: 14px;
            color: #333;
          }
          
          .spec-values {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            
            .spec-value {
              padding: 8px 12px;
              border: 1px solid #e0e0e0;
              border-radius: 4px;
              cursor: pointer;
              transition: all 0.3s;
              display: flex;
              align-items: center;
              
              &:hover {
                border-color: #7e57c2;
              }
              
              &.active {
                border-color: #7e57c2;
                background-color: #f6f0ff;
              }
              
              .spec-image {
                width: 20px;
                height: 20px;
                margin-right: 6px;
                border-radius: 2px;
              }
            }
          }
        }
        
        .quantity-section {
          display: flex;
          align-items: center;
          
          .quantity-label {
            margin-right: 10px;
            font-size: 14px;
            color: #333;
          }
          
          .stock-info {
            margin-left: 15px;
            color: #999;
            font-size: 12px;
          }
        }
      }
      
      .product-actions {
        display: flex;
        gap: 15px;
        margin-bottom: 30px;
        
        .el-button {
          min-width: 120px;
        }
      }
      
      .service-promises {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        
        .promise-item {
          display: flex;
          align-items: center;
          color: #666;
          font-size: 12px;
          
          .el-icon {
            color: #52c41a;
            margin-right: 5px;
          }
        }
      }
    }
  }
  
  .product-tabs {
    margin-bottom: 40px;
    
    :deep(.el-tabs__nav-wrap::after) {
      height: 1px;
    }
    
    :deep(.el-tabs__active-bar) {
      height: 3px;
    }
    
    :deep(.el-tabs__item) {
      font-size: 16px;
      padding: 0 25px;
    }
    
    .product-detail-content {
      padding: 20px 0;
      
      h2, h3 {
        margin: 20px 0 10px;
      }
      
      p {
        line-height: 1.8;
        margin-bottom: 15px;
      }
      
      ul {
        list-style: disc;
        padding-left: 20px;
        margin-bottom: 15px;
        
        li {
          line-height: 1.8;
          margin-bottom: 5px;
        }
      }
      
      .detail-images {
        margin: 30px 0;
        
        img {
          max-width: 100%;
          margin-bottom: 10px;
          border-radius: 4px;
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .product-info-section {
    flex-direction: column;
    
    .product-gallery {
      width: 100% !important;
      margin-bottom: 30px;
    }
  }
}

@media (max-width: 768px) {
  .product-detail-container {
    padding: 10px;
  }
  
  .thumbnail-list {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .product-actions {
    flex-wrap: wrap;
    
    .el-button {
      flex: 1;
      min-width: 40% !important;
    }
  }
}
</style>