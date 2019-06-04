const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    DO: '',           // 加载页面 peisong   ziti
    order_id: '',     // 订单id
    orderInfo: {},    // 订单信息
  },
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      order_id: options.orderid,
      DO: options.DO
    })
    switch(options.DO) {
      case 'peisong':
          that.getPeisongList(that, options.orderid)
          break;
      case 'ziti':
          that.getZitiList(that, options.orderid)
          break;
      default:
          console.log('参数错误')
          break;
    }
  },
  // 加载配送员订单列表
  getPeisongList: function (that, order_id) {
    wx.request({
      url: Globalhost + 'Api/order/order_detail_express',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        order_id: order_id
      },
      success: function(res) {
        console.log(res)
        let data = res.data.data;
        data.add_time = that.formatDate(data.add_time);
        that.setData({
          orderInfo: data
        })
      }
    })
  },
  // 加载自提点列表
  getZitiList(that, order_id) {
    wx.request({
      url: Globalhost + 'Api/order/order_detail_pickup',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        order_id: order_id
      },
      success: function(res) {
        console.log(res)
        let data = res.data.data;
        data.add_time = that.formatDate(data.add_time);
        that.setData({
          orderInfo: data
        })
      }
    })
  },
  // 配送员送达
  toSend: function () {
    let that = this;
    wx.request({
      url: Globalhost + 'Api/order/arrive',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        order_id: that.data.order_id
      },
      success: function(res) {
        console.log(res);
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        if(res.data.code == 200) {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1000)
        }
      }
    })
  },
  // 自提点 提货
  toTiHuo(e) {
    console.log(e.currentTarget.dataset.orderid)
    wx.request({
      url: Globalhost + 'Api/order/confirm_tihuo',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        order_id: e.currentTarget.dataset.orderid
      },
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        if(res.data.code == 200) {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1000)
        }
      }
    })
  },
  formatDate : function (date) {
      if(date.length == 10) {
        date = date*1000
      }
      date = Number(date)
      date = new Date(date);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;  
      m = m < 10 ? '0' + m : m;  
      var d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      return y + '-' + m + '-' + d;  
  },
  onShareAppMessage: function () {

  }
})