const W = 900, H = 600, Q = 80;

const internationalActivities = [
  {
    id: 103,
    type: "international",
    name: "로마 콜로세움 가이드 투어",
    location: "이탈리아 로마",
    price: 34000,
    rating: 4.6,
    thumbnail: `https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "고대 로마 역사 해설."
  },
  {
    id: 105,
    type: "international",
    name: "후쿠오카 야타이 먹거리 투어",
    location: "일본 후쿠오카",
    price: 26000,
    rating: 4.5,
    thumbnail: `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "포장마차 골목 미식 체험."
  },
  {
    id: 107,
    type: "international",
    name: "오사카 USJ 익스프레스",
    location: "일본 오사카",
    price: 129000,
    rating: 4.8,
    thumbnail: `https://images.unsplash.com/photo-1509057199576-632a47484ece?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "대기 최소화 익스프레스 패스."
  },
  {
    id: 110,
    type: "international",
    name: "런던 해리포터 스튜디오",
    location: "영국 런던",
    price: 95000,
    rating: 4.9,
    thumbnail: `https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "영화 세트/소품 체험 투어."
  },
  {
    id: 114,
    type: "international",
    name: "푸켓 피피섬 호핑투어",
    location: "태국 푸켓",
    price: 59000,
    rating: 4.5,
    thumbnail: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "스피드보트 섬 투어."
  },
  {
    id: 115,
    type: "international",
    name: "두바이 사막 사파리",
    location: "아랍에미리트 두바이",
    price: 88000,
    rating: 4.7,
    thumbnail: `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "듄배싱·바비큐 디너 포함."
  },
  {
    id: 116,
    type: "international",
    name: "이스탄불 보스포루스 유람선",
    location: "튀르키예 이스탄불",
    price: 35000,
    rating: 4.4,
    thumbnail: `https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "해협 크루즈."
  },
  {
    id: 118,
    type: "international",
    name: "비엔나 클래식 콘서트",
    location: "오스트리아 비엔나",
    price: 72000,
    rating: 4.7,
    thumbnail: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "오케스트라 공연 관람."
  },
  {
    id: 119,
    type: "international",
    name: "취리히 융프라우 소규모 투어",
    location: "스위스 취리히",
    price: 210000,
    rating: 4.8,
    thumbnail: `https://images.unsplash.com/photo-1454329001438-1752daa90420?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "알프스 설원 전망."
  },
  {
    id: 120,
    type: "international",
    name: "홍콩 피크트램 패스트트랙",
    location: "홍콩",
    price: 36000,
    rating: 4.5,
    thumbnail: `https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "빅토리아 피크 야경."
  }
];

export default internationalActivities;
