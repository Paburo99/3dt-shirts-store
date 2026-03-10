# 3D Shirts Store

A modern e-commerce platform built for customizing and purchasing 3D shirts. This project allows users to view and interact with products in 3D space, manage their wishlists, place orders, and includes a full-featured administration panel for store management.

## Tech Stack

This project is built using a modern TALL/VILT stack variant, leveraging the power of Laravel for the backend and React with Inertia.js for a seamless frontend experience.

**Backend:**
- [Laravel 12](https://laravel.com/)
- [Filament](https://filamentphp.com/) (Admin Panel)
- [Laravel Sanctum](https://laravel.com/docs/sanctum) (Authentication)
- [Laravel Scout](https://laravel.com/docs/scout) (Search)

**Frontend:**
- [React 18](https://reactjs.org/)
- [Inertia.js](https://inertiajs.com/) (Routing & Data bridge)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) & [Three.js](https://threejs.org/) (3D Previews)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (Animations)
- [Zustand](https://github.com/pmndrs/zustand) (State Management)

**Other Services:**
- [Resend](https://resend.com/) (Email Delivery)
- [Wompi](https://wompi.com/) (Payment Gateway)

## Features

- **Interactive 3D Previews:** Users can rotate, zoom, and inspect shirts in real-time 3D before purchasing.
- **Product Catalog:** Browse products by categories, view details, and select specific SKUs.
- **Shopping Cart & Checkout:** Add products to the cart, manage shipping addresses, and place orders securely.
- **Secure Payments:** Integrated with Wompi for safe and reliable transaction processing.
- **User Accounts:** Registration, authentication, and profile management.
- **Wishlists:** Save favorite products for later.
- **Admin Dashboard:** A powerful administrative interface built with Filament to manage Users, Products, Categories, SKUs, and Orders.

## Project Structure

- `app/Models`: Core domain models (`User`, `Product`, `Category`, `Sku`, `Order`, `OrderItem`, `Address`, `Wishlist`).
- `app/Http/Controllers`: Handles incoming requests for the store front.
- `resources/js`: React frontend application.
- `app/Filament`: Admin dashboard resources and pages.

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js & NPM
- Database (MySQL, SQLite, etc.)

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd 3d-shirts-store
   ```

2. **Install PHP dependencies:**
   ```bash
   composer install
   ```

3. **Install NPM dependencies:**
   ```bash
   npm install
   ```

4. **Environment Setup:**
   Copy the example `.env` file and configure your database and API keys.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Run Migrations & Seeders:**
   Prepare your database schema and optional mock data.
   ```bash
   php artisan migrate --seed
   ```

6. **Start the Development Servers:**
   This project uses a concurrent setup to run both Laravel's server and Vite's dev server.
   ```bash
   composer run dev
   ```
   *Alternatively, you can run them separately:*
   ```bash
   php artisan serve
   npm run dev
   ```

## Admin Access

To access the administrative dashboard, visit `/admin` in your browser. 
You will need to create a user with administrative privileges or run a seeder that provides a default admin account.

## License

This project is open-sourced software licensed under the [Apache License 2.0](https://opensource.org/licenses/Apache-2.0).
