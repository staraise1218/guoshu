/**
 * 购物车抛物线东环
 */
function timeManage(){//时间控制器，让多个parabola公用一个定时器
    this.fns=[];//所有需要运行的程序
    this.uid=0;//计数器
    this.can_run=false;//没有内容，不运行
  }
  timeManage.prototype.add=function(fn,arg){
    this.fns.push({
      id:this.uid++,
      fn:fn,
      arg:arg
    });
    if(!this.can_run){
      this.can_run = true;
      this.run();
    }
    
    
  }
  timeManage.prototype.run = function () {
    var self=this;
    if(this.can_run){
      this.fns.forEach(function(t,i){//运行所有的方法
        var rs=t.fn(t.arg);
        if(!rs){//fn运行完了
          self.del(t.id);
        }
      });
     // 
    if(this.can_run)
      setTimeout(this.run.bind(this), 40);
    }
  }
  timeManage.prototype.del = function (id) {
    this.fns=this.fns.filter(function(n,i){
      return n.id!=id;
    });
    if(this.fns.length){
      this.can_run=true;
    }else{
      this.can_run=false;
    }
  }
  
  var _timeManage = new timeManage();
  
  
  function parabola(option) {
    this.data = {
      start: '', //开始
      end: '', //结束,
      numbers:20,//总共分成多少份
      callback:null,//每次的回调
      finish:null,//完成
    }
    this.init(option);
  }
  parabola.prototype.init = function (option) {
    this.data.start = option.start || {
      x: 0,
      y: 0
    };
    this.data.end = option.end || {
      x: 0,
      y: 0
    };
    this.data.callback = option.callback||function(){};
    this.data.finish = option.finish || function () { };
  
    this.data.start.y = Math.max(0, this.data.start.y);//不能小于0
    this.data.end.y = Math.max(0, this.data.end.y);//不能小于0
  }
  parabola.prototype.getData = function () {
    
    var k = Math.min(this.data.start.y, this.data.end.y) - Math.abs(this.data.start.x - this.data.end.x) / 3, //预算顶点纵坐标y
      k = Math.max(0, k);
  
      
      
    if (this.data.start.x == this.data.end.x) { //垂直方向相同
      var h = 0,
        a = 0;
    } else if (this.data.start.y == this.data.end.y && this.data.start.y == 0) { //水平方向相同且都是在0上
      var h = 0,
        a = 0;
    } else if (this.data.start.y == 0 && this.data.start.y != this. data.end.y) { //顶点为起点的
      var h = this.data.start.x,
        a = this.data.end.y / Math.pow(this.data.end.x - h, 2);
    } else if (this.data.end.y == 0 && this.data.start.y != this.data.end.y) { //顶点为终点的
      var h = this.data.end.x,
        a = this.data.start.y / Math.pow(this.data.start.x - h, 2)
    } else { //正常情况
      var _ = -Math.sqrt((this.data.start.y - k) / (this.data.end.y - k)),
        h = (_ * this.data.end.x - this.data.start.x) / (_ - 1), //顶点横坐标h
        a = (this.data.start.y - k) / Math.pow(this.data.start.x - h, 2);
    }
  
    return {
      count: 0,
      h: h,
      k: k,
      a: a
    }
  }
  parabola.prototype.move = function (data) {
    if (data.count <= this.data.numbers) {
      if (data.a != 0) {
        var x = this.data.start.x + (data.count / this.data.numbers) * (this.data.end.x - this.data.start.x),
          y = data.a * Math.pow(x - data.h, 2) + data.k;
      } else {
        var x = this.data.start.x + (data.count / this.data.numbers) * (this.data.end.x - this.data.start.x),
          y = this.data.start.y + (data.count / this.data.numbers) * (this.data.end.y - this.data.start.y);
      }
  
      if (this.data.end.width && this.data.end.height && this.data.start.width && this.data.start.height) {//控制大小
        var w = this.data.start.width - (this.data.start.width - this.data.end.width) * Math.sin((data.count / this.data.numbers) * Math.PI / 2),
          h = this.data.start.height - (this.data.start.height - this.data.end.height) * Math.sin((data.count / this.data.numbers) * Math.PI / 2);
      }
  
      if (this.data.callback){
        this.data.callback(x,y,w,h);
      }
      data.count+=1;
      return true;
    }else{
      if (this.data.finish) {
        this.data.finish();
      }
      return false;
    }
  }
  parabola.prototype.run = function (option) {
    
    var data = this.getData();
    
  
    _timeManage.add(this.move.bind(this,data));
  }
  
  module.exports = {
    parabola:parabola
  }