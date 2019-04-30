const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    msg: {}, // 订单详情
    orderid: '', // 订单id
  },
  onLoad: function (options) {
    console.log(options.orderid)
    let that = this;
    that.setData({
      orderid: options.orderid
    })
    that.orderCon(that);
  },







  orderCon: function (that) {
    wx.request({
      url: Globalhost + 'Api/order/order_detail',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        order_id: that.data.orderid,
        user_id: wx.getStorageSync('user_id')
      },
      success: function(res) {
        console.log(res)
        that.setData({
          msg: res.data.data
        })
      }
    })
  },

  toHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  toOrder: function () {
    let that = this;
    wx.showToast({
      title: '敬请期待',
      icon: 'none'
    })
    // wx.navigateTo({
    //   url: '/pages/orderSuccess/orderSuccess?orderid='+that.data.orderid
    // })
  }
})