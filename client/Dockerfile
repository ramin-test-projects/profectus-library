FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN yarn
RUN yarn add next sass -g

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]