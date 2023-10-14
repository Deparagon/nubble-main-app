FROM php:8.1-fpm-alpine

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=3e9fe2349614d6d5dc9f601be71fed8a

RUN apk update && apk add --update nodejs npm \
    composer php-pdo_sqlite php-pdo_mysql php-pdo_pgsql php-simplexml php-fileinfo php-dom php-tokenizer php-xml php-xmlwriter php-session \
    openrc bash nginx

RUN docker-php-ext-install pdo

COPY --chown=www-data:www-data web /app
WORKDIR /app

# Overwrite default nginx config
COPY web/nginx.conf /etc/nginx/nginx.conf

# Use the default production configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

RUN composer install
RUN touch /app/storage/nubble.sqlite
RUN chown www-data:www-data /app/storage/db.sqlite

RUN cd frontend && npm install && npm run build
RUN composer build

RUN dos2unix /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
