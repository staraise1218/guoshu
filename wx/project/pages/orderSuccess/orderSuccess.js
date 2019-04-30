const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    state: '',
    orderid: '',
    msg: {}
  },
  onLoad: function (options) {
    let that = this;
    console.log(options)
    if(options.state) {
      this.setData({
        state: options.state
      })
    }
    if(options.orderid) {
      this.setData({
        orderid: options.orderid
      })
    }
    wx.request({
      url: Globalhost + 'Api/order/order_detail',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        order_id: that.data.orderid,
        user_id: wx.getStorageSync('user_id')
      },
      success: function(res) {
        let data = res.data.data
        console.log(data)
        that.setData({
          msg: data
        })
      }
    })
  },
  /**
   * 取消订单
   */
  toCancel: function () {
    let that = this;
    wx.showModal({
      content: '是否取消订单',
      success: function() {
        wx.request({
          url: Globalhost + 'Api/order/cancel_order',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            user_id: wx.getStorageSync('user_id'),
            order_id: that.data.orderid
          },
          success: function(res) {
            console.log(res)
            if(res.data.code == 200) {
              wx.showToast({
                title: '订单已取消',
                icon: 'none'
              })
              wx.navigateBack({
                delta: 1
              });
            } else if(res.data.code == 400){
              wx.showModal({
                title: '温馨提示',
                content: res.data.msg,
              })
            }
          }
        })
      }
    })
  },
  /**
   * 删除订单
   */
  toDelete: function (e) {
    console.log(e)
    wx.request({
      url: Globalhost + 'Api/order/del_order',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        order_id: e.currentTarget.dataset.orderid
      },
      success: function(res) {
        console.log(res)
        if(res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          wx.navigateBack({
            delta: 1
          });
        }
      }
    })
  }
  ,
  toComment: function (e) {
    console.log(e.currentTarget.dataset.orderid)
    wx.navigateTo({
      url: '/pages/pinglun/pinglun?orderid=' + e.currentTarget.dataset.orderid
    })
  },
  toReceive: function (e) {
    console.log(e.currentTarget.dataset.orderid)
    wx.request({
      url: Globalhost + 'Api/order/receive_order',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        order_id: e.currentTarget.dataset.orderid
      },
      success: function(res) {
        console.log(res)
        if(res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          wx.navigateBack({
            delta: 1
          });
        }
      }
    })
  },
})