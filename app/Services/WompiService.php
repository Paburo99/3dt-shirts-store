<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WompiService
{
    protected string $baseUrl;
    protected string $publicKey;

    public function __construct()
    {
        $this->publicKey = config('wompi.public_key');
        // If the public key starts with pub_test, we use sandbox url
        $isTest = str_starts_with($this->publicKey, 'pub_test_');
        $this->baseUrl = $isTest 
            ? 'https://sandbox.wompi.co/v1' 
            : 'https://production.wompi.co/v1';
    }

    public function getTransaction(string $transactionId)
    {
        $response = Http::get("{$this->baseUrl}/transactions/{$transactionId}");

        if ($response->successful()) {
            return $response->json('data');
        }

        Log::error("Failed to fetch Wompi transaction {$transactionId}. Response: " . $response->body());
        return null;
    }
}
