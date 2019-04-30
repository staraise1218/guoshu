const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    card: [{
      
    }],
    msg: ''
  },
  onLoad: function (options) {
    let that = this;
    console.log(options)
    that.setData({
      msg: options.msg
    })
    wx.request({
      url: Globalhost + 'Api/user/coupon',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        page: 1
      },
      success: function (res) {
        console.log(res)
        let data = res.data.data;

        var card = []
        for(var i = 0; i < data.length; i++) {
          card[i] = {
            cid: "",
            money: "",
            use_scope: "",
            use_end_time: "",
            use_start_time: ""
          };
          var cCid = 'card[' + i + '].cid',
              cMoney = 'card[' + i + '].money',
              cUse_scope = 'card[' + i + '].use_scope',
              cUse_end_time = 'card[' + i + '].use_end_time',
              cStatus = 'card[' + i + '].status',
              cUse_start_time = 'card[' + i + '].use_start_time';



              
          data[i].use_start_time = that.formatDate(data[i].use_start_time)
          data[i].use_end_time = that.formatDate(data[i].use_end_time)
          that.setData({
            [cCid] : data[i].cid,
            [cMoney] : data[i].money,
            [cUse_scope] : data[i].use_scope,
            [cUse_end_time] : data[i].use_end_time,
            [cStatus] : data[i].status,
            [cUse_start_time] : data[i].use_start_time
          })
        }
      }
    })
  },
  toCouponlist: function () {
    wx.navigateTo({
      url: '/pages/couponlist/couponlist'
    })
  },
  toOrder: function (e) {
    let that = this;
    if(that.data.msg == 'order') {
      console.log(e.currentTarget.dataset)
      wx.navigateTo({
        url: '/pages/order/order?coupon_id=' + e.currentTarget.dataset.couponid + '&coupon_index=' + e.currentTarget.dataset.couponindex
      })
    }
  },
  formatDate : function (date) {
      if(date.length == 10) {
        date = date*1000
      }
      date = Number(date)
      date = new Date(date);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;  
      m = m < 10 ? '0' + m : m;  
      var d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      return y + '-' + m + '-' + d;  
  }
})