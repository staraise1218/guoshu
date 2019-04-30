Page({
  data: {

  },
  toCancel: function () {
    wx.showModal({
      content: '是否取消订单',
      success: function() {
        wx.showToast({
          title: '订单已取消',
          icon: 'success'
        })
      }
    })
  },
  toPay: function () {
    console.log('去付款')
  }
})