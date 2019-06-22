const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    msg: {}, // 订单详情
    orderid: '', // 订单id
    order_amount: ''
  },
  onLoad: function (options) {
    console.log(options)
    let that = this;
    that.setData({
      orderid: options.order_id,
      order_amount:  wx.getStorageSync('order_amount') || '',
      payMethod: wx.getStorageSync('payMethod')
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
  },
})