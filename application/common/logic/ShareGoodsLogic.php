<?php


namespace app\common\logic;

use app\common\logic\MessageLogic;
use think\Db;
/**
 * 购物车 逻辑定义
 * Class CatsLogic
 * @package Home\Logic
 */
class ShareGoodsLogic
{

	// 给分享商品的用户分佣金
	public function shareMoney($order_sn){
		// 获取订单信息
		$order = Db::name('order')->where('order_sn', $order_sn)->field('order_id, user_id, pay_status')->find();
		if(empty($order) || $order['pay_status'] = 0) return false;

		// 获取订单商品
		$orderGoods = Db::name('order_goods')->alias('og')
			->join('goods g', 'og.goods_id=g.goods_id')
			->where('og.order_id', $order['order_id'])
			->field('g.goods_id, g.goods_name, g.shop_price, g.share_ratio')
			->select();

		if(empty($orderGoods)) return false;
		// 重组数组，方便下面使用
		$orderGoodsList = array();
		foreach ($orderGoods as $goods) {
			if($goods['share_ratio'] > 0 && $goods['share_ratio'] < 1)
				$orderGoodsList[$goods['goods_id']] = $goods;
		}

		// 获取和该订单商品相关的分享信息
		$goodsIds = array_column($orderGoodsList, 'goods_id');
		$goodsShareList = Db::name('goods_share')->alias('gs')
			->join('goods g', 'gs.goods_id=g.goods_id')
			->where('gs.user_id', $order['user_id'])
			->where('gs.goods_id', array('IN', $goodsIds))
			->where('gs.is_used', 0)
			->field('gs.id, g.goods_id, g.goods_name, g.shop_price, g.share_ratio')
			->select();

		if(empty($goodsShareList)) return false;

		foreach ($goodsShareList as $item) {
			$money = number_format($item['shop_price'] * $item['share_ratio'], 2); // 佣金
			// 修改分享记录状态为已使用|
			$updatedata = array(
				'is_used' => 1,
				'order_id' => $order['order_id'],
				'order_sn' => $order_sn,
				'money' => $money,
			);
			DB::name('goods_share')->where('id', $item['id'])->update($updatedata);
			// 给分享者发放佣金
			$desc = '分享商品得佣金';
			accountLog($order['user_id'], $money, 0, $desc, 0, $order['order_id'], $order['order_sn'], 4);

			// 发送站内信
			$MessageLogic = new MessageLogic();
			$message = '您分享的商品《'.$item['goods_name'].'》获得了佣金。';
			$MessageLogic->add($order['user_id'], $message);
		}
	}
}