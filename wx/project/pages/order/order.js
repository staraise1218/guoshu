const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    address: {},
    cartList: {},
    retMsg: {},
    youhuiquan: {},

    couponList: [], // 优惠券
    coupon_id: '', // 优惠券ID
    coupon_index: 0, // 优惠券 index

    order_amount: '', // 应付金额
    addressid: '', // 地址id
    order_sn: '', //订单号
    paystatus: 'wx', // 支付方式 【默认微信】

    pickup_id: '', // 自提点 id
    List: [], // 自提点列表
    byNowGoodId: '', // 立即购买时的 byNowGoodId

    status: '',  // 页面状态 【byNow：立即购买】

    payMethods: 'weixin', // 【默认微信支付】、余额支付 yue
  },
  onLoad: function (options) {
    let that = this;
    console.log(options)
    // that.address(that);
    // 选择优惠券 跳转回来
    if (options.coupon_index) {
      that.setData({
        coupon_index: options.coupon_index,
        coupon_id: options.coupon_id
      })
    }
    // 门店自取
    if (options.pickup_id) {
      that.setData({
        pickup_id: options.pickup_id
      })
    }
    // 立即购买 goodId
    if(options.status == "byNow") {
      if (options.goodId) {
        that.setData({
          byNowGoodId: options.goodId,
          status: 'byNow'
        })
        wx.request({
          url: Globalhost + 'Api/cart/cart2',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            user_id: wx.getStorageSync('user_id'),
            action: 'buy_now',
            goods_id: that.data.byNowGoodId,
            goods_num: 1
          },
          success: function (res) {
            console.log(res)
            that.setData({
              address: res.data.data.address,
              cartList: res.data.data.cartList
            })
            console.log(that.data)
          }
        })
      }
    }
    //我的订单 ---> 订单详情
    if (options.orderId) {
      that.orderDetal(that, options.orderId)
    } 
    if(!options.orderId || options.status != "byNow"){
      that.loadList(that);
      that.order1(that); // 订单确认页（1）
    }
    // that.order1Buy(that); // 确认订单(1) 确认购买
  },
  onShow: function (options) {
    let that = this;
    if (wx.getStorageSync('chooseAddressId')) {
      // that.address(that);
    }
  },

  /**
   * 提交订单
   */
  toPay: function () {
    let that = this;
    let posData = {};
    if (that.data.pickup_id) { // 自取
      posData = {
        user_id: wx.getStorageSync('user_id'), // 用户id
        coupon_id: that.data.coupon_id, // 优惠券id
        address_id: that.data.address.address_id, // 地址id
        action: 'cart', // 动作：立即购买：buy_now 购物车结算：cart
        dosubmit: 1, // 提交订单时传入1
        send_method: 2, // 自取
        pickup_id: that.data.pickup_id
      }
      if(this.data.status == 'byNow') {
        posData.action = 'buy_now'
      }
    } else { // 送货上门
      posData = {
        user_id: wx.getStorageSync('user_id'), // 用户id
        coupon_id: that.data.coupon_id, // 优惠券id
        address_id: that.data.address.address_id, // 地址id
        action: 'cart', // 动作：立即购买：buy_now 购物车结算：cart
        dosubmit: 1, // 提交订单时传入1
        send_method: 1 // 送货上门
      }
      if(this.data.status == 'byNow') {
        posData.action = 'buy_now'
      }
    }

    wx.request({
      url: Globalhost + 'Api/cart/cart3',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: posData,
      success: function (res) {
        console.log(res)
        that.setData({
          order_sn: res.data.data.order_sn
        })
        console.log(that.data)
        wx.setStorageSync('order_sn', res.data.data.order_sn);
        if(res.data.code == 200) {
          that.wxPay(that); // 微信支付
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })

  },
  /**
   * 微信支付
   */
  wxPay: function (that) {
    wx.request({
      url: Globalhost + 'Api/Wxapplet/unifiedOrder',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        order_sn: that.data.order_sn,
        openid: 'omnTc4kbM0dc4Cj3Q6V32EF8jXaQ'
      },
      success: function (res) {
        console.log(res)
        let data = res.data.data;
        wx.request({
          url: Globalhost + 'api/WxappletBuyGoodsCallback/testpay',
          method: 'POST',
          data: {
            order_sn: that.data.order_sn
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == 200) {
              wx.showToast({
                title: res.data.msg,
                icon: 'success'
              })
              wx.navigateTo({
                url: '/pages/paySuccess/paySuccess?orderid=' + that.data.order_sn
              })
            }
          }
        })
        // wx.requestPayment({
        //   timeStamp: data.timeStamp,
        //   nonceStr: data.nonceStr,
        //   package: data.package,
        //   signType: data.signType,
        //   paySign: data.paySign,
        //   success: function(res){
        //     console.log(res)
        //   },
        //   fail: function(res){
        //     console.log(res)
        //   }
        // })
      }
    })
  },

  /**
   * 选择优惠券
   */
  toYouHui: function () {
    wx.navigateTo({
      url: '/pages/youhuiquan/youhuiquan?msg=order'
    })
  },

  /**
   * 我的优惠券
   */
  myYouhui: function (that) {
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
        let data = res.data.data;
        console.log(data)
        that.setData({
          couponList: data
        })
      }
    })
  },

  /**
   * 订单确认页（2）（提交订单）
   */
  order2: function (that) {
    wx.request({
      url: Globalhost + 'Api/cart/cart3',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'), //用户id
        action: 'cart', //动作：立即购买：buy_now 购物车结算：cart
      },
      success: function (res) {
        let data = res.data.data;
        console.log(data)
        that.setData({
          retMsg: data,
          order_amount: data.order_amount
        })
      }
    })
  },

  /**
   * 订单确认页（1）
   * 购物车
   */
  order1: function (that) {
    if(that.data.status == 'byNow') {
      console.log(that.data)
      var posData = {
        user_id: wx.getStorageSync('user_id'),
        action: 'buy_now ',
        goods_id: that.data.byNowGoodId,
        goods_num: 1
      }
    } else {
      var posData = {
        user_id: wx.getStorageSync('user_id'),
        action: 'cart'
      }
    }
    wx.request({
      url: Globalhost + 'Api/cart/cart2',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: posData,
      success: function (res) {
        let data = res.data.data;
        console.log(res)
        that.setData({
          address: data.address,
          cartList: data.cartList,
          couponList: data.couponList
        })
        that.myYouhui(that); // 我的优惠券
        that.order2(that); // 订单确认（2）
        wx.setStorageSync('addressid', data.address.address_id)
      }
    })
  },
  /**
   * 订单确认页（1）
   * 立即购买
   */
  // order1Buy: function (that) {
  //   wx.request({
  //     url: Globalhost + 'Api/cart/cart2',
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     data: {
  //       user_id: wx.getStorageSync('user_id'),
  //       action: 'buy_now',
  //       goods_id: that.data.byNowGoodId
  //     },
  //     success: function (res) {
  //       let data = res.data.data;
  //       console.log(res)
  //       that.setData({
  //         address: data.address,
  //         cartList: data.cartList,
  //         couponList: data.couponList
  //       })
  //       that.myYouhui(that); // 我的优惠券
  //       // that.order2(that); // 订单确认（2）
  //       wx.setStorageSync('addressid', data.address.address_id)
  //     }
  //   })
  // },
  /**
   * 选择地址
   */
  address: function (that) {
    wx.request({
      url: Globalhost + 'Api/Address/address_list',
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
        console.log(res)
        for (var i = 0; i < data.length; i++) {
          if (data[i].address_id == wx.getStorageSync('chooseAddressId')) {
            that.setData({
              address: data[i]         
            })
          }
        }
        console.log(that.data.address)
      }
    })
  },
  /**
   * 选则地址
   */
  toAddress: function () {
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },
  /**
   * 选择支付方式
   */
  choosePayBtn: function (e) {
    console.log(e.currentTarget.dataset.paystatus);
    this.setData({
      paystatus: e.currentTarget.dataset.paystatus
    })
  },

  /**
   * 自提点列表加载
   */
  loadList: function (that) {
    wx.request({
      url: Globalhost + 'Api/cart/getPickupList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            List: res.data.data
          })
        } else {
          wx.showToast({
            title: '数据出错',
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 跳转自取
   */
  toziqu: function () {
    let that = this;
    wx.navigateTo({
      url: '/pages/storeList/storeList?goodId=' + that.data.byNowGoodId
    })
  },
})