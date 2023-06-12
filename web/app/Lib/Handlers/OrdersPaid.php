<?php

declare(strict_types=1);

namespace App\Lib\Handlers;

use Illuminate\Support\Facades\Log;
use Shopify\Webhooks\Handler;
use App\Models\Session;
use App\Lib\KeyManager;

class OrdersPaid implements Handler
{
    public function handle(string $topic, string $shop, array $body): void
    {
        Log::debug("New order from $shop   ");

        $store = Session::where('shop', $shop)->first();

        if (is_object($store) && isset($store->id)) {
            file_put_contents(dirname(__FILE__).'/thebody_of_request.txt', print_r($body, true));

            $orderdata = $body;

            $apidata = array('mngKey'=>$store->mngKey, 'order'=>$orderdata, 'orderId'=>$orderdata['id']);
            $apidata = json_encode($apidata);
            $response = KeyManager::makeRequest($apidata, true);
        }
    }
}
