<?php

declare(strict_types=1);

namespace App\Lib;

use App\Exceptions\ShopifyProductCreatorException;
use Shopify\Auth\Session;
use Shopify\Clients\Graphql;
use DB;

class KeyManager
{
    public static function fetchShopKey(Session $session)
    {
        $shop = \App\Models\Session::where('shop', $session->getShop())->first();
        if(is_null($shop->mngKey)){
            return "";
        }
        return $shop->mngKey;
    }


    public static function saveAPIKey($session, $key)
    {
        $shop = \App\Models\Session::where('shop', $session->getShop())->first();

       
        $shop->mngKey = $key;

        $shop->save();

        $build = http_build_query(array('mngKey'=>$key, 'API_KEY'=>$shop->access_token));
        $resp = self::makeRequest($build);
        return $resp;
    }

    public static function makeRequest($data, $type = 'token')
    {
        $headers = array('Authorization: jPTCP5rckfSLl1unia121saJKOpc2QAi8QU9G1aWx');
        if ($type =='token') {
            $url = 'https://svc-sp.nubble.cloud/token';
            $headers[] = 'Content-type:application/x-www-form-urlencoded';
        } elseif ($type =='order') {
            $url = 'https://svc-sp.nubble.cloud/order';
            $headers[] = 'Content-type:application/json';
            $headers[] = 'Accept:application/json';
        }

        //$url = 'http://dev.lightcodes.net/shopify/api.php';


        if ($url =='') {
            return array('status'=>'NK', 'message'=>'Invalid custom app api url');
        }
        $curl = curl_init($url);


        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_MAXREDIRS, 10);
        curl_setopt($curl, CURLOPT_TIMEOUT, 0);
        curl_setopt($curl, CURLOPT_ENCODING, '');
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);


        try {
            $response = curl_exec($curl);
            curl_close($curl);
            return array('status'=>'OK', 'message'=>'request sent', 'payload'=>$response);
        } catch (Exception $e) {
            return $e->getMessage();
        }

        return false;
    }
}
