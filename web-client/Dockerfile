FROM node:alpine AS builder
WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/app/dist /usr/share/nginx/html