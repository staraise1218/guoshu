<?php

namespace app\api\controller;

use app\common\logic\ShareGoodsLogic;
use think\Db;
/**
*
* example目录下为简单的支付样例，仅能用于搭建快速体验微信支付使用
* 样例的作用仅限于指导如何使用sdk，在安全上面仅做了简单处理， 复制使用样例代码时请慎重
* 请勿直接直接使用样例对外提供服务
* 
**/

require_once "./plugins/payment/wxapplet/lib/WxPay.Api.php";
require_once './plugins/payment/wxapplet/lib/WxPay.Notify.php';
require_once "./plugins/payment/wxapplet/WxPay.Config.php";
// require_once 'log.php';

class WxappletBuyGoodsCallback extends \WxPayNotify
{
	// 执行回调
	public function exec(){
		$param = $GLOBALS['HTTP_RAW_POST_DATA']; // file_get_contents('php://input');
		$data = "\r\n".var_export($param, true);
		file_put_contents('runtime/log/request.log', $data, FILE_APPEND);
		$config = new \WxPayConfig();
		// Log::DEBUG("begin notify");
		$this->Handle($config, false);
	}
	//查询订单
	public function Queryorder($transaction_id)
	{
		$input = new \WxPayOrderQuery();
		$input->SetTransaction_id($transaction_id);

		$config = new \WxPayConfig();
		$result = \WxPayApi::orderQuery($config, $input);
		// Log::DEBUG("query:" . json_encode($result));
		if(array_key_exists("return_code", $result)
			&& array_key_exists("result_code", $result)
			&& $result["return_code"] == "SUCCESS"
			&& $result["result_code"] == "SUCCESS")
		{
			return true;
		}
		return false;
	}

	/**
	*
	* 回包前的回调方法
	* 业务可以继承该方法，打印日志方便定位
	* @param string $xmlData 返回的xml参数
	*
	**/
	public function LogAfterProcess($xmlData)
	{
		// Log::DEBUG("call back， return xml:" . $xmlData);
		return;
	}
	
	//重写回调处理函数
	/**
	 * @param WxPayNotifyResults $data 回调解释出的参数
	 * @param WxPayConfigInterface $config
	 * @param string $msg 如果回调处理失败，可以将错误信息输出到该方法
	 * @return true回调出来完成不需要继续回调，false回调处理未完成需要继续回调
	 */
	public function NotifyProcess($objData, $config, &$msg)
	{
		$data = $objData->GetValues();

		//TODO 1、进行参数校验
		if(!array_key_exists("return_code", $data) 
			||(array_key_exists("return_code", $data) && $data['return_code'] != "SUCCESS")) {
			//TODO失败,不是支付成功的通知
			//如果有需要可以做失败时候的一些清理处理，并且做一些监控
			$msg = "异常异常";
			return false;
		}
		if(!array_key_exists("transaction_id", $data)){
			$msg = "输入参数不正确";
			return false;
		}
file_put_contents('runtime/log/request.log', '1---'.var_export($data, true), FILE_APPEND);
		//TODO 2、进行签名验证
		try {
			$checkResult = $objData->CheckSign($config);
			if($checkResult == false){
				//签名错误
				// Log::ERROR("签名错误...");
				$msg = "签名错误";
				return false;
			}
		} catch(Exception $e) {
			// Log::ERROR(json_encode($e));
		}

		//TODO 3、处理业务逻辑
		// Log::DEBUG("call back:" . json_encode($data));
		
		$order_sn  = $data['out_trade_no'];
file_put_contents('runtime/log/request.log', '2---'.$order_sn, FILE_APPEND);
        $order = Db::name('order')->where('order_sn', $order_sn)->find();
		if(empty($order) || $order['pay_status'] == 1) return true;
		
		// 回调后的业务流程
		$this->operation($order_sn);
		return true;
		
		
		//查询订单，判断订单真实性
		/*if(!$this->Queryorder($data["transaction_id"])){
			$msg = "订单查询失败";
			return false;
		}
		return true;*/
	}

	public function testpay(){
		$order_sn = I('order_sn');
		$this->operation($order_sn);

		response_success('', '支付成功');
	}

	public function operation($order_sn){
		// 启动事务
		Db::startTrans();
		try{
			// 更改订单状态
			M('order')->where('order_sn', $order_sn)->update(array('pay_status'=>1, 'pay_time'=>time()));

			// 分享商品得佣金
			$ShareGoodsLogic = new ShareGoodsLogic();
			$ShareGoodsLogic->shareMoney($order_sn);
		   
		    // 提交事务
		    Db::commit();

		} catch (\Exception $e) {
		    // 回滚事务
		    Db::rollback();
		}
	}
}
