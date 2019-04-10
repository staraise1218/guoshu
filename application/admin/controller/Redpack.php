<?php
/**
 * Date: 2015-12-11
 */
namespace app\admin\controller;
use think\AjaxPage;
use think\Page;
use think\Db;
use think\Loader;

class Redpack extends Base {
    
    public function index(){
        //获取红包列表Redpack

    	$count =  M('redpack')->count();
    	$Page = new Page($count,10);
        $show = $Page->show();
        $lists = M('Redpack')->order('add_time desc')->limit($Page->firstRow.','.$Page->listRows)->select();
        $this->assign('lists',$lists);
        $this->assign('pager',$Page);// 赋值分页输出
        $this->assign('page',$show);// 赋值分页输出   
        $this->assign('redpacks',C('REDPACK_TYPE'));
        return $this->fetch();
    }

    /*
     * 添加编辑一个红包类型
     */
    public function redpack_info(){
        $rid = I('get.id/d');
        if ($rid) {
            $redpack = M('redpack')->where(array('id' => $rid))->find();
            if (empty($redpack)) {
                $this->error('红包不存在');
            }else{
                if($redpack['use_type'] == 2){
                    $goods_redpack = Db::name('goods_redpack')->where('redpack_id',$rid)->find();
                    $cat_info = M('goods_category')->where(array('id'=>$goods_redpack['goods_category_id']))->find();
                    $cat_path = explode('_', $cat_info['parent_id_path']);
                    $redpack['cat_id1'] = $cat_path[1];
                    $redpack['cat_id2'] = $cat_path[2];
                    $redpack['cat_id3'] = $goods_redpack['goods_category_id'];
                }
                if($redpack['use_type'] == 1){
                    $redpack_goods_ids = Db::name('goods_redpack')->where('redpack_id',$rid)->getField('goods_id',true);
                    $enable_goods = M('goods')->where("goods_id", "in", $redpack_goods_ids)->select();
                    $this->assign('enable_goods',$enable_goods);
                }
            }
            $this->assign('redpack', $redpack);
        } else {
            $def['send_start_time'] = strtotime("+1 day");
            $def['send_end_time'] = strtotime("+1 month");
            $def['use_start_time'] = strtotime("+1 day");
            $def['use_end_time'] = strtotime("+2 month");
            $this->assign('redpack', $def);
        }
        $cat_list = M('goods_category')->where(['parent_id' => 0])->select();//自营店已绑定所有分类
        $this->assign('cat_list',$cat_list);
        return $this->fetch();
    }

    /**
     * 添加编辑红包
     */
    public function addEditRedpack()
    {
        $data = I('post.');
        $data['send_start_time'] = strtotime($data['send_start_time']);
        $data['send_end_time'] = strtotime($data['send_end_time']);
        $data['use_end_time'] = strtotime($data['use_end_time']);
        $data['use_start_time'] = strtotime($data['use_start_time']);
        $redpackValidate = Loader::validate('Redpack');
        if (!$redpackValidate->batch()->check($data)) {
            $this->ajaxReturn(['status' => 0, 'msg' => '操作失败', 'result' => $redpackValidate->getError()]);
        }
        if (empty($data['id'])) {
            $data['add_time'] = time();
            $row = Db::name('redpack')->insertGetId($data);
            
        } else {
            $row = M('redpack')->where(array('id' => $data['id']))->save($data);
           
        }
        if ($row !== false) {
            $this->ajaxReturn(['status' => 1, 'msg' => '编辑红包成功', 'result' => '']);
        } else {
            $this->ajaxReturn(['status' => 0, 'msg' => '编辑红包失败', 'result' => '']);
        }
    }

    /*
    * 红包发放
    */
    public function make_redpack(){
        //获取红包ID
        $rid = I('get.id/d');
        $type = I('get.type');
        //查询是否存在红包
        $data = M('redpack')->where(array('id'=>$rid))->find();
        $remain = $data['createnum'] - $data['send_num'];//剩余派发量
    	if($remain<=0 && $data['createnum']>0) $this->error($data['name'].'已经发放完了');
        if(!$data) $this->error("红包类型不存在");
        if($type != 3) $this->error("该红包类型不支持发放");
        if(IS_POST){
            $num  = I('post.num/d');
            if($num>$remain && $data['createnum']>0) $this->error($data['name'].'发放量不够了');
            if(!$num > 0) $this->error("发放数量不能小于0");
            if($data['status'] == 2) $this->error("红包已设置为失效");
            $add['rid'] = $rid;
            $add['type'] = $type;
            $add['send_time'] = time();
            for($i=0;$i<$num; $i++){
                do{
                    $code = get_rand_str(8,0,1);//获取随机8位字符串
                    $check_exist = M('user_redpack')->where(array('code'=>$code))->find();
                }while($check_exist);
                $add['code'] = $code;
                M('user_redpack')->add($add);
            }
            M('redpack')->where("id",$rid)->setInc('send_num',$num);
            adminLog("发放".$num.'张'.$data['name']);
            $this->success("发放成功",U('Admin/Redpack/index'));
            exit;
        }
        $this->assign('redpack',$data);
        return $this->fetch();
    }
    
    public function ajax_get_user(){
    	//搜索条件
    	$condition = array();
    	I('mobile') ? $condition['mobile'] = I('mobile') : false;
    	I('email') ? $condition['email'] = I('email') : false;
    	I('level_id') ? $condition['level'] = I('level_id') : false;
        $rid = I('rid');
    	$nickname = I('nickname');
    	if(!empty($nickname)){
    		$condition['nickname'] = array('like',"%$nickname%");
    	}
        $issued_uids = Db::name('user_redpack')->where(['rid'=>$rid])->getField('uid',true); //已经发放的用户ID
    	$count = Db::name('users')->whereNotIn('user_id',$issued_uids)->where($condition)->count();
    	$Page  = new AjaxPage($count,10);
    	/*foreach($condition as $key=>$val) {
    		$Page->parameter[$key] = urlencode($val);
    	}*/
    	$show = $Page->show();
    	$userList = Db::name('users')->whereNotIn('user_id',$issued_uids)->where($condition)->order("user_id desc")->limit($Page->firstRow.','.$Page->listRows)->select();

        $user_level = M('user_level')->getField('level_id,level_name',true);       
        $this->assign('user_level',$user_level);
    	$this->assign('userList',$userList);
    	$this->assign('page',$show);
        $this->assign('pager',$Page);
    	return $this->fetch();
    }
    
    public function send_redpack(){
    	$rid = I('rid/d');
    	if(IS_POST){
    		$level_id = I('level_id');
    		$user_id = I('user_id/a');
    		$insert = '';
    		$redpack = M('redpack')->where("id",$rid)->find();
    		if($redpack['createnum']>0){
    			$remain = $redpack['createnum'] - $redpack['send_num'];//剩余派发量
    			if($remain<=0) $this->error($redpack['name'].'已经发放完了');
    		}
    		if(empty($user_id) && $level_id>=0){
    			if($level_id==0){
    				$user = M('users')->where("is_lock",0)->select();
    			}else{
    				$user = M('users')->where("is_lock",0)->where('level', $level_id)->select();
    			}
    			if($user){
    				$able = count($user);//本次发送量
    				if($redpack['createnum']>0 && $remain<$able){
    					$this->error($redpack['name'].'派发量只剩'.$remain.'张');
    				}
    				foreach ($user as $k=>$val){
    					$time = time();
                        $insert[] = ['rid' => $rid, 'type' => 1, 'uid' => $val['user_id'], 'send_time' => $time];
    				}
    			}
    		}else{
    			$able = count($user_id);//本次发送量
    			if($redpack['createnum']>0 && $remain<$able){
    				$this->error($redpack['name'].'派发量只剩'.$remain.'张');
    			}
    			foreach ($user_id as $k=>$v){
    				$time = time();
                    $insert[] = ['rid' => $rid, 'type' => 1, 'uid' => $v, 'send_time' => $time];
    			}
    		}
			DB::name('user_redpack')->insertAll($insert);
			M('redpack')->where("id",$rid)->setInc('send_num',$able);
			adminLog("发放".$able.'张'.$redpack['name']);
			$this->success("发放成功");
			exit;
    	}
    	$level = M('user_level')->select();
    	$this->assign('level',$level);
    	$this->assign('rid',$rid);
    	return $this->fetch();
    }
    
    public function send_cancel(){
    	
    }

    /*
     * 删除红包类型
     */
    public function del_redpack(){
        //获取红包ID
        $rid = I('get.id/d');
        // 查询红包是否被用
        $count = M('user_redpack')->where(array('rid'=>$rid))->count();
        if($count){
            $this->ajaxReturn(['status' => 0, 'msg' => '红包已发放，不可删除']);
        }
        //查询是否存在红包
        $row = M('redpack')->where(array('id'=>$rid))->delete();
        if (!$row) {
            $this->ajaxReturn(['status' => 0, 'msg' => '红包不存在，删除失败']);
        }
        
        //删除此类型下的红包
        M('user_redpack')->where(array('rid'=>$rid))->delete();
        $this->ajaxReturn(['status' => 1, 'msg' => '删除成功']);
    }


    /*
     * 红包详细查看
     */
    public function user_redpack(){
        //获取红包ID
        $rid = I('get.id/d');
        //查询是否存在红包
        $check_redpack = M('redpack')->field('id,type')->where(array('id'=>$rid))->find();
        if(!$check_redpack['id'] > 0)
            $this->error('不存在该类型红包');
       
        //查询该红包的列表的数量
        $sql = "SELECT count(1) as c FROM __PREFIX__user_redpack  l ".
                "LEFT JOIN __PREFIX__redpack c ON c.id = l.rid ". //联合红包表查询名称
                "LEFT JOIN __PREFIX__order o ON o.order_id = l.used_order_id ".     //联合订单表查询订单编号
                "LEFT JOIN __PREFIX__users u ON u.user_id = l.uid WHERE l.rid = :rid";    //联合用户表去查询用户名
        
        $count = DB::query($sql,['rid' => $rid]);
        $count = $count[0]['c'];
    	$Page = new Page($count,10);
    	$show = $Page->show();
        
        //查询该红包的列表
        $sql = "SELECT l.*,c.name,o.order_sn,u.nickname FROM __PREFIX__user_redpack  l ".
                "LEFT JOIN __PREFIX__redpack c ON c.id = l.rid ". //联合红包表查询名称
                "LEFT JOIN __PREFIX__order o ON o.order_id = l.used_order_id ".     //联合订单表查询订单编号
                "LEFT JOIN __PREFIX__users u ON u.user_id = l.uid WHERE l.rid = :rid".    //联合用户表去查询用户名
                " limit {$Page->firstRow} , {$Page->listRows}";
        $user_redpack = DB::query($sql,['rid' => $rid]);
        $this->assign('redpack_type',C('REDPACK_TYPE'));
        $this->assign('type',$check_redpack['type']);       
        $this->assign('lists',$user_redpack);            	
    	$this->assign('page',$show);
        $this->assign('pager',$Page);
        return $this->fetch();
    }
    
    /*
     * 删除一张红包
     */
    public function user_redpack_del(){
        //获取红包ID
        $rid = I('get.id');
        if(!$rid)
            $this->error("缺少参数值");
        //查询是否存在红包
         $row = M('user_redpack')->where(array('id'=>$rid))->delete();
        if(!$row)
            $this->error('删除失败');
        $this->success('删除成功');
    }
}