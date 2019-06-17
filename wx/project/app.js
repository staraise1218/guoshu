App({
  onLoad: function () {
    if (!wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  onLaunch: function () {

  },
  globalData: {
    Globalhost: 'https://app.zhuoyumall.com:444/',
    // Globalhost : 'http://guoshu.staraise.com.cn/',
    loadingfunc: function () {
      wx.showLoading({
        title: '加载中',
        mask: 'true'
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    },
  },
})