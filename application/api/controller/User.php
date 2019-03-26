<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use app\api\logic\SmsLogic;
use app\common\logic\UsersLogic;

class User extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
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
        $count = Db::name('users')->where('user_id', $user_id)->where('mobile', $mobile)->count();
        if(!$count) response_error('', '手机号不存在');

        response_success('', '验证成功');
    }

    public function setPayPassword(){
        $user_id = I('user_id');
        $password = I('password');
        $password_confirm = I('password_confirm');

        if($password_confirm != $password) response_error('', '两次密码不一致');
        Db::name('users')->where('user_id', $user_id)->setField('pay_password', encrypt($password));

        response_success('', '设置成功');
    }

    // 余额明细
    public function userMoneyLog(){
        $user_id = I('user_id/d');
        $page = I('page/d', 1);

        $account_log = M('account_log')
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

        $list = Db::name('coupon')
            ->where('type', 2)
            ->where('send_start_time', ['<', time()])
            ->where('send_end_time', ['>', time()])
            ->where('status', 1)
            ->field('id, name, money, condition, use_start_time, use_end_time')
            ->order('id desc')
            ->page($page)
            ->limit(20)
            ->select();

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


}