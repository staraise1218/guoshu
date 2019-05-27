const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
var common = require("../../utils/common.js");
Page({
  data: {},
  onLoad() {
    console.log('*************************onLoad************************')
  },

  index: function (that) {
    wx.request({
      url: Globalhost + 'Api/index/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        city_code: wx.getStorageSync('addressCode') // 110100
      },
      success(res) {
        console.log(res)
      }
    })
  },
  onPullDownRefresh: function(){
    let that = this;
    console.log('loading')
    that.index(that);
    wx.request({
      url: Globalhost + 'Api/index/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        city_code: wx.getStorageSync('addressCode') // 110100
      },
      success(res) {
        wx.showToast({
          title: 'loading',
          icon: 'loading'
        })
        console.log(res)
      },
      complete: function() {
        wx.stopPullDownRefresh();
      }
    })
},


  modalcnt2: function () {
    wx.stopPullDownRefresh()
  }
})