import type { Product, Shop } from "../types";

type ProductTemplate = {
  name: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  category: string;
  categoryId: string;
};

const CATEGORY_PRODUCTS: Record<string, ProductTemplate[]> = {
  bread: [
    {
      name: "영주 사과빵",
      price: 3500,
      description: "영주 사과를 넣은 달콤한 지역 디저트입니다.",
      image: "🍞",
      rating: 4.8,
      category: "빵·디저트",
      categoryId: "bread",
    },
    {
      name: "인삼 마들렌",
      price: 4200,
      description: "풍기 인삼 향을 은은하게 담은 마들렌입니다.",
      image: "🧁",
      rating: 4.6,
      category: "빵·디저트",
      categoryId: "bread",
    },
    {
      name: "사과 파이",
      price: 5000,
      description: "바삭한 파이 안에 영주 사과 필링을 넣었습니다.",
      image: "🥧",
      rating: 4.7,
      category: "빵·디저트",
      categoryId: "bread",
    },
    {
      name: "찹쌀 도넛",
      price: 3000,
      description: "쫀득한 식감의 간식용 도넛입니다.",
      image: "🍩",
      rating: 4.5,
      category: "빵·디저트",
      categoryId: "bread",
    },
    {
      name: "영주 쿠키 세트",
      price: 9000,
      description: "선물하기 좋은 수제 쿠키 세트입니다.",
      image: "🍪",
      rating: 4.6,
      category: "빵·디저트",
      categoryId: "bread",
    },
    {
      name: "크림빵 세트",
      price: 11000,
      description: "부드러운 크림빵을 다양하게 담은 세트입니다.",
      image: "🥐",
      rating: 4.4,
      category: "빵·디저트",
      categoryId: "bread",
    },
  ],

  ginseng: [
    {
      name: "풍기 인삼",
      price: 39000,
      description: "풍기 지역 대표 인삼 상품입니다.",
      image: "🌿",
      rating: 4.9,
      category: "인삼·건강",
      categoryId: "ginseng",
    },
    {
      name: "인삼 절편",
      price: 18000,
      description: "간편하게 먹기 좋은 인삼 절편입니다.",
      image: "🍯",
      rating: 4.7,
      category: "인삼·건강",
      categoryId: "ginseng",
    },
    {
      name: "홍삼 스틱",
      price: 32000,
      description: "휴대하기 좋은 홍삼 스틱 세트입니다.",
      image: "🧃",
      rating: 4.8,
      category: "인삼·건강",
      categoryId: "ginseng",
    },
    {
      name: "인삼청",
      price: 25000,
      description: "차로 즐기기 좋은 인삼청입니다.",
      image: "🫙",
      rating: 4.6,
      category: "인삼·건강",
      categoryId: "ginseng",
    },
    {
      name: "홍삼 젤리",
      price: 12000,
      description: "부담 없이 즐기는 홍삼 젤리입니다.",
      image: "🍬",
      rating: 4.3,
      category: "인삼·건강",
      categoryId: "ginseng",
    },
    {
      name: "건강 선물세트",
      price: 59000,
      description: "부모님 선물로 좋은 건강 세트입니다.",
      image: "🎁",
      rating: 4.9,
      category: "인삼·건강",
      categoryId: "ginseng",
    },
  ],

  fruit: [
    {
      name: "영주 사과 3kg",
      price: 25000,
      description: "아삭하고 달콤한 영주 대표 사과입니다.",
      image: "🍎",
      rating: 4.8,
      category: "과일",
      categoryId: "fruit",
    },
    {
      name: "사과즙 박스",
      price: 28000,
      description: "영주 사과로 만든 사과즙입니다.",
      image: "🧃",
      rating: 4.7,
      category: "과일",
      categoryId: "fruit",
    },
    {
      name: "제철 과일 꾸러미",
      price: 22000,
      description: "제철 과일을 담은 꾸러미입니다.",
      image: "🍇",
      rating: 4.5,
      category: "과일",
      categoryId: "fruit",
    },
    {
      name: "미니 사과 세트",
      price: 16000,
      description: "가볍게 들고 가기 좋은 미니 사과 세트입니다.",
      image: "🍏",
      rating: 4.4,
      category: "과일",
      categoryId: "fruit",
    },
    {
      name: "사과잼",
      price: 8500,
      description: "빵과 잘 어울리는 수제 사과잼입니다.",
      image: "🫙",
      rating: 4.6,
      category: "과일",
      categoryId: "fruit",
    },
    {
      name: "건조 사과칩",
      price: 7000,
      description: "바삭하게 말린 사과 간식입니다.",
      image: "🍎",
      rating: 4.3,
      category: "과일",
      categoryId: "fruit",
    },
  ],

  meat: [
    {
      name: "영주 한우 세트",
      price: 89000,
      description: "선물용으로 좋은 프리미엄 한우 세트입니다.",
      image: "🥩",
      rating: 4.9,
      category: "축산물",
      categoryId: "meat",
    },
    {
      name: "한우 불고기",
      price: 29000,
      description: "간편하게 조리할 수 있는 불고기용 고기입니다.",
      image: "🥩",
      rating: 4.7,
      category: "축산물",
      categoryId: "meat",
    },
    {
      name: "한우 국거리",
      price: 24000,
      description: "국거리용으로 좋은 한우 상품입니다.",
      image: "🍲",
      rating: 4.6,
      category: "축산물",
      categoryId: "meat",
    },
    {
      name: "수제 육포",
      price: 15000,
      description: "간식이나 안주로 좋은 수제 육포입니다.",
      image: "🥓",
      rating: 4.5,
      category: "축산물",
      categoryId: "meat",
    },
    {
      name: "한돈 세트",
      price: 45000,
      description: "가성비 좋은 한돈 구성 세트입니다.",
      image: "🍖",
      rating: 4.4,
      category: "축산물",
      categoryId: "meat",
    },
    {
      name: "캠핑 고기 세트",
      price: 69000,
      description: "여행객을 위한 캠핑용 고기 세트입니다.",
      image: "🔥",
      rating: 4.8,
      category: "축산물",
      categoryId: "meat",
    },
  ],

  drink: [
    {
      name: "전통주 세트",
      price: 32000,
      description: "지역 양조장의 전통주 세트입니다.",
      image: "🍶",
      rating: 4.7,
      category: "전통주",
      categoryId: "drink",
    },
    {
      name: "사과 막걸리",
      price: 9000,
      description: "사과 향이 은은한 지역 막걸리입니다.",
      image: "🍶",
      rating: 4.5,
      category: "전통주",
      categoryId: "drink",
    },
    {
      name: "인삼주",
      price: 27000,
      description: "인삼 향이 담긴 전통주입니다.",
      image: "🍾",
      rating: 4.6,
      category: "전통주",
      categoryId: "drink",
    },
    {
      name: "약주 세트",
      price: 30000,
      description: "선물하기 좋은 약주 세트입니다.",
      image: "🥂",
      rating: 4.4,
      category: "전통주",
      categoryId: "drink",
    },
    {
      name: "오미자 음료",
      price: 12000,
      description: "상큼하게 즐기는 오미자 음료 세트입니다.",
      image: "🥤",
      rating: 4.3,
      category: "전통주",
      categoryId: "drink",
    },
    {
      name: "전통 음료 세트",
      price: 18000,
      description: "남녀노소 즐기기 좋은 전통 음료 구성입니다.",
      image: "🧃",
      rating: 4.4,
      category: "전통주",
      categoryId: "drink",
    },
  ],

  processed: [
    {
      name: "인삼청",
      price: 25000,
      description: "따뜻한 차로 즐기기 좋은 인삼청입니다.",
      image: "🧴",
      rating: 4.7,
      category: "특산가공",
      categoryId: "processed",
    },
    {
      name: "사과잼",
      price: 8500,
      description: "영주 사과로 만든 수제 잼입니다.",
      image: "🫙",
      rating: 4.6,
      category: "특산가공",
      categoryId: "processed",
    },
    {
      name: "사과칩",
      price: 7000,
      description: "바삭하게 즐기는 건조 사과칩입니다.",
      image: "🍎",
      rating: 4.3,
      category: "특산가공",
      categoryId: "processed",
    },
    {
      name: "고추장 세트",
      price: 18000,
      description: "지역 농산물로 만든 장류 세트입니다.",
      image: "🌶️",
      rating: 4.4,
      category: "특산가공",
      categoryId: "processed",
    },
    {
      name: "참기름 세트",
      price: 22000,
      description: "고소한 향의 참기름 세트입니다.",
      image: "🧴",
      rating: 4.5,
      category: "특산가공",
      categoryId: "processed",
    },
    {
      name: "수제 반찬 세트",
      price: 19000,
      description: "여행 후 집에서 먹기 좋은 반찬 세트입니다.",
      image: "🍱",
      rating: 4.4,
      category: "특산가공",
      categoryId: "processed",
    },
  ],

  gift: [
    {
      name: "사과 선물세트",
      price: 35000,
      description: "영주 사과를 담은 선물세트입니다.",
      image: "🎁",
      rating: 4.8,
      category: "선물세트",
      categoryId: "gift",
    },
    {
      name: "인삼 선물세트",
      price: 59000,
      description: "풍기 인삼으로 구성한 선물세트입니다.",
      image: "🎁",
      rating: 4.9,
      category: "선물세트",
      categoryId: "gift",
    },
    {
      name: "특산물 종합세트",
      price: 49000,
      description: "여러 특산물을 한 번에 담았습니다.",
      image: "📦",
      rating: 4.7,
      category: "선물세트",
      categoryId: "gift",
    },
    {
      name: "부모님 건강세트",
      price: 69000,
      description: "부모님 선물로 좋은 건강 상품입니다.",
      image: "💝",
      rating: 4.8,
      category: "선물세트",
      categoryId: "gift",
    },
    {
      name: "간식 선물세트",
      price: 24000,
      description: "가볍게 선물하기 좋은 간식 세트입니다.",
      image: "🍪",
      rating: 4.4,
      category: "선물세트",
      categoryId: "gift",
    },
    {
      name: "프리미엄 패키지",
      price: 99000,
      description: "고급 선물용 프리미엄 구성입니다.",
      image: "🏷️",
      rating: 4.9,
      category: "선물세트",
      categoryId: "gift",
    },
  ],
};

export function getProductsByShop(
  shop: Shop | null,
  categoryId?: string | null,
): Product[] {
  const safeCategoryId =
    categoryId && categoryId !== "all"
      ? categoryId
      : shop?.categoryId || "gift";

  const baseProducts =
    CATEGORY_PRODUCTS[safeCategoryId] ?? CATEGORY_PRODUCTS.gift;

  return baseProducts.map((product, index) => ({
    ...product,
    id: `${shop?.id ?? "shop"}-${safeCategoryId}-${index + 1}`,
    shopId: shop?.id ?? "unknown-shop",
    shopName: shop?.name ?? "영주 특산물 매장",
    shopLat: shop?.lat ?? 36.8106,
    shopLng: shop?.lng ?? 128.6241,
  }));
}

export function getProductById(id: string) {
  const saved = localStorage.getItem("selected-product");

  if (!saved) return undefined;

  try {
    const product = JSON.parse(saved) as Product;
    return product.id === id ? product : undefined;
  } catch {
    return undefined;
  }
}
