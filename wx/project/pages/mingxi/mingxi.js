const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    orderList: [
      {
        change_time: "2018-03-29 18:08:00",
        desc: "订单取消，退回10.00元,0积分",
        order_sn: "201801311409282905",
        user_money: -10.00
      }
    ]
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: Globalhost + 'api/user/userMoneyLog',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        page: 1
      },
      success: function(res) {
        console.log(res)
        var data = res.data.data;
        var orderList = []
        for(var i = 0; i < data.length; i++) {
          orderList[i] = {
            change_time: '',
            desc: '',
            order_sn: '',
            user_money: ''
          };
          var ORchange_time = 'orderList['+i+'].change_time',
              ORdesc = 'orderList['+i+'].desc',
              ORorder_sn = 'orderList['+i+'].order_sn',
              ORuser_money = 'orderList['+i+'].user_money';
          that.setData({
            [ORchange_time]: data[i].change_time,
            [ORdesc]: data[i].desc,
            [ORorder_sn]: data[i].order_sn,
            [ORuser_money]: data[i].user_money,
          })
        }
      }
    })
  },
})