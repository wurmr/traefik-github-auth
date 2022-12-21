FROM node:lts AS builder
WORKDIR /app
COPY . .
ENV NODE_ENV production
RUN npm ci
RUN npm run build

FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /app/dist/main.js ./
ENV NODE_ENV production
ENTRYPOINT ["node", "main.js"]