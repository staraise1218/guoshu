const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    Page: '',               // 页面 []
    Action: '',             // 支付时传参
    Address: {},            // 地址
    Address_id: '',         // 地址id
    GoodList: [],           // 商品
    Goods_id: '',           // 商品id 【立即购买】
    RedEnvelopes: [],       // 红包
    RedEnvelopes_id: '',    // 红包id
    CouponList: [],         // 优惠券列表
    Coupon_id: '',          // 优惠券id
    CommodityMsg: '',       // 订单信息
    PayMethods: '',         // 支付方式
    Store_id: '',           // 门店id
    StoreList: [],          // 门店列表
    Status: '',             // buy_now cart
    payMethods: 'wx',       // 【默认微信支付】、余额支付 yue
  },
  onLoad: function (options) {
    let that = this;
    console.log(options);
    // 商品详情 --》 订单详情 【立即购买】
    if(options.page == "commodityDeatils") {
      that.setData({
        Goods_id: options.goodId,
        Action: 'buy_now',
        Page: options.page
      })
      setTimeout(function () {
        console.log(that.data)
        that.ByNow(that);
      }, 200)
    }
    // 【门店列表】 【立即购买】
    if(options.page == "storeList") {
      if(options.status == "byNow") {
        that.setData({
          Store_id: options.Store_id,
          Goods_id: options.goodId,
          Page: options.page,
          Status: options.status,
          Action: 'buy_now'
        })
        setTimeout(function () {
          console.log(that.data)
          that.ByNow(that);
          that.loadList(that);
        }, 200)
      }
    }
    // 【门店列表】 【购物车】
    if(options.page == "storeList") {
      if(options.status == "cart") {
        that.setData({
          Store_id: options.Store_id,
          Goods_id: options.goodId,
          Page: options.page,
          Status: options.status,
          Action: 'cart'
        })
        setTimeout(function () {
          console.log(that.data)
          that.CartBy(that);
          that.loadList(that);
        }, 200)
        that.setData({
          Goods_id: options.goodId
        })
      }
    }
    // 【购物车】
    if(options.page == "shoppingCart") {
      that.setData({
        Action: 'cart',
        Page: options.page
      })
      that.CartBy(that);
    }
  },
  onShow: function (options) {
    let that = this;
    // 选择地址后返回
    if(wx.getStorageSync('retPage') == 'address') {

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
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].address_id == wx.getStorageSync('chooseAddressId')) {
              that.setData({
                Address: res.data.data[i],
                Address_id: res.data.data[i].address_id
              })
            }
          }
        }
      })
      wx.setStorageSync('retPage', false)
    }
    if(wx.getStorageSync('chooseStatus') == 'coupon') { // 从优惠券选择返回
      that.setData({
        CouponIndex: wx.getStorageSync('coupon_index'),
        Coupon_id: wx.getStorageSync('coupon_id')
      })
    }
  },
// 立即购买 【加载】
  ByNow: function (that) {
    wx.request({
      url: Globalhost + 'Api/cart/cart2',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        action: that.data.Action,
        goods_id: that.data.Goods_id,
        goods_num: 1

      },
      success: function(res) {
        console.log(res)
        if(res.data.code == 200) {
          that.setData({
            Address: res.data.data.address,
            Address_id: res.data.data.address.address_id,
            GoodList: res.data.data.cartList.cartList,
            CommodityMsg: res.data.data.cartList
          })
          if(res.data.data.couponList.length > 0) {
            that.setData({
              CouponList: res.data.data.couponList,
              Coupon_id: res.data.data[0].id
            })
          }
          console.log(that.data)
          wx.request({
            url: Globalhost + 'Api/cart/cart3',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              user_id: wx.getStorageSync('user_id'),
              address_id: that.data.Address_id,
              coupon_id: that.data.Coupon_id,
              user_money: 0,
              action: that.data.Action,
              goods_id: that.data.Goods_id,
              goods_num: 1
            },
            success: function(res) {
              console.log(res)
              that.setData({
                'CommodityMsg.total_fee': res.data.data.order_amount,
                'CommodityMsg.total_amount': res.data.data.total_amount
              })
            }
          })
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
   * 更新 选择完重新渲染
   */
  cart3: function (that, id) {
    wx.request({
      url: Globalhost + 'Api/cart/cart3',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        address_id: that.data.Address_id,
        coupon_id: id,
        user_money: 0,
        action: that.data.Action,
        goods_id: that.data.Goods_id,
        goods_num: 1
      },
      success: function(res) {
        console.log(res)
        that.setData({
          'CommodityMsg.total_fee': res.data.data.order_amount
        })
      }
    })
  },
// 购物车 【加载】
  CartBy: function (that) {
    wx.request({
      url: Globalhost + 'Api/cart/cart2',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        action: that.data.Action
      },
      success: function(res) {
        console.log(res)
        if(res.data.code == 200) {
          that.setData({
            Address: res.data.data.address,
            Address_id: res.data.data.address.address_id,
            GoodList: res.data.data.cartList.cartList,
            CommodityMsg: res.data.data.cartList
          })
          if(res.data.data.couponList.length > 0) {
            that.setData({
              CouponList: res.data.data.couponList,
              Coupon_id: res.data.data.couponList[0].id
            })
          }
          wx.request({
            url: Globalhost + 'Api/cart/cart3',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              user_id: wx.getStorageSync('user_id'),        // 用户id
              address_id: that.data.Address_id,     // 地址id
              coupon_id: that.data.Coupon_id,      // 优惠券id
              user_money: 0,     // 使用的余额数
              action: that.data.Action ,         // 动作：立即购买：buy_now 购物车结算：cart
              send_method: 1,    // 提交订单参数，配送方式 1 送货上门 2 门店自取
            },
            success: function(res) {
              console.log(res)
              that.setData({
                'CommodityMsg.total_fee': res.data.data.order_amount,
                'CommodityMsg.total_amount': res.data.data.total_amount
              })
            }
          })
        }
      }
    })
  },

  toPay: function () {
    let that = this;
    if(that.data.payMethods == 'wx') {  // 微信支付
      if(wx.getStorageSync('openid')) {
        wx.request({
          url: Globalhost + 'Api/cart/cart3',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            user_id: wx.getStorageSync('user_id'),
            address_id: that.data.Address_id,
            coupon_id: that.data.Coupon_id,
            user_money: 0,
            action: that.data.Action,
            goods_id: that.data.Goods_id,
            goods_num: 1,
            dosubmit: 1,
            send_method: 1
          },
          success: function(res) {
            console.log(res)
            let ordermsg = res.data.data;
            that.setData({
              Order_sn: res.data.data.order_sn
            })
            wx.request({
              url: Globalhost + 'Api/Wxapplet/unifiedOrder',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                order_sn: res.data.data.order_sn,
                openid: wx.getStorageSync('openid')
              },
              success: function(res) {
                wx.requestPayment({
                  'timeStamp': res.data.data.timeStamp, // 时间
                  'nonceStr': res.data.data.nonceStr, // 随机字符串
                  'package': res.data.data.package, // prepayId
                  'signType': res.data.data.signType, // 签名算法
                  'paySign': res.data.data.paySign, // 签名
                  'success': function (res) {
                    console.log(res)
                    
                    wx.setStorageSync('chooseStatus', 'END')  // 清空优惠券状态
                    wx.navigateTo({
                      url: '/pages/paySuccess/paySuccess?order_amount=' + ordermsg.order_amount + '&order_id=' + ordermsg.order_id + '&order_sn=' + ordermsg.order_sn
                    })
                  }
                })
              }
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages/wxlogin/wxlogin'
        })
      }
    } else { // 余额支付
      wx.showToast({
        title: '余额不足',
        icon: 'none'
      })
      // wx.request({
      //   url: '',
      //   url: Globalhost + 'Api/cart/cart3',
      //   method: 'POST',
      //   header: {
      //     'content-type': 'application/x-www-form-urlencoded'
      //   },
      //   success: function(res) {
          
      //   }
      // })
    }
  },
  
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
  consoleData: function () {
    console.log(this.data)    
  },
  toAddress: function () {
    wx.navigateTo({
      url: '/pages/address/address?page=order'
    })
  },
  toStoreList: function () {
    console.log(this.data.Goods_id)
    wx.navigateTo({
      url: '/pages/storeList/storeList?page=demo&good_id=' + this.data.Goods_id + '&status=' + this.data.Status
    })
  },
  // 自提点
  loadList: function (that) {
    wx.request({
      url: Globalhost + 'Api/cart/getPickupList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res)
        if(res.data.code == 200) {
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
    if(e.currentTarget.dataset.paystatus == "yue") {
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
   * 选中优惠券
   */
  toYouHui: function (e) {
    let that = this;
    console.log(that.data.CouponList)
    var arr = [];
    for(var i = 0; i < that.data.CouponList.length; i++) {
      arr[i] = that.data.CouponList[i].coupon.money
    }
    wx.showActionSheet({
      itemList: arr,
      success(res) {
        console.log(that.data.CouponList)
        console.log(res.tapIndex)
        for(var j = 0; j < that.data.CouponList.length; j ++) {
          that.setData({
            Coupon_id: that.data.CouponList[res.tapIndex].id
          })
        }
        // that.cart3(that, that.data.CouponList[res.tapIndex].id);
        
        wx.request({
          url: Globalhost + 'Api/cart/cart3',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            user_id: wx.getStorageSync('user_id'),
            address_id: that.data.Address_id,
            coupon_id: that.data.CouponList[res.tapIndex].id,
            user_money: 0,
            action: 'cart',
            goods_num: 1
          },
          success: function(res) {
            console.log(res)
            that.setData({
              'CommodityMsg.total_fee': res.data.data.order_amount
            })
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
    // wx.navigateTo({
    //   url: '/pages/youhuiquan/youhuiquan?status=chooseCoupon'
    // })
  },


})