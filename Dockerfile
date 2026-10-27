# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build arguments for admin frontend env configuration
ARG VITE_API_GATEWAY_URL=http://localhost:8080
ARG VITE_API_BASE_URL=http://localhost:8080

ENV VITE_API_GATEWAY_URL=$VITE_API_GATEWAY_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
