import request from '@/utils/request'

// 获取商品分类
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

// 品牌列表
export const brandOptions = [
  { value: 1, label: '皇家' },
  { value: 2, label: '福来恩' },
  { value: 3, label: '小佩' },
  { value: 4, label: '冠能' },
  { value: 5, label: '伯纳天纯' },
  { value: 6, label: '麦富迪' }
]

// 获取商品列表
export function getProductList(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params
  })
}

// 更新商品状态
export function updatePublishStatus(id, params) {
  return request({
    url: `/product/update/publishStatus/${id}`,
    method: 'post',
    params
  })
}

// 删除商品
export function deleteProduct(id) {
  return request({
    url: `/product/delete/${id}`,
    method: 'post'
  })
}

// 创建商品
export function createProduct(data) {
  return request({
    url: '/product/create',
    method: 'post',
    data
  })
}

// 更新商品
export function updateProduct(id, data) {
  return request({
    url: `/product/update/${id}`,
    method: 'post',
    data
  })
}

// 获取商品详情
export function getProductDetail(id) {
  return request({
    url: `/product/${id}`,
    method: 'get'
  })
} 