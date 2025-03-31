/**
 * API接口类型定义
 */

// 通用响应格式
export interface CommonResult<T> {
  code: number;
  message: string;
  data: T;
}

// 轮播广告
export interface HomeAdvertise {
  id: number;
  name: string;
  type: number;
  pic: string;
  startTime: string;
  endTime: string;
  status: number;
  clickCount: number;
  orderCount: number;
  url: string;
  note: string;
  sort: number;
}

// 品牌
export interface Brand {
  id: number;
  name: string;
  firstLetter: string;
  sort: number;
  factoryStatus: number;
  showStatus: number;
  productCount: number;
  productCommentCount: number;
  logo: string;
  bigPic: string;
  brandStory: string;
}

// 秒杀活动
export interface FlashPromotion {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: number;
  createTime: string;
}

// 商品
export interface Product {
  id: number;
  brandId: number;
  productCategoryId: number;
  feightTemplateId: number;
  productAttributeCategoryId: number;
  name: string;
  pic: string;
  productSn: string;
  deleteStatus: number;
  publishStatus: number;
  newStatus: number;
  recommandStatus: number;
  verifyStatus: number;
  sort: number;
  sale: number;
  price: number;
  promotionPrice: number;
  giftGrowth: number;
  giftPoint: number;
  usePointLimit: number;
  subTitle: string;
  description: string;
  originalPrice: number;
  stock: number;
  lowStock: number;
  unit: string;
  weight: number;
  previewStatus: number;
  serviceIds: string;
  keywords: string;
  note: string;
  albumPics: string;
  detailTitle: string;
  detailDesc: string;
  detailHtml: string;
  detailMobileHtml: string;
  promotionStartTime: string;
  promotionEndTime: string;
  promotionPerLimit: number;
  promotionType: number;
  brandName: string;
  productCategoryName: string;
}

// 专题
export interface Subject {
  id: number;
  categoryId: number;
  title: string;
  pic: string;
  productCount: number;
  recommendStatus: number;
  createTime: string;
  collectCount: number;
  readCount: number;
  commentCount: number;
  albumPics: string;
  description: string;
  showStatus: number;
  content: string;
  forwardCount: number;
  categoryName: string;
}

// 首页内容
export interface HomeContentResult {
  advertiseList: HomeAdvertise[];
  brandList: Brand[];
  homeFlashPromotion: {
    startTime: string;
    endTime: string;
    nextStartTime: string;
    nextEndTime: string;
    flashPromotionId: number;
    flashPromotionSessionId: number;
    flashPromotionProduct: any[];
  };
  newProductList: Product[];
  hotProductList: Product[];
  subjectList: Subject[];
}

// 商品分类
export interface ProductCategory {
  id: number;
  parentId: number;
  name: string;
  level: number;
  productCount: number;
  productUnit: string;
  navStatus: number;
  showStatus: number;
  sort: number;
  icon: string;
  keywords: string;
  description: string;
  children: ProductCategory[];
} 