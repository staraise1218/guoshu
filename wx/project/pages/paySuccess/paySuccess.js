const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    msg: {}, // 订单详情
    orderid: '', // 订单id
  },
  onLoad: function (options) {
    console.log(options)
    let that = this;
    that.setData({
      orderid: options.order_id
    })
  },
  toHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  toOrder: function (e) {
    console.log(e.currentTarget.dataset.orderId)
    wx.navigateTo({
      url: '/pages/orderSuccess/orderSuccess?orderid='+e.currentTarget.dataset.orderId
    })
  }
})