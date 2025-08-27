const W = 900, H = 600, Q = 80;

const domesticActivities = [
  {
    id: 3,
    type: "domestic",
    name: "강릉 서핑 클래스",
    location: "강릉 경포",
    price: 55000,
    rating: 4.7,
    thumbnail: `https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "입문자를 위한 안전 교육과 기본 라이딩."
  },
  {
    id: 4,
    type: "domestic",
    name: "부산 요트 세일링 체험",
    location: "부산 해운대",
    price: 39000,
    rating: 4.5,
    thumbnail: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "요트 승선 후 광안대교 야경 감상."
  },
  {
    id: 11,
    type: "domestic",
    name: "대전 천문대 별자리 투어",
    location: "대전 유성",
    price: 20000,
    rating: 4.5,
    thumbnail: `https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=${W}&h=${H}&q=${Q}`,
    description: "천체 망원경 관측과 강의."
  }
];

export default domesticActivities;
