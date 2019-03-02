FROM node:10 as frontendBuilder
COPY ./frontend .
RUN npm install && \
    npm run lint && \
    npm run build




FROM php:7.3-apache as backendBuilder

ENV COMPOSER_ALLOW_SUPERUSER=1
COPY ./backend /backend

RUN apt-get update && \
    apt-get install -y git libzip-dev && \
    docker-php-ext-install -j$(nproc) zip && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN cd /backend && composer install && composer build-dist




FROM php:7.3-apache
MAINTAINER Felix Sandström <felix.sandstrom@me.com>

ENV STORAGE='SQLite' \
    REDIS_HOST='tcp://redis.local:6379'

ADD apache.conf /etc/apache2/sites-enabled/000-default.conf

COPY --from=backendBuilder /backend /backend
COPY --from=frontendBuilder ./dist /var/www/html/public

RUN a2enmod rewrite && \
    a2enmod headers && \
    mv /backend/src/phppst.php /var/www/html/public/phppst.php && \
    mv /backend/vendor /var/www/html/vendor && \
    mv /backend/src /var/www/html/src && \
    rm -Rf /backend && \
    mkdir  /var/www/html/src/data && \
    chown www-data:staff /var/www/html/src/data && \
    chmod 700 /var/www/html/src/data

EXPOSE 80
