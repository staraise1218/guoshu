<?php

namespace app\api\controller;

use app\common\logic\GoodsLogic;
use app\common\logic\GoodsPromFactory;
use app\common\model\SpecGoodsPrice;
use app\common\logic\CartLogic;
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
		$keyword && $where['goods_name'] = ['like', "%$keyword%"];

		$goodslist = Db::name('goods')
			->where($where)
			->order('sort asc, goods_id desc')
			->field('goods_id, goods_name, subtitle, tag, store_count, original_img, shop_price')
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
      	// 获取商品评论
      	$goods['goodsCommentList'] = $this->goodsComment($goods_id);
        //当前用户收藏
        // $collect = M('goods_collect')->where(array("goods_id"=>$goods_id ,"user_id"=>$user_id))->count();
        // $goods_collect_count = M('goods_collect')->where(array("goods_id"=>$goods_id))->count(); //商品收藏数
        $goods['goods_content'] = $goods['goods_content'] ? htmlspecialchars_decode($goods['goods_content']) : '';

        // 购物车商品数量
        $cartLogic = new CartLogic();
        $cartLogic->setUserId($user_id);
 		$goods['cart_num'] = $cartLogic->getUserCartGoodsTypeNum();//获取用户购物车商品总数
        response_success($goods);
	}

	// 获取商品的活动价格等信息
    public function activity(){
        $goods_id = input('goods_id/d');//商品id
        $item_id = input('item_id/d', 0);//规格id
        $goods_num = input('goods_num/d', 1);//欲购买的商品数量

        $Goods = new \app\common\model\Goods();
        $goods = $Goods::get($goods_id);
        $goodsPromFactory = new GoodsPromFactory();
        if ($goodsPromFactory->checkPromType($goods['prom_type'])) {
            //这里会自动更新商品活动状态，所以商品需要重新查询
            if($item_id){
                $specGoodsPrice = SpecGoodsPrice::get($item_id);
                $goodsPromLogic = $goodsPromFactory->makeModule($goods,$specGoodsPrice);
            }else{
                $goodsPromLogic = $goodsPromFactory->makeModule($goods,null);
            }
            if($goodsPromLogic->checkActivityIsAble()){
                $goods = $goodsPromLogic->getActivityGoodsInfo();
                $goods['activity_is_on'] = 1;
                response_success(array('activityInfo'=>$goods), '该商品参与活动');
            }else{
                if(!empty($goods['price_ladder'])){
                    $goodsLogic = new GoodsLogic();
                    $price_ladder = unserialize($goods['price_ladder']);
                    $goods->shop_price = $goodsLogic->getGoodsPriceByLadder($goods_num, $goods['shop_price'], $price_ladder);
                }
                $goods['activity_is_on'] = 0;
                response_success(array('activityInfo'=>$goods), '该商品未参与活动');
            }
        }
        if(!empty($goods['price_ladder'])){
            $goodsLogic = new GoodsLogic();
            $price_ladder = unserialize($goods['price_ladder']);
            $goods->shop_price = $goodsLogic->getGoodsPriceByLadder($goods_num, $goods['shop_price'], $price_ladder);
        }
        response_success(array('activityInfo'=>$goods), '该商品未参与活动');
    }


    /**
     * 商品评论ajax分页
     */
    public function goodsComment($goods_id){        
        $commentType = I('commentType','1'); // 1 全部 2好评 3 中评 4差评
        $where = ['is_show'=>1,'goods_id'=>$goods_id,'parent_id'=>0];
        if($commentType==5){
            $where['img'] = ['<>',''];
        }else{
        	$typeArr = array('1'=>'0,1,2,3,4,5','2'=>'4,5','3'=>'3','4'=>'0,1,2');
            $where['ceil((deliver_rank + goods_rank + service_rank) / 3)'] = ['in',$typeArr[$commentType]];
        }

       
        $list = M('Comment')->alias('c')
        	->join('__USERS__ u','u.user_id = c.user_id','LEFT')
        	->where($where)
        	->field('u.nickname, u.head_pic, c.content, ceil((deliver_rank + goods_rank + service_rank) / 3) as goods_rank, c.is_anonymous, c.img')
        	->limit(1)
        	->order("goods_rank desc")
        	->select();
        
        foreach($list as $k => $v){
            $list[$k]['img'] = $v['img'] ? unserialize($v['img']) : array(); // 晒单图片
            $replyList[$v['comment_id']] = M('Comment')->where(['is_show'=>1,'goods_id'=>$goods_id,'parent_id'=>$v['comment_id']])->order("add_time desc")->select();
        }
        return $list;     
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
			->field('goods_id, goods_name, subtitle, tag, store_count, original_img, shop_price, (sales_sum+virtual_num) as virtual_num')
			->page($page)
			->limit(15)
			->select();

		response_success($goodslist);
	}

	// 分享的商品和用户绑定关系
	public function bindShareGoods(){
		$user_id = I('user_id');
		$goods_id = I('goods_id');
		$share_userCode = I('share_userCode');

		// 获取分享者用户信息
		$shareUserInfo = Db::name('users')->where('userCode', $share_userCode)->find();
		if(empty($shareUserInfo) || $shareUserInfo['is_lock'] == 1) response_error('', '分享者不存在');
        if($shareUserInfo['user_id'] == ! $user_id) response_error('', '给自己分享无效');
        
		$data = array(
			'user_id' => $user_id,
			'goods_id' => $goods_id,
			'share_userCode' => $share_userCode,
			'share_user_id' => $shareUserInfo['user_id'],
		);

		// 判断重复记录
		if(Db::name('goods_share')->where($data)->count() > 0) response_success('', '操作成功');

		Db::name('goods_share')->insert($data);

		response_success('', '操作成功');
	}

}