<?php
/**
 
 * Author: dyr
 * Date: 2016-08-19
 */

namespace app\admin\controller;

use app\common\logic\MessageLogic;
use think\Page;
use think\AjaxPage;
use think\Db;

class Pickup extends Base {

    public function index(){
		$p = M('region2')->where(array('parentCode'=>'000000'))->select();
		$this->assign('province',$p);
        return $this->fetch();
    }

	public function ajaxPickupList(){
		$province_id = I('post.province_id');
		$city_id = I('post.city_id');
		$district_id = I('post.district_id');
		$order_by_field = I('post.order_by_field','pickup_id');
		$order_by_mode = I('post.order_by_mode','desc');
		$key_word = I('post.key_word');
		$pickup_where = array();
		// if(!empty($province_id)){
		// 	$pickup_where['p.province_id'] = $province_id;
		// }
		// if(!empty($city_id)){
		// 	$pickup_where['p.city_id'] = $city_id;
		// }
		// if(!empty($district_id)){
		// 	$pickup_where['p.district_id'] = $district_id;
		// }
		if(!empty($key_word)){
			$pickup_where['p.pickup_name'] = array('like',"%$key_word%");
		}
		// 配送点管理员看到自己配送点的商品
        if($this->role_id == 2){
            $city_code = $this->adminInfo['city_code'];
            $pickup_where['p.city_code'] = $city_code;
        }

		$count = DB::name('pick_up')->alias('p')->where($pickup_where)->count();
		$Page  = new AjaxPage($count,10);
		$show = $Page->show();

		$pickupList = DB::name('pick_up')
				->alias('p')
				->field('p.*,r1.name as province_name,r2.name as city_name,r3.name as district_name,s.suppliers_name')
				->join('__REGION__ r1','r1.code = p.province_code','LEFT')
				->join('__REGION__ r2','r2.code = p.city_code','LEFT')
				->join('__REGION__ r3','r3.code = p.district_code','LEFT')
				->join('__SUPPLIERS__ s','s.suppliers_id = p.suppliersid','LEFT')
				->where($pickup_where)
				->order($order_by_field.' '.$order_by_mode)
				->limit($Page->firstRow.','.$Page->listRows)
				->select();

		$this->assign('pickupList',$pickupList);
		$this->assign('page',$show);// 赋值分页输出
		$this->assign('pager',$Page);
		return $this->fetch();
	}

	public function add()
	{
		if (IS_POST) {
			$data = I('post.');
			$pickup_id = I('post.pickup_id');
			$model = M('pick_up');
			if (empty($pickup_id)) {
				//添加
				unset($pickup_id);
				$add_res = $model->add($data);
				if ($add_res === false) {
					$this->error('添加失败', U('Admin/Pickup/add'));
				} else {
					$this->error('添加成功', U('Admin/Pickup/index'));
				}
			} else {
				//修改
				$update_res = $model->where(array('pickup_id' => $pickup_id))->save($data);
				if ($update_res === false) {
					$this->error('更新失败', U('Admin/Pickup/edit_address', array('pickup_id' => $pickup_id)));
				} else {
					$this->success('更新成功', U('Admin/Pickup/index'));
				}
			}
		}
		$suppliers = M('suppliers')->where(array('is_check' => 1))->select();
		$p = M('region')->where(array('parent_id' => 0, 'level' => 1))->select();
		$this->assign('province', $p);
		$this->assign('suppliers', $suppliers);
		return $this->fetch();
	}

	/**
    * 地址编辑
    */
	public function edit_address(){
		$id = I('get.pickup_id');
		$pickup = M('pick_up')->where(array('pickup_id'=>$id))->find();
		//获取省份
		$p = M('region')->where(array('level'=>'1'))->select();
		$c = M('region')->where(array('level'=>2))->select();
		// $d = M('region')->where(array('parentCode'=>$pickup['city_code']))->select();
		$suppliers = M('suppliers')->where(array('is_check'=>1))->select();

		$this->assign('province',$p);
		$this->assign('city',$c);
		$this->assign('district',$d);
		$this->assign('suppliers',$suppliers);
		$this->assign('pickup',$pickup);
		return $this->fetch('add');
	}

	public function del()
	{
		$id = I('get.pickup_id');
		M('pick_up')->where(array('pickup_id' => $id))->delete();
		$return_arr = array('status' => 1, 'msg' => '操作成功', 'data' => '',);
		$this->ajaxReturn($return_arr);
	}

	// 审核自提点
	public function ajaxChangeStatus(){
		$status = I('status');
		$pickup_id = I('pickup_id');

		$pick_update_data = array(
			'status' => $status,
		);
		// 设为待审核或者已拒绝时，将开启状态关闭
		if($status == 2){
			$pick_update_data['is_open'] = 1;

			$user_update_data['role'] = 3; // 设为自提点角色
		} else {
			$pick_update_data['is_open'] = 0;

			$user_update_data['role'] = 1; // 取消自提点角色
		}

		Db::name('pick_up')->where('pickup_id', $pickup_id)->update($pick_update_data);

		// 更新用户角色
		$pickup = Db::name('pick_up')->where('pickup_id', $pickup_id)->find();
		Db::name('users')->where('user_id', $pickup['user_id'])->update($user_update_data);

		// 发送站内信
		$MessageLogic = new MessageLogic();
		$message = '您申请的自提点已审核通过';
		$MessageLogic->add($pickup['user_id'], $message);
	}
}