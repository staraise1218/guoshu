<?php

namespace app\api\controller;
use think\Db;
use app\api\logic\WxpayLogic;

class Wxapplet extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}


	// 选择支付方式去支付
	public function topay(){
		$order_sn = I('order_sn');
		$paymentMethod = I('paymentMethod');

		/********* 判断订单信息 **************/
		$order = Db::name('order')->where('order_sn', $order_sn)->find();
		if(empty($order)) response_error('', '该订单不存在');
		if($order['paystatus'] == 1) response_error('', '该订单已支付');

		$total_amount = $order['price'];

		/************** 获取订单签名字符串 **************/
		if($paymentMethod == 'alipay'){
			$notify_url = 'http://guoshu.staraise.com.cn/index.php/api/goldcoin/alipayCallback';
			$AlipayLogic = new AlipayLogic($notify_url);
			$orderStr = $AlipayLogic->generateOrderStr($order_sn, $total_amount, '购买商品', '购买商品');
			return $orderStr;
		}

		if($paymentMethod == 'wxpay'){
			$WxpayLogic = new WxpayLogic();
			$WxpayLogic->notify_url = 'http://guoshu.staraise.com.cn/index.php/api/goldcoin/wxpayCallback';
			$param = $WxpayLogic->getPrepayId($order_sn, $total_amount, '购买商品');
			response_success($param);
		}
		// 余额支付
		if($paymentMethod == 'money'){
			
		}
	}

	public function operation($order_sn){
		// 启动事务
		Db::startTrans();
		try{
			
			// 更改订单状态
			M('order')->where('order_sn', $order_sn)->update(array('paystatus'=>1, 'paytime'=>time()));
		   

		    // 提交事务
		    Db::commit();

		} catch (\Exception $e) {
		    // 回滚事务
		    Db::rollback();
		}
	}
}