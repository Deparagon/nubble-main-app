<?php

declare(strict_types=1);

namespace App\Lib\Handlers;

use Illuminate\Support\Facades\Log;
use Shopify\Webhooks\Handler;
use App\Models\Session;

class ProductUpdate implements Handler
{
    public function handle(string $topic, string $shop, array $body): void
    {
        Log::debug("Product update  was in shop $shop ");
    }
}
