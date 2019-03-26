<?php

namespace app\api\controller;

use think\Db;

class Article extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'post';

		parent::__construct();
	}

	public function getContent(){
		$type = input('type');

		$article_id = 0;
		if($type == 1) $article_id = 1; // 用户协议
		if($type == 2) $article_id = 2; // 隐私策略

		$info = Db::name('article')
			->where('article_id', $article_id)
			->where('is_open', 1)
			->field('title, content')
			->find();

		if($info) $info['content'] = html_entity_decode($info['content']);

		response_success($info);
	}
}