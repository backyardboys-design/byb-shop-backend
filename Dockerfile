FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app/.medusa/server

COPY --from=builder /app/.medusa/server ./
RUN npm ci --omit=dev

EXPOSE 9000
CMD ["npm", "run", "start"]