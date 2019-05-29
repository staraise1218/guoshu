<?php

namespace app\api\controller; 


use app\common\logic\CartLogic;
use app\common\logic\Integral;
use app\common\logic\Pay;
use app\common\logic\PlaceOrder;
use app\common\logic\UserAddressLogic;
use app\common\logic\GoodsActivityLogic;
use app\common\logic\CouponLogic;
use app\common\logic\RedpackLogic;
use app\common\logic\OrderLogic;
// use app\common\logic\PickupLogic;
use app\common\model\SpecGoodsPrice;
use app\common\model\Goods;
use app\common\util\TpshopException;
use app\common\logic\GeographyLogic;
use think\Db;

class Cart extends Base {

    public function __construct(){
        // 设置所有方法的默认请求方式
        $this->method = 'POST';

        parent::__construct();
    }

    public function index(){
        $user_id = I('user_id');
        $city_code = I('city_code');

        $cartLogic = new CartLogic();
        $cartLogic->setUserId($user_id);
        $cartLogic->setCityCode($city_code);

        $cartList = $cartLogic->getCartList();//用户购物车
        $userCartGoodsTypeNum = $cartLogic->getUserCartGoodsNum();//获取用户购物车商品总数

        response_success($cartList);
    }

    /**
     * 更新购物车，并返回计算结果
     * cart [{"id":2,"goods_num":2,"selected":1}]
     */
    public function AsyncUpdateCart()
    {
        $user_id = I('user_id');
        $cart = input('cart');
        $cart = json_decode(html_entity_decode($cart), true);

        $cartLogic = new CartLogic();
        $cartLogic->setUserId($user_id);

        $result = $cartLogic->AsyncUpdateCart($cart);

        response_success($result);
    }

    /**
     *  购物车加减
     *  cart:[{"id":2,"goods_num":2,"selected":1}]
     */
    public function changeNum(){
         // p(json_encode(array('id'=>2, 'goods_num'=>2,'selected'=>1)));
        $user_id = I('user_id');
        $cart = input('cart');
        $cart = json_decode(html_entity_decode($cart), true);
        if (empty($cart)) response_error('', '请选择要更改的商品');

        $cartLogic = new CartLogic();
        $cartLogic->setUserId($user_id);
        $result = $cartLogic->changeNum($cart['id'],$cart['goods_num']);
        if($result['status'] == 0) response_error('', $result['msg']);

        response_success('', '修改成功');
    }

    /**
     * 删除购物车商品
     */
    public function delete(){
        $user_id = I('user_id');
        $cart_ids = input('cart_ids');
        $cart_ids = json_decode(html_entity_decode($cart_ids), true);

        $cartLogic = new CartLogic();
        $cartLogic->setUserId($user_id);
        $result = $cartLogic->delete($cart_ids);

        if($result !== false){
            response_success('', '删除成功');
        }else{
            response_error('', '删除失败');
        }
    }

    /**
     * 购物车优惠券领取列表
     */
    public function getStoreCoupon()
    {
        $goods_ids = input('goods_ids/a', []);
        $goods_category_ids = input('goods_category_ids/a', []);
        if (empty($goods_ids) && empty($goods_category_ids)) {
            $this->ajaxReturn(['status' => 0, 'msg' => '获取失败', 'result' => '']);
        }
        $CouponLogic = new CouponLogic();
        $newStoreCoupon = $CouponLogic->getStoreGoodsCoupon($goods_ids, $goods_category_ids);
        if ($newStoreCoupon) {
            $user_coupon = Db::name('coupon_list')->where('uid', $this->user_id)->getField('cid', true);
            foreach ($newStoreCoupon as $key => $val) {
                if (in_array($newStoreCoupon[$key]['id'], $user_coupon)) {
                    $newStoreCoupon[$key]['is_get'] = 1;//已领取
                } else {
                    $newStoreCoupon[$key]['is_get'] = 0;//未领取
                }
            }
        }
        $this->ajaxReturn(['status' => 1, 'msg' => '获取成功', 'result' => $newStoreCoupon]);
    }

    /**
     * ajax 将商品加入购物车
     */
    function addCart()
    {
        $user_id = I('user_id/d');
        $goods_id = I("goods_id/d"); // 商品id
        $goods_num = I("goods_num/d");// 商品数量
        $item_id = I("item_id/d", 0); // 商品规格id

        if(empty($goods_id)){
            response_success('请选择要购买的商品');
        }
        if(empty($goods_num)){
            response_success('购买商品数量不能为0');
        }
        if($goods_num > 200){
            response_success('购买商品数量不能大于200');
        }

        $cartLogic = new CartLogic();
        $cartLogic->setUserId($user_id);
        $cartLogic->setGoodsModel($goods_id);
        if($item_id){
            $cartLogic->setSpecGoodsPriceModel($item_id);
        }
        $cartLogic->setGoodsBuyNum($goods_num);
        $result = $cartLogic->addGoodsToCart();

        if($result['status'] == 1){
            response_success(array('total_num'=>$result['result']), '添加购物成功');
        }
        response_error('', $result['msg']);
    }

    /**
     * 购物车第二步确定页面
     */
    public function cart2(){
        $user_id = I('user_id');
        $action = input("action"); // 行为

        $goods_id = input("goods_id/d"); // 商品id (立即购买时用)
        $goods_num = input("goods_num/d");// 商品数量(立即购买时用)
        $item_id = input("item_id/d", 0); // 商品规格id(立即购买时用)

        $address_id = input('address_id/d'); // 收货地址

        // 收货地址
        $address = $this->getAddress($user_id);

        $cartLogic = new CartLogic();
        $cartLogic->setUserId($user_id);
        //立即购买
        if($action == 'buy_now'){
            $cartLogic->setGoodsModel($goods_id);
            $cartLogic->setSpecGoodsPriceModel($item_id);
            $cartLogic->setGoodsBuyNum($goods_num);
            $buyGoods = [];
            try{
                $buyGoods = $cartLogic->buyNow();
            }catch (TpshopException $t){
                $error = $t->getErrorArr();
                response_error('', $error['msg']);
            }
            $cartList['cartList'][0] = $buyGoods;
            $cartGoodsTotalNum = $goods_num;
        }else{
            if ($cartLogic->getUserCartOrderCount() == 0) response_error('', '您的购物车没有选中的商品');
            $cartList['cartList'] = $cartLogic->getCartList(1); // 获取用户选中的购物车商品
            $cartGoodsTotalNum = count($cartList['cartList']);
        }
        $cartGoodsList = get_arr_column($cartList['cartList'],'goods');
        $cartGoodsId = get_arr_column($cartGoodsList,'goods_id');
        $cartGoodsCatId = get_arr_column($cartGoodsList,'cat_id');
        $cartPriceInfo = $cartLogic->getCartPriceInfo($cartList['cartList']);  //初始化数据。商品总额/节约金额/商品总共数量
        $cartList = array_merge($cartList,$cartPriceInfo);
        //用户可用的优惠券列表
        $couponLogic = new CouponLogic();
        $userCouponList = $couponLogic->getUserAbleCouponList($user_id, $cartGoodsId, $cartGoodsCatId);
        $userCartCouponList = $cartLogic->getCouponCartList($cartList, $userCouponList);
        // 过滤掉able=0的优惠券
        if(!empty($userCartCouponList)){
            foreach ($userCartCouponList as $k => $item) {
                if($item['coupon']['able'] == 0) unset($userCartCouponList[$k]);
            }
            
            $userCartCouponList = array_values($userCartCouponList);
        }
        // 获取用户余额
        $user = Db::name('users')->where('user_id', $user_id)->field('user_money')->find();
        $result['user_money'] = $user['user_money'];
        $result['address'] = $address; // 地址
        $result['couponList'] = $userCartCouponList; //优惠券，用able判断是否可用
        $result['cartList'] = $cartList; // 购物车的商品
        // $result['cartPriceInfo'] = $cartPriceInfo;//商品优惠总价
        
        response_success($result);

    }


    /*
     * ajax 获取用户收货地址 用于购物车确认订单页面
     */
    public function getAddress($user_id){
        $address_list = Db::name('UserAddress')
            ->where(['user_id'=>$user_id,'is_pickup'=>0])
            ->order('is_default desc')
            ->select();

        $address = array();
        if($address_list){
        	$address = $address_list[0];

            $area_id = array();
    		$area_id[] = $address['province'];
            $area_id[] = $address['city'];
            $area_id[] = $address['district'];
            $area_id[] = $address['twon'];                        
        	   
            $area_id = array_filter($area_id);
        	$area_id = implode(',', $area_id);
        	$regionList = Db::name('region2')->where("id", "in", $area_id)->getField('id,name');
            
            $address['fulladdress'] = $regionList[$address['province']].$regionList[$address['city']].$regionList[$address['district']].$regionList[$address['twon']].$address['address'];
        }

        return $address;
    }
    /**
     * @author dyr
     * @time 2016.08.22
     * 获取自提点信息
     */
    public function ajaxPickup()
    {
        $province_id = I('province_id/d');
        $city_id = I('city_id/d');
        $district_id = I('district_id/d');
        if (empty($province_id) || empty($city_id) || empty($district_id)) {
            exit("<script>alert('参数错误');</script>");
        }
        $user_address = new UserAddressLogic();
        $address_list = $user_address->getUserPickup($this->user_id);
        $pickup = new PickupLogic();
        $pickup_list = $pickup->getPickupItemByPCD($province_id, $city_id, $district_id);
        $this->assign('pickup_list', $pickup_list);
        $this->assign('address_list', $address_list);
        return $this->fetch('ajax_pickup');
    }

    /**
     * @author dyr
     * @time 2016.08.22
     * 更换自提点
     */
    public function replace_pickup()
    {
        $province_id = I('get.province_id/d');
        $city_id = I('get.city_id/d');
        $district_id = I('get.district_id/d');
        $call_back = I('get.call_back');
        if (IS_POST) {
            echo "<script>parent.{$call_back}('success');</script>";
            exit(); // 成功
        }
        $address = array('province' => $province_id, 'city' => $city_id, 'district' => $district_id);
        $p = Db::name('region')->where(array('parent_id' => 0, 'level' => 1))->select();
        $c = Db::name('region')->where(array('parent_id' => $province_id, 'level' => 2))->select();
        $d = Db::name('region')->where(array('parent_id' => $city_id, 'level' => 3))->select();
        $this->assign('province', $p);
        $this->assign('city', $c);
        $this->assign('district', $d);
        $this->assign('address', $address);
        $this->assign('call_back', $call_back);
        return $this->fetch();
    }

    /**
     * @author dyr
     * @time 2016.08.22
     * 更换自提点
     */
    public function ajax_PickupPoint()
    {
        $province_id = I('province_id/d');
        $city_id = I('city_id/d');
        $district_id = I('district_id/d');
        $pick_up_model = new PickupLogic();
        $pick_up_list = $pick_up_model->getPickupListByPCD($province_id,$city_id,$district_id);
        exit(json_encode($pick_up_list));
    }


    /**
     * ajax 获取订单商品价格 或者提交 订单
     */
    public function cart3(){
        $user_id            = I('user_id/d');
        $address_id         = I("address_id/d"); //  收货地址id
        $invoice_title      = I('invoice_title');  // 发票
        $taxpayer           = I('taxpayer');       // 纳税人识别号
        $user_redpack_id    = I("user_redpack_id/d"); //  用户红包id
        $coupon_id          = I("coupon_id/d"); //  优惠券id
        $pay_points         = I("pay_points/d",0); //  使用积分
        $user_money         = I("user_money/f",0); //  使用余额
        $user_note          = I("user_note",''); // 用户留言
        $payPwd             = I("payPwd",''); // 支付密码
        $goods_id           = I("goods_id/d"); // 商品id
        $goods_num          = I("goods_num/d");// 商品数量
        $item_id            = I("item_id/d"); // 商品规格id
        $action             = I("action"); // 立即购买
        $dosubmit           = I('dosubmit', 0);
        $send_method        = I('send_method'); // 配送方式 1 送货上门 2 门店自取
        $pickup_id          = I('pickup_id');
        $payMethod          = I('payMethod');
        $delivery_code      = I('delivery_code');


        mb_strlen($user_note) > 60 && response_error('', '备注超出限制可输入字符长度！');
        if(!$address_id && $dosubmit == 1) response_error('', '请填写收货地址'); 
        $address = Db::name('UserAddress')->where("address_id", $address_id)->find();
        $cartLogic = new CartLogic();
        $pay = new Pay();
        try {
            $cartLogic->setUserId($user_id);
            $pay->setUserId($user_id);
            if ($action == 'buy_now') {
                $cartLogic->setGoodsModel($goods_id);
                $cartLogic->setSpecGoodsPriceModel($item_id);
                $cartLogic->setGoodsBuyNum($goods_num);
                $buyGoods = $cartLogic->buyNow();
                $cartList[0] = $buyGoods;
                $pay->payGoodsList($cartList);
            } else {
                $userCartList = $cartLogic->getCartList(1);
                $cartLogic->checkStockCartList($userCartList);
                $pay->payCart($userCartList);
            }
            // $pay->delivery($address['district']);
            $pay->orderPromotion();
            $pay->useCouponById($coupon_id);
            $pay->useUserMoney($user_money);
            $pay->usePayPoints($pay_points);
            // 提交订单
            if ($dosubmit == 1) {
                // 检测是否在配送范围
                if($send_method == 1){
                    // 获取配送范围
                    $basicinfo = tpCache('basic');
                    $delivery_range = $basicinfo['delivery_range'];
                    // 获取用户地址经纬度
                    $user_longitude = $address['longitude'];
                    $user_latitude = $address['latitude'];
                    if(empty($user_longitude) || empty($user_latitude)) response_error('', '该地址缺少经纬度坐标'.$user_longitude.'---'.$user_latitude);
                    // 配送站点经纬度
                    $region = Db::name('region')->where('code', $delivery_code)->find();
                    if(empty($region)) response_error('', '该城市不支持配送');
                    $delivery_longitude = $region['longitude'];
                    $delivery_latitude = $region['latitude'];
                    if($delivery_longitude == '' || $delivery_latitude == '') response_error('', '未设置配送点坐标');
                    $GeographyLogic = new GeographyLogic();
                    $distance = $GeographyLogic->getDistance($user_longitude, $user_latitude, $delivery_longitude, $delivery_latitude);
                    if($distance > $delivery_range) response_error('', '请回首页选择合适的配送中心或调整收货地址、或放弃本次购买');
                }
                $placeOrder = new PlaceOrder($pay);
                $placeOrder->setUserAddress($address);
                $placeOrder->setInvoiceTitle($invoice_title);
                $placeOrder->setUserNote($user_note);
                $placeOrder->setTaxpayer($taxpayer);
                $placeOrder->setPayPwd($payPwd);
                // 额外参数
                $extraParams = array(
                    'send_method' => $send_method,
                    'pickup_id' => $pickup_id,
                    'delivery_code' => $delivery_code,
                );
                $placeOrder->setPayMethod($payMethod);
                $placeOrder->setExtraParams($extraParams);
                $placeOrder->addNormalOrder();
                $cartLogic->clear();
                $order = $placeOrder->getOrder();
                response_success(array('order_sn'=>$order['order_sn'], 'order_id'=>$order['order_id'], 'order_amount'=>$order['order_amount']), '提交订单成功');
            }
            response_success($pay->toArray(), '计算成功');
        } catch (TpshopException $t) {
            $error = $t->getErrorArr();

            response_error('', $error['msg']);
        }
    }
    /**
     * ajax 获取订单商品价格 或者提交 订单
	 * 已经用心方法 这个方法 cart9  准备作废
     */
   
    /*
     * 订单支付页面
     */
    public function cart4(){
        $user_id = I('user_id');
        $order_id = I('order_id/d');
        $order_sn= I('order_sn/s','');
        $order_where['user_id'] = $this->user_id;
        if($order_sn){
            $order_where['order_sn'] = $order_sn;
        }else{
            $order_where['order_id'] = $order_id;
        }
        $order = M('Order')->where($order_where)->find();
        empty($order) && $this->error('订单不存在！');
        if($order['order_status'] == 3){
            $this->error('该订单已取消',U("Mobile/Order/order_detail",array('id'=>$order['order_id'])));
        }
        if(empty($order) || empty($this->user_id)){
            $order_order_list = U("User/login");
            header("Location: $order_order_list");
            exit;
        }
        // 如果已经支付过的订单直接到订单详情页面. 不再进入支付页面
        if($order['pay_status'] == 1){            
            $order_detail_url = U("Home/Order/order_detail",array('id'=>$order['order_id']));
            header("Location: $order_detail_url");
            exit;
        }
        //如果是预售订单，支付尾款
        if($order['pay_status'] == 2 && $order['prom_type'] == 4){
            $pre_sell_info = M('goods_activity')->where(array('act_id'=>$order['order_prom_id']))->find();
            $pre_sell_info = array_merge($pre_sell_info,unserialize($pre_sell_info['ext_info']));
            if($pre_sell_info['retainage_start'] > time()){
                $this->error('还未到支付尾款时间'.date('Y-m-d H:i:s',$pre_sell_info['retainage_start']));
            }
            if($pre_sell_info['retainage_end'] < time()){
                $this->error('对不起，该预售商品已过尾款支付时间'.date('Y-m-d H:i:s',$pre_sell_info['retainage_start']));
            }
        }
        $payment_where = array(
            'type'=>'payment',
            'status'=>1,
            'scene'=>array('in',array(0,2))
        );
        //预售和抢购暂不支持货到付款
        $orderGoodsPromType = M('order_goods')->where(['order_id'=>$order['order_id']])->getField('prom_type',true);
        $no_cod_order_prom_type = ['4,5'];//预售订单，虚拟订单不支持货到付款
        if(in_array($order['prom_type'],$no_cod_order_prom_type) || in_array(1,$orderGoodsPromType)){
            $payment_where['code'] = array('neq','cod');
        }
        $paymentList = M('Plugin')->where($payment_where)->select();
        $paymentList = convert_arr_key($paymentList, 'code');
        
        foreach($paymentList as $key => $val)
        {
            $val['config_value'] = unserialize($val['config_value']);            
            if($val['config_value']['is_bank'] == 2)
            {
                $bankCodeList[$val['code']] = unserialize($val['bank_code']);        
            }                
        }                
        
        $bank_img = include APP_PATH.'home/bank.php'; // 银行对应图片        
        $this->assign('paymentList',$paymentList);        
        $this->assign('bank_img',$bank_img);
        $this->assign('order',$order);
        $this->assign('bankCodeList',$bankCodeList);        
        $this->assign('pay_date',date('Y-m-d', strtotime("+1 day")));

        return $this->fetch();
    }
 
    
    //ajax 请求购物车列表
    public function header_cart_list()
    {
        $cartLogic = new CartLogic();
        $cartLogic->setUserId($this->user_id);
        $cartList = $cartLogic->getCartList();
        $cartPriceInfo = $cartLogic->getCartPriceInfo($cartList);
    	$this->assign('cartList', $cartList); // 购物车的商品
    	$this->assign('cartPriceInfo', $cartPriceInfo); // 总计
        $template = I('template','header_cart_list');    	 
        return $this->fetch($template);		 
    }

    /**
     * 预售商品下单流程
     */
    public function pre_sell_cart()
    {
        $act_id = I('act_id/d');
        $goods_num = I('goods_num/d');
        if(empty($act_id)){
            $this->error('没有选择需要购买商品');
        }
        if(empty($goods_num)){
            $this->error('购买商品数量不能为0', U('Home/Activity/pre_sell', array('act_id' => $act_id)));
        }
        if($this->user_id == 0){
            $this->error('请先登录',U('Home/User/login'));
        }
        $pre_sell_info = M('goods_activity')->where(array('act_id' => $act_id, 'act_type' => 1))->find();
        if(empty($pre_sell_info)){
            $this->error('商品不存在或已下架',U('Home/Activity/pre_sell_list'));
        }
        $pre_sell_info = array_merge($pre_sell_info, unserialize($pre_sell_info['ext_info']));
        if ($pre_sell_info['act_count'] + $goods_num > $pre_sell_info['restrict_amount']) {
            $buy_num = $pre_sell_info['restrict_amount'] - $pre_sell_info['act_count'];
            $this->error('预售商品库存不足，还剩下' . $buy_num . '件', U('Home/Activity/pre_sell', array('id' => $act_id)));
        }
        $goodsActivityLogic = new GoodsActivityLogic();
        $pre_count_info = $goodsActivityLogic->getPreCountInfo($pre_sell_info['act_id'], $pre_sell_info['goods_id']);//预售商品的订购数量和订单数量
        $pre_sell_price['cut_price'] =$goodsActivityLogic->getPrePrice($pre_count_info['total_goods'], $pre_sell_info['price_ladder']);//预售商品价格
        $pre_sell_price['goods_num'] = $goods_num;
        $pre_sell_price['deposit_price'] = floatval($pre_sell_info['deposit']);
        // 提交订单
        if ($_REQUEST['act'] == 'submit_order') {
            $invoice_title = I('invoice_title'); // 发票
            $taxpayer      = I('taxpayer'); // 纳税人识别号
            $address_id = I("address_id/d"); //  收货地址id
            if(empty($address_id)){
                exit(json_encode(array('status'=>-3,'msg'=>'请先填写收货人信息','result'=>null))); // 返回结果状态
            }
            $orderLogic = new OrderLogic();
            $result = $orderLogic->addPreSellOrder($this->user_id, $address_id, $invoice_title, $act_id, $pre_sell_price,$taxpayer); // 添加订单
            exit(json_encode($result));
        }
        $this->assign('pre_sell_info', $pre_sell_info);// 购物车的预售商品
        $this->assign('pre_sell_price',$pre_sell_price);
        return $this->fetch();
    }

    /**
     * 兑换积分商品
     */
    public function buyIntegralGoods(){
        $goods_id = input('goods_id/d');
        $item_id = input('item_id/d');
        $goods_num = input('goods_num');
        $Integral = new Integral();
        $Integral->setUserById($this->user_id);
        $Integral->setGoodsById($goods_id);
        $Integral->setSpecGoodsPriceById($item_id);
        $Integral->setBuyNum($goods_num);
        try{
            $Integral->checkBuy();
            $url = U('Cart/integral', ['goods_id' => $goods_id, 'item_id' => $item_id, 'goods_num' => $goods_num]);
            $result = ['status' => 1, 'msg' => '购买成功', 'result' => ['url' => $url]];
            $this->ajaxReturn($result);
        }catch (TpshopException $t){
            $result = $t->getErrorArr();
            $this->ajaxReturn($result);
        }
    }

    /**
     *  积分商品结算页
     * @return mixed
     */
    public function integral(){
        $goods_id = input('goods_id/d');
        $item_id = input('item_id/d');
        $goods_num = input('goods_num/d');
        if(empty($this->user)){
            $this->error('请登录');
        }
        if(empty($goods_id)){
            $this->error('非法操作');
        }
        if(empty($goods_num)){
            $this->error('购买数不能为零');
        }
        $Goods = new Goods();
        $goods = $Goods->where(['goods_id'=>$goods_id])->find();
        if(empty($goods)){
            $this->error('该商品不存在');
        }
        if (empty($item_id)) {
            $goods_spec_list = SpecGoodsPrice::all(['goods_id' => $goods_id]);
            if (count($goods_spec_list) > 0) {
                $this->error('请传递规格参数');
            }
            $goods_price = $goods['shop_price'];
            //没有规格
        } else {
            //有规格
            $specGoodsPrice = SpecGoodsPrice::get(['item_id'=>$item_id,'goods_id'=>$goods_id]);
            if ($goods_num > $specGoodsPrice['store_count']) {
                $this->error('该商品规格库存不足，剩余' . $specGoodsPrice['store_count'] . '份');
            }
            $goods_price = $specGoodsPrice['price'];
            $this->assign('specGoodsPrice', $specGoodsPrice);
        }
        $point_rate = tpCache('shopping.point_rate');
        $this->assign('point_rate', $point_rate);
        $this->assign('goods', $goods);
        $this->assign('goods_price', $goods_price);
        $this->assign('goods_num',$goods_num);
        return $this->fetch();
    }

    /**
     *  积分商品价格提交
     * @return mixed
     */
    public function integral2(){
        if ($this->user_id == 0){
            $this->ajaxReturn(['status' => -100, 'msg' => "登录超时请重新登录!", 'result' => null]);
        }
        $goods_id           = input('goods_id/d');
        $item_id            = input('item_id/d');
        $goods_num          = input('goods_num/d');
        $address_id         = input("address_id/d"); //  收货地址id
        $user_note          = input('user_note'); // 给卖家留言
        $invoice_title      = input('invoice_title'); // 发票
        $taxpayer           = input('taxpayer'); // 发票纳税人识别号
        $user_money         = input("user_money/f", 0); //  使用余额
        $payPwd                = input('payPwd');
        $integral = new Integral();
        $integral->setUserById($this->user_id);
        $integral->setGoodsById($goods_id);
        $integral->setBuyNum($goods_num);
        $integral->setSpecGoodsPriceById($item_id);
        $integral->setUserAddressById($address_id);
        $integral->useUserMoney($user_money);
        try{
            $integral->checkBuy();
            $pay = $integral->pay();
            // 提交订单
            if ($_REQUEST['act'] == 'submit_order') {
                $placeOrder = new PlaceOrder($pay);
                $placeOrder->setUserAddress($integral->getUserAddress());
                $placeOrder->setInvoiceTitle($invoice_title);
                $placeOrder->setUserNote($user_note);
                $placeOrder->setTaxpayer($taxpayer);
                $placeOrder->setPayPsw($payPwd);
                $placeOrder->addNormalOrder();
                $order = $placeOrder->getOrder();
                $this->ajaxReturn(['status'=>1,'msg'=>'提交订单成功','result'=>$order['order_id']]);
            }
            $this->ajaxReturn(['status' => 1, 'msg' => '计算成功', 'result' => $pay->toArray()]);
        }catch (TpshopException $t){
            $error = $t->getErrorArr();
            $this->ajaxReturn($error);
        }

    }
     /**
     *  获取发票信息
     * @date2017/10/19 14:45
     */
    public function invoice(){
        $map['user_id']=  $this->user_id;
        $field=[          
            'invoice_title',
            'taxpayer',
            'invoice_desc',	
        ];

        $info = M('user_extend')->field($field)->where($map)->find();
        if(empty($info)){
            $result=['status' => -1, 'msg' => 'N', 'result' =>''];
        }else{
            $result=['status' => 1, 'msg' => 'Y', 'result' => $info];
        }
        $this->ajaxReturn($result);            
    }
     /**
     *  保存发票信息
     * @date2017/10/19 14:45
     */
    public function save_invoice(){
        if(IS_AJAX){
            //A.1获取发票信息
            $invoice_title = trim(I("invoice_title"));
            $taxpayer      = trim(I("taxpayer"));
            $invoice_desc  = trim(I("invoice_desc"));
            //B.1校验用户是否有历史发票记录
            $map['user_id'] =  $this->user_id;
            $info           = M('user_extend')->where($map)->find();
           //B.2发票信息
            $data=[];  
            $data['invoice_title'] = $invoice_title;
            $data['taxpayer']      = $taxpayer;  
            $data['invoice_desc']  = $invoice_desc;
            //B.3发票抬头
            if($invoice_title=="个人"){
                $data['invoice_title'] ="个人";
                $data['taxpayer']      = "";
            }
            //是否存贮过发票信息
            if(empty($info)){   
                $data['user_id'] = $this->user_id;
                (M('user_extend')->add($data))?
                $status=1:$status=-1;                
             }else{
                (M('user_extend')->where($map)->save($data))?
                $status=1:$status=-1;                
            }            
            $result = ['status' => $status, 'msg' =>'', 'result' =>''];
            $this->ajaxReturn($result);
        }
    }

    /**
     * 优惠券兑换
     */
    public function cartCouponExchange()
    {
        $coupon_code = input('coupon_code');
        $couponLogic = new CouponLogic;
        $return = $couponLogic->exchangeCoupon($this->user_id, $coupon_code);
        $this->ajaxReturn($return);
    }

    // 自提点列表
    public function getPickupList(){
        $user_id = I('user_id');
        $isLocalCity = I('isLocalCity', 1);  // 是否本地城市(该字段不用了，但不影响逻辑)
        $user_longitude = I('user_longitude'); // 
        $user_latitude = I('user_latitude');
        $city_code = I('city_code');
        $page = I('page/d');

        $where = array(
            'status' => 2,
            'is_open'=> 1,
        );
        $city_code && $where['city_code'] = $city_code;
        
        $field = 'pickup_id, pickup_name, pickup_phone, pickup_contact, province_code, city_code, district_code, pickup_address, image';
        $order = 'pickup_id desc';

        if($user_longitude && $user_longitude && $isLocalCity){
            $GeographyLogic = new GeographyLogic();
            // 计算500km 范围内的经纬度
            $around = $GeographyLogic->getAround($user_longitude, $user_latitude, 5000000);
            $where['longitude'] = array('BETWEEN', array($around['minLongitude'], $around['maxLongitude']));
            $where['latitude'] = array('BETWEEN', array($around['minLatitude'], $around['maxLatitude']));
            // sql 计算距离 并按距离排序
            $field .= ", ROUND(6378.138*2*ASIN(SQRT(POW(SIN(($user_latitude*PI()/180-latitude*PI()/180)/2),2)+COS($user_latitude*PI()/180)*COS(latitude*PI()/180)*POW(SIN(($user_longitude*PI()/180-longitude*PI()/180)/2),2))), 2) AS distance";
            $order = 'distance asc';
        }
        
        $list = Db::name('pick_up')
            ->where($where)
            ->order($order)
            ->field($field)
            ->page($page)
            ->limit(20)
            ->select();

        $region2 = Db::name('region')->cache(0)->field('name, code')->select();
        $regionlist = array();
        // 循环地址处理数组
        foreach ($region2 as $item) {
            $regionList[$item['code']] = array('name'=>$item['name']);
        }
        if($list){
            
            foreach ($list as &$item) {
                $item['fulladdress'] = $regionList[$item['province_code']]['name'].$regionList[$item['city_code']]['name'].$item['pickup_address'];
                unset($item['pickup_address']);
            }
        }

        response_success($list);
    }
}
