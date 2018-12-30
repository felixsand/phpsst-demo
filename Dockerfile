FROM php:7.2-apache
MAINTAINER Felix Sandström <felix.sandstrom@me.com>

ENV STORAGE='SQLite' \
    REDIS_HOST='tcp://redis.local:6379'

RUN a2enmod rewrite && \
    a2enmod headers && \
    apt-get update && \
    apt-get install -y git zlib1g-dev && \
    docker-php-ext-install -j$(nproc) zip && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

ADD apache.conf /etc/apache2/sites-enabled/000-default.conf
ADD . /var/www/html
RUN composer install && composer build-dist

EXPOSE 80
