Page({
  data: {
    imgUrls: [
      'https://app.zhuoyumall.com/wx/img/引导页1-1.png',
      'https://app.zhuoyumall.com/wx/img/引导页1-2.png',
      'https://app.zhuoyumall.com/wx/img/引导页1-3.png'
    ]
  },
  onLoad: function () {
    wx.setStorageSync('FIRST', '不是第一次登陆了')
  },
  toIndex: function () {
    wx.reLaunch({
      url: '/pages/loading/loading'
    })
  }
})