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
|customFields|CustomField[]|사용자 정의 필드 값|

### products

|필드|타입|설명|
|------|---|---|
|\_id|ObjectId|상품 고유 ID|
|store|ObjectId|상점 고유 ID|
|name|String|상품 이름|
|price|Number|상품 가격|
|categories|String[]|상품 카테고리 목록|
|customFields|CustomField[]|사용자 정의 필드 값|

### orders

|필드|타입|설명|
|------|---|---|
|\_id|ObjectId|주문 고유 ID|
|store|ObjectId|상점 고유 ID|
|status|String|주문 상태 (enum OrderStatus)|
|customer|ObjectId|고객 고유 ID|
|products|ObjectId[]|상품 고유 ID 목록|
|price|Number|주문 총액|
|customFields|CustomField[]|사용자 정의 필드 값|

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
|isOnlyStoreWritable|Boolean|사용자 정의 필드 수정 권한 여부 예시)적립금|

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
