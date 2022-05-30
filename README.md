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
