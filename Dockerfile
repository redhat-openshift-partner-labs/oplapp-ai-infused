# Flexible Dockerfile that accepts build directory as argument
ARG BUILD_DIR=build

# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
# Re-declare ARG for this stage
ARG BUILD_DIR=dist

RUN apk add --no-cache curl

# Copy nginx config if exists, otherwise use default
RUN echo 'server { listen 8080; location / { root /usr/share/nginx/html; try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf

# Copy build output using the ARG
COPY --from=builder /app/${BUILD_DIR} /usr/share/nginx/html

# Security: Run as non-root
RUN adduser -D nginx || true
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
