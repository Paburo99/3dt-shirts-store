<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Sku;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create an admin/test user
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
            ]
        );

        // 2. Define our rich catalog of 3D products
        $catalog = [[
                'name' => 'The Essential 3D Hoodie',
                'slug' => 'essential-3d-hoodie',
                'description' => 'A premium heavy-weight cotton hoodie. Fully customizable.',
                'base_price' => 120000, // 120,000 COP
                'glb_model_path' => '/models/hoodie.glb',
                'skus' => [['color' => '#FF0000', 'color_name' => 'Crimson Red', 'size' => 'M', 'stock' => 5, 'price_override' => null],['color' => '#FF0000', 'color_name' => 'Crimson Red', 'size' => 'L', 'stock' => 0, 'price_override' => null], // OUT OF STOCK TEST['color' => '#000000', 'color_name' => 'Midnight Black', 'size' => 'M', 'stock' => 10, 'price_override' => null],['color' => '#000000', 'color_name' => 'Midnight Black', 'size' => 'L', 'stock' => 1, 'price_override' => null], // CONCURRENCY TEST
                ]
            ],[
                'name' => 'Classic 3D Crewneck',
                'slug' => 'classic-3d-crewneck',
                'description' => 'Vintage wash loopback french terry crewneck sweatshirt.',
                'base_price' => 95000, // 95,000 COP
                'glb_model_path' => '/models/crewneck.glb', // You can duplicate your hoodie.glb to this name for now
                'skus' => [['color' => '#4A5568', 'color_name' => 'Charcoal', 'size' => 'S', 'stock' => 15, 'price_override' => null],['color' => '#4A5568', 'color_name' => 'Charcoal', 'size' => 'M', 'stock' => 8, 'price_override' => null],['color' => '#4A5568', 'color_name' => 'Charcoal', 'size' => 'XL', 'stock' => 3, 'price_override' => 105000], // XXL COSTS MORE TEST['color' => '#F6E05E', 'color_name' => 'Mustard Yellow', 'size' => 'M', 'stock' => 2, 'price_override' => null],
                ]
            ],[
                'name' => 'Cyberpunk Cargo Pants',
                'slug' => 'cyberpunk-cargo-pants',
                'description' => 'Water-resistant tactical cargo pants with adjustable cuffs.',
                'base_price' => 180000, // 180,000 COP
                'glb_model_path' => '/models/pants.glb',
                'skus' =>[['color' => '#276749', 'color_name' => 'Olive Drab', 'size' => 'M', 'stock' => 0, 'price_override' => null], // OUT OF STOCK['color' => '#276749', 'color_name' => 'Olive Drab', 'size' => 'L', 'stock' => 5, 'price_override' => null],['color' => '#1A202C', 'color_name' => 'Stealth Black', 'size' => 'M', 'stock' => 12, 'price_override' => null],['color' => '#1A202C', 'color_name' => 'Stealth Black', 'size' => 'L', 'stock' => 10, 'price_override' => null],
                ]
            ]
        ];

        // 3. Loop through the catalog and insert into the database
        foreach ($catalog as $item) {
            $product = Product::firstOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'description' => $item['description'],
                    'base_price' => $item['base_price'],
                    'glb_model_path' => $item['glb_model_path'],
                ]
            );

            foreach ($item['skus'] as $sku) {
                // Generate a unique SKU code like: CREWNECK-CHARCOAL-XL
                $prefix = strtoupper(explode('-', $item['slug'])[2] ?? 'PROD');
                $code = $prefix . '-' . strtoupper(str_replace(' ', '', $sku['color_name'])) . '-' . $sku['size'];

                Sku::firstOrCreate(
                    ['code' => $code],[
                        'product_id' => $product->id,
                        'color' => $sku['color'],
                        'size' => $sku['size'],
                        'stock' => $sku['stock'],
                        'price_override' => $sku['price_override'],
                    ]
                );
            }
        }
    }
}