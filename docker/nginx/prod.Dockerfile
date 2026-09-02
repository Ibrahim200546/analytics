FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY ./docker/nginx/prod.nginx.conf /etc/nginx/conf.d/default.conf
COPY ./backend/public/ /srv/app/public/
