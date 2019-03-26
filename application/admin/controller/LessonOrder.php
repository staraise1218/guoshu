<?php

namespace app\admin\controller;

use think\Page;
use think\Paginator;

class LessonOrder extends Base {

    public function index(){
        $page = I('page', 1);
        
        $where = "paystatus = 1";
        $keywords = trim(I('keywords'));
        $keywords && $where.=" and u.fullname like '%$keywords%' ";
       
        $list = M('lesson_order')->alias('lo')
            ->join('users u', 'lo.user_id=u.user_id')
            ->join('lesson l', 'lo.lesson_id=l.id')
            ->where($where)
            ->order('lo.id desc')
            ->field('u.fullname, u.mobile, u.head_pic, u.ID_number, l.title, lo.order_sn, lo.price, lo.createtime, lo.paytime, lo.paymethod')
            ->paginate(20, false, ['page'=>$page, 'path'=>U('admin/lesson_order/index')]);


        $this->assign('list',$list);// 赋值数据集
        
        return $this->fetch();
    }
}