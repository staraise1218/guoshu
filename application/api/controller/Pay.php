<?php

namespace app\api\controller;
use think\Db;
use app\api\logic\AlipayLogic;
use app\api\logic\WxpayLogic;
use app\common\logic\ShareGoodsLogic;

class Pay extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}


	// 选择支付方式去支付
	public function topay(){
		$order_sn = I('order_sn');
		$paymentMethod = I('paymentMethod');
		$payPwd = I('payPwd');

		/********* 判断订单信息 **************/
		$order = Db::name('order')->where('order_sn', $order_sn)->find();
		if(empty($order)) response_error('', '该订单不存在');
		if($order['pay_status'] == 1) response_error('', '该订单已支付');

		$order_amount = $order['order_amount'];

		/************** 获取订单签名字符串 **************/
		if($paymentMethod == 'alipay'){
			$notify_url = 'https://app.zhuoyumall.com:444/index.php/api/pay/alipayCallback';
			$AlipayLogic = new AlipayLogic($notify_url);
			$orderStr = $AlipayLogic->generateOrderStr($order_sn, $order_amount, '购买商品', '购买商品');
			return $orderStr;
		}

		if($paymentMethod == 'wxpay'){
			$WxpayLogic = new WxpayLogic();
			$WxpayLogic->notify_url = 'https://app.zhuoyumall.com:444/index.php/api/pay/wxpayCallback';
			$param = $WxpayLogic->getPrepayId($order_sn, $order_amount, '购买商品');
			response_success($param);
		}
		// 余额支付
		if($paymentMethod == 'money'){
			$user = Db::name('users')->where('user_id', $order['user_id'])->find();
			// 判断支付密码是否正确
			if (encrypt($payPwd) !== $user['paypwd']) response_error('', '支付密码错误');
			if(empty($user) || $user['user_money'] < $order['order_amount']) response_error('', '余额不足');
			// 判断余额日志和表中记录金额是否对应
			$sum_money = Db::name('account_log')
				->where('user_id', $order['user_id'])
				->where('user_money', '<>', 0)
				->sum('user_money');
			if($sum_money != $user['user_money']) response_error('', '余额异常');
			// 判断余额日志是否异常 单笔 不能大于5元
			$count = Db::name('account_log')->where('user_money', 'gt', 5)->count();
			if($count) response_error('', '余额异常');

			// 启动事务
			Db::startTrans();
			try{
				// 更改订单状态
				$updatedata = array(
					'pay_code' => 'money',
					'pay_name' => '零钱支付',
					'pay_status'=>1 ,
					'pay_time'=>time(),
					'real_amount' => $order_amount,
				);
				$resut = Db::name('order')->where('order_sn', $order_sn)->update($updatedata);
				// file_put_contents('runtime/log/request.log', '23----'.var_export($resut, true), FILE_APPEND);
				// 支付成功减库存
				$order = Db::name('order')->where('order_sn', $order_sn)->find();
				minus_stock($order);//下单减库存
				// 分享商品得佣金
				$ShareGoodsLogic = new ShareGoodsLogic();
				$ShareGoodsLogic->shareMoney($order_sn);

			    // 提交事务
			    Db::commit();
			    response_success('', '支付成功');

			} catch (\Exception $e) {
			    // 回滚事务
			    Db::rollback();
			    response_error('', '支付失败');
			}

		}
	}

	// 购买金币后的支付宝回调接口
	public function alipayCallback(){
		$order_sn = input('post.out_trade_no');
		$trade_status = input('post.trade_status');

		$order = Db::name('order')->where('order_sn', $order_sn)->find();
		if(empty($order)) goto finish;
		if($order['paystatus'] == 1) goto finish;

		// 回调后的业务流程
		if($trade_status == 'TRADE_SUCCESS'){
			$this->operation($order_sn);
		}

		finish:
		echo 'success';
	}
	// 购买金币后的微信回调接口
	public function wxpayCallback(){
		$WxpayLogic = new WxpayLogic();
		$result = $WxpayLogic->callback();

		if($result['return_code'] == 'SUCCESS' && $result['result_code'] == 'SUCCESS' ){
            
            $order_sn  = $result['out_trade_no'];

            $order = Db::name('order')->where('order_sn', $order_sn)->find();
			if(empty($order)) goto finish;
			if($order['paystatus'] == 1) goto finish;

			// 回调后的业务流程
			$this->operation($order_sn);
            
        }

         
		finish:
		echo '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
        exit();     
	}

	public function operation($order_sn){
		// 启动事务
		Db::startTrans();
		try{
			
			// 更改订单状态
			$updatedata = array(
				'pay_status'=>1,
				'pay_time'=>time()
			);
			M('order')->where('order_sn', $order_sn)->update($updatedata);
		   

		    // 提交事务
		    Db::commit();

		} catch (\Exception $e) {
		    // 回滚事务
		    Db::rollback();
		}
	}

	private function generateOrderno(){
		$order_sn = date('YmdHis').mt_rand(1000, 9999);

		$count = Db::name('order')->where('order_sn', $order_sn)->count();

		if($count) $this->generateOrderno();
		return $order_sn;
	}
}