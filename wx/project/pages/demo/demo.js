const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
var common = require("../../utils/common.js");
Page({
  data: {
    Page: '', // 页面 []
    Action: '', // 支付时传参
    Address: {}, // 地址
    Address_id: '', // 地址id
    GoodList: [], // 商品
    Goods_id: '', // 商品id 【立即购买】
    RedEnvelopes: [], // 红包
    RedEnvelopes_id: '', // 红包id
    CouponList: [], // 优惠券列表
    Coupon_id: '', // 优惠券id
    ORDERINFO: '', // 订单信息
    PayMethods: '', // 支付方式
    Store_id: '', // 门店id
    StoreList: [], // 门店列表
    Status: '', // buy_now cart
    payMethods: 'wx', // 【默认微信支付】、余额支付 yue

    payment_mode: 1, //默认支付方式 微信支付
    isFocus: false, //控制input 聚焦
    balance: 100, //余额
    actual_fee: 20, //待支付
    wallets_password_flag: false, //密码输入遮罩
    storeListShow: false,
    addressListShow: false
  },
  onLoad: function (options) {
    let that = this;
    // console.log(options)
    // if(options.getPickupListPosdata) {
    //   let getPickupListPosdata = options.getPickupListPosdata;
    //   getPickupListPosdata = JSON.parse(getPickupListPosdata);
    //   that.loadList(that, getPickupListPosdata)
    // }
    // that.setData({
    //   options: options
    // })
    // // 购物车
    // let posdata2 = {};
    // if(options.page == 'shoppingCart') {  
    //   if(options.send_method == 1) {// 配送
    //     posdata2 = {
    //       user_id: wx.getStorageSync('user_id'),
    //       action: 'cart'
    //     }
    //   } else {  // 自取
    //     posdata2 = {
    //       user_id: wx.getStorageSync('user_id'),
    //       action: 'cart'
    //     }
    //   }
    // }
    // // 自取
    // // if(options.page == 'storeList') {
    // //   options.options = JSON.parse(options.options);
    // //   that.setData({
    // //     'options.options': options.options
    // //   })
    // //   posdata2 = {
    // //     user_id: wx.getStorageSync('user_id'),
    // //     action: 'buy_now'
    // //   }
    // // }
    // // 详情
    // if(options.page == "commodityDeatils") {
    //   if(options) { // 配送
    //     posdata2 = {
    //       user_id: wx.getStorageSync('user_id'),
    //       action: 'buy_now',
    //       goods_id: options.goodId,
    //       goods_num: 1
    //     }
    //   } else { // 自取

    //   }
    // }

    var posdata2 = {};
    switch (wx.getStorageSync('PAYSTATUS')) {
      case 0:
        posdata2 = {
          action: 'cart',
          user_id: wx.getStorageSync('user_id')
        }
        break;
      case 1:
        posdata2 = {
          action: 'cart',
          user_id: wx.getStorageSync('user_id')
        }
        break;
      case 2:
        posdata2 = {
          action: 'buy_now',
          user_id: wx.getStorageSync('user_id'),
          goods_id: wx.getStorageSync('goods_id'),
          goods_num: wx.getStorageSync('goods_num')
        }
        break;
      case 3:
        posdata2 = {
          action: 'buy_now',
          user_id: wx.getStorageSync('user_id'),
          goods_id: wx.getStorageSync('goods_id'),
          goods_num: wx.getStorageSync('goods_num')
        }
        break;
    }
    that.cart2(that, posdata2);









  },
  onShow: function () {
    let that = this;
    that.loadAddress(that)
  },
  cart2: function (that, posdata2, callback) {
    wx.request({
      url: Globalhost + 'Api/cart/cart2',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: posdata2,
      success: function (res) {
        console.log(res)
        if (res.data.data.address.length == 0) {
          wx.showModal({
            title: '未设置地址',
            content: '请先填写地址',
            confirmText: '去填写',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/address/address'
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          })

        }
        // let options = that.data.options;
        // if (options.options) {
        //   options.options = JSON.parse(options.options)
        // }
        if (res.data.code == 200) {

          // if (that.data.options.Store_id) { // 自提点id
          // if (options.page == "commodityDeatils") { // 立即购买
          //     posdata3 = {
          //       user_id: wx.getStorageSync('user_id'), // 用户id
          //       address_id: res.data.data.address.address_id || 0, // 地址id
          //       user_money: 0, // 使用的余额数
          //       action: 'buy_now', // 动作：立即购买：buy_now 购物车结算：cart
          //       send_method: 2, // 提交订单参数，配送方式 1 送货上门 2 门店自取
          //       pickup_id: that.data.options.Store_id,
          //       goods_num: 1,
          //       goods_id: options.options.goodId,
          //     }
          //   } else { // 购物车
          //     posdata3 = {
          //       user_id: wx.getStorageSync('user_id'), // 用户id
          //       address_id: res.data.data.address.address_id || 0, // 地址id
          //       user_money: 0, // 使用的余额数
          //       action: 'cart', // 动作：立即购买：buy_now 购物车结算：cart
          //       send_method: 2, // 提交订单参数，配送方式 1 送货上门 2 门店自取
          //       pickup_id: that.data.options.Store_id,
          //     }
          //   }
          //   // that.loadList(that);
          // } else { // 配送
          //   console.log(res)
          //   posdata3 = {
          //     user_id: wx.getStorageSync('user_id'), // 用户id
          //     address_id: res.data.data.address.address_id || 0, // 地址id
          //     user_money: 0, // 使用的余额数
          //     action: options.action, // 动作：立即购买：buy_now 购物车结算：cart
          //     send_method: options.send_method, // 提交订单参数，配送方式 1 送货上门 2 门店自取
          //     goods_id: options.goodId,
          //     goods_num: 1,
          //   }
          // }
          // if (res.data.data.couponList.length > 0) {
          //   posdata3.coupon_id = res.data.data.couponList[0].id // 优惠券id
          //   that.setData({
          //     CouponList: res.data.data.couponList || [], // 优惠券列表
          //     Coupon_id: res.data.data.couponList[0].id || '', // 选中优惠券id【默认第一个】
          //   })
          // }
          // }
          let posdata3 = {}
          that.setData({
            Address: res.data.data.address, // 地址
            Address_id: res.data.data.address.address_id, // 地址id
            GoodList: res.data.data.cartList.cartList, // 商品列表
            // posdata3: posdata3
          })
          switch (wx.getStorageSync('PAYSTATUS')) {
            case 0:
              posdata3 = {
                user_id: wx.getStorageSync('user_id'),
                address_id: res.data.data.address.address_id || '',
                action: 'cart',
                send_method: 1
              }
              break;
            case 1:
              posdata3 = {
                user_id: wx.getStorageSync('user_id'),
                address_id: res.data.data.address.address_id || '',
                action: 'cart',
                send_method: 2
              }
              break;
            case 2:
              posdata3 = {
                user_id: wx.getStorageSync('user_id'),
                address_id: res.data.data.address.address_id || '',
                action: 'buy_now',
                goods_id: wx.getStorageSync('goods_id'),
                goods_num: wx.getStorageSync('goods_num'),
                send_method: 1
              }
              break;
            case 3:
              posdata3 = {
                user_id: wx.getStorageSync('user_id'),
                address_id: res.data.data.address.address_id || '',
                action: 'buy_now',
                goods_id: wx.getStorageSync('goods_id'),
                goods_num: wx.getStorageSync('goods_num'),
                send_method: 1
              }
              break;
          }
          try {
            posdata3.coupon_id = res.data.data.couponList[0].id
          } catch (error) {
            console.log(error)
          }

          that.cart3(that, posdata3)

        }
      }
    })
  },
  cart3: function (that, posdata3) {
    console.log(posdata3)
    wx.request({
      url: Globalhost + 'Api/cart/cart3',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: posdata3,
      success: function (res) {
        console.log(res)
        that.setData({
          ORDERINFO: res.data.data // 订单详情
        })
      }
    })
  },

  // 自提点列表
  loadList: function (that, posdata) {
    wx.request({
      url: Globalhost + 'Api/cart/getPickupList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: posdata,
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            StoreList: res.data.data
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
   * 选择支付方式
   */
  choosePayBtn: function (e) {
    if (e.currentTarget.dataset.paystatus == "yue") {
      this.setData({
        payMethods: 'yue'
      })
    } else if (e.currentTarget.dataset.paystatus == 'wx') {
      this.setData({
        payMethods: 'wx'
      })
    }
  },
  /**
   * 选则优惠券
   */
  toYouHui: function (e) {
    let that = this;
    console.log(that.data.CouponList)
    var arr = [];
    for (var i = 0; i < that.data.CouponList.length; i++) {
      arr[i] = that.data.CouponList[i].coupon.money
    }
    wx.showActionSheet({
      itemList: arr,
      success(res) {
        console.log(that.data.CouponList)
        console.log(res.tapIndex)
        for (var j = 0; j < that.data.CouponList.length; j++) {
          that.setData({
            Coupon_id: that.data.CouponList[res.tapIndex].id
          })
        }
        that.setData({
          'posdata3.coupon_id': that.data.CouponList[res.tapIndex].id,
        })
        setTimeout(() => {
          that.cart3(that, that.data.posdata3);
        }, 200);
      },
      fail(res) {
        console.log(res.errMsg)
        wx.showToast({
          title: '没有其他可用红包',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 选择地址 弹窗 加载
   */
  loadAddress: function (that) {
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
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            ADDRESSLIST: res.data.data || []
          })
          var arr = [];
          for (var i = 0; i < res.data.data.length; i++) {
            arr[i] = res.data.data[i].address
          }
          console.log(arr)
        }
      }
    })
  },

  /**
   * 选择地址 弹窗 选择
   */
  toAddress: function (that) {
    this.setData({
      addressListShow: true
    })
  },
  chooseAddress: function (e) {
    let that = this;
    console.log(e)
    console.log(that.data)
    console.log(that.data.Address)
    for (var i = 0; i < that.data.ADDRESSLIST.length; i++) {
      if (that.data.ADDRESSLIST[i].address_id == e.currentTarget.dataset.id) {
        that.setData({
          Address: that.data.ADDRESSLIST[i],
          addressListShow: false,
        })
      }
    }
  },
  closeAddress: function () {
    let that = this;
    that.setData({
      addressListShow: false
    })
  },
  /**
   * 选择自提点
   */
  toStoreList: function () {
    // let that = this;
    // console.log(that.data.StoreList)
    // var arr = [];
    // for(var i = 0; i < that.data.StoreList.length; i++) {
    //   arr[i] = that.data.StoreList[i].fulladdress;
    // }
    // wx.showActionSheet({
    //   itemList: arr,
    //   success(res) {
    //     console.log(res.tapIndex)
    //     for(var j = 0; j < that.data.StoreList.length; j ++) {
    //       that.setData({
    //         'options.Store_id': that.data.StoreList[res.tapIndex].pickup_id
    //       })
    //     }
    //     that.setData({
    //       'posdata3.coupon_id': that.data.CouponList[res.tapIndex].id,
    //     })
    //     setTimeout(() => {
    //       that.cart3(that, that.data.posdata3);
    //     }, 200);
    //   },
    //   fail(res) {
    //     console.log(res.errMsg)
    //   }
    // })
    this.setData({
      storeListShow: true
    })

  },
  choosePickup: function (e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      storeListShow: false,
      'options.Store_id': e.currentTarget.dataset.id
    })
  },
  closePickup: function () {
    this.setData({
      storeListShow: false
    })
  },

  toPay: function () {
    let that = this;
    let payData = {};
    switch(wx.getStorageSync('PAYSTATUS')) {
      case 0:
          payData = {
            user_id: wx.getStorageSync('user_id'),
            address_id: that.data.Address_id,
            action: 'cart',
            dosubmit: 1,
            send_method: 1,
            delivery_code: wx.getStorageSync('addressCode')
          }
          break;
      case 1:
          payData = {
            user_id: wx.getStorageSync('user_id'),
            address_id: that.data.Address_id,
            action: 'cart',
            dosubmit: 1,
            send_method: 2,
            pickup_id: wx.getStorageSync('pickup_id'),
            delivery_code: wx.getStorageSync('addressCode')
          }
          break;
      case 2:
          payData = {
            user_id: wx.getStorageSync('user_id'),
            address_id: that.data.Address_id,
            action: 'buy_now',
            goods_id: wx.getStorageSync('goods_id'),
            goods_num: wx.getStorageSync('goods_num'),
            dosubmit: 1,
            send_method: 1,
            pickup_id: wx.getStorageSync('pickup_id'),
            delivery_code: wx.getStorageSync('addressCode')
          }
          break;
      case 3:
          payData = {
            user_id: wx.getStorageSync('user_id'),
            address_id: that.data.Address_id,
            action: 'buy_now',
            goods_id: wx.getStorageSync('goods_id'),
            goods_num: wx.getStorageSync('goods_num'),
            dosubmit: 1,
            send_method: 2,
            pickup_id: wx.getStorageSync('pickup_id'),
            delivery_code: wx.getStorageSync('addressCode')
          }
          break;
    }
    // payMethod: 'wxpay',
    switch(that.data.payMethods) {
      case 'wx': // 微信支付
        payData.payMethod = 'wxpay';
        that.pabBefore(that, payData)
        break;
      case 'yue': // 余额支付
        payData.payMethod = 'money';
        break;
    }

    // if (that.data.payMethods == 'wx') { // 微信支付
    //   var posdata = {};
    //   if (that.data.options.page == "shoppingCart") {
    //     posdata = {
    //       user_id: wx.getStorageSync('user_id'),
    //       address_id: that.data.Address_id,
    //       coupon_id: that.data.Coupon_id,
    //       user_money: 0,
    //       action: 'cart',
    //       goods_num: 1,
    //       dosubmit: 1,
    //       send_method: 1,
    //       delivery_code: wx.getStorageSync('addressCode')
    //     }
    //   } else if (that.data.options.page == "commodityDeatils") {
    //     posdata = {
    //       user_id: wx.getStorageSync('user_id'),
    //       address_id: that.data.Address_id,
    //       coupon_id: that.data.Coupon_id,
    //       user_money: 0,
    //       action: 'buy_now',
    //       goods_id: that.data.options.goodId,
    //       goods_num: 1,
    //       dosubmit: 1,
    //       send_method: 1,
    //       delivery_code: wx.getStorageSync('addressCode')
    //     }
    //   }
      // if (wx.getStorageSync('openid')) {



        // wx.request({
        //   url: Globalhost + 'Api/cart/cart3',
        //   method: 'POST',
        //   header: {
        //     'content-type': 'application/x-www-form-urlencoded'
        //   },
        //   data: posdata,
        //   success: function (res) {
        //     console.log(res)
        //     if (res.data.code == 400) {
        //       that.setData({
        //         errorShow: true,
        //         errorMsg: res.data.msg
        //       })
        //     } else {
        //       let ordermsg = res.data.data;
        //       var orderMsg = {
        //         status: '支付订单保存',
        //         order_amount: ordermsg.order_amount,
        //         order_id: ordermsg.order_id,
        //         order_sn: ordermsg.order_sn
        //       }
        //       that.setData({
        //         Order_sn: res.data.data.order_sn
        //       })
        //       wx.request({
        //         url: Globalhost + 'Api/Wxapplet/unifiedOrder',
        //         method: 'POST',
        //         header: {
        //           'content-type': 'application/x-www-form-urlencoded'
        //         },
        //         data: {
        //           order_sn: res.data.data.order_sn,
        //           openid: wx.getStorageSync('openid')
        //         },
        //         success: function (res) {
        //           wx.requestPayment({
        //             'timeStamp': res.data.data.timeStamp, // 时间
        //             'nonceStr': res.data.data.nonceStr, // 随机字符串
        //             'package': res.data.data.package, // prepayId
        //             'signType': res.data.data.signType, // 签名算法
        //             'paySign': res.data.data.paySign, // 签名
        //             'success': function (res) {
        //               console.log(res)
        //               wx.setStorageSync('chooseStatus', 'END') // 清空优惠券状态
        //               wx.navigateTo({
        //                 url: '/pages/paySuccess/paySuccess?order_amount=' + ordermsg.order_amount + '&order_id=' + ordermsg.order_id + '&order_sn=' + ordermsg.order_sn
        //               })
        //             },
        //             fail(res) {
        //               console.log(res)
        //               console.log('ERROR***********************************************************')
        //               wx.redirectTo({
        //                 url: '/pages/errorPay/errorPay?status=errorPay&order_id=' + ordermsg.order_id + '&order_sn=' + ordermsg.order_sn
        //               })
        //             }
        //           })
        //         }
        //       })
        //     }
        //   }
        // })
      // } else {
      //   wx.navigateTo({
      //     url: '/pages/wxlogin/wxlogin'
      //   })
      // }
    // } else { // 余额支付
      // wx.showToast({
      //   title: '余额不足',
      //   icon: 'none'
      // })
      // var query = wx.createSelectorQuery();
      //选择id
      // that.setData({
      //   wxShow: true,
      //   wallets_password: ''
      // })
    // }
  },


  pabBefore: function (that, payData) {
    wx.request({
      url: Globalhost + 'Api/cart/cart3',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: payData,
      success: function(res) {
        if(res.data.code == 200) {
          wx.setStorageSync('order_amount', res.data.data.order_amount);
          wx.setStorageSync('order_id', res.data.data.order_id);
          wx.setStorageSync('order_sn', res.data.data.order_sn);
          that.wxPay(that);
        }
      }
    })
  },


  // 微信支付
  wxPay: function (that) {
    wx.request({
      url: Globalhost + 'Api/Wxapplet/unifiedOrder',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        order_sn: wx.getStorageSync('order_sn'),
        openid: wx.getStorageSync('openid')
      },
      success: function(res) {
        if(res.data.code == 200) {
          wx.setStorageSync('appId', res.data.data.appId);
          wx.setStorageSync('nonceStr', res.data.data.nonceStr);
          wx.setStorageSync('package', res.data.data.package);
          wx.setStorageSync('paySign', res.data.data.paySign);
          wx.setStorageSync('signType', res.data.data.signType);
          wx.setStorageSync('timeStamp', res.data.data.timeStamp);
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp, // 时间
            'nonceStr': res.data.data.nonceStr, // 随机字符串
            'package': res.data.data.package, // prepayId
            'signType': res.data.data.signType, // 签名算法
            'paySign': res.data.data.paySign, // 签名
            'success': function (res) {
              console.log(res)
              wx.setStorageSync('chooseStatus', 'END') // 清空优惠券状态
              wx.navigateTo({
                url: '/pages/paySuccess/paySuccess?order_amount=' + ordermsg.order_amount + '&order_id=' + ordermsg.order_id + '&order_sn=' + ordermsg.order_sn
              })
            },
            fail(res) {
              console.log(res)
              console.log('ERROR***********************************************************')
              wx.redirectTo({
                url: '/pages/errorPay/errorPay?status=errorPay&order_id=' + ordermsg.order_id + '&order_sn=' + ordermsg.order_sn
              })
            }
          })

        }
        
      }
    })
  },


  set_wallets_password(e) { //获取钱包密码
    let that = this;
    this.setData({
      wallets_password: e.detail.value
    });
    if (this.data.wallets_password.length == 6) { //密码长度6位时，自动验证钱包支付结果
      // wallet_pay(this)
      that.setData({
        wxShow: false
      })
      var posdata = {};
      if (that.data.options.page == "commodityDeatils") {
        posdata = {
          user_id: wx.getStorageSync('user_id'),
          address_id: that.data.Address_id,
          coupon_id: that.data.Coupon_id,
          user_money: 0,
          action: 'buy_now',
          goods_id: that.data.options.goodId,
          goods_num: 1,
          dosubmit: 1,
          send_method: that.data.options.send_method,
          payMethod: 'money',
          payPwd: this.data.wallets_password,
          delivery_code: wx.getStorageSync('addressCode')
        }
      } else if (that.data.options.page == "shoppingCart") {
        posdata = {
          user_id: wx.getStorageSync('user_id'),
          address_id: that.data.Address_id,
          coupon_id: that.data.Coupon_id,
          user_money: 0,
          action: 'cart',
          goods_num: 1,
          dosubmit: 1,
          send_method: that.data.options.send_method,
          payMethod: 'money',
          payPwd: this.data.wallets_password,
          delivery_code: wx.getStorageSync('addressCode')
        }
      }
      wx.request({
        url: '',
        url: Globalhost + 'Api/cart/cart3',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: posdata,
        success: function (res) {
          let ordermsg = res.data.data;
          console.log(res)
          if (res.data.code == 400) {
            if (res.data.msg == "余额不足") {
              wx.showToast({
                title: '余额不足',
                icon: 'none'
              })
            } else if (res.data.msg == '请先设置支付密码') {
              wx.showModal({
                title: '请先设置支付密码',
                confirmText: '去设置',
                cancelText: '取消',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                    wx.navigateTo({
                      url: '/pages/password/password'
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
            }
          }
          if (res.data.code == 200) {
            wx.request({
              url: Globalhost + 'api/pay/topay',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                order_sn: res.data.data.order_sn,
                paymentMethod: 'money'
              },
              success: function (res) {
                wx.navigateTo({
                  url: '/pages/paySuccess/paySuccess?order_amount=' + ordermsg.order_amount + '&order_id=' + ordermsg.order_id + '&order_sn=' + ordermsg.order_sn
                })
              }
            })

          }
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
      wxShow: false,
      wallets_password: ''
    })
  },
  closeError: function () {
    this.setData({
      errorShow: false
    })
  },


  toEditAddress: function (e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/addressEdit/addressEdit?address_id=' + e.currentTarget.dataset.id
    })
  }









})