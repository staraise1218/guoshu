<?php


namespace app\common\logic;

use think\Model;
use think\Db;

/**
 *
 * @package common\Logic
 */
class RedpackLogic extends Model
{
    
    /**
     * 获取购物车（订单）中可用的红包
     * $type: 0可用，1不可用
     * $size: 每页的数量，null表示所有
     */
    public function getCartReppackList($user_id, $type, $cartList, $p = 1, $size = null)
    {
        //商品优惠总价
        $cartTotalPrice = array_sum(array_map(function($val){
            return $val['total_fee'];
        }, $cartList));
        
        $now = time();
        $where = "rp.status=1 AND urp.uid={$user_id} AND rp.use_end_time>{$now}";
        if (!$type) {
            $where .= " AND rp.use_start_time<{$now} AND rp.condition<={$cartTotalPrice}";
        } else {
            $where .= " AND (rp.use_start_time>{$now} OR rp.condition>{$cartTotalPrice}) ";
        }
        
        $query = Db::name('redpack')->alias('rp')
                ->field('rp.name, rp.money, rp.condition, rp.use_end_time, urp.*')
                ->join('user_redpack urp','urp.rid=rp.id AND urp.status=0', 'LEFT')
                ->where($where);
        if ($size) {
            return $query->page($p, $size)->select();
        }
        return $query->select();
    }

    /**
     * 获取用户可用的优惠券
     * @param $user_id|用户id
     * @param array $goods_ids|限定商品ID数组
     * @param array $goods_cat_id||限定商品分类ID数组
     * @return array
     */
    public function getUserAbleRedpackList($user_id, $goods_ids = array(), $goods_cat_id = array())
    {
        $CouponList = new CouponList();
        $Coupon = new Coupon();
        $userCouponArr = [];
        $userCouponList = $CouponList->where('uid', $user_id)->where('status', 0)->select();//用户优惠券
        if(!$userCouponList){
            return $userCouponArr;
        }
        $userCouponId = get_arr_column($userCouponList, 'cid');
        $couponList = $Coupon->with('GoodsCoupon')
            ->where('id', 'IN', $userCouponId)
            ->where('status', 1)
            ->where('use_start_time', '<', time())
            ->where('use_end_time', '>', time())
            ->select();//检查优惠券是否可以用
        foreach ($userCouponList as $userCoupon => $userCouponItem) {
            foreach ($couponList as $coupon => $couponItem) {
                if ($userCouponItem['cid'] == $couponItem['id']) {
                    //全店通用
                    if ($couponItem['use_type'] == 0) {
                        $tmp = $userCouponItem;
                        $tmp['coupon'] = $couponItem->append(['use_type_title'])->toArray();
                        $userCouponArr[] = $tmp;
                    }
                    //限定商品
                    if ($couponItem['use_type'] == 1 && !empty($couponItem['goods_coupon'])) {
                        foreach ($couponItem['goods_coupon'] as $goodsCoupon => $goodsCouponItem) {
                            if (in_array($goodsCouponItem['goods_id'], $goods_ids)) {
                                $tmp = $userCouponItem;
                                $tmp['coupon'] = array_merge($couponItem->append(['use_type_title'])->toArray(), $goodsCouponItem->toArray());
                                $userCouponArr[] = $tmp;
                                break;
                            }
                        }
                    }
                    //限定商品类型
                    if ($couponItem['use_type'] == 2 && !empty($couponItem['goods_coupon'])) {
                        foreach ($couponItem['goods_coupon'] as $goodsCoupon => $goodsCouponItem) {
                            if (in_array($goodsCouponItem['goods_category_id'], $goods_cat_id)) {
                                $tmp = $userCouponItem;
                                $tmp['coupon'] = array_merge($couponItem->append(['use_type_title'])->toArray(), $goodsCouponItem->toArray());
                                $userCouponArr[] = $tmp;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return $userCouponArr;
    }
}