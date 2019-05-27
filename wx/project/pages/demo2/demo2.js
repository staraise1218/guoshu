

    var app = getApp();
    Page({
      data: {
        GZtate: true,
        // 轮播
        imgUrls: [
          '../../src/img/gouwuche-pre.png',
          '../../src/img/gouwuche-pre.png',
          '../../src/img/gouwuche-pre.png',
          '../../src/img/gouwuche-pre.png',
        ],
        indicatorDots: false,
        interval: 5000,
        duration: 1000,
        autoplay: true,
        // over
     
        list:[],
     
      clientHeight:0, arr:[], arrHight:[] 
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        const self = this;
        wx.getSystemInfo({
          success: function (res) {
            self.setData({
              clientHeight: res.windowHeight
            });
          }
        })
        // console.log(options)
        var tarrHight = [];
        app.util.request({
          'url': 'entry/wxapp/list',
          data: {
            category: options.category ? options.category : '',
          },
          'cachetime': '30',
          success(res) {
            //console.log(res);
            self.setData({
              list: res.data.data
            })
            // 
            var arr = [];
            var length = Array.from(res.data.data).length;
            var isD = length % 2 == 0 ? true : false;
            
            for (var i = 0; i < length; i++) {
              arr[i] = false;
              tarrHight[i] = Math.floor(i / 2) * (320 / 750) * 520;
            }
            self.setData({
              arr: arr,
              list: Array.from(res.data.data),
              arrHight: tarrHight
            })
            //  console.log(self.data.arr)
            // 
          },
        })
        for (var i = 0; i < self.data.list.length; i++) {
          if (tarrHight[i] < self.data.scrollTop) {
            if (arr[i] == false) {
              arr[i] = true;
            }
          }
        }
        // 上拉加载
        //点击搜索按钮，触发事件 
        self.setData({
          listPageNum: 1, //第一次加载，设置1 
          List: [], //放置返回数据的数组,设为空 
          isFromlist: true, //第一次加载，设置true 
          listLoading: true, //把"上拉加载"的变量设为true，显示 
          listLoadingComplete: false //把“没有数据”设为false，隐藏 
        })
        self.fetchlist();
      },
    scroll: function (e) {
        //console.log(this.data);
        var seeHeight = this.data.clientHeight; //可见区域高度
        var arrHight = this.data.arrHight;
        var event = e;
        var scrollTop = event.detail.scrollTop;
        var arr = this.data.arr;
        // console.log(scrollTop)
        for (var i = 0; i < this.data.list.length; i++) {
          if (arrHight[i] < scrollTop) {
            if (arr[i] == false) {
              arr[i] = true;
              // arr[i*2]   arr[i*2+1] 
            }
            //n = i + 1;
          }
          //arr[i] = true;
        }
        this.setData({
          arr: arr,
          scrollTop:scrollTop
        })
      },
})