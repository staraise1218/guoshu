<?php
namespace app\admin\validate;
use think\Validate;
class Redpack extends Validate
{
    // 验证规则
    protected $rule = [
        ['name', 'require'],
        ['money', 'require'],
        ['condition', 'require|checkCondition'],
        ['createnum', 'require'],
        ['type', 'require'],
        ['send_start_time', 'require|checkSendTime'],
        ['send_end_time', 'require'],
        ['use_start_time', 'checkUserTime'],
    ];
    //错误信息
    protected $message  = [
        'name.require'                  => '红包名称必须',
        'money.require'                 => '请填写红包面额',
        'condition.require'             => '请填写消费金额',
        'condition.checkCondition'      => '消费金额不能小于红包金额',
        'createnum.require'             => '请填写发放数量',
        'type.require'                  => '请选择发放类型',
        'send_start_time.require'       => '请选择发放开始日期',
        'send_start_time.checkSendTime' => '发放结束日期不得小于发放开始日期',
        'send_end_time.require'         => '请选择发放结束日期',
        'use_start_time.checkUserTime' => '使用结束日期不得小于使用开始日期',
    ];
    /**
     * 检查发放日期
     * @param $value|验证数据
     * @param $rule|验证规则
     * @param $data|全部数据
     * @return bool|string
     */
    protected function checkSendTime($value, $rule ,$data)
    {
        return ($value >= $data['send_end_time']) ? false : true;
    }

    /**
     * 检查用户使用时间
     * @param $value
     * @param $rile
     * @param $data
     * @return bool
     */
    protected function checkUserTime($value,$rile,$data){
        return ($value >= $data['use_end_time']) ? false : true;
    }
    /**
     * 检查消费金额
     * @param $value|验证数据
     * @param $rule|验证规则
     * @param $data|全部数据
     * @return bool|string
     */
    protected function checkCondition($value, $rule ,$data)
    {
        return ($value < $data['money']) ? false : true;
    }
}