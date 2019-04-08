<?php

namespace app\api\controller;

use think\Db;

require_once "./plugins/payment/wxapplet/lib/WxPay.Api.php";
require_once "./plugins/payment/wxapplet/WxPay.JsApiPay.php";
require_once "./plugins/payment/wxapplet/WxPay.Config.php";

class Wxapplet {

    // 微信jsapi 支付
	// 统一下单 unifiedOrder
    public function unifiedOrder(){
        $order_sn = I('order_sn');
        $openId = I('openid');

        /********* 判断订单信息 **************/
		$order = Db::name('order')->where('order_sn', $order_sn)->find();
		if(empty($order)) response_error('', '该订单不存在');
		if($order['paystatus'] == 1) response_error('', '该订单已支付');

		$total_amount = $order['price'];

    	//②、统一下单
        $input = new \WxPayUnifiedOrder();
        $input->SetBody("购买商品");
        $input->SetAttach("购买商品");
        $input->SetOut_trade_no($order_sn);
        $input->SetTotal_fee($order['price']*100);
        $input->SetTime_start(date("YmdHis"));
        $input->SetTime_expire(date("YmdHis", time() + 600));
        $input->SetGoods_tag("购买商品");
        $input->SetNotify_url("http://guoshu.staraise.com.cn/api/WxappletBuyGoodsCallback/exec");
        $input->SetTrade_type("JSAPI");
        $input->SetOpenid($openId);
        $input->SetSignType('MD5');
        $config = new \WxPayConfig();
        $order = \WxPayApi::unifiedOrder($config, $input);
p($order);
        $JsApiPay = new \JsApiPay();
        $jsApiParameters = $JsApiPay->GetJsApiParameters($order);
        echo $jsApiParameters;
    }
}