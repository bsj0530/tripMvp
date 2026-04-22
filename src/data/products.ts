import type { Product } from '../types'

export const mockProducts: Product[] = [
  {
    id: 'P001',
    shopId: 'S001',
    shopName: '영주한우빵집',
    name: '영주한우빵 (6개입)',
    price: 12000,
    description: '영주 한우를 넣어 만든 특제 빵. 당일 제조하여 신선한 상태로 픽업 가능합니다. 택배 불가 상품.',
    image: '🍞',
    rating: 4.8,
    isPickupOnly: true,
    category: '빵·디저트',
    categoryId: 'bread',
  },
  {
    id: 'P002',
    shopId: 'S004',
    shopName: '영주떡방앗간',
    name: '부석사 꿀떡세트',
    price: 15000,
    description: '부석사 인근에서 채취한 야생 꿀로 만든 전통 꿀떡. 찹쌀과 꿀의 조화가 일품입니다.',
    image: '🍡',
    rating: 4.6,
    isPickupOnly: true,
    category: '빵·디저트',
    categoryId: 'bread',
  },
  {
    id: 'P003',
    shopId: 'S005',
    shopName: '소백산빵집',
    name: '영주 쑥찰빵 (8개입)',
    price: 9000,
    description: '소백산 쑥을 넣어 만든 건강한 찰빵. 쫀득한 식감이 특징입니다.',
    image: '🥐',
    rating: 4.5,
    isPickupOnly: true,
    category: '빵·디저트',
    categoryId: 'bread',
  },
  {
    id: 'P004',
    shopId: 'S001',
    shopName: '영주한우빵집',
    name: '사과 파이 (4개입)',
    price: 8000,
    description: '영주 사과를 듬뿍 넣은 수제 파이. 바삭한 크러스트와 달콤한 사과 필링.',
    image: '🥧',
    rating: 4.7,
    isPickupOnly: true,
    category: '빵·디저트',
    categoryId: 'bread',
  },
  {
    id: 'P005',
    shopId: 'S002',
    shopName: '풍기인삼명가',
    name: '홍삼절편 소포장',
    price: 18000,
    description: '6년근 풍기인삼을 꿀에 절여 만든 홍삼절편. 여행 선물로 인기.',
    image: '🌿',
    rating: 4.9,
    isPickupOnly: false,
    category: '인삼·건강',
    categoryId: 'ginseng',
  },
  {
    id: 'P006',
    shopId: 'S002',
    shopName: '풍기인삼명가',
    name: '인삼차 10포',
    price: 8000,
    description: '풍기인삼 100%로 만든 간편 인삼차. 따뜻하게 또는 차갑게 즐길 수 있습니다.',
    image: '🍵',
    rating: 4.6,
    isPickupOnly: false,
    category: '인삼·건강',
    categoryId: 'ginseng',
  },
  {
    id: 'P007',
    shopId: 'S003',
    shopName: '영주사과농원',
    name: '영주 꿀사과 3kg',
    price: 22000,
    description: '소백산 기슭에서 재배한 당도 높은 영주 사과. 당일 수확, 당일 픽업.',
    image: '🍎',
    rating: 4.7,
    isPickupOnly: true,
    category: '과일',
    categoryId: 'fruit',
  },
  {
    id: 'P008',
    shopId: 'S006',
    shopName: '영주한우직판장',
    name: '영주한우 특선 세트 (600g)',
    price: 45000,
    description: '영주에서 방목 사육한 한우 특선 부위 모음. 아이스박스 포장.',
    image: '🥩',
    rating: 4.8,
    isPickupOnly: true,
    category: '축산물',
    categoryId: 'meat',
  },
  {
    id: 'P009',
    shopId: 'S007',
    shopName: '소백산양조장',
    name: '소백산 막걸리 세트 (3병)',
    price: 15000,
    description: '소백산 청정 지역의 쌀로 빚은 전통 막걸리. 영주 여행의 맛.',
    image: '🍶',
    rating: 4.7,
    isPickupOnly: false,
    category: '전통주',
    categoryId: 'drink',
  },
]

export function getProductsByCategory(categoryId: string): Product[] {
  if (categoryId === 'all') return mockProducts
  return mockProducts.filter((p) => p.categoryId === categoryId)
}

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id)
}

export function getProductsByShop(shopId: string): Product[] {
  return mockProducts.filter((p) => p.shopId === shopId)
}

// 향후 API 연결 시:
// export async function fetchProducts(categoryId?: string): Promise<Product[]> {
//   const params = categoryId ? `?category=${categoryId}` : ''
//   const res = await fetch(`/api/products${params}`)
//   return res.json()
// }
