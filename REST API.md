# AI Chatbot Travel Booking API

`ai_chatbot_travel_booking` 프로젝트는 AI 챗봇 기반의 숙박/여행 예약 플랫폼입니다. 이 문서는 백엔드 REST API 엔드포인트들을 정리한 문서입니다.

## 기본 정보

- **Base URL**: `http://localhost:8888`
- **Content-Type**: `application/json`
- **인증 방식**: JWT 토큰 기반

```http
Authorization: Bearer {jwt_token}
````

---

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

## 공통 응답 코드

| 상태 코드 | 의미     |
| ----- | ------ |
| 200   | 성공     |
| 201   | 생성 완료  |
| 204   | 내용 없음  |
| 400   | 잘못된 요청 |
| 401   | 인증 실패  |
| 403   | 권한 없음  |
| 404   | 리소스 없음 |
| 500   | 서버 오류  |

---

## 기술 스택

* Spring Boot (Spring Security, OAuth2)
* JWT 인증 기반 로그인
* RESTful API 설계
* Swagger 연동 가능 (`/swagger-ui/index.html`)

---

## 프로젝트 구조

```
├── controller/
├── service/
├── entity/
├── repository/
├── config/
├── dto/
└── exception/
```

---

## 테스트 및 문서 확인

* Swagger UI: [http://localhost:8888/swagger-ui/index.html](http://localhost:8888/swagger-ui/index.html)

---

> 본 문서는 `controller` 디렉토리 기반 자동 생성 문서를 가공한 예시입니다. 각 API의 **Request/Response DTO 구조**는 Swagger 또는 추가 문서에서 확인 가능합니다.

```

---

이제 `README.md` 파일에 위 마크다운을 복사해서 붙여 넣으면, 프로젝트 소개 + API 개요 + 요청 예시 + 기술 스택 등
```
