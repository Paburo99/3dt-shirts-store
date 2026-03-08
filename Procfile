web: php artisan migrate --force && php -S 0.0.0.0:${PORT:-8000} -t public public/index.php
worker: php artisan migrate --force && php artisan queue:work --sleep=3 --tries=3 --max-time=3600
scheduler: php artisan migrate --force && php artisan schedule:work
