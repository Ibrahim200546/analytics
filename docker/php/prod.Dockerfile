FROM dexodus/php:8.2-fpm-alpine3.17

COPY docker/php/php.ini /usr/local/etc/php/php.ini
COPY --chown=1000 ./backend /srv/app/
COPY --chown=1000 ./.env /srv/app/

WORKDIR /srv/app

ARG ENVIRONMENT

RUN apk --no-cache add icu-dev icu-data-full  \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl

RUN composer install --prefer-dist --no-interaction --no-scripts

RUN bin/console cache:warmup --env=prod \
    && bin/console assets:install --env=prod
