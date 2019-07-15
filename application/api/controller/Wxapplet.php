<?php

namespace app\api\controller;

use think\Db;

require_once "./plugins/payment/wxapplet/lib/WxPay.Api.php";
require_once "./plugins/payment/wxapplet/WxPay.JsApiPay.php";
require_once "./plugins/payment/wxapplet/WxPay.Config.php";

class Wxapplet  extends Base {

    public function __construct(){
        // 设置所有方法的默认请求方式
        $this->method = 'post';

        parent::__construct();
    }


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
        $input->SetOut_trade_no($order_sn);
        $input->SetTotal_fee($total_amount*100);
        $input->SetTime_start(date("YmdHis"));
        $input->SetTime_expire(date("YmdHis", time() + 600));
        $input->SetGoods_tag("购买商品");
        $input->SetNotify_url("https://app.zhuoyumall.com/api/WxappletBuyGoodsCallback/exec");
        $input->SetTrade_type("JSAPI");
        $input->SetOpenid($openId);
        $input->SetSignType('MD5');
        $config = new \WxPayConfig();
        $order = \WxPayApi::unifiedOrder($config, $input);

        // 如果有错
        if($order['return_code'] == 'FAIL'){
            response_error('', $order['return_msg']);
        }
        if($order['result_code'] == 'FAIL'){
            response_error('', $order['err_code_des']);
        }
        // 正确获取数据进行下一步
        $JsApiPay = new \JsApiPay();
        $jsApiParameters = $JsApiPay->GetJsApiParameters($order);
        response_success(json_decode($jsApiParameters, true));
    }
}