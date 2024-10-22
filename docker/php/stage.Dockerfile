FROM dexodus/8.2-fpm-alpine3.17

COPY --from=surnet/alpine-wkhtmltopdf:3.16.2-0.12.6-full /bin/wkhtmltopdf /bin/wkhtmltopdf

RUN apk add --no-cache \
        libstdc++ \
        libx11 \
        libxrender \
        libxext \
        libssl1.1 \
        ca-certificates \
        fontconfig \
        freetype \
        ttf-droid \
        ttf-freefont \
        ttf-liberation

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
        postgresql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && docker-php-ext-enable gd \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl \
    && apk del .build-deps

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

COPY docker/php/php.ini /usr/local/etc/php/php.ini
COPY --chown=1000 ./backend/ /srv/app/
COPY --chown=1000 ./.env /srv/app/.env

WORKDIR /srv/app

RUN composer install --prefer-dist --no-interaction --no-scripts \
    && bin/console cache:warmup --env=prod \
    && bin/console assets:install
