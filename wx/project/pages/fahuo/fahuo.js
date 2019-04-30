Page({
  data: {

  },
  toCancel: function () {
    wx.showModal({
      content: '是否取消订单',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            title: '订单已取消',
            icon: 'success',
            duration: 2000
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})