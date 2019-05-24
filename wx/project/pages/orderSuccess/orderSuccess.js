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
  toCancel: function (e) {
    let that = this;
    wx.showModal({
      content: '是否取消订单',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: Globalhost + 'Api/order/cancel_order',
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
  toPay: function (e) {
    let that = this;
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '请选择支付方式',
      confirmText: '微信支付',
      cancelText: '余额支付',
      success(res) {
        if (res.confirm) {
          console.log('微信支付')
          wx.request({
            url: Globalhost + 'Api/Wxapplet/unifiedOrder',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              order_sn: e.currentTarget.dataset.ordersn,
              openid: wx.getStorageSync('openid')
            },
            success: function(res) {
              console.log(res)
              wx.requestPayment({
                'timeStamp': res.data.data.timeStamp, // 时间
                'nonceStr': res.data.data.nonceStr, // 随机字符串
                'package': res.data.data.package, // prepayId
                'signType': res.data.data.signType, // 签名算法
                'paySign': res.data.data.paySign, // 签名
                'success': function (res) {
                  console.log(res)
                  
                  // wx.setStorageSync('chooseStatus', 'END')  // 清空优惠券状态
                  wx.navigateTo({
                    url: '/pages/paySuccess/paySuccess?order_amount=' + that.data.msg.total_amount + '&order_id=' + that.data.msg.order_id + '&order_sn=' + that.data.msg.order_sn
                  })
                }
              })
            }
          })



        } else if (res.cancel) {
          console.log('余额支付')
        }
      }
    })
    // if(that.data.payMethods == 'wx') {  // 微信支付
    //   if(wx.getStorageSync('openid')) {
    //     wx.request({
    //       url: Globalhost + 'Api/cart/cart3',
    //       method: 'POST',
    //       header: {
    //         'content-type': 'application/x-www-form-urlencoded'
    //       },
    //       data: {
    //         user_id: wx.getStorageSync('user_id'),
    //         address_id: that.data.Address_id,
    //         coupon_id: that.data.Coupon_id,
    //         user_money: 0,
    //         action: that.data.Action,
    //         goods_id: that.data.Goods_id,
    //         goods_num: 1,
    //         dosubmit: 1,
    //         send_method: 1
    //       },
    //       success: function(res) {
    //         console.log(res)
    //         let ordermsg = res.data.data;
    //         that.setData({
    //           Order_sn: res.data.data.order_sn
    //         })
    //         wx.request({
    //           url: Globalhost + 'Api/Wxapplet/unifiedOrder',
    //           method: 'POST',
    //           header: {
    //             'content-type': 'application/x-www-form-urlencoded'
    //           },
    //           data: {
    //             order_sn: res.data.data.order_sn,
    //             openid: wx.getStorageSync('openid')
    //           },
    //           success: function(res) {
    //             wx.requestPayment({
    //               'timeStamp': res.data.data.timeStamp, // 时间
    //               'nonceStr': res.data.data.nonceStr, // 随机字符串
    //               'package': res.data.data.package, // prepayId
    //               'signType': res.data.data.signType, // 签名算法
    //               'paySign': res.data.data.paySign, // 签名
    //               'success': function (res) {
    //                 console.log(res)
                    
    //                 wx.setStorageSync('chooseStatus', 'END')  // 清空优惠券状态
    //                 wx.navigateTo({
    //                   url: '/pages/paySuccess/paySuccess?order_amount=' + ordermsg.order_amount + '&order_id=' + ordermsg.order_id + '&order_sn=' + ordermsg.order_sn
    //                 })
    //               }
    //             })
    //           }
    //         })
    //       }
    //     })
    //   } else {
    //     wx.navigateTo({
    //       url: '/pages/wxlogin/wxlogin'
    //     })
    //   }
    // } else { // 余额支付
    //   wx.request({
    //     url: '',
    //     url: Globalhost + 'Api/cart/cart3',
    //     method: 'POST',
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded'
    //     },
    //     success: function(res) {
          
    //     }
    //   })
    // }
  },
  toHome: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})