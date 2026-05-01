# Server

NestJS backend with a modular architecture (core, iam, users) and integrations
for MongoDB, Redis/BullMQ, mail, Swagger, and JWT-based auth.

## Requirements

- Node.js >= 22.19
- npm
- Optional: Docker + Docker Compose

## Environment

Create a `.env` file in the repository root.

Required variables:

```
MONGO_URI=mongodb://localhost:27017/?replicaSet=rs0
ACCESS_TOKEN_SECRET=change-me
JWT_TOKEN_AUDIENCE=your-audience
JWT_TOKEN_ISSUER=your-issuer
JWT_ACCESS_TOKEN_TTL=900
JWT_REFRESH_TOKEN_TTL=86400
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-user
SMTP_PASS=your-pass
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

Optional variables:

```
NODE_ENV=development
PORT=3000
DB_DRIVER=mongoose
SWAGGER_ENABLED=true
CORS_ORIGINS=http://localhost:3000
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_TLS=false
REDIS_TLS_REJECT_UNAUTHORIZED=true
APP_BASE_URL=http://localhost:3000
MAIL_FROM=no-reply@app.com
MONGO_USER=admin
MONGO_PASS=admin
```

Notes:

- `JWT_*_TTL` values are in seconds.
- `MONGO_USER` and `MONGO_PASS` are only used by the `mongo-express` container
  in `docker-compose.yml`.

## Install

```
npm install
```

## Run locally

```
npm run start:dev
```

## Run with Docker Compose

```
docker compose up --build
```

If the app runs inside Docker Compose, use:

```
MONGO_URI=mongodb://db:27017/?replicaSet=rs0
```

## Scripts

```
npm run build
npm run start
npm run start:dev
npm run start:prod
npm run lint
npm run test
npm run test:cov
npm run test:e2e
```

## Swagger

Swagger UI is available at `http://localhost:3000/api` when `SWAGGER_ENABLED`
is `true` or when `NODE_ENV` is not `production`.
