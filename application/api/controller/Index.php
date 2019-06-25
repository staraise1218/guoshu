<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use app\api\logic\GeographyLogic;
use app\common\logic\ShareGoodsLogic;

class Index extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function index(){
		$user_id = I('user_id');
        $city_code = I('city_code');

		// 获取所有的广告图片
		$bannerList = $adv = $shareGoods = array();
        $adList = Db::name('ad')
            ->where('enabled', 1)
            ->where('pid', 'in', array(1, 2, 4))
            ->field('ad_name, ad_link, ad_code, pid, city_code')
            ->order('orderby asc, ad_id asc')
            ->select();
        if($adList){
        	foreach ($adList as $k => $item) {
        		// 首页banner
        		($item['pid'] == 1 && $item['city_code'] == $city_code) && $bannerList[] = $item;
        		// 首页广告位图片：团购入口，邀请好友得红包入口
        		($item['pid'] == 2 ) && $adv[] = $item;
        		// 分享商品
        		($item['pid'] == 4 ) && $shareGoods[] = $item;
        	}
        }

        // 获取分类
        $categoryList = Db::name('goods_category')
			->where('is_show', 1)
			->where('parent_id', 0)
			->order('sort_order')
			->field('id, name, icon, image, index_image')
			->select();


		// 秒杀时间段
        // $time_space = flash_sale_time_space();
       
        // 团购列表
        $group_by_where = array(
            'gb.start_time'=>array('lt', time()),
            'gb.end_time'=>array('gt', time()),
            'is_end' => 0,
            'g.is_on_sale'=>1,
            'g.city_code'=>$city_code,
        );

        $grouplist = Db::name('group_buy')->alias('gb')
            ->join('goods g', 'gb.goods_id=g.goods_id')
            ->where($group_by_where)
            ->limit(24)
            ->order('id desc')
            ->field('gb.goods_id, gb.title, gb.price, gb.goods_price, (gb.virtual_num+gb.buy_num) as virtual_num, g.goods_name, g.subtitle, g.tag, g.original_img, g.store_count, market_price')
            ->select();

        // 首页下方分类商品
        $topCateGoods = array();
        foreach ($categoryList as $item) {
			$cat_id_arr = getCatGrandson ($item['id']);
			$where = array(
				'city_code' => $city_code, // 城市
				'is_on_sale' => 1, // 上架中
				'prom_type' => 0, // 普通商品
				'cat_id' => array('in', $cat_id_arr),
			);

			$goodslist = Db::name('goods')
				->where($where)
				->order('sort asc, goods_id desc')
				->field('goods_id, goods_name, subtitle, tag, store_count, original_img, shop_price, market_price, (sales_sum+virtual_num) as virtual_num')
				->limit(24)
				->select();
			$topCateGoods[] = array(
				'id' => $item['id'],
				'cat_name' => $item['name'],
				'index_image' => $item['index_image'],
				'goodslist' => $goodslist,
			);
        }




        $result['bannerList'] = $bannerList;
        $result['categoryList'] = $categoryList;
        $result['grouplist'] = $grouplist;
        $result['adv'] = $adv;
        $result['shareGoods'] = $shareGoods;
        $result['topCateGoods'] = $topCateGoods;
       	// $result['time_space'] = $time_space;
		response_success($result);
	}

	/**
	 * [getCateGoods 获取顶级分类下的子分类带商品列表]
	 * @return [type] [description]
	 */
	public function getTopCateGoods(){
		$cat_id = input('cat_id');
		$city_code = input('city_code');

		$subcatelist = Db::name('goods_category')
			->where('is_show', 1)
			->where('parent_id', $cat_id)
			->order('sort_order')
			->field('id, name, image')
			->select();

		$list = array();
		if($subcatelist){
			$list = array();
			foreach ($subcatelist as $k => $item) {
				$goodslist = Db::name('goods')
					->where('cat_id', $item['id'])
					->where('city_code', $city_code)
					->where('is_on_sale', 1) 
					->where('prom_type', 0)  // 普通商品
					->order('sort asc, goods_id desc')
					->field('goods_id, goods_name, subtitle, tag, store_count, original_img, shop_price,market_price, (sales_sum+virtual_num) as virtual_num')
					->select();
				if($goodslist) {
					$item['goodslist'] = $goodslist;
					$list[] = $item;
				}
			}
		}

		response_success($list);
	}

	// 首页通过分类获取商品列表
	public function getGoodsByCat(){
		$cat_id = I('cat_id');
		$city_code = I('city_code');
		$page = I('page', 1);

		$category = Db::name('goods_category')
			->where('is_show', 1)
			->where('id', $cat_id)
			->field('id, name, image')
			->select();
    	
    	$where = array(
			'city_code' => $city_code, // 城市
			'is_on_sale' => 1, // 上架中
			'prom_type' => 0, // 普通商品
		);

		$cat_id_arr = getCatGrandson ($cat_id);
		$where['cat_id'] = array('in', $cat_id_arr);

		$goodslist = Db::name('goods')
			->where($where)
			->order('sort asc, goods_id desc')
			->field('goods_id, goods_name, subtitle, store_count, original_img, shop_price, market_price, tag, (sales_sum+virtual_num) as virtual_num')
			->page($page)
			->limit(15)
			->select();

		$result['category'] = $category;
		$result['goodslist'] = $goodslist;
		response_success($result);
	}

	// 获取最近的城市（配送中心)
	public function getNearCity(){
		$user_longitude = input('post.longitude');
		$user_latitude = input('post.latitude');		

		$field = 'id, name, code';
		$field .= ", ROUND(6378.138*2*ASIN(SQRT(POW(SIN(($user_latitude*PI()/180-latitude*PI()/180)/2),2)+COS($user_latitude*PI()/180)*COS(latitude*PI()/180)*POW(SIN(($user_longitude*PI()/180-longitude*PI()/180)/2),2))), 2) AS distance";
		$list = Db::name('region')
			->where('level', 2)
			->field($field)
			->order('distance asc')
			->select();

		$info = array_shift($list);
		response_success($info);

	}

    // 获取配送城市
    public function getDeliveryCity(){
        $list = M('region')->field('id, name, code, parent_id')->cache(true)->select();

        $data = array();
        foreach ($list as $region) {
          $data[$region['id']] = $region;
        }

        $data = $this->_treeFortDeliveryCity($data);
        response_success($data);
    }
    /**
     * 生成目录树结构
     */
    private function _treeFortDeliveryCity($data){

      $tree = array();
      foreach ($data as $item) {
               if(isset($data[$item['parent_id']])){
                  $data[$item['parent_id']]['sub'][] = &$data[$item['id']];
               } else {
                  $tree[] = &$data[$item['id']];
               }
      }

      return $tree;
    }

	function test(){
		$order_sn = '201906041533321855';
		// 分享商品得佣金
			$ShareGoodsLogic = new ShareGoodsLogic();
			$ShareGoodsLogic->shareMoney($order_sn);
	}
}