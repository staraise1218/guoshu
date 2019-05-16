<?php
/**
 * 团购、秒杀
 */
namespace app\api\controller;

use app\common\logic\GoodsLogic;
use app\common\logic\GoodsActivityLogic;
use app\common\model\FlashSale;
use app\common\model\GroupBuy;
use think\Db;
use think\Page;
use app\common\logic\ActivityLogic;

class Activity extends Base {
    public function __construct(){
        // 设置所有方法的默认请求方式
        $this->method = 'POST';

        parent::__construct();
    }

    /**
     * 团购活动列表
     */
    public function index()
    {
        $user_id = I('user_id');
        $city_code = I('city_code');
        $page = I('page',1);

        // 获取团购页banner
        $bannerList = Db::name('ad')
            ->where('pid', 3)
            ->where('enabled', 1)
            ->field('ad_name, ad_link, ad_code')
            ->order('orderby desc, ad_id desc')
            ->select();

        // 秒杀时间段
        // $time_space = flash_sale_time_space();
        
        // 团购列表
        $group_by_where = array(
            'gb.start_time'=>array('lt',time()),
            'gb.end_time'=>array('gt',time()),
            'gb.is_end' => 0,
            'g.is_on_sale'=>1,
            'g.city_code'=>$city_code,
        );

        $GroupBuy = new GroupBuy();
        $grouplist = $GroupBuy
            ->alias('gb')
            ->join('__GOODS__ g', 'gb.goods_id=g.goods_id AND g.prom_type=2')
            ->where($group_by_where)
            ->field('gb.goods_id, gb.title, gb.price, gb.goods_price, (gb.virtual_num+gb.buy_num) as virtual_num, g.goods_name, g.subtitle, g.tag, g.original_img, g.store_count')
            ->page($page)
            ->limit(15)
            ->order('id desc')
            ->select();

       
       $result['bannerList'] = $bannerList;
       // $result['time_space'] = $time_space;
       $result['grouplist'] = $grouplist;
       response_success($result);
    }


    /**
     * 秒杀活动列表
     */
    public function flash_sale_list()
    {
        $user_id = I('user_id');
        $city_code = I('city_code');
        $page = I('page', 1);
        // $start_time = I('start_time');
        // $end_time = I('end_time');
        $type = I('type');

        // 下期预告
        if($type == 'next'){
            $start_time = strtotime(date('Y-m-d', strtotime('+1 day')));
            $end_time = strtotime(date('Y-m-d', strtotime('+2 day')));
        } else {
            $start_time = time();
            $end_time = strtotime(date('Y-m-d', strtotime('+1 day')));
        }

        $where = array(
            'fl.start_time'=>array('elt',$start_time),
            'fl.end_time'=>array('elt',$end_time),
            'fl.is_end' => 0,
            'g.is_on_sale'=>1
        );
        $FlashSale = new FlashSale();
        $list = $FlashSale->alias('fl')
            ->join('__GOODS__ g', 'g.goods_id = fl.goods_id')
            ->with(['goods'])
            ->field('*,100*(FORMAT(buy_num/goods_num,2)) as percent')
            ->where($where)
            ->select();
        
        
        response_success($list);
    }

    // 获取团购商品列表
    public function groupList(){
        $city_code = I('city_code');
        $page = I('page',1);

         // 团购列表
        $group_by_where = array(
            'gb.start_time'=>array('lt',time()),
            'gb.end_time'=>array('gt',time()),
            'gb.is_end' => 0,
            'g.is_on_sale'=>1,
            'g.city_code'=>$city_code,
        );

        $GroupBuy = new GroupBuy();
        $grouplist = $GroupBuy
            ->alias('gb')
            ->join('__GOODS__ g', 'gb.goods_id=g.goods_id AND g.prom_type=2')
            ->where($group_by_where)
            ->page($page)
            ->limit(15)
            ->order('id desc')
            ->select();

        response_success($grouplist);
    }

}