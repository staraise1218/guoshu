<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use app\api\logic\SmsLogic;
use app\common\logic\CartLogic;

class Common extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = '*';

		parent::__construct();
	}


    /**
     * [sendMobleCode 发送手机验证码]
     * @param [scene 1 注册 2 找回密码, 3 修改手机号]
     * @return [type] [description]
     */
    public function sendMobileCode(){
        $mobile = I('mobile');
        $scene = I('scene', 1);


        // 检测手机号
        if(check_mobile($mobile) == false) response_error('', '手机号格式错误');

        // 注册场景检测是否注册
        if($scene == '3'){
            $count = Db::name('users')->where("mobile=$mobile")
            	->count();
            if($count) response_error('', '该手机号已被占用');
        }

        $SmsLogic = new SmsLogic();
        $code = $SmsLogic->send($mobile, $scene, $error);
        if($code != false){
            response_success(array('code'=>$code), '发送成功');
        } else {
            response_error('', $error);
        }
    } 

    /**
     * [fileUpload 上传单文件]
     * @param   $[file] [<文件名>]
     * @param [type] $[type] [<类型 ]
     * @return [type] [description]
     */
    public function uploadFile(){
        $type = I('type');

        if( ! in_array($type, array('goods_comment'))) response_error('', '不被允许的类型');
        if(empty($_FILES)) response_error('文件不能为空');

        /************* 上传路径 ***************/        
        if($type == 'goods_comment') $uploadPath = UPLOAD_PATH.'goods_comment';
        
        $FileLogic = new FileLogic();
        $result = $FileLogic->uploadSingleFile('file', $uploadPath);
        if($result['status'] == '1'){
            $filepath = $result['fullPath'];
            response_success(array('filepath'=>$filepath));
        } else {
            response_error('', '文件上传失败');
        }
    }

    // 多文件上传
    public function uploadMultiFile(){
        $type = I('type');

        if( ! in_array($type, array('goods_comment'))) response_error('', '不被允许的类型');
        if(empty($_FILES)) response_error('文件不能为空');

        /************* 上传路径 ***************/        
        if($type == 'goods_comment') $uploadPath = UPLOAD_PATH.'goods_comment';

        $FileLogic = new FileLogic();
        $result = $FileLogic->uploadMultiFile('file', $uploadPath);
        if($result['status'] == '1'){
            $images = $result['images'];

            response_success(array('images'=>$images));
        } else {
            response_error('', '文件上传失败');
        }

    }

    // 获取购物车商品总数量
    public function getCartNum(){
        $user_id = I('user_id');
        $city_code = I('city_code');

        $cartLogic = new CartLogic();
        $cartLogic->setUserId($user_id);
        $cartLogic->setCityCode($city_code);
        
        $cartNum = $cartLogic->getUserCartGoodsNum();//获取用户购物车商品总数

        response_success(array('cartNum'=>$cartNum));
    }

}