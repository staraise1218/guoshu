const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {

  },
  onLoad: function (options) {
    let that = this;
    that.index(that)
  },
  index: function (that) {
    loadingfunc(); // 加载函数
    wx.request({
      url: Globalhost + 'Api/index/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        city_code: wx.getStorageSync('addressCode'),//110100
      },
      success: function (res) {
        let data = res.data.data
        that.setData({
          topCateGoods: data.topCateGoods
        })
      }
    })
  },
  onShareAppMessage: function () {

  }
})