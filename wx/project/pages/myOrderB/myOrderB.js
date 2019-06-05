const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    opSTATUS: '',               // 上一个页面传过来的加载页面状态  [默认 全部]
    STATUS: 'ALL',              // 显示与加载的页面 默认 待收货（未提货）
    ALL: [],                    // 全部
    TODAYRECIEVE: [],           // 今日提货
    WAITRECEIVE: [],            // 待收货（未提货）
  },
  onLoad: function (options) {
    let that = this;
    that.setData({
      STATUS: options.opSTATUS || 'ALL'
    })
  },
  onShow: function () {
    let that = this;
    that.getList(that, that.data.STATUS)
  },
  changTab(e) {
    let that = this;
    console.log(e.currentTarget.dataset.status)
    this.setData({
      STATUS: e.currentTarget.dataset.status
    })
    that.getList(that, e.currentTarget.dataset.status)
  },
  getList: function (that, type, page) {
    let posData = {
      user_id: wx.getStorageSync('user_id'),
      type: type || 'ALL',
      page: page || 1
    }
    wx.request({
      url: Globalhost + 'Api/order/pickup_order_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: posData,
      success: function(res) {
        console.log(res)
        let data = res.data.data;
        let len = data.order_list.length;
        for(var i = 0; i < len; i++) {
          data.order_list[i].pay_time = that.formatDate(data.order_list[i].pay_time );
        }
        switch(type) {
          case 'ALL':
              that.setData({
                ALL: data.order_list
              })
              break;
          case 'TODAYRECIEVE':
              that.setData({
                TODAYRECIEVE: data.order_list
              })
              break;
          case 'WAITRECEIVE':
              that.setData({
                WAITRECEIVE: data.order_list
              })
              break;
          default:
              that.setData({
                ALL: data.order_list
              })
              break;
        }
        that.setData({
          user_money: data.user_money
        })
      }
    })
  },
  toYue: function () {
    wx.navigateTo({
      url: '/pages/shouyiB/shouyiB'
    })
  },
  toCon(e) {
    console.log(e.currentTarget.dataset.orderid)
    wx.navigateTo({
      url: '/pages/peisonCon/peisonCon?DO=ziti&orderid=0' + e.currentTarget.dataset.orderid
    })
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
},
})