const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    card: [{
      "id": 20,
      "name": "九月九",
      "money": "50.00",
      "condition": "2000.00",
      "use_start_time": 1509008132,
      "use_end_time": 1607417732
    }]
  },
  onLoad: function (options) {
    let that = this;
    that.list(that);
  },
  onShow: function () {
    let that = this;
    that.list(that);
  },
  /**
   * 优惠券数据
   */
  list: function (that) {
    wx.request({
      url: Globalhost + 'Api/user/couponlist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        page: 1
      },
      success: function (res) {
        let data = res.data.data;
        console.log(data)
        // that.formatDate(data.use_start_time)
        var card = []
        for (var i = 0; i < data.length; i++) {
          card[i] = {}
          var cId = 'card[' + i + '].id',
            cName = 'card[' + i + '].name',
            cMoney = 'card[' + i + '].money',
            cCondition = 'card[' + i + '].condition',
            cStime = 'card[' + i + '].use_start_time',
            cEtime = 'card[' + i + '].use_end_time'


          data[i].use_start_time = that.formatDate(data[i].use_start_time)
          data[i].use_end_time = that.formatDate(data[i].use_end_time)

          that.setData({
            [cId]: data[i].id,
            [cName]: data[i].name,
            [cMoney]: data[i].money,
            [cCondition]: data[i].condition,
            [cStime]: data[i].use_start_time,
            [cEtime]: data[i].use_end_time
          })
        }
      }
    })
  },
  /***
   * 领取优惠券
   */
  lingqu: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.request({
      url: Globalhost + 'Api/user/getCoupon',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        coupon_id: e.currentTarget.dataset.id
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: ''
          })
        } else if (res.data.code == 400) {
          wx.showModal({
            title: '',
            content: '' + res.data.msg,
          })
        }
      }
    })
  },
  formatDate: function (date) {
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