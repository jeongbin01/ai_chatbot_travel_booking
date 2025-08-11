# 온쉼 여행 프로젝트
---

## 🌿 온쉼 (OnShim) 프로젝트
국내 & 해외 숙박 예약 + AI 여행 추천 챗봇 서비스

사용자가 손쉽게 여행을 계획하고, 숙박을 예약하며, AI 챗봇을 통해 맞춤 여행 일정을 추천받을 수 있는 통합 플랫폼입니다

## 👥 팀원
- 전정빈 : 팀장
- 오상민 : 팀원
- 황대훈 : 팀원
- 고하림 : 팀원

## 🏗️ 기술 스택
|영역|  기술|
|----|-----|
|Frontend|React, Axios, TailwindCSS, React Router, Vite
|Backend|Spring Boot, Spring Security, MySQL, JPA (Hibernate), - JWT, OAuth2, Thymeleaf|
|AI Server|FastAPI, LangChain, OpenAI API|
|배포 환경 | Docker, AWS|

## 🧑‍💻 개발자
| 역할        | 담당 업무 |  담당자  |
|-------------|-----------|-----------|
| 프론트엔드  | 숙소/예약 UI, Axios 연동, 챗봇 연동 | 전정빈 , 황대훈 , 고하림 |
| 백엔드      | 숙소/예약 CRUD, 인증/보안, DB 설계 | 전정빈 , 오상민 |
| AI 서버     | LangChain 설계, 챗봇 프롬프트 엔지니어링 | 전정빈 , 오상민 |

## 🔐 인증 / 보안
- Spring Security 기반 인증 시스템
- 3가지 로그인 방식 지원:
    - 일반 회원가입 및 로그인 (JWT, Cookie)
    - 소셜 로그인 (OAuth2, Cookie - Google, Kakao 등) 
    - 관리자 페이지 전용 로그인 (Thymeleaf + Session 기반) 

## 📱 프론트엔드 기능 (React 기반)
- 반응형 웹 (모바일/PC 최적화)
- 숙소 검색, 필터링, 예약 기능
- 지도 기반 숙소 위치 확인
- 찜(위시리스트), 리뷰, 예약 내역 페이지
- 관리자 모드 접근 (Thymeleaf 기반 백오피스)
- Axios를 통한 RESTful API 통신
- 마이페이지 / 로그인 처리. js-cookie를 이용한 Cookie 처리.

## 🛠️ 백엔드 기능 (Spring Boot 기반)
- 회원가입 / 로그인 처리, Cokie 생성 로직 구현.
- 숙소 및 여행 상품 CRUD
- 예약/찜하기 처리 로직
- 관리자용 페이지 (상품/예약/리뷰 관리)
- 접근 제어 관리. Spring Security.

## 🗃️ 주요 DB 테이블
```
로그인 관련 - user, socialaccount

숙박 - accommodation, room, room_type, accommodation_image,
    room_type_image, accommodation_amenity,
    included_service, service, price_policy

상품 - travel_product, product_schedule, product_image

예약 - booking, payment, refund

리뷰 - review

챗봇 - chat_session, chat_message

admin - admin_user


```
## 📌 ERD
ERD - Link : https://dbdiagram.io/d/AI%EC%B1%97%EB%B4%87-%EC%97%AC%ED%96%89-%ED%94%8C%EB%9E%AB%ED%8F%BC-685d29fbf413ba3508019d64
![ERD](./AI챗봇%20여행%20플랫폼.png)

## 📁 프로젝트 폴더 구조
```
# API 엔드포인트

## 1. 인증(Authentication) API

### 1.1 회원가입

`POST /app/signup`
신규 사용자 계정 생성

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "사용자명"
}
```

### 1.2 로그인 (JWT)

`POST /app/login`
이메일/비밀번호 기반 JWT 토큰 발급

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 1.3 구글 OAuth 로그인

`POST /app/oauth/google`
Google 인증 코드 기반 로그인

```json
{
  "code": "google_auth_code"
}
```

---

## 2. 사용자 API

### 마이페이지

* `GET /app/mypage/{userId}`: 프로필 조회
* `PUT /app/mypage/user/{userId}`: 프로필 수정
* `DELETE /app/mypage/user/{userId}`: 사용자 삭제
* `PUT /app/mypage/social/{socialAccountId}`: 소셜 계정 수정
* `DELETE /app/mypage/social/{socialAccountId}`: 소셜 계정 삭제

---

##  3. 숙소 API

### 숙소 관리

* `GET /app/accommodations`: 숙소 전체 조회
* `GET /app/accommodations/{id}`: 숙소 상세 조회
* `POST /app/accommodations`: 숙소 등록
* `PUT /app/accommodations/{id}`: 숙소 수정
* `DELETE /app/accommodations/{id}`: 숙소 삭제

### 숙소 이미지

* `GET /app/accommodation-images/{accommodationId}`: 이미지 조회
* `DELETE /app/accommodation-images/{imageId}`: 이미지 삭제

### 숙소 편의시설

* `GET /api/accommodation-amenities/{accommodationId}`: 편의시설 조회

---

## 4. 객실/객실 타입 API

* `GET /app/rooms/{roomId}`: 객실 조회
* `GET /app/room-types/{roomTypeId}`: 객실 타입 조회
* `GET /app/room-type-images/room-type/{roomTypeId}`: 타입 이미지 조회

---

## 5. 예약 API

* `POST /app/bookings`: 예약 생성
* `GET /app/bookings/user/{userId}`: 사용자 예약 목록
* `PUT /app/bookings/{id}`: 예약 수정
* `DELETE /app/bookings/{id}`: 예약 삭제

---

## 6. 결제/환불 API

### 결제

* `POST /app/payment`: 결제 생성
* `GET /app/payment/user/{userId}`: 결제 조회

### 환불

* `POST /app/refund`: 환불 요청
* `GET /app/refund/user/{userId}`: 환불 내역

---

## 7. 쿠폰/프로모션 API

* `GET /api/coupons/code/{couponCode}`: 쿠폰 코드 조회
* `GET /api/user-coupons/user/{userId}`: 사용자 보유 쿠폰
* `GET /api/user-coupons/check`: 쿠폰 사용 가능 여부 확인

---

## 8. 여행 상품 API

* `GET /app/travel-products/{productId}`: 상품 상세
* `GET /app/itineraries/product/{productId}`: 일정 조회
* `GET /app/product-images/product/{productId}`: 이미지 목록
* `GET /app/product-schedules/product/{productId}`: 판매 일정

---

## 9. 리뷰 API

* `GET /app/reviews/{id}`: 리뷰 조회
* `DELETE /app/reviews/{id}`: 리뷰 삭제
* `GET /app/review-images/review/{reviewId}`: 리뷰 이미지 조회

---

## 테스트 및 문서 확인

* Swagger UI: [http://localhost:8888/swagger-ui/index.html](http://localhost:8888/swagger-ui/index.html)

```

