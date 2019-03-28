<?php

namespace app\api\controller;

use app\common\logic\GoodsLogic;
use app\common\logic\GoodsPromFactory;
use app\common\model\SpecGoodsPrice;
use think\Db;

class Goods extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	/**
	 * [goodslist 获取二级分类下的商品,分类页和搜索页]
	 * @return [type] [description]
	 */
	public function goodslist(){
		$cat_id = I('cat_id');
		$city_code = I('city_code');
		$keyword = I('keyword');
		$page = I('page', 1);

		$where = array(
			'city_code' => $city_code, // 城市
			'is_on_sale' => 1, // 上架中
			'prom_type' => 0, // 普通商品
		);
		$cat_id && $where['cat_id'] = $cat_id;
		$goods_name && $where['goods_name'] = ['like', $keyword];

		$goodslist = Db::name('goods')
			->where($where)
			->order('sort asc, goods_id desc')
			->field('goods_id, goods_name, subtitle, store_count, original_img, shop_price')
			->page($page)
			->limit(15)
			->select();

		response_success($goodslist);
	}

	/**
	 * [goodsInfo 商品详情]
	 * @return [type] [description]
	 */
	public function goodsInfo(){
		$user_id = I('user_id');

		$goodsLogic = new GoodsLogic();
        $goods_id = I('goods_id/d');
        $goodsModel = new \app\common\model\Goods();
        $goods = $goodsModel::get($goods_id);
        if(empty($goods) || ($goods['is_on_sale'] == 0) || ($goods['is_virtual']==1 && $goods['virtual_indate'] <= time())){
            response_error('', '此商品不存在或者已下架');
        }


        $goods['goods_images_list'] = M('GoodsImages')->where("goods_id", $goods_id)->select(); // 商品 图册
        // $goods_attribute = M('GoodsAttribute')->getField('attr_id,attr_name'); // 查询属性
        // $goods_attr_list = M('GoodsAttr')->where("goods_id", $goods_id)->select(); // 查询商品属性表
		// $filter_spec = $goodsLogic->get_spec($goods_id);
        // $spec_goods_price  = M('spec_goods_price')->where("goods_id", $goods_id)->getField("key,price,store_count,item_id"); // 规格 对应 价格 库存表
        // $this->assign('spec_goods_price', json_encode($spec_goods_price,true)); // 规格 对应 价格 库存表
        // $goods['commentStatistics'] = $goodsLogic->commentStatistics($goods_id);// 获取某个商品的评论统计
      	$goods['sale_num'] = M('order_goods')->where(['goods_id'=>$goods_id,'is_send'=>1])->sum('goods_num');
        //当前用户收藏
        // $collect = M('goods_collect')->where(array("goods_id"=>$goods_id ,"user_id"=>$user_id))->count();
        // $goods_collect_count = M('goods_collect')->where(array("goods_id"=>$goods_id))->count(); //商品收藏数
        $goods['goods_content'] = $goods['goods_content'] ? htmlspecialchars_decode($goods['goods_content']) : '';
        response_success($goods);
	}

	/**
	 * [recommendgoodslist 推荐的商品]
	 * @return [type] [description]
	 */
	public function recommendgoodslist(){
		// $cat_id = I('cat_id');
		$city_code = I('city_code');

		$where = array(
			'city_code' => $city_code, // 城市
			'is_on_sale' => 1, // 上架中
			'prom_type' => 0, // 普通商品
			'is_recommend' => 1
		);
		// $cat_id && $where['cat_id'] = $cat_id;

		$goodslist = Db::name('goods')
			->where($where)
			->order('sort asc, goods_id desc')
			->field('goods_id, goods_name, subtitle, store_count, original_img, shop_price')
			->page($page)
			->limit(15)
			->select();

		response_success($goodslist);
	}

}