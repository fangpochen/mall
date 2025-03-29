# 首页API接口文档

## 前后端接口匹配说明

本文档描述了前端API与后端接口的对应关系，帮助开发者理解如何正确调用接口。

### 接口对应表

| 前端API方法 | 后端API路径 | 后端Service方法 | 说明 |
|------------|------------|--------------|------|
| getHomeContent() | GET /home/content | HomeService.content() | 获取首页全部内容，包含轮播图、推荐商品等 |
| getBannerList() | - | - | 获取轮播图（内部调用getHomeContent提取数据） |
| getCategoryList(parentId) | GET /home/productCateList | HomeService.getProductCateList(parentId) | 获取商品分类列表 |
| getRecommendProducts(pageSize, pageNum) | GET /home/recommendProductList | HomeService.recommendProductList(pageSize, pageNum) | 获取推荐商品列表 |
| getNewProducts(pageSize, pageNum) | GET /home/newProductList | HomeService.newProductList(pageNum, pageSize) | 获取新品推荐列表 |
| getHotProducts(pageSize, pageNum) | GET /home/hotProductList | HomeService.hotProductList(pageNum, pageSize) | 获取人气推荐列表 |

### 接口参数说明

#### 1. 获取首页全部内容 (getHomeContent)
- 请求路径：GET /home/content
- 参数：无
- 返回数据：包含轮播图、品牌列表、推荐商品等内容

#### 2. 获取商品分类 (getCategoryList)
- 请求路径：GET /home/productCateList
- 参数：
  - parentId：父分类ID，0表示获取一级分类
- 返回数据：分类列表

#### 3. 获取推荐商品 (getRecommendProducts)
- 请求路径：GET /home/recommendProductList
- 参数：
  - pageSize：每页数量
  - pageNum：页码
- 返回数据：推荐商品列表

#### 4. 获取新品推荐 (getNewProducts)
- 请求路径：GET /home/newProductList
- 参数：
  - pageSize：每页数量
  - pageNum：页码
- 返回数据：新品商品列表

#### 5. 获取人气推荐 (getHotProducts)
- 请求路径：GET /home/hotProductList
- 参数：
  - pageSize：每页数量
  - pageNum：页码
- 返回数据：热门商品列表

## 数据模型

### 首页内容结果 (HomeContentResult)
```typescript
export interface HomeContentResult {
  advertiseList: BannerInfo[]       // 轮播图列表
  brandList: any[]                  // 品牌列表
  homeFlashPromotion: any           // 首页秒杀活动
  newProductList: ProductInfo[]     // 新品推荐
  hotProductList: ProductInfo[]     // 热卖商品
  recommendProductList: ProductInfo[] // 推荐商品
}
```

### 轮播图信息 (BannerInfo)
```typescript
export interface BannerInfo {
  id: number       // 轮播图ID
  imgUrl: string   // 图片URL
  link: string     // 跳转链接
  sort: number     // 排序
}
```

### 分类信息 (CategoryInfo)
```typescript
export interface CategoryInfo {
  id: number           // 分类ID
  name: string         // 分类名称
  iconClass: string    // 图标类名
  sort: number         // 排序
  parentId?: number    // 父分类ID
}
```

### 商品信息 (ProductInfo)
```typescript
export interface ProductInfo {
  id: number           // 商品ID
  name: string         // 商品名称
  pic: string          // 商品图片
  price: number        // 商品价格
  productSn: string    // 商品货号
  stock: number        // 库存
  brand: string        // 品牌
  description: string  // 描述
  isNew: boolean       // 是否新品
  isHot: boolean       // 是否热卖
  publishStatus: number // 上架状态：0->下架；1->上架
  categoryId: number   // 分类ID
  brandId: number      // 品牌ID
  createTime: string   // 创建时间
  updateTime: string   // 更新时间
}
``` 