const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    page: 1,
    list: [],
    STATUS: true
  },
  onLoad: function (options) {
    var that = this;
    that.betLog(that, that.data.page);
  },
  betLog(that, page) {
    wx.request({
      url: Globalhost + 'api/user/userMoneyLog',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        page: page
      },
      success: function(res) {
        var data = res.data.data;
        console.log(data)
        if(data.length == 0) {
          that.setData({
            STATUS:false
          })
        }
        var list = that.data.list;
        data.forEach(item => {
          list.push(item)
        })
        that.setData({
          list: list
        })
        console.log(that.data.list)
      }
    })
  },
  asdf(e) {
    console.log(e)
    let that = this;
    let page = ++that.data.page
    let STATUS = that.data.STATUS;
    if(STATUS) {
      that.betLog(that, page);
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      })
    }
  }
})