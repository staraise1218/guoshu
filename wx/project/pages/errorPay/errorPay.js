Page({
  data: {
    orderid: '',
    order_amount: '',
    msg: '支付失败'
  },
  onLoad: function (options) {
    console.log(options)
    if(options.order_id) {
      this.setData({
        orderid: options.order_id,
        msg: options.msg == '' ? '支付失败': options.msg
      })
    }
    this.setData({
      order_amount: wx.getStorageSync('order_amount') || '',
      payMethod: wx.getStorageSync('payMethod')
    })

    
  },
  toOrder: function () {
    wx.redirectTo({
      url: '/pages/orderSuccess/orderSuccess?status=errorPay&orderid=' + this.data.orderid
    })
    // wx.reLaunch({
    //   url: '/pages/orderSuccess/orderSuccess?status=errorPay&orderid=' + this.data.orderid
    // })
  },
  toHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  onShareAppMessage: function () {

  }
})