FROM dexodus/php:8.2-fpm-alpine3.17

WORKDIR /srv/app

RUN apk --no-cache add icu-dev icu-data-full  \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl
