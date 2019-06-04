const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
    opSTATUS: '',         // 上一个页面传过来的加载页面状态  [默认 配送中]
    STATUS: 'SENDING',    // 显示与加载的页面 默认 配送中
    SENDING: [],          // 配送中
    TODAY: [],            // 今日送达
    SENDED: [],           // 已送达

  },
  onLoad: function (options) {
    let that = this;
    
    // 判断高亮显示
    that.setData({
      STATUS: options.opSTATUS || 'SENDING'
    })
  },
  onShow: function () {
    let that = this;
    that.getOrderInfo(that, that.data.STATUS); // 配送中： SENDING; 今日送达： TODAY ； 已送达： SENDED
  },
  // 加载列表
  getOrderInfo: function (that, type, page) {
    let posData = {
      user_id: wx.getStorageSync('user_id'),
      page: page || 1,
      type: type || 'SENDING'
    }
    wx.request({
      url: Globalhost + 'Api/order/expressman_order_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: posData,
      success: function(res) {
        console.log(res)
        if(res.data.code == 200) {
          wx.showToast({
            title: 'loading...',
            icon: 'loading',
            duration: 60000
          })
          let data = res.data.data;
          var len = data.length;
          for(var i = 0; i < len; i++) {
            data[i].pay_time = that.formatDate(data[i].pay_time)
          }
          switch (type) {
            case 'SENDING': // 配送中
              that.setData({
                SENDING: data
              })
              break;
            case 'TODAY':
                that.setData({
                  TODAY: data
                })
                break;
            case 'SENDED':
                that.setData({
                  SENDED: data
                })
                break;
            default:
              console.log('参数错误')
                that.setData({
                  SENDING: data
                })
                break;
          }
        } else {
          wx.showToast({
            title: '请求错误 ： getOrderInfo',
            icon: 'none'
          })
        }
      },
      complete: function () {
        setTimeout(() => {
          wx.hideToast()
        }, 500)
      }
    })
  },
  // 打电话
  toCall: function (e) {
    console.log(e.currentTarget.dataset.phone)
    wx.showModal({
      title: '拨打电话？',
      content: e.currentTarget.dataset.phone,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.dataset.phone
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
  // 切换
  changTab: function (e) {
    let that = this;
    this.setData({
      STATUS: e.currentTarget.dataset.status
    })
    that.getOrderInfo(that, e.currentTarget.dataset.status)
    // console.log(this.data)
  },
  // 跳转详情
  toCon: function (e) {
    console.log(e.currentTarget.dataset.orderid)
    wx.navigateTo({
      url: '/pages/peisonCon/peisonCon?DO=peisong&orderid=' + e.currentTarget.dataset.orderid
    })
  },
  // 上拉加载
  loadMore: function (e) {
    console.log(e)
  }

})