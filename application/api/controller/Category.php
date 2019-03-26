<?php

namespace app\api\controller;

use think\Db;

class Category extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	/**
	 * [getAllCategory 获取所有分类 有层级关系]
	 * @return [type] [description]
	 */
	public function getAllCategory(){
		$list = Db::name('goods_category')
			->where('is_show', 1)
			->order('sort_order')
			->field('id, name, parent_id')
			->select();

		$data = array();
  		foreach ($list as $item) {
  			$data[$item['id']] = $item;
  		}

  		$data = $this->_tree($data);
  		response_success($data);

		response_success($data);
	}

	/**
	 * [getCateGoods 获取分类下的商品]
	 * @return [type] [description]
	 */
	public function getCatesGoods(){
		$cat_id = input('cat_id');
		$city_code = input('city_code');

		$subcatelist = Db::name('goods_category')
			->where('is_show', 1)
			->where('parent_id', $cat_id)
			->order('sort_order')
			->field('id, name')
			->select();

		if($subcatelist){
			$list = array();
			foreach ($subcatelist as $k => $item) {
				$goodslist = Db::name('goods')
					->where('cat_id', $item['id'])
					->where('city_code', $city_code)
					->where('is_on_sale', 1) 
					->where('prom_type', 0)  // 普通商品
					->order('sort asc, goods_id desc')
					->field('goods_id, goods_name, subtitle, store_count, original_img, shop_price')
					->select();
				if($goodslist) {
					$item['goodslist'] = $goodslist;
					$list[] = $item;
				}
			}
		}

		response_success($list);
	}


	/**
	 * [goodslist 获取二级分类下的商品]
	 * @return [type] [description]
	 */
	public function goodslist(){
		$cat_id = I('cat_id');
		$city_code = I('city_code');
		$page = I('page', 1);

		$goodslist = Db::name('goods')
			->where('cat_id', $cat_id)
			->where('city_code', $city_code)
			->where('is_on_sale', 1) 
			->where('prom_type', 0)  // 普通商品
			->order('sort asc, goods_id desc')
			->field('goods_id, goods_name, subtitle, store_count, original_img, shop_price')
			->page($page)
			->limit(15)
			->select();

		response_success($goodslist);
	}

	  /**
   	 * 生成目录树结构
   	 */
	  private function _tree($data){

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

}