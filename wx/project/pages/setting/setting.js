Page({
  data: {

  },
  onLoad: function (options) {

  },
  toAgreement: function () {
    wx.navigateTo({
      url: '/pages/agreement/greement'
    })
  },
  toClear: function () {
    wx.showModal({
      content: '是否清除缓存',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.clearStorage()
          wx.showToast({
            title: '缓存清除成功',
            icon: 'success',
            duration: 2000
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
          content: '当前版本' + res.platform,
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
      url: '/pages/passwordSeeting/passwordSeeting'
    })
  }
})