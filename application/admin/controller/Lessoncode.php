<?php

namespace app\admin\controller;

use think\Page;
use think\Paginator;

class Lessoncode extends Base {

    public function index(){
        $page = I('page', 1);
        
        $where = "1 = 1";
        $keywords = trim(I('keywords'));
        $keywords && $where.=" and title like '%$keywords%' ";
       
        $list = M('lessoncode')
            ->where($where)
            ->order('id desc')
            ->paginate(20, false, ['page'=>$page, 'path'=>U('admin/lessoncode/index')]);

        $this->assign('list',$list);// 赋值数据集
        return $this->fetch();
    }

    public function add(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['title']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['title' =>'标题不能为空']]);

            $data['createtime'] = time();
            if(M('lessoncode')->insert($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }

        
        return $this->fetch();
    }

    public function edit(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['title']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['title' =>'标题不能为空']]);

            $id = $data['id'];

            if(M('lessoncode')->where('id', $id)->save($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }
        $id = I('id');
        $info = M('lessoncode')->where('id', $id)->find();

        $this->assign('info', $info);
        return $this->fetch();
    }

    public function del(){
        $id = I('id');

        if(false !== M('lessoncode')->where('id', $id)->delete()){
            $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
        } else {
            $this->ajaxReturn(['status' => 0, 'msg' => '操作失败']);
        }
    }

    // 课程码列表
    public function codelist(){
        $lessoncode_id = I('lessoncode_id');
        $page = I('page', 1);
        
        $where = "lessoncode_id = $lessoncode_id";
        $keywords = trim(I('keywords'));
        $keywords && $where.=" and code = $keywords ";
       
        $list = M('lessoncode_list')
            ->where($where)
            ->order('id desc')
            ->paginate(10, false, ['page'=>$page, 'path'=>U('admin/lessoncode/codelist', array('lessoncode_id'=>$lessoncode_id))]);
        
        $this->assign('lessoncode_id',$lessoncode_id);
        $this->assign('list',$list);
        return $this->fetch();
    }

    public function codeadd(){
        if($this->request->isPost()){
            
            $data = I('post.');
            $number = (int)$data['number'];

            if($number > 0){
                $codelist = $this->unique_rand($number);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '参数不对']);
            }

            $insertdata = array();
            foreach ($codelist as $item) {
                $insertdata[] = array(
                    'lessoncode_id' => $data['lessoncode_id'],
                    'code' => $item,
                );
            }

            if(M('lessoncode_list')->insertAll($insertdata)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }

        $lessoncode_id = I('lessoncode_id');
        $this->assign('lessoncode_id', $lessoncode_id);
        
        return $this->fetch();
    }

    /*
    * array unique_rand( int $min, int $max, int $num )
    * 生成一定数量的不重复随机数
    * $min 和 $max: 指定随机数的范围
    * $num: 指定生成数量
    */
    function unique_rand($num=1) {
        $min=1000;
        $max=9999;
        $count = 0;
        $return = array();
        while ($count < $num) {
            $return[] = substr(date('Ymd'), 2, 6).mt_rand($min, $max).substr(uniqid(mt_rand()), 0, 4);
            $return = array_flip(array_flip($return));
            $count = count($return);
        }
        shuffle($return);
        return $return;
    }
    
    public function exportcode(){
        $lessoncode_id = I('lessoncode_id');

        $strTable ='<table border="1">';
        $strTable .= '<tr>';
        $strTable .= '<td>课程码</td>';
        $strTable .= '<td>是否使用</td>';
        $strTable .= '</tr>';
        $count = M('lessoncode_list')
            ->where('lessoncode_id', $lessoncode_id)
            ->where('is_used', 0)
            ->count();
        $p = ceil($count/5000);
        for($i=0;$i<$p;$i++){
            $start = $i*5000;
            $end = ($i+1)*5000;
            $list = M('lessoncode_list')
                ->where('lessoncode_id', $lessoncode_id)
                ->where('is_used', 0)
                ->limit($start.','.$end)->select();
            if(is_array($list)){
                foreach($list as $k=>$val){
                    $strTable .= '<tr>';
                    $strTable .= '<td style="vnd.ms-excel.numberformat:@">'.$val['code'].'</td>';
                    $strTable .= '<td>'.$val['is_used'].' </td>';
                   
                    $strTable .= '</tr>';
                }
                unset($list);
            }
        }
        $strTable .='</table>';
        downloadExcel($strTable,'课程码-'.$i);
        exit();
    }
}