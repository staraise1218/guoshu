const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    currentTab: 0,
    reaHeight: 0,
    orderInfo: [],
    waitPayMsg: [],       // 未支付
    paiedMsg: [],         // 已支付
    waitccommentMsg: [],  // 待评价
    refundMsg: [],        // 退款
    wait: [],

    // 未支付：WAITPAY， 已支付：PAIED， 待评价：WAITCCOMMENT， 退款：REFUND
  },
  onLoad: function (options) {
    let that = this;
    console.log(options.pageStatus)
    that.setData({
      currentTab: options.pageStatus
    })

    /**
     * 判断高度
     */
    // var dom = '.item-box-' + options.pageStatus
    // setTimeout(function () {
    //   var query = wx.createSelectorQuery()
    //   // query.select('.item-box-1').boundingClientRect()
    //   query.select(dom).boundingClientRect()
    //   query.selectViewport().scrollOffset()
    //   query.exec(function (res) {
    //     res[0].top // #the-id节点的上边界坐标
    //     res[1].scrollTop // 显示区域的竖直滚动位置
    //     // console.log('打印demo的元素的信息', res);
    //     // console.log('打印高度', res[0].height);
    //     that.setData({
    //       reaHeight: 'height:' + (res[0].height + 20) + 'px'
    //     })
    //   })
    // }, 1000)
    // 判断高度 END
  },
  onShow: function () {
    let that = this;
    that.loadWaitpay(that);
    that.loadWaitCcomment(that);
    that.loadWaitSend(that);
    that.loadTuiKuan(that);
  },

  //滑动切换 
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if (e.currentTarget.dataset.current == 0) {
      var query = wx.createSelectorQuery()
      query.select('.item-box-1').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        res[0].top // #the-id节点的上边界坐标
        res[1].scrollTop // 显示区域的竖直滚动位置
        console.log('打印demo的元素的信息', res);
        console.log('打印高度', res[0].height);
        that.setData({
          reaHeight: 'height:' + (res[0].height + 20) + 'px'
        })
      })
    } else if (e.currentTarget.dataset.current == 1) {
      var query = wx.createSelectorQuery()
      query.select('.item-box-2').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        res[0].top // #the-id节点的上边界坐标
        res[1].scrollTop // 显示区域的竖直滚动位置
        console.log('打印demo的元素的信息', res);
        console.log('打印高度', res[0].height);
        that.setData({
          reaHeight: 'height:' + (res[0].height + 20) + 'px'
        })
      })
    } else if (e.currentTarget.dataset.current == 2) {
      var query = wx.createSelectorQuery()
      query.select('.item-box-3').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        res[0].top // #the-id节点的上边界坐标
        res[1].scrollTop // 显示区域的竖直滚动位置
        console.log('打印demo的元素的信息', res);
        console.log('打印高度', res[0].height);
        that.setData({
          reaHeight: 'height:' + (res[0].height + 20) + 'px'
        })
      })
    }
  },
  //点击切换 
  clickTap: function (e) {
    var that = this;
    console.log(e)
    console.log(e.currentTarget.dataset.current)
    that.setData({
      currentTab: e.currentTarget.dataset.current
    })
    if (e.currentTarget.dataset.current == 0) {
      var query = wx.createSelectorQuery()
      query.select('.item-box-1').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        res[0].top // #the-id节点的上边界坐标
        res[1].scrollTop // 显示区域的竖直滚动位置
        console.log('打印demo的元素的信息', res);
        console.log('打印高度', res[0].height);
        that.setData({
          reaHeight: 'height:' + (res[0].height + 20) + 'px'
        })
      })
    } else if (e.currentTarget.dataset.current == 1) {
      var query = wx.createSelectorQuery()
      query.select('.item-box-2').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        res[0].top // #the-id节点的上边界坐标
        res[1].scrollTop // 显示区域的竖直滚动位置
        console.log('打印demo的元素的信息', res);
        console.log('打印高度', res[0].height);
        that.setData({
          reaHeight: 'height:' + (res[0].height + 20) + 'px'
        })
      })
    } else if (e.currentTarget.dataset.current == 2) {
      var query = wx.createSelectorQuery()
      query.select('.item-box-3').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        res[0].top // #the-id节点的上边界坐标
        res[1].scrollTop // 显示区域的竖直滚动位置
        console.log('打印demo的元素的信息', res);
        console.log('打印高度', res[0].height);
        that.setData({
          reaHeight: 'height:' + (res[0].height + 20) + 'px'
        })
      })
    } else if (e.currentTarget.dataset.current == 4) {
      var query = wx.createSelectorQuery()
      query.select('.item-box-4').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        res[0].top // #the-id节点的上边界坐标
        res[1].scrollTop // 显示区域的竖直滚动位置
        console.log('打印demo的元素的信息', res);
        console.log('打印高度', res[0].height);
        that.setData({
          reaHeight: 'height:' + (res[0].height + 20) + 'px'
        })
      })
    }
  },
  /**
   * 跳转
   */
  go: function (e) {
    console.log(e.currentTarget.dataset.orderid)
    console.log(e.currentTarget.dataset.state);
    var state = e.currentTarget.dataset.state;
    wx.navigateTo({
      url: '/pages/orderSuccess/orderSuccess?state=' + e.currentTarget.dataset.state + '&orderid=' + e.currentTarget.dataset.orderid
    })
  },
  // 未支付
  loadWaitpay: function (that) {
    wx.request({
      url: Globalhost + 'Api/order/order_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id') ,
        type: 'WAITPAY',
        page: 1
      },
      success: function (res) {
        let data = res.data.data;
        for(var i = 0; i < data.length; i++) {
          data[i].add_time = that.formatDate(Number(data[i].add_time))
        }
        setTimeout(()=> {
          that.setData({
            waitPayMsg: data
          })
        }, 200)
      }
    })
  },
  // 已支付
  loadWaitSend: function (that) {
    wx.request({
      url: Globalhost + 'Api/order/order_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id') ,
        type: 'PAIED',
        page: 1
      },
      success: function (res) {
        let data = res.data.data;
        for(var i = 0; i < data.length; i++) {
          data[i].pay_time = that.formatDate(Number(data[i].pay_time))
        }
        setTimeout(()=> {
          that.setData({
            paiedMsg: data
          })
        }, 200)
      }
    })
  },
  // 待评价
  loadWaitCcomment: function (that) {
    wx.request({
      url: Globalhost + 'Api/order/order_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        type: 'WAITCCOMMENT',
        page: 1
      },
      success: function(res) {
        let data = res.data.data;
        for(var i = 0; i < data.length; i++) {
          data[i].pay_time = that.formatDate(Number(data[i].pay_time))
        }
        setTimeout(()=> {
          that.setData({
            waitccommentMsg: data
          })
        }, 200)
      }
    })
  },
  // 退款
  loadTuiKuan: function (that) {
    wx.request({
      url: Globalhost + 'Api/order/order_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        type: 'REFUND',
        page: 1
      },
      success: function(res) {
        let data = res.data.data;
        for(var i = 0; i < data.length; i++) {
          data[i].pay_time = that.formatDate(Number(data[i].pay_time))
        }
        setTimeout(()=> {
          that.setData({
            refundMsg: data
          })
        }, 200)
      }
    })
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let that = this;
    wx.showModal({
      content: '确定取消订单吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: Globalhost + 'Api/order/cancel_order',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              user_id: wx.getStorageSync('user_id'),
              order_id: e.currentTarget.dataset.orderId
            },
            success: function(res) {
              console.log(res)
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
              // that.listLoad(that);
              that.loadWaitpay(that);
              that.loadWaitCcomment(that);
              that.loadWaitSend(that);
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 删除订单
   */
  delOrder: function () {
    wx.showModal({
      content: '确定删除订单吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            title: '订单已删除',
            icon: 'success',
            duration: 2000
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 确定收货吗
   */
  shouhuo: function () {
    wx.showModal({
      content: '确定收货吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            title: '收货成功',
            icon: 'success',
            duration: 2000
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 评论
   */
  toPinglun: function (e) {
    // console.log(e.currentTarget.dataset.orderId)
    // console.log(e.currentTarget.dataset.orderSn)
    wx.navigateTo({
      url: '/pages/pinglun/pinglun?orderid=' + e.currentTarget.dataset.orderId + '&orderSn=' + e.currentTarget.dataset.orderSn
    })
  },
  /**
   * 支付方式弹窗
   */
  toPay: function (e) {
    console.log(e.currentTarget.dataset)
    let orderId = e.currentTarget.dataset.orderId
    console.log(orderId)
    this.setData({
      alertPayShow: true,
      orderId: orderId,
      order_sn: e.currentTarget.dataset.orderSn,
      orderamount: e.currentTarget.dataset.orderamount
    })
  },
  // 关闭支付弹窗
  closePay: function () {
    this.setData({
      alertPayShow: false,
    })
  },
  // 微信支付
  wxpay: function () {
    let that = this;
    this.setData({
      alertPayShow: false
    })
    wx.request({
      url: Globalhost + 'Api/Wxapplet/unifiedOrder',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        order_sn: that.data.order_sn,
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        console.log(res)
        wx.showToast({
          title: res.data.msg,
          icon: 'none'
        })
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp, // 时间
          'nonceStr': res.data.data.nonceStr, // 随机字符串
          'package': res.data.data.package, // prepayId
          'signType': res.data.data.signType, // 签名算法
          'paySign': res.data.data.paySign, // 签名
          'success': function (res) {
            console.log(res)
            wx.navigateTo({
              url: '/pages/paySuccess/paySuccess?order_id=' + orderId
            })
          }
        })
      }
    })
  },

  yuepay: function () {
    this.setData({
      alertPayShow: false,
      yueShow: true
    })
  },
  


  // 余额支付弹出
  set_wallets_password(e) { //获取钱包密码
    let that = this;
    this.setData({
      wallets_password: e.detail.value
    });
    if (this.data.wallets_password.length == 6) { //密码长度6位时，自动验证钱包支付结果
      that.setData({
        yueShow: false
      })
      wx.request({
        url: Globalhost + 'api/pay/topay',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          order_sn: that.data.order_sn,
          paymentMethod: 'money'
        },
        success: function (res) {
          wx.navigateTo({
            url: '/pages/paySuccess/paySuccess?order_amount=' + wx.getStorageSync('order_amount') + '&order_id=' + wx.getStorageSync('order_id') + '&order_sn=' + wx.getStorageSync('order_sn')
          })
        }
      })
    }
  },
  set_Focus() { //聚焦input
    console.log('isFocus', this.data.isFocus)
    this.setData({
      isFocus: true
    })
  },
  set_notFocus() { //失去焦点
    this.setData({
      isFocus: false
    })
  },
  close_wallets_password() { //关闭钱包输入密码遮罩
    this.setData({
      isFocus: false, //失去焦点
      yueShow: false,
      wallets_password: ''
    })
  },
  closeError: function () {
    this.setData({
      errorShow: false
    })
  },

  
  formatDate : function (date) {
      // if(date.length == 10) {
      // }
      date = Number(date)
      date = date*1000
      date = new Date(date);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;  
      m = m < 10 ? '0' + m : m;  
      var d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      var asd = y + '-' + m + '-' + d
      console.log(asd)
      return y + '-' + m + '-' + d;  
  }

})