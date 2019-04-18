<?php

namespace app\api\controller;

use think\Db;

class Region extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = '*';

		parent::__construct();
	}


    public function getJson(){
    	$regions = M('region2')->field('name, code, parentCode')->select();

    	$data = array();
  		foreach ($regions as $region) {
  			$data[$region['code']] = $region;
  		}

  		$data = $this->_tree($data);
  		response_success($data);
    }
    


   	/**
   	 * 生成目录树结构
   	 */
	  private function _tree($data){

   		$tree = array();
   		foreach ($data as $item) {
               if(isset($data[$item['parentCode']])){
                  $data[$item['parentCode']]['sub'][] = &$data[$item['code']];
               } else {
                  $tree[] = &$data[$item['code']];
               }
   		}

   		return $tree;
   	}
    /*
     * 获取地区
     */
    public function getRegion(){
        $parent_code = I('get.parent_code/d');
        $selected = I('get.selected',0);        
        $data = M('region2')->where("parentCode",$parent_code)->select();
        $html = '';
        if($data){
            foreach($data as $h){
              if($h['id'] == $selected){
                $html .= "<option value='{$h['code']}' selected>{$h['name']}</option>";
              }
                $html .= "<option value='{$h['code']}'>{$h['name']}</option>";
            }
        }
        echo $html;
    }
    

    public function getTwon(){
      $parent_code = I('get.parent_code/d');
      $data = M('region2')->where("parentCode",$parent_code)->select();
      $html = '';
      if($data){
        foreach($data as $h){
          $html .= "<option value='{$h['code']}'>{$h['name']}</option>";
        }
      }
      if(empty($html)){
        echo '0';
      }else{
        echo $html;
      }
    }

    /**
     * 获取省
     */
    public function getProvince()
    {
        $province = Db::name('region')->field('id,name')->where(array('level' => 1))->cache(true)->select();
        $res = array('status' => 1, 'msg' => '获取成功', 'result' => $province);
        exit(json_encode($res));
    }
}