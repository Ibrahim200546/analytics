FROM nginx:1.20-alpine

COPY ./docker/nginx/prod.nginx.conf /etc/nginx/conf.d/default.conf
COPY ./backend/public/ /srv/app/public/
