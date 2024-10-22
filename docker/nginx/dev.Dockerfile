FROM nginx:1.20-alpine

COPY ./docker/nginx/dev.nginx.conf /etc/nginx/conf.d/default.conf

ARG NGINX_PORT
RUN sed -i "s|__LISTEN_PORT__|$NGINX_PORT|" /etc/nginx/conf.d/default.conf
