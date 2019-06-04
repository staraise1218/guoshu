<?php

namespace app\api\controller;
use think\Db;

class Task extends Base {
    public function __construct(){
        // 设置所有方法的默认请求方式
        $this->method = 'GET';

        parent::__construct();
    }

    // 团购商品结束状态更新
    public function checkGroup(){
        $list = Db::name('group_buy')
            ->where('end_time', ['<=', time()])
            ->field('id, goods_id')
            ->select();

        if(empty($list)) return;
        
        $group_ids = array_column($list, 'id');
        $goods_ids = array_column($list, 'goods_id');

        Db::name('group_buy')->where('id', array('IN', $group_ids))->setField('is_end', 1);
        Db::name('goods')->where('goods_id', array('IN', $goods_ids))->update(array('prom_type'=>0, 'prom_id'=>0));
    }

    // 秒杀商品结束状态更新
    public function checkFlashSale(){
        $list = Db::name('flash_sale')
            ->where('end_time', ['<=', time()])
            ->field('id, goods_id')
            ->select();

        if(empty($list)) return;

        $group_ids = array_column($list, 'id');
        $goods_ids = array_column($list, 'goods_id');
        Db::name('flash_sale')->where('id', array('IN', $group_ids))->setField('is_end', 1);
        Db::name('goods')->where('goods_id', array('IN', $goods_ids))->update(array('prom_type'=>0, 'prom_id'=>0));
    }

    // 次日凌晨之前的未支付订单取消
    public function checkOrder(){

        $time = time();
        $list = Db::name('order_goods')->alias('og')
            ->join('order o', 'og.order_id = o.order_id')
            ->where('o.pay_status', 0)
            ->where('o.order_status', array('IN', array(0, 1)))
            ->where('o.add_time', array('<', $time))
            ->field('og.order_id, og.goods_id, og.goods_num')
            ->select();

        if(empty($list)) return;

        // 启动事务
        Db::startTrans();
        try{
            // 取消订单
            $order_ids = array_unique(array_column($list, 'order_id'));
            Db::name('order')->where('order_id', array('IN', $order_ids))->setField('order_status', 5);

            /*foreach ($list as $item) {
                // 商品库存返回
                Db::name('goods')->where('goods_id', $item['goods_id'])->setInc('store_count', $item['goods_num']);
            }*/

            // 提交事务
            Db::commit();

        } catch (\Exception $e) {
            // 回滚事务
            Db::rollback();
        }
    }
}