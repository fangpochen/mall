import request from '@/utils/request'
import type { ProductInfo } from './product'

export interface BannerInfo {
  id: number
  imgUrl?: string  // 兼容前端字段
  pic?: string     // 兼容后端字段
  name?: string
  link?: string
  url?: string     // 兼容后端字段
  sort?: number
  type?: number
  startTime?: number
  endTime?: number
  status?: number
}

export interface CategoryInfo {
  id: number
  name: string
  iconClass?: string
  icon?: string
  sort?: number
  parentId?: number
  navStatus?: number
  showStatus?: number
}

export interface HomeFlashPromotion {
  startTime: string
  endTime: string
  id: number
  status: number
  title: string
  productList: ProductInfo[]
}

export interface HomeContentResult {
  advertiseList: BannerInfo[]
  brandList: any[]
  homeFlashPromotion: HomeFlashPromotion
  newProductList: ProductInfo[]
  hotProductList: ProductInfo[]
  subjectList: any[]
}

// Mock数据 - 轮播图
const mockBanners: BannerInfo[] = [
  {
    id: 1,
    imgUrl: '/images/banner/banner1.jpg',
    link: '/product/1',
    sort: 1
  },
  {
    id: 2,
    imgUrl: '/images/banner/banner2.jpg',
    link: '/product/2',
    sort: 2
  },
  {
    id: 3,
    imgUrl: '/images/banner/banner3.jpg',
    link: '/product/3',
    sort: 3
  }
]

// Mock数据 - 分类
const mockCategories: CategoryInfo[] = [
  { id: 1, name: '猫粮', iconClass: 'icon-cat-food', sort: 1 },
  { id: 2, name: '狗粮', iconClass: 'icon-dog-food', sort: 2 },
  { id: 3, name: '玩具', iconClass: 'icon-toy', sort: 3 },
  { id: 4, name: '护理', iconClass: 'icon-care', sort: 4 },
  { id: 5, name: '医疗', iconClass: 'icon-medical', sort: 5 },
  { id: 6, name: '清洁', iconClass: 'icon-clean', sort: 6 }
]

// Mock数据 - 推荐商品
const mockRecommendProducts: ProductInfo[] = [
  {
    id: 1,
    name: '进口猫粮10kg',
    pic: '/images/products/cat-food1.jpg',
    price: 199.00,
    productSn: 'PET001',
    stock: 100,
    brand: '皇家',
    description: '天然无谷物配方，适合所有年龄段猫咪',
    isNew: true,
    isHot: true,
    publishStatus: 1,
    categoryId: 101,
    brandId: 1,
    createTime: '2024-03-28',
    updateTime: '2024-03-28'
  },
  {
    id: 2,
    name: '狗狗洗澡露',
    pic: '/images/products/dog-shampoo.jpg',
    price: 58.00,
    productSn: 'PET002',
    stock: 200,
    brand: '福来恩',
    description: '温和配方，不刺激皮肤，香味持久',
    isNew: true,
    isHot: false,
    publishStatus: 1,
    categoryId: 203,
    brandId: 2,
    createTime: '2024-03-28',
    updateTime: '2024-03-28'
  },
  {
    id: 3,
    name: '猫咪爬架',
    pic: '/images/products/cat-tree.jpg',
    price: 299.00,
    productSn: 'PET003',
    stock: 50,
    brand: '小佩',
    description: '多层设计，稳固耐用，满足猫咪攀爬需求',
    isNew: false,
    isHot: true,
    publishStatus: 1,
    categoryId: 103,
    brandId: 3,
    createTime: '2024-03-28',
    updateTime: '2024-03-28'
  },
  {
    id: 4,
    name: '宠物智能喂食器',
    pic: '/images/products/pet-feeder.jpg',
    price: 399.00,
    productSn: 'PET004',
    stock: 30,
    brand: '小佩',
    description: '智能定时投食，远程手机控制',
    isNew: true,
    isHot: true,
    publishStatus: 1,
    categoryId: 104,
    brandId: 3,
    createTime: '2024-03-28',
    updateTime: '2024-03-28'
  }
]

// Mock数据 - 热卖商品
const mockHotProducts: ProductInfo[] = [
  {
    id: 5,
    name: '猫咪逗猫棒',
    pic: '/images/products/cat-toy.jpg',
    price: 15.90,
    productSn: 'PET005',
    stock: 300,
    brand: '小佩',
    description: '互动玩具，增进感情，锻炼猫咪敏捷度',
    isNew: false,
    isHot: true,
    publishStatus: 1,
    categoryId: 103,
    brandId: 3,
    createTime: '2024-03-28',
    updateTime: '2024-03-28'
  },
  {
    id: 6,
    name: '狗狗磨牙棒',
    pic: '/images/products/dog-bone.jpg',
    price: 29.90,
    productSn: 'PET006',
    stock: 200,
    brand: '福来恩',
    description: '耐咬耐磨，有效清洁牙齿，预防牙结石',
    isNew: false,
    isHot: true,
    publishStatus: 1,
    categoryId: 202,
    brandId: 2,
    createTime: '2024-03-28',
    updateTime: '2024-03-28'
  }
]

// 是否使用Mock数据
const useMockData = false;

/**
 * 获取首页全部内容
 * @returns Promise
 */
export function getHomeContent() {
  if (useMockData) {
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: {
        advertiseList: mockBanners,
        brandList: [],
        homeFlashPromotion: {},
        newProductList: mockRecommendProducts.filter(item => item.isNew),
        hotProductList: mockHotProducts,
        subjectList: []
      }
    });
  }
  
  return request.get('/home/content');
}

/**
 * 获取首页轮播图列表
 * @returns Promise
 */
export function getBannerList() {
  if (useMockData) {
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: mockBanners
    });
  }
  
  // 调用内容接口后提取轮播图数据
  return getHomeContent().then(res => {
    // 转换数据格式，将后端的pic字段映射到前端的imgUrl字段
    const banners = res.data?.advertiseList || [];
    return {
      code: 200,
      message: 'success',
      data: banners.map((item: any) => ({
        ...item,
        imgUrl: item.pic || '', // 将pic字段映射到imgUrl字段
        link: item.url || '/'    // 将url字段映射到link字段
      }))
    }
  }).catch(error => {
    console.error('获取轮播图失败:', error);
    return {
      code: 200,
      message: 'success',
      data: mockBanners // 出错时使用Mock数据
    };
  })
}

/**
 * 获取首页分类列表
 * @param parentId 父分类ID，0表示获取一级分类
 * @returns Promise
 */
export function getCategoryList(parentId = 0) {
  if (useMockData) {
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: mockCategories
    });
  }
  
  return request.get('/home/productCateList/' + parentId);
}

/**
 * 获取推荐商品列表
 * @param pageSize 每页数量
 * @param pageNum 页码
 * @returns Promise
 */
export function getRecommendProductList(pageSize: number = 4, pageNum: number = 1) {
  if (useMockData) {
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: mockRecommendProducts
    });
  }
  
  return request.get('/home/recommendProductList', { pageSize, pageNum });
}

/**
 * 获取新品推荐列表
 * @param pageSize 每页数量
 * @param pageNum 页码
 * @returns Promise
 */
export function getNewProductList(pageNum: number = 1, pageSize: number = 6) {
  if (useMockData) {
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: mockRecommendProducts.filter(item => item.isNew)
    });
  }
  
  return request.get('/home/newProductList', { pageNum, pageSize });
}

/**
 * 获取人气推荐列表
 * @param pageSize 每页数量
 * @param pageNum 页码
 * @returns Promise
 */
export function getHotProductList(pageNum: number = 1, pageSize: number = 6) {
  if (useMockData) {
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: mockHotProducts
    });
  }
  
  return request.get('/home/hotProductList', { pageNum, pageSize });
}

/**
 * 获取商品分类
 * @param parentId 父级ID
 * @returns Promise
 */
export function getProductCategories(parentId: number) {
  return request.get('/home/productCateList/' + parentId);
}

/**
 * 获取专题列表
 * @param cateId 分类ID
 * @param pageSize 每页数量
 * @param pageNum 页码
 * @returns Promise
 */
export function getSubjectList(cateId?: number, pageSize: number = 4, pageNum: number = 1) {
  return request.get('/home/subjectList', { cateId, pageSize, pageNum });
} 