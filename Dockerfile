# Stage 1: Build frontend assets
FROM node:20 AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve application
FROM php:8.2-cli

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl zip pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy application files (excluding node_modules due to size, ideally handled by .dockerignore)
COPY . /app

# Copy built frontend assets from the node stage
COPY --from=frontend /app/public/build /app/public/build

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev --no-interaction

# Set correct permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Start command: migrate first (creates cache table), then serve via php -S (avoids Laravel ServeCommand port type bug)
CMD ["sh", "-c", "php artisan migrate --force && php -S 0.0.0.0:${PORT:-8000} -t public public/index.php"]