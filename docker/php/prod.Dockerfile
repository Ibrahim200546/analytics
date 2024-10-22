FROM dexodus/php:8.2-fpm-alpine3.17

COPY docker/php/php.ini /usr/local/etc/php/php.ini
COPY --chown=1000 ./backend /srv/app/
COPY --chown=1000 ./.env /srv/app/

WORKDIR /srv/app

ARG ENVIRONMENT

RUN apk update \
    && apk add --no-cache --virtual .build-deps \
        zlib-dev \
        libzip-dev \
        freetype-dev \
        libjpeg-turbo-dev \
        libpng-dev \
    && apk --no-cache add \
        git \
        zsh \
		zlib \
		freetype \
        libjpeg-turbo \
        libpng \
        libzip-dev \
        icu-dev \
        icu-data-full \
        postgresql-client

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && docker-php-ext-enable gd \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl

COPY docker/php/v8/include /opt/v8/include
COPY docker/php/v8/lib /opt/v8/lib

ENV LD_LIBRARY_PATH /opt/v8/lib
ENV PKG_CONFIG_PATH /opt/v8/lib/pkgconfig

RUN cd /tmp \
    && git clone https://github.com/phpv8/v8js.git \
    && cd v8js \
    && phpize \
    && ./configure --with-v8js=/opt/v8 LDFLAGS="-lstdc++" CPPFLAGS="-DV8_COMPRESS_POINTERS -DV8_ENABLE_SANDBOX" \
    && make \
#    && make test \
    && make install

RUN docker-php-ext-enable v8js

RUN composer install --prefer-dist --no-interaction --no-scripts

RUN bin/console cache:warmup --env=prod \
    && bin/console assets:install --env=prod

RUN chmod 777 -R ./
