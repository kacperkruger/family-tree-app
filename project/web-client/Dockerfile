FROM node:alpine AS builder
WORKDIR /opt/app
ENV API_HOST_URL=${API_HOST_URL:-REPLACE}
ENV WEBSOCKET_HOST_URL=${WEBSOCKET_HOST_URL:-REPLACE}
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM nginx
COPY --from=builder /opt/app/dist /usr/share/nginx/html