web: php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
worker: php artisan migrate --force && php artisan queue:work --sleep=3 --tries=3 --max-time=3600
scheduler: php artisan migrate --force && php artisan schedule:work
