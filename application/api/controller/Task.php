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

        if(empty($list)) return false;
        
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

        if(empty($list)) return false;
        
p($goods_ids, $goods_ids);
        $group_ids = array_column($list, 'id');
        $goods_ids = array_column($list, 'goods_id');
        Db::name('group_buy')->where('id', array('IN', $group_ids))->setField('is_end', 1);
        Db::name('goods')->where('goods_id', array('IN', $goods_ids))->update(array('prom_type'=>0, 'prom_id'=>0));
    }
}