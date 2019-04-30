const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    shouyiList: [],
    user_money: 0, 
  },
  onLoad: function (options) {
    let that = this;
    that.loadList(that);
    if(wx.getStorageSync('user_money')) {
      this.setData({
        user_money: wx.getStorageSync('user_money')
      })
    }
  },
  loadList: function (that) {
    wx.request({
      url: Globalhost + 'Api/user/account_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'), // 	用户id
        // type: 1,// 	0 无 1 订单退差价 2 自提点订单收益 3 商品消费
        page: 1, // 	页码
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          shouyiList: res.data.data,

        })
        var shouyiList = []
        for(var i = 0; i < res.data.data.length; i++) {
          shouyiList[i] = {};
          var str = 'shouyiList[' + i + '].change_time'
          var msg = that.formatDate(res.data.data[i].change_time)
          that.setData({
            [str]: msg
          })
        }
      }
    })
  },
  formatDate: function (date) {
    if (date.length == 10) {
      date = date * 1000
    }
    date = Number(date)
    date = new Date(date);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
  },
  onShareAppMessage: function () {

  }
})