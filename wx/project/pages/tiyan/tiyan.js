Page({
  data: {

  },
  onLoad: function (options) {

  },
  toLogin() {
    wx.showModal({
      title: '您未登录',
      content: '是否前往登录界面',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.reLaunch({
            url: '/pages/loading/loading?tiyanStatus=T'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})