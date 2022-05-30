# E-commerce API 서버

## 기술스택

NestJS, TypeScript, MongoDB

## 설치

```bash
$ npm install
```

## 준비

1. 프로젝트 디렉터리 최상위에 `.env` 파일을 생성합니다.

    예시)

    ```
    DB_URL=mongodb://localhost/ecommerce
    JWT_ISSUER=ecommerce
    JWT_STORE_SECRET=#H?G+bm3Z-Z=JHLMSsVSQVr6u#%7S@y9
    JWT_STORE_EXPIRES_IN=24h
    JWT_CUSTOMER_SECRET=#ZLK&9Jx8vrZ_B8aCcC-kBVC8TpaUeB6
    JWT_CUSTOMER_EXPIRES_IN=24h
    ```
2. 프로젝트 디렉터리 최상위에 위치한 `E-commerce API.postman_collection.json` 파일을 다운로드하여 Postman에 Import 합니다.
3. Postman에 `local` 환경변수를 생성하고 값을 `localhost:3000/api/v1`로 지정합니다.

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

## API 설계

### 인증
- Store JWT 인증
- Customer JWT 인증

### 에러코드
- `200` (OK)
- `400` (Bad Request)
- `401` (Unauthorized)
- `403` (Forbidden)
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

-  `400`, `401`, `403`, `404`, `409`, `500`

    ```json
    {
        "isSuccess": false,
        "errorCode": {error-code},
        "time": {unix-time}
    }
    ```

### `/auth`

- POST /auth/stores/sign-in
  - 상점 계정에 로그인합니다.
  - Request
    - Body
      - id: string
      - password: string
  - Response
    - 200
      - data: {token}
    - 401
      - data: Unauthorized
- POST /auth/stores/:id/customers/sign-in
  - 고객 계정에 로그인합니다.
  - Request
    - URI Parameter
      - id: string
    - Body
      - id: string
      - password: string
  - Response
    - 200
      - data: {token}
    - 401
      - data: Unauthorized

### `/stores`

- POST /stores
  - 상점을 생성합니다.
- GET /stores
  - 상점 목록을 조회합니다.
- GET /stores/me
  - 제 상점 정보를 가져옵니다.
- PATCH /stores/me
  - 제 상점 정보를 수정합니다.
- PATCH /stores/me/password
  - 제 상점 비밀번호를 변경합니다.
- DELETE /stores/me
  - 제 상점을 삭제합니다.

### `/customers`

- POST /stores/:id/customers
  - 특정 상점에 고객 계정을 생성합니다.
- GET /stores/me/customers
  - 제 상점의 고객 목록을 조회합니다.
- GET /stores/me/customers/:id
  - 제 상점의 고객 정보를 조회합니다.
- PATCH /stores/me/customers/:id
  - 제 상점의 고객 정보를 변경합니다.
- GET /customers/me
  - 제 고객 정보를 조회합니다.
- PATCH /customers/me
  - 제 고객 정보를 수정합니다.
- PATCH /customers/me/password
  - 제 고객 비밀번호를 변경합니다.
- DELETE /customers/me
  - 제 고객 계정을 삭제합니다.

### `/products`

- POST /stores/me/products
  - 제 상점에 상품 정보를 생성합니다.
- GET /stores/me/products
  - 제 상점의 상품 목록을 조회합니다.
- GET /stores/:id/products
  - 특정 상점의 상품 목록을 조회합니다.
- GET /stores/me/products/:id
  - 제 상점의 상품 정보를 조회합니다.
- GET /stores/:storeid/products/:id
  - 특정 상점의 상품 정보를 조회합니다.
- PATCH /stores/me/products/:id
  - 제 상점의 상품 정보를 변경합니다.
- DELETE /stores/me/products/:id
  - 제 상점의 상품 정보를 삭제합니다.

### `/orders`

- POST /orders
  - 주문 정보를 생성합니다.
- GET /stores/me/orders
  - 제 상점의 주문 목록을 조회합니다.
- GET /stores/me/orders/:id
  - 제 상점의 주문 정보를 조회합니다.
- GET /stores/me/customers/:id/orders
  - 제 상점의 특정 고객의 주문 목록을 조회합니다.
- GET /customers/me/orders
  - 제 고객 주문 목록을 조회합니다.
- GET /customers/me/orders/:id
  - 제 고객 주문 정보를 조회합니다.
- PATCH /customers/me/orders/:id/stauts
  - 제 고객의 특정 주문 정보의 상태를 변경합니다.
- PATCH /stores/me/orders/:id/stauts
  - 제 상점의 특정 주문 정보의 상태를 변경합니다.

### `/custom-fields`

- POST /stores/me/custom-fields
  - 제 상점에 사용자 정의 필드 정보를 생성합니다.
- GET /stores/me/custom-fields
  - 제 상점의 사용자 정의 필드 목록을 조회합니다.
- PATCH /stores/me/custom-fields/:id
  - 제 상점의 사용자 정의 필드 정보를 변경합니다.
- DELETE /stores/me/custom-fields/:id
  - 제 상점의 사용자 정의 필드 정보를 삭제합니다.
- GET /stores/:id/custom-fields
  - 특정 상점의 사용자 정의 필드 정보를 가져옵니다.

