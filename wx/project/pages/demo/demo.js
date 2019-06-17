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
    addressListShow: false,
    hongbaoShow: false,


    // 弹窗
    alert_errorMsg: '',
    my_error_alert_show: false,
    my_alert_title: '温馨提示',
    cancel: '取消',
    ok: '确定',

    isToPay: 0, // 付款误触 0 可以点击 1 不可点击
    user_note: '',  // 备注内容

    alertShow: false
  },
  
  onLoad: function (options) {
    let that = this;
    that.setData({
      PAYSTATUS: wx.getStorageSync('PAYSTATUS'),
      send_method: wx.getStorageSync('send_method')
    })
    if(wx.getStorageSync('send_method') == 2) {
      that.loadList(that)
    }
    var posdata2 = {};
    switch (wx.getStorageSync('PAYSTATUS')) {
      case 0:
        posdata2 = {
          action: 'cart',
          user_id: wx.getStorageSync('user_id')
        }
        break;
      case 1:
        that.setData({
          pickup_id: wx.getStorageSync('pickup_id')
        })
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
        that.setData({
          pickup_id: wx.getStorageSync('pickup_id')
        })
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
  cart2: function (that, posdata2) {
    wx.request({
      url: Globalhost + 'Api/cart/cart2',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: posdata2,
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          if(res.data.data.couponList == 0) {
            that.setData({
              couponList: -1,
              coupon_id: -1
            })
          } else {
            that.setData({
              couponList: res.data.data.couponList,
              coupon_id: res.data.data.couponList[0].id
            })
          }
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
            posdata3.coupon_id = that.data.coupon_id||res.data.data.couponList[0].id
          } catch (error) {
            console.log(error)
          }
          that.setData({
            posdata3: posdata3
          })
          that.cart3(that, posdata3)

        } else {
          console.log('*********************************')
          that.setData({
            alertShow: true,
            errorMsg: res.data.msg
          })
        }
      }
    })
  },
  cart3: function (that, posdata3) {
    console.log(posdata3)
    posdata3.user_note = that.data.user_note;
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
        wx.setStorageSync('order_amount', res.data.data.order_amount);
      }
    })
  },

  // 自提点列表
  loadList: function (that) {
    let getPickupListData = wx.getStorageSync('getPickupListData');
    getPickupListData = JSON.parse(getPickupListData)
    wx.request({
      url: Globalhost + 'Api/cart/getPickupList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: getPickupListData,
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
    that.setData({
      hongbaoShow: true
    })
  },
  alertHongBao: function () {
    this.setData({
      hongbaoShow: true
    })
  },
  chooseHongBao(e) {
    let that = this;
    console.log(e.currentTarget.dataset.id)
    this.setData({
      coupon_id: e.currentTarget.dataset.id,
      hongbaoShow: false
    })
    let posdata3 = that.data.posdata3;
    posdata3.coupon_id = e.currentTarget.dataset.id;
    that.cart3(that, posdata3)
  },
  closeHongBao: function (e) {
    this.setData({
      hongbaoShow: false
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
          Address_id: that.data.ADDRESSLIST[i].address_id,
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
    this.setData({
      storeListShow: true
    })

  },
  choosePickup: function (e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      storeListShow: false,
      'pickup_id': e.currentTarget.dataset.id
    })
    wx.setStorageSync('pickup_id', e.currentTarget.dataset.id);
  },
  closePickup: function () {
    this.setData({
      storeListShow: false
    })
  },

  toPay: function () {
    console.log('0000000')
    let that = this;
    that.setData({
      isToPay: 1
    })
    setTimeout(() => {
      that.setData({
        isToPay: 0
      })
    }, 2000)
    let payData = {};
    switch(wx.getStorageSync('PAYSTATUS')) {
      case 0:
          payData = {
            user_id: wx.getStorageSync('user_id'),
            address_id: that.data.Address_id,
            action: 'cart',
            dosubmit: 1,
            coupon_id: that.data.coupon_id,
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
            coupon_id: that.data.coupon_id,
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
            coupon_id: that.data.coupon_id,
            send_method: 1,
            // pickup_id: wx.getStorageSync('pickup_id'),
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
            coupon_id: that.data.coupon_id,
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
        wx.setStorageSync('payMethod', 'wxpay');
        break;
      case 'yue': // 余额支付
        payData.payMethod = 'money';
        payData = JSON.stringify(payData);
        console.log(payData)
        wx.setStorageSync('payMethod', 'yue');
        that.setData({
          payData: payData
        })
        that.yuePay(that);
        // that.setData({
        //   wxShow: true,
        //   wallets_password: ''
        // })
        break;
    }
  },

  pabBefore: function (that, payData) {
    payData.user_note = that.data.user_note
    wx.request({
      url: Globalhost + 'Api/cart/cart3',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: payData,
      success: function(res) {
        console.log(res)
        if(res.data.code == 200) {
          wx.setStorageSync('order_amount', res.data.data.order_amount);
          wx.setStorageSync('order_id', res.data.data.order_id);
          wx.setStorageSync('order_sn', res.data.data.order_sn);
          that.wxPay(that);
        } else {
          that.setData({
            my_error_alert_show: true,
            alert_errorMsg: '' + res.data.msg
          })
          console.log(that.data.alert_errorMsg)
          // wx.showToast({
          //   title: res.data.msg,
          //   icon: 'none'
          // })
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
        console.log(res)
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
              wx.redirectTo({
                url: '/pages/paySuccess/paySuccess?order_amount=' + wx.getStorageSync('order_amount') + '&order_id=' + wx.getStorageSync('order_id') + '&order_sn=' + wx.getStorageSync('order_sn')
              })
            },
            fail(res) {
              console.log(res)
              console.log('ERROR***********************************************************')
              wx.redirectTo({
                url: '/pages/errorPay/errorPay?status=errorPay&order_id=' + wx.getStorageSync('order_id') + '&order_sn=' + wx.getStorageSync('order_sn')
              })
            }
          })

        }
        
      }
    })
  },
  yuePay: function (that) {
    let yueData = {};
    switch(wx.getStorageSync('PAYSTATUS')) {
      case 0:
          yueData = {
            user_id: wx.getStorageSync('user_id'),
            address_id: that.data.Address_id,
            action: 'cart',
            dosubmit: 1,
            send_method: 1,
            payMethod: 'money',
            coupon_id: that.data.coupon_id,
            // payPwd: this.data.wallets_password,
            delivery_code: wx.getStorageSync('addressCode')
          }
          break;
      case 1:
          yueData = {
            user_id: wx.getStorageSync('user_id'),
            address_id: that.data.Address_id,
            action: 'cart',
            dosubmit: 1,
            send_method: 2,
            payMethod: 'money',
            coupon_id: that.data.coupon_id,
            pickup_id: wx.getStorageSync('pickup_id'),
            // payPwd: this.data.wallets_password,
            delivery_code: wx.getStorageSync('addressCode')
          }
          break;
      case 2:
          yueData = {
            user_id: wx.getStorageSync('user_id'),
            address_id: that.data.Address_id,
            action: 'buy_now',
            goods_id: wx.getStorageSync('goods_id'),
            goods_num: wx.getStorageSync('goods_num'),
            dosubmit: 1,
            coupon_id: that.data.coupon_id,
            send_method: 1,
            payMethod: 'money',
            pickup_id: wx.getStorageSync('pickup_id'),
            // payPwd: this.data.wallets_password,
            delivery_code: wx.getStorageSync('addressCode')
          }
          break;
      case 3:
          yueData = {
            user_id: wx.getStorageSync('user_id'),
            address_id: that.data.Address_id,
            action: 'buy_now',
            goods_id: wx.getStorageSync('goods_id'),
            goods_num: wx.getStorageSync('goods_num'),
            dosubmit: 1,
            coupon_id: that.data.coupon_id,
            send_method: 2,
            payMethod: 'money',
            pickup_id: wx.getStorageSync('pickup_id'),
            // payPwd: this.data.wallets_password,
            delivery_code: wx.getStorageSync('addressCode')
          }
          break;
    }
    console.log(yueData)
    yueData.user_note = that.data.user_note
    wx.request({
      url: '',
      url: Globalhost + 'Api/cart/cart3',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: yueData,
      success: function (res) {
        // let ordermsg = res.data.data;
        console.log(res)
        wx.setStorageSync('order_amount', res.data.data.order_amount);
        wx.setStorageSync('order_id', res.data.data.order_id);
        wx.setStorageSync('order_sn', res.data.data.order_sn);
        if (res.data.code == 200) {
          wx.request({
            url: Globalhost + 'api/pay/topay',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              order_sn: res.data.data.order_sn,
              paymentMethod: 'money',
              // payPwd: that.data.wallets_password
            },
            success: function (res) {
              console.log(res)
              if(res.code == 200) {
                wx.redirectTo({
                  url: '/pages/paySuccess/paySuccess?order_amount=' + wx.getStorageSync('order_amount') + '&order_id=' + wx.getStorageSync('order_id') + '&order_sn=' + wx.getStorageSync('order_sn')
                })
              } else {
                wx.redirectTo({
                  url: '/pages/errorPay/errorPay?status=errorPay&order_id=' + wx.getStorageSync('order_id') + '&order_sn=' + wx.getStorageSync('order_sn') + '&msg=' + res.data.msg
                })
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }
          })
        } else {
          that.setData({
            my_error_alert_show: true,
            alert_errorMsg: '' + res.data.msg
          })
          console.log(that.data.alert_errorMsg)
          
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  set_wallets_password(e) { //获取钱包密码
    let that = this;
    // this.setData({
    //   wallets_password: e.detail.value
    // });
    // if (this.data.wallets_password.length == 6) { //密码长度6位时，自动验证钱包支付结果
    //   // wallet_pay(this)
    //   that.setData({
    //     wxShow: false
    //   })
      // var posdata = {};
      let yueData = {};
      switch(wx.getStorageSync('PAYSTATUS')) {
        case 0:
            yueData = {
              user_id: wx.getStorageSync('user_id'),
              address_id: that.data.Address_id,
              action: 'cart',
              dosubmit: 1,
              send_method: 1,
              payMethod: 'money',
              coupon_id: that.data.coupon_id,
              // payPwd: this.data.wallets_password,
              delivery_code: wx.getStorageSync('addressCode')
            }
            break;
        case 1:
            yueData = {
              user_id: wx.getStorageSync('user_id'),
              address_id: that.data.Address_id,
              action: 'cart',
              dosubmit: 1,
              send_method: 2,
              payMethod: 'money',
              coupon_id: that.data.coupon_id,
              pickup_id: wx.getStorageSync('pickup_id'),
              // payPwd: this.data.wallets_password,
              delivery_code: wx.getStorageSync('addressCode')
            }
            break;
        case 2:
            yueData = {
              user_id: wx.getStorageSync('user_id'),
              address_id: that.data.Address_id,
              action: 'buy_now',
              goods_id: wx.getStorageSync('goods_id'),
              goods_num: wx.getStorageSync('goods_num'),
              dosubmit: 1,
              coupon_id: that.data.coupon_id,
              send_method: 1,
              payMethod: 'money',
              pickup_id: wx.getStorageSync('pickup_id'),
              // payPwd: this.data.wallets_password,
              delivery_code: wx.getStorageSync('addressCode')
            }
            break;
        case 3:
            yueData = {
              user_id: wx.getStorageSync('user_id'),
              address_id: that.data.Address_id,
              action: 'buy_now',
              goods_id: wx.getStorageSync('goods_id'),
              goods_num: wx.getStorageSync('goods_num'),
              dosubmit: 1,
              coupon_id: that.data.coupon_id,
              send_method: 2,
              payMethod: 'money',
              pickup_id: wx.getStorageSync('pickup_id'),
              // payPwd: this.data.wallets_password,
              delivery_code: wx.getStorageSync('addressCode')
            }
            break;
      }
      console.log(yueData)
      yueData.user_note = that.data.user_note
      wx.request({
        url: '',
        url: Globalhost + 'Api/cart/cart3',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: yueData,
        success: function (res) {
          // let ordermsg = res.data.data;
          console.log(res)
          wx.setStorageSync('order_amount', res.data.data.order_amount);
          wx.setStorageSync('order_id', res.data.data.order_id);
          wx.setStorageSync('order_sn', res.data.data.order_sn);
          if (res.data.code == 200) {
            wx.request({
              url: Globalhost + 'api/pay/topay',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                order_sn: res.data.data.order_sn,
                paymentMethod: 'money',
                // payPwd: that.data.wallets_password
              },
              success: function (res) {
                console.log(res)
                if(res.code == 200) {
                  wx.redirectTo({
                    url: '/pages/paySuccess/paySuccess?order_amount=' + wx.getStorageSync('order_amount') + '&order_id=' + wx.getStorageSync('order_id') + '&order_sn=' + wx.getStorageSync('order_sn')
                  })
                } else {
                  wx.redirectTo({
                    url: '/pages/errorPay/errorPay?status=errorPay&order_id=' + wx.getStorageSync('order_id') + '&order_sn=' + wx.getStorageSync('order_sn') + '&msg=' + res.data.msg
                  })
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }
              }
            })
          } else {
            that.setData({
              my_error_alert_show: true,
              alert_errorMsg: '' + res.data.msg
            })
            console.log(that.data.alert_errorMsg)
            
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    // }
  },
  // 关闭弹窗
  close_my_alert() {
    this.setData({
      my_error_alert_show: false,
      isToPay: false
    })
  },
  my_alert_cancel() {
    this.close_my_alert();
  },
  my_alert_ok() {
    this.close_my_alert();
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
  },
  // 备注
  beizhu(e) {
    console.log(e)
    this.setData({
      user_note: e.detail.value
    })
  },


  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }










})