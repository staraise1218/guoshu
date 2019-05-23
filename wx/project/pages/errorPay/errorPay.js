Page({
  data: {
    orderid: ''
  },
  onLoad: function (options) {
    console.log(options)
    if(options.order_id) {
      this.setData({
        orderid: options.order_id
      })
    }
  },
  toOrder: function () {
    wx.reLaunch({
      url: '/pages/orderSuccess/orderSuccess?status=errorPay&orderid=' + this.data.orderid
    })
  },
  toHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  onShareAppMessage: function () {

  }
})