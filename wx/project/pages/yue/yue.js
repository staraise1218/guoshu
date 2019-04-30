const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    user_money: 0
  },
  onLoad: function (options) {
    var that = this;
    if(wx.getStorageSync('user_id')) {
      wx.request({
        url: Globalhost + 'Api/user/getUserInfo',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user_id: wx.getStorageSync('user_id')
        },
        success: function(res) {
          console.log(res)
          that.setData({
            user_money: res.data.data.user_money
          })
        }
      })
    } else {
      wx.showToast({
        title: '未登录',
        icon: 'none'
      })
    }
  },
  toMingxi: function () {
    wx.navigateTo({
      url: '/pages/mingxi/mingxi'
    })
  }
})