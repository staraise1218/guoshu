<?php

namespace app\admin\controller;

use think\Page;
use think\Paginator;

class LessonEpisode extends Base {

    public function index(){
        $page = I('page', 1);
        $lesson_id = I('lesson_id');
        
        $where = "lesson_id={$lesson_id} and is_delete = 0";
        $keywords = trim(I('keywords'));
        $keywords && $where.=" and title like '%$keywords%' ";
       
        $list = M('lessonEpisode')
            ->where($where)
            ->order('id desc')
            ->paginate(20, false, ['page'=>$page, 'path'=>U('admin/lessonEpisode/index', array('lesson_id'=>$lesson_id))]);

        $this->assign('lesson_id',$lesson_id);
        $this->assign('list',$list);
        
        return $this->fetch();
    }

    public function add(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['title']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['title' =>'标题不能为空']]);

            if(M('lessonEpisode')->insert($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }

        $lesson_id = I('lesson_id');
        $this->assign('lesson_id', $lesson_id);
        return $this->fetch();
    }

    public function edit(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['title']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['title' =>'标题不能为空']]);

            $id = $data['id'];

            if(M('lessonEpisode')->where('id', $id)->save($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }
        $id = I('id');
        $info = M('lessonEpisode')->where('id', $id)->find();

        $this->assign('info', $info);
        return $this->fetch();
    }

    public function del(){
        $id = I('id');

        if(false !== M('lessonEpisode')->where('id', $id)->update(array('is_delete'=>1))){
            $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
        } else {
            $this->ajaxReturn(['status' => 0, 'msg' => '操作失败']);
        }
    }
}