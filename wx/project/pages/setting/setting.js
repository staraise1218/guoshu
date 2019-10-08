Page({
  data: {

  },
  onLoad: function (options) {
    let that = this;
    console.log('*************************onLoad************************');
    let user_id = wx.getStorageSync("user_id") || "0"
    that.setData({
      user_id: user_id
    })
  },
  onShow() {
    let that = this;
    let user_id = wx.getStorageSync("user_id") || "0"
    that.setData({
      user_id: user_id
    })
  },
  toAgreement: function () {
    wx.navigateTo({
      url: '/pages/agreement/greement'
    })
  },
  toClear: function () {
    wx.showModal({
      content: '是否退出登录',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.clearStorage()
          wx.showToast({
            title: '已退出',
            icon: 'success',
            duration: 2000
          })
          wx.reLaunch({
            url: '/pages/loading/loading?tiyanStatus=T'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  edition: function () {
    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        wx.showModal({
          content: '当前版本 1.1.6',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  },
  toLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  toCelve: function () {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    })
  },
  toPassword: function () {
    wx.navigateTo({
      // url: '/pages/passwordSeeting/passwordSeeting'
      url: '/pages/password/password'
    })
  }
})