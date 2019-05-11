<?php

namespace app\api\controller;
use think\Db;

class Task extends Base {
    public function __construct(){
        // 设置所有方法的默认请求方式
        $this->method = 'GET';

        parent::__construct();
    }

    // 没5分钟更新一次 人气代表大会数据
	public function generateCongress(){
       
	}

    public function test(){
        echo date('Y-m-d H:i:s');
        echo phpinfo();

    }
}