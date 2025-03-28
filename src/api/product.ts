import request from '@/utils/request'

// 定义接口类型
export interface ProductQuery {
  keyword?: string
  pageNum?: number
  pageSize?: number
  publishStatus?: number
  brandId?: number
  categoryId?: number
  productSn?: string
}

export interface ProductInfo {
  id: number
  name: string
  pic: string
  price: number
  productSn: string
  stock: number
  brand: string
  description: string
  isNew: boolean
  isHot: boolean
  publishStatus: number
  categoryId: number
  brandId: number
  createTime: string
  updateTime: string
}

// 商品分类选项
export const categoryOptions = [
  {
    value: 1,
    label: '猫咪用品',
    children: [
      { value: 101, label: '猫粮' },
      { value: 102, label: '猫砂' },
      { value: 103, label: '猫玩具' },
      { value: 104, label: '猫咪日用' }
    ]
  },
  {
    value: 2,
    label: '狗狗用品',
    children: [
      { value: 201, label: '狗粮' },
      { value: 202, label: '狗玩具' },
      { value: 203, label: '狗狗清洁' },
      { value: 204, label: '狗狗日用' }
    ]
  },
  {
    value: 3,
    label: '宠物医疗',
    children: [
      { value: 301, label: '营养保健' },
      { value: 302, label: '医疗用品' },
      { value: 303, label: '驱虫药' }
    ]
  }
]

// 品牌选项
export const brandOptions = [
  { value: 1, label: '皇家' },
  { value: 2, label: '福来恩' },
  { value: 3, label: '小佩' },
  { value: 4, label: '冠能' },
  { value: 5, label: '伯纳天纯' },
  { value: 6, label: '麦富迪' }
]

/**
 * 获取商品列表
 * @param params 查询参数
 * @returns Promise
 */
export function getProductList(params: ProductQuery) {
  return request({
    url: '/product/list',
    method: 'get',
    params
  })
}

/**
 * 更新商品上架状态
 * @param id 商品ID
 * @param params 状态参数
 * @returns Promise
 */
export function updatePublishStatus(id: number, params: { publishStatus: number }) {
  return request({
    url: `/product/update/publishStatus/${id}`,
    method: 'post',
    params
  })
}

/**
 * 删除商品
 * @param id 商品ID
 * @returns Promise
 */
export function deleteProduct(id: number) {
  return request({
    url: `/product/delete/${id}`,
    method: 'post'
  })
}

/**
 * 创建商品
 * @param data 商品信息
 * @returns Promise
 */
export function createProduct(data: ProductInfo) {
  return request({
    url: '/product/create',
    method: 'post',
    data
  })
}

/**
 * 更新商品
 * @param id 商品ID
 * @param data 商品信息
 * @returns Promise
 */
export function updateProduct(id: number, data: ProductInfo) {
  return request({
    url: `/product/update/${id}`,
    method: 'post',
    data
  })
}

/**
 * 获取商品详情
 * @param id 商品ID
 * @returns Promise
 */
export function getProductDetail(id: number) {
  return request({
    url: `/product/${id}`,
    method: 'get'
  })
}

/**
 * 批量删除商品
 * @param ids 商品ID数组
 * @returns Promise
 */
export function batchDeleteProduct(ids: number[]) {
  return request({
    url: '/product/batchDelete',
    method: 'post',
    data: { ids }
  })
}

/**
 * 批量更新商品状态
 * @param ids 商品ID数组
 * @param publishStatus 上架状态
 * @returns Promise
 */
export function batchUpdatePublishStatus(ids: number[], publishStatus: number) {
  return request({
    url: '/product/batchUpdate/publishStatus',
    method: 'post',
    data: { ids, publishStatus }
  })
}

/**
 * 更新商品新品状态
 * @param id 商品ID
 * @param isNew 是否新品
 * @returns Promise
 */
export function updateNewStatus(id: number, isNew: boolean) {
  return request({
    url: `/product/update/newStatus/${id}`,
    method: 'post',
    params: { isNew }
  })
}

/**
 * 更新商品热卖状态
 * @param id 商品ID
 * @param isHot 是否热卖
 * @returns Promise
 */
export function updateHotStatus(id: number, isHot: boolean) {
  return request({
    url: `/product/update/hotStatus/${id}`,
    method: 'post',
    params: { isHot }
  })
} 