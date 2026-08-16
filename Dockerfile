FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx swc prisma.config.ts -o prisma.config.js
RUN npx prisma generate

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.js ./prisma.config.js

RUN npx prisma generate

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]