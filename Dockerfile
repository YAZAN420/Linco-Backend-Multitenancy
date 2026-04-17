FROM node:22-alpine

ARG APP_NAME

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --verbose

COPY . .

CMD ["npm", "run", "start:dev"]