FROM php:7.1-apache
MAINTAINER Felix Sandström <felix.sandstrom@me.com>

ENV STORAGE='sqLite' \
	REDIS_HOST='tcp://redis.local:6379'

RUN a2enmod rewrite && \
	apt-get update && \
	apt-get install -y git && \
	curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY apache.conf /etc/apache2/sites-enabled/000-default.conf
ADD . /var/www/html
RUN composer install --optimize-autoloader --apcu-autoloader --no-dev --prefer-dist

EXPOSE 80
