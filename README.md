# E-commerce API 서버

## 기술스택

NestJS, TypeScript, MongoDB

## 설치

```bash
$ npm install
```

## 준비

프로젝트 디렉터리 최상위에 `.env` 파일을 생성합니다.

예시)

```
DB_URL=mongodb://localhost/ecommerce
JWT_ISSUER=ecommerce
JWT_STORE_SECRET=#H?G+bm3Z-Z=JHLMSsVSQVr6u#%7S@y9
JWT_STORE_EXPIRES_IN=24h
JWT_CUSTOMER_SECRET=#ZLK&9Jx8vrZ_B8aCcC-kBVC8TpaUeB6
JWT_CUSTOMER_EXPIRES_IN=24h
```

## 실행

```bash
$ npm run start
```

API 서버는 `http://localhost:3000/api/v1` 에서 실행됩니다.

## MongoDB 데이터 모델링

### CustomFieldValue

`customers`, `products`, `orders` 컬렉션 내 `customFields` 필드에서 사용되는 서브도큐먼트의 스키마

|필드|타입|설명|
|------|---|---|
|\_id|ObjectId|사용자 정의 필드 값 고유 ID|
|customField|ObjectId|사용자 정의 필드 고유 ID|
|name|String|사용자 정의 필드 이름|
|type|String|사용자 정의 필드 타입 (enum CustomFieldType)|
|value|Any|사용자 정의 필드 값|
|isOnlyStoreWritable|Boolean|사용자 정의 필드 수정 권한 여부 (예시: 적립금)|

```typescript
export enum CustomFieldType {
    SELECT = 'Select',
    INPUT = 'Input',
}
```

### stores

|필드|타입|설명|
|------|---|---|
|\_id|ObjectId|상점 고유 ID|
|name|String|상점 이름|
|email|String|상점 이메일|
|password|String|상점 비밀번호|

### customers

|필드|타입|설명|
|------|---|---|
|\_id|ObjectId|고객 고유 ID|
|store|ObjectId|상점 고유 ID|
|name|String|고객 이름|
|email|String|고객 이메일|
|password|String|고객 비밀번호|
|customFields|CustomFieldValue[]|사용자 정의 필드 값|

### products

|필드|타입|설명|
|------|---|---|
|\_id|ObjectId|상품 고유 ID|
|store|ObjectId|상점 고유 ID|
|name|String|상품 이름|
|price|Number|상품 가격|
|categories|String[]|상품 카테고리 목록|
|customFields|CustomFieldValue[]|사용자 정의 필드 값|

### orders

|필드|타입|설명|
|------|---|---|
|\_id|ObjectId|주문 고유 ID|
|store|ObjectId|상점 고유 ID|
|status|String|주문 상태 (enum OrderStatus)|
|customer|ObjectId|고객 고유 ID|
|products|ObjectId[]|상품 고유 ID 목록|
|price|Number|주문 총액|
|customFields|CustomFieldValue[]|사용자 정의 필드 값|

```typescript
export enum OrderStatus {
    INCOMPLETE_PAYMENT = 'IncompletePayment', // 미결제
    COMPLETE_PAYMENT = 'CompletePayment', // 결제완료
    CANCEL_PAYMENT = 'CancelPayment', // 결제취소
    PREPARE_DELIVERY = 'PrepareDelivery', // 배송준비중
    IN_DELIVERY = 'InDelivery', // 배송중
    COMPLETE_DELIVERY = 'CompleteDelivery', // 배송완료
    CONFIRM_PURCHASE = 'ConfirmPurchase', // 구매확정
    REQUEST_CANCELLATION = 'RequestCancellation', // 취소요청
    COMPLETE_CANCELLATION = 'CompleteCancellation', // 취소완료
    REQUEST_RETURN = 'RequestReturn', // 반품요청
    COMPLETE_RETURN = 'CompleteReturn', // 반품완료
    REQUEST_EXCHANGE = 'RequestExchange', // 교환요청
    COMPLETE_EXCHANGE = 'CompleteExchange', // 교환완료
}
```

### customfields

|필드|타입|설명|
|------|---|---|
|\_id|ObjectId|사용자 정의 필드 고유 ID|
|store|ObjectId|상점 고유 ID|
|target|String|사용자 정의 필드 대상 (enum CustomFieldTarget)|
|name|String|사용자 정의 필드 이름|
|type|String|사용자 정의 필드 타입 (enum CustomFieldType)|
|subType|String[]|사용자 정의 필드 타입이 `Select`인 경우 선택할 수 있는 선택지 목록|
|isRequired|Boolean|사용자 정의 필드 필수 입력 여부|
|isOnlyStoreWritable|Boolean|사용자 정의 필드 수정 권한 여부 (예시: 적립금)|

```typescript
export enum CustomFieldTarget {
    CUSTOMER = 'Customer',
    PRODUCT = 'Product',
    ORDER = 'Order',
}
```

```typescript
export enum CustomFieldType {
    SELECT = 'Select',
    INPUT = 'Input',
}
```

## 사용자 정의 필드 기능

- 사용자 정의 필드 정보는 `customfields` 컬렉션에 저장합니다.
- 사용자 정의 필드에 대해 입력된 값은 각 `customers`, `products`, `orders` 컬렉션에 서브도큐먼트 배열 형태로 저장합니다.
- 사용자 정의 필드 정보(name, type, subType 등)가 변경되는 경우에 대비하기 위해 `customfields` 컬렉션의 도큐먼트를 조회할 필요 없이, `customers`, `products`, `orders` 컬렉션의 도큐먼트만 조회해도 사용자 정의 필드 값 데이터를 응답할 수 있게 구성하였습니다.

## API 문서

### 인증
- Store JWT 인증
- Customer JWT 인증

### 에러코드
- `200` (OK)
- `400` (Bad Request)
- `401` (Unauthorized)
- `404` (Not Found)
- `409` (Conflict)
- `500` (Internal Server Error) - 공통 에러 처리

### 응답
- `200`

    ```json
    {
        "isSuccess": true,
        "data": {data},
        "time": {unix-time}
    }
    ```

-  `400`, `401`, `404`, `409`, `500`

    ```json
    {
        "isSuccess": false,
        "errorCode": {error-code},
        "time": {unix-time}
    }
    ```

### `/auth`
- POST /auth/stores/sign-in
- POST /auth/stores/:id/customers/sign-in

### `/stores`
- POST /stores
- GET /stores
- GET /stores/me
- PATCH /stores/me
- PATCH /stores/me/password
- DELETE /stores/me

### `/customers`
- POST /stores/:id/customers
- GET /stores/me/customers
- GET /stores/me/customers/:id
- PATCH /stores/me/customers/:id
- GET /customers/me
- PATCH /customers/me
- PATCH /customers/me/password
- DELETE /customers/me

### `/products`
- POST /stores/me/products
- GET /stores/me/products
- GET /stores/:id/products
- GET /stores/me/products/:id
- GET /stores/:storeid/products/:id
- PATCH /stores/me/products/:id
- DELETE /stores/me/products/:id

### `/orders`
- POST /orders
- GET /stores/me/orders
- GET /stores/me/orders/:id
- GET /stores/me/customers/:id/orders
- GET /customers/me/orders
- GET /customers/me/orders/:id
- PATCH /customers/me/orders/:id/stauts
- PATCH /stores/me/orders/:id/stauts

### `/custom-fields`
- POST /stores/me/custom-fields
- GET /stores/me/custom-fields
- PATCH /stores/me/custom-fields/:id
- DELETE /stores/me/custom-fields/:id
- GET /stores/:id/custom-fields
