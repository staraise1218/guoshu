<?php

/**
 
 * Author: 当燃
 * Date: 2015-09-09
 */

namespace app\admin\controller;
use app\admin\logic\UpgradeLogic;
use app\common\logic\Saas;
use think\Controller;
use think\Db;
use think\response\Json;
use think\Session;
class Base extends Controller {

    public $begin;
    public $end;
    public $page_size = 0;
    public $admin_id; // 自定义添加 管理员id
    public $role_id; // 自定义添加 管理员角色
    public $adminInfo; // 自定义添加 管理员信息
    /**
     * 析构函数
     */
    function __construct() 
    {
        Session::start();
        header("Cache-control: private");  // history.back返回后输入框值丢失问题 参考文章 http://www.tp-shop.cn/article_id_1465.html  http://blog.csdn.net/qinchaoguang123456/article/details/29852881
        parent::__construct();
        $upgradeLogic = new UpgradeLogic();
        $upgradeMsg = $upgradeLogic->checkVersion(); //升级包消息        
        $this->assign('upgradeMsg',$upgradeMsg);    
        //用户中心面包屑导航
        $navigate_admin = navigate_admin();
        $this->assign('navigate_admin',$navigate_admin);
        tpversion();
   }
    
    /**
     * 初始化操作
     */
    public function _initialize()
    {
        Saas::instance()->checkSso();

        //过滤不需要登陆的行为 
        if (!in_array(ACTION_NAME, array('login', 'vertify'))) {
            if (session('admin_id') > 0) {
                $this->check_priv();//检查管理员菜单操作权限
            }else {
                (ACTION_NAME == 'index') && $this->redirect( U('Admin/Admin/login'));
                $this->error('请先登录', U('Admin/Admin/login'), null, 1);
            }
        }
        $this->public_assign();
    }

    /**
     * 保存公告变量到 smarty中 比如 导航 
     */
    public function public_assign()
    {
       $tpshop_config = array();
       $tp_config = M('config')->cache(true)->select();
       foreach($tp_config as $k => $v)
       {
          $tpshop_config[$v['inc_type'].'_'.$v['name']] = $v['value'];
       }
        if(I('start_time')){
            $begin =$begin = I('start_time');
            $end = I('end_time');
        }else{
            $begin = date('Y-m-d', strtotime("-1 days"));//30天前
            $end = date('Y-m-d', strtotime('+1 days'));
        }

        // 自定义添加 管理员信息
        $admin_id = session('admin_id');
        $this->admin_id = $admin_id;
        $this->assign('admin_id', $admin_id);
        $admin = Db::name('admin')->where('admin_id', $admin_id)->find();
        $this->adminInfo = $admin;
        $this->role_id = $admin['role_id'];
        $this->assign('role_id', $admin['role_id']);

        $this->assign('start_time',$begin);
        $this->assign('end_time',$end);
        $this->begin = strtotime($begin);
        $this->end = strtotime($end)+86399;
        $this->page_size = C('PAGESIZE');
       $this->assign('tpshop_config', $tpshop_config);       
    }
    
    public function check_priv()
    {
    	$ctl = CONTROLLER_NAME;
    	$act = ACTION_NAME;
        $act_list = session('act_list');
		//无需验证的操作
		$uneed_check = array('login','logout','vertifyHandle','vertify','imageUp','upload','videoUp','delupload','login_task');
    	if($ctl == 'Index' || $act_list == 'all'){
    		//后台首页控制器无需验证,超级管理员无需验证
    		return true;
    	}elseif(request()->isAjax() || strpos($act,'ajax')!== false || in_array($act,$uneed_check)){
    		//所有ajax请求不需要验证权限
    		return true;
    	}else{
    		$right = M('system_menu')->where("id", "in", $act_list)->cache(true)->getField('right',true);
            $role_right = '';
    		foreach ($right as $val){
    			$role_right .= $val.',';
    		}
    		$role_right = explode(',', $role_right);
    		//检查是否拥有此操作权限
    		if(!in_array($ctl.'@'.$act, $role_right)){
    			$this->error('您没有操作权限['.($ctl.'@'.$act).'],请联系超级管理员分配权限',U('Admin/Index/welcome'));
    		}
    		
    		 
    	}
    }
    
    public function ajaxReturn($data,$type = 'json'){                        
            exit(json_encode($data));
    }    
}