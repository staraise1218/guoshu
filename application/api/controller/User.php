<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use app\api\logic\SmsLogic;
use app\common\logic\UsersLogic;
use app\common\logic\ActivityLogic;

class User extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

    public function index(){
        $user_id = I('user_id');
        $userInfo = M('users')
            ->where("user_id", $user_id)
            ->where('is_lock', 0)
            ->find();
        $result['userInfo'] = array(
            'head_pic' => $userInfo['head_pic'],
            'nickname' => $userInfo['nickname'],
            'user_money' => $userInfo['user_money'],
        );

        $result['redpack_num'] = Db::name('coupon_list')->alias('cl')
                                        ->join('coupon c', 'cl.cid=c.id', 'left')
                                        ->where('cl.uid', $user_id)
                                        ->where('cl.status', 0)
                                        ->where('c.use_end_time', 'gt', time())
                                        ->count();
        response_success($result);
    }

    public function getUserInfo(){
        $user_id = I('user_id');
        $userInfo = M('users')
            ->where("user_id", $user_id)
            ->where('is_lock', 0)
            ->find();
        unset($userInfo['password']);
        unset($userInfo['pay_password']);
       
       // 计算年龄
        response_success($userInfo);
    }

    /**
     * [uploadFile 上传头像/认证视频 app 原生调用]
     * @param [type] $[type] [文件类型 head_pic 头像 auth_video 视频认证]
     * @param  $[action] [ 默认 add 添加 edit 修改]
     * @return [type] [description]
     */
    public function changeHeadPic(){
        $user_id = I('user_id/d');

        $uploadPath = UPLOAD_PATH.'head_pic/';

        $FileLogic = new FileLogic();
        $result = $FileLogic->uploadSingleFile('head_pic', $uploadPath);
        if($result['status'] == '1'){
            $fullPath = $result['fullPath'];

            Db::name('users')->update(array('user_id'=>$user_id, 'head_pic'=>$fullPath));

            $resultdata = array('head_pic'=>$fullPath);
            response_success($resultdata, '上传成功');
            
        } else {
            response_error('', '上传失败');
        }
    }

    /**
     * [changeField description]
     * @return [type] [description]
     */
    public function changeField(){
        $user_id = I('user_id');
        $field = input('post.field');
        $fieldValue = input('post.fieldValue');

        if(!in_array($field, array('nickname', 'sex'))) response_error('', '不被允许的字段');

        if($field == 'nickname'){
            if(mb_strlen($fieldValue) > 6 || mb_strlen($fieldValue) < 2){
                response_error('', '姓名长度在2-6个字之间');
            }
        }

        Db::name('users')->where('user_id', $user_id)->update(array($field=>$fieldValue));
        response_success('', '修改成功');
    }

    /**
     * [checkMobile 设置支付密码前的手机号验证]
     * @return [type] [description]
     */
    public function checkMobile(){
        $user_id = I('user_id');
        $mobile = I('mobile');
        $code = I('code');

         // 验证码检测
        $SmsLogic = new SmsLogic();
        if($SmsLogic->checkCode($mobile, $code, 3, $error) == false) response_error('', $error);

        // 检测手机号是否存在
        $user = Db::name('users')->where('user_id', $user_id)->find();
        if(empty($user)) response_error('', '用户不存在');
        if($user['mobile'] == '') response_error(array('status' => -1), '未设置手机号');
        if($user['mobile'] != $mobile) response_error('', '与设置的手机号不相符');
        if(!$count) response_error('', '手机号不存在');

        response_success('', '验证成功');
    }

    public function setPayPassword(){
        $user_id = I('user_id');
        $password = I('password');
        $password_confirm = I('password_confirm');

        if($password_confirm != $password) response_error('', '两次密码不一致');
        Db::name('users')->where('user_id', $user_id)->setField('paypwd', encrypt($password));

        response_success('', '设置成功');
    }

    // 余额明细
    public function userMoneyLog(){
        $user_id = I('user_id/d');
        $page = I('page/d', 1);

        $account_log = M('account_log')
        ->where('user_id', $user_id)
        ->where('user_money', array('neq', 0))
        ->where("user_id=" . $user_id." and user_money!=0 ")
        ->field("user_money, FROM_UNIXTIME(change_time, '%Y-%m-%d %H:%i:%s') change_time, desc, order_sn")
        ->page($page)
        ->limit(20)
        ->order('log_id desc')
        ->select();

        response_success($account_log);
    }

    /**
     * [couponlist 优惠券列表/优惠券领取页]
     * @return [type] [description]
     */
    public function couponlist(){
        $user_id = I('user_id');
        $page = I('page', 1);

        $where = array(
            'type'  => 2,
            'send_start_time'   => ['<', time()],
            'send_end_time' => ['>', time()],
            'status'    => 1,
            'createnum' => ['exp', ' > `send_num`'],
        );
        $list = Db::name('coupon')->alias('c')
            ->where($where)
            ->where(function($query) use ($user_id){
                $query->table('tp_coupon_list')->where('uid', $user_id)->where('cid', 'exp', '=`c`.`id`');
            }, 'not exists')
            ->field('id, name, money, condition, use_start_time, use_end_time')
            ->order('id desc')
            ->page($page)
            ->limit(20)
            ->select();
        if(!empty($list)){
            foreach ($list as &$item) {
                $count =  Db::name('coupon_list')
                    ->where('cid', $item['id'])
                    ->where('uid', $user_id)
                    ->count();
                $item['is_get'] = $count ? 1 : 0;
            }
        }

        response_success($list);
    }
    
    /**
     * 我的优惠券
     */
    public function coupon()
    {
        $user_id = I('user_id');

        $logic = new UsersLogic();
        $data = $logic->get_coupon($user_id, input('type'));
        foreach($data['result'] as $k =>$v){
            $user_type = $v['use_type'];
            $data['result'][$k]['use_scope'] = C('COUPON_USER_TYPE')["$user_type"];
            if($user_type==1){ //指定商品
                $data['result'][$k]['goods_id'] = M('goods_coupon')->field('goods_id')->where(['coupon_id'=>$v['cid']])->getField('goods_id');
            }
            if($user_type==2){ //指定分类
                $data['result'][$k]['category_id'] = Db::name('goods_coupon')->where(['coupon_id'=>$v['cid']])->getField('goods_category_id');
            }
        }
        $coupon_list = $data['result'];
        
        response_success($coupon_list);
    }

    /**
     * 领优惠券
     */
    public function getCoupon()
    {
        $user_id = input('user_id/d');
        $coupon_id = I('coupon_id/d');

        $activityLogic = new ActivityLogic();
        $result = $activityLogic->get_coupon($coupon_id, $user_id);

        if($result['status'] == 1){
            response_success('', '领取成功');
        } else {
            response_error('', $result['msg']);
        }
        
    }


    // 分享小程序日志记录 return status: 0 无红包 1 有红包
    public function shareSystemLog(){
        $user_id = I('user_id');

        // 将分享日志写入表中
        $data = array(
            'user_id' => $user_id,
            'createtime' => time(),
        );
        Db::name('sharesystem_log')->insert($data);

        // 查看系统设置的分享红包
        $redpack = Db::name('redpack')
                        ->where('type', 1) // 分享小程序红包
                        ->where('status', 1) // 有效状态
                        ->where('send_start_time', ['lt', time()]) // 发放开始时间
                        ->where('send_end_time', ['gt', time()]) // 发放结束时间
                        ->where('use_start_time', ['lt', time()]) // 使用开始时间
                        ->where('use_end_time', ['gt', time()]) // 使用结束时间
                        ->find();

        // 如果分享小程序可以得红包，则判断是否满足分享10次
        if($redpack){  
            // 判断用户是否已经得到该红包
            $is_has = Db::name('user_redpack')->where('rid', $redpack['id'])->count();
            if($is_has) response_success(array('status'=>0));
            // 判断发放红包数量是否已满额
            if(($redpack['createnum'] > 0) && ($redpack['send_num'] == $redpack['createnum'])) response_success(array('status'=>0));

            // 如果没有得到该红包就继续
            $count = Db::name('sharesystem_log')
                ->where('createtime', ['egt', $redpack['send_start_time']])
                ->where('createtime', ['elt', $redpack['send_end_time']])
                ->count();

            if($count >= 10){
                $data = array(
                    'rid' => $redpack['id'],
                    'type' => $redpack['type'],
                    'uid' => $user_id,
                    'send_time' => time(),
                );
                Db::name('user_redpack')->insert($data); // 分享小程序符合条件赠送红包
                Db::name('redpack')->setInc('send_num', 1); // 红包表记录赠送数量
                response_success(array('status'=>1));
            }
        }

        response_success(array('status'=>0));
    }

    // 申请自提点
    public function applyPickup(){
        $user_id = I('user_id/d');
        $mobile_code = I('mobile_code');
        $pickup_phone = I('pickup_phone');
        $pickup_contact = I('pickup_contact');
        $province_code = I('province_code');
        $city_code = I('city_code');
        $district_code = I('district_code');
        $pickup_address = I('pickup_address');

        if(check_mobile($pickup_phone) == false){
            response_error('', '手机号格式错误');
        }

        // 验证码检测
        $SmsLogic = new SmsLogic();
        if($SmsLogic->checkCode($pickup_phone, $mobile_code, '4', $error) == false) response_error('', $error);

        // 检测是否已申请
        $pickup = Db::name('pick_up')->where('user_id', $user_id)->find();
        if($pickup) response_error('', '您已申请，不可重复申请');

        $data = array(
            'user_id' => $user_id,
            'mobile_code' => $mobile_code,
            'pickup_phone' => $pickup_phone,
            'pickup_contact' => $pickup_contact,
            'province_code' => $province_code,
            'city_code' => $city_code,
            'district_code' => $district_code,
            'pickup_address' => $pickup_address,
            'apply_time' => time(),
        );
        $result = Db::name('pick_up')->insert($data);
        if($result){
            response_success('', '申请成功');
        } else {
            response_error('', '申请失败');
        }
    }

    // 余额记录
    // 变更类型：0 无 1 订单退差价 2 自提点订单收益 3 商品消费
    public function account_list(){
        $user_id = I('user_id');
        $type = I('type', 0);
        $page = I('page', 1);

        $where = array(
            'user_id'=> $user_id,
            'user_money'=> array('neq', 0),
        );
        $type && $where['type'] = $type;
        
        $list = Db::name('account_log')
            ->where($where)
            ->field('log_id, user_money, change_time, desc, order_sn, order_id')
            ->page($page)
            ->limit(20)
            ->select();

        response_success($list);
    }

    // 消息列表
    public function message(){
        $user_id = I('user_id/d');
        $page = I('page/d', 1);

        $limit_start = ($page-1)*20;
        $list = Db::name('message')->alias('m')
            ->join('user_message um', 'um.message_id=m.message_id', 'left')
            ->where('user_id', $user_id)
            ->whereOr('m.type', 1)
            ->field('m.message_id, message, m.category, data, send_time, status')
            ->order('message_id desc')
            ->limit($limit_start, 20)
            ->select();

        if(!empty($list)){
            // $now_date = strtotime(date('Y-m-d')); // 今日凌晨
            // $mid_date = strtotime(date('Y-m-d 12:00:00')) ;// 今日中午

            foreach ($list as &$item) {
                // if($item['send_time'] < $now_date) $item['send_time'] = date('Y-m-d', $item['send_time']);
                // if($item['send_time'] > $now_date && $item['send_time'] < $mid_date) $item['send_time'] = '上午'.date('H:i', $item['send_time']);
                // if($item['send_time'] > $mid_date) $item['send_time'] = '下午'.date('H:i', $item['send_time']);

                if(empty($item['status'])) $item['status'] = 0;
                if($item['data']) $item['data'] = unserialize($item['data']);
            }
        }

        response_success($list);
    }

        // 标记读消息
    public function readMessage(){
        $user_id = I('user_id');
        $message_id = I('message_id');

        $count = M('user_message')->where(array('user_id'=>$user_id, 'message_id'=>$message_id))->count();
        if($count){
            M('user_message')->where(array('user_id'=>$user_id, 'message_id'=>$message_id))->setField('status', 1);
        } else {
            $data = array(
                'user_id' => $user_id,
                'message_id' => $message_id,
                'status' => '1',
            );
            M('user_message')->insert($data);
        }

        response_success();
    }

    // 获取自提点信息
    public function getPickupInfo(){
        $user_id = I('user_id');

        $info = Db::name('pick_up')
            ->where('user_id', $user_id)
            ->field('pickup_id, pickup_name, pickup_phone, pickup_contact')
            ->find();
        response_success($info);
    }
}