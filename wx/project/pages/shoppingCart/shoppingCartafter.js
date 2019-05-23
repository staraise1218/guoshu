const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    orderList: [{}], // 购物车列表
    total_fee: '', // 合计
    chooseAllShow: false, // 全选按钮状态
    tuijian: [{}], // 推荐商品
    cartList: [], // 选中的商品
  },
  onShow: function () {
    let that = this;
    that.createList(that);  // 渲染列表
    that.tuijian(that);     // 推荐商品
    that.isChooseAll(that); // 判断全选按钮状态
    console.log(that.data.cartList.length)
  },

  /**
   * 去结算
   */
  toPay: function () {
    let that = this;
    // console.log(that.data.orderList)
    if (that.data.cartList.length > 0) {
      wx.showModal({
        title: '尊敬的用户：',
        content: '在您确定订单之前，请选择您的收货方式，我们提供了两种收货方式：门店自取和送货上门。',
        confirmText: '送货上门',
        cancelText: '门店自取',
        success(res) {
          if (res.confirm) {
            console.log('送货上门')
            wx.navigateTo({
              url: '/pages/demo/demo?page=shoppingCart'
            })
          } else if (res.cancel) {
            console.log('门店自取')
            wx.navigateTo({
              url: '/pages/storeList/storeList?page=shoppingCart'
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '未选择商品',
        icon: 'none'
      })
    }
  },
  /**
   * 购物车加减商品
   */
  ctrl: function (e) {
    let that = this;
    console.log(e)
    console.log(that.data.orderList)
    var orderList = [];

    for (var i = 0; i < that.data.orderList.length; i++) {
      if (e.target.dataset.catId == that.data.orderList[i].cat_id) {
        console.log(that.data.orderList[i])
        orderList[i] = {};
        var num = 'orderList[' + i + '].goods_num'
        var cart = {
          id: e.target.dataset.catId,
          goods_num: that.data.orderList[i].goods_num,
          selected: that.data.orderList[i].selected
        };
        if (e.target.dataset.msg == "reduce") {
          if (cart.goods_num == 1) {
            wx.showModal({
              title: '是否删除该商品',
              success(res) {
                if (res.confirm) {
                  wx.request({
                    url: Globalhost + 'Api/cart/delete',
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      user_id: wx.getStorageSync('user_id'),
                      cart_ids: e.target.dataset.catId
                    },
                    success: function (res) {
                      cart.goods_num--
                      that.setData({
                        [num]: cart.goods_num--
                      })
                      that.createList(that);  // 渲染列表
                      that.calculation(that); // 更新购物并计算结果
                      console.log(res)
                    }
                  })
                }
              }
            })
          } else {
            console.log(cart.goods_num)
            cart.goods_num--
            that.setData({
              [num]: cart.goods_num--
            })
            console.log(cart.goods_num)
            cart = JSON.stringify(cart);
            wx.request({
              url: Globalhost + 'Api/cart/changeNum',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                user_id: wx.getStorageSync('user_id'),
                cart: cart
              },
              success: function (res) {
                console.log(res)
                that.calculation(that); // 更新购物并计算结果
              }
            })
          }
        } else if (e.target.dataset.msg == "add") {
          console.log(cart.goods_num)
          console.log('add')
          cart.goods_num++
          that.setData({
            [num]: cart.goods_num++
          })
          cart = JSON.stringify(cart);
          wx.request({
            url: Globalhost + 'Api/cart/changeNum',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              user_id: wx.getStorageSync('user_id'),
              cart: cart
            },
            success: function (res) {
              console.log(res)
              that.calculation(that); // 更新购物并计算结果
            }
          })
        }
      }
    }
    // that.calculation(that); // 更新购物并计算结果
  },
  /**
   * 渲染列表
   */
  createList: function (that) {
    wx.request({
      url: Globalhost + 'Api/cart/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id:  wx.getStorageSync('user_id'),
        city_code: 110100
      },
      success: function (res) {
        that.setData({
          orderList: ''
        })
        let data = res.data.data;
        // console.log(data);
        var orderList = [];
        for (var i = 0; i < data.length; i++) {
          orderList[i] = {};
          orderList[i].goods = {};
          var ORid = 'orderList[' + i + '].goods_id',
            ORcat_id = 'orderList[' + i + '].cat_id',
            Orname = 'orderList[' + i + '].goods_name',
            ORnum = 'orderList[' + i + '].goods_num',
            ORprice = 'orderList[' + i + '].goods_price',
            ORselect = 'orderList[' + i + '].selected',
            ORimg = 'orderList[' + i + '].goods.original_img'

          that.setData({
            [ORid]: data[i].goods_id,
            [ORcat_id]: data[i].id,
            [Orname]: data[i].goods_name,
            [ORnum]: data[i].goods_num,
            [ORprice]: data[i].goods_price,
            [ORimg]: 'https://app.zhuoyumall.com:444' + data[i].goods.original_img,
            [ORselect]: 0
          })
        }
        console.log(that.data.orderList)
        that.calculation(that); // 更新购物并计算结果
      }
    })
  },
  /**
   * 更新购物并计算结果
   */
  calculation: function (that) {
    var flag = true;
    if(flag) {
      flag = false;
      var posdata = []
      for (var i = 0; i < that.data.orderList.length; i++) {
        posdata[i] = {};
        posdata[i].id = that.data.orderList[i].cat_id;
        posdata[i].goods_num = that.data.orderList[i].goods_num;
        posdata[i].selected = that.data.orderList[i].selected;
      }
      posdata = JSON.stringify(posdata)
      wx.request({
        url: Globalhost + 'Api/cart/AsyncUpdateCart',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user_id: wx.getStorageSync('user_id'),
          cart: posdata
        },
        success: function (res) {
          let data = res.data.data;
          console.log(data)
          if(data.result.cartList.length == that.data.orderList.length) {
            that.setData({
              chooseAllShow: true
            })
          } else {
            that.setData({
              chooseAllShow: false
            })
          }
          that.setData({
            total_fee: data.result.total_fee,
            cartList: data.result.cartList
          })
        }
      })
      setTimeout(function () {
        flag = true;
      }, 500)
    }
  },
  /***
   * 选中状态
   */
  choose: function (e) {
    let that = this;
    var orderList = that.orderList;
    var selected = 'orderList[' + e.currentTarget.dataset.index + '].selected'
    if (that.data.orderList[e.currentTarget.dataset.index].selected == 0) {
      that.setData({
        [selected]: 1
      })
    } else {
      that.setData({
        [selected]: 0
      })
    }
    console.log(that.data.orderList)
    console.log(that.data.cartList)
    that.calculation(that);
    that.isChooseAll(that); // 判断全选按钮状态
  },
  /**
   * 选中所有
   */
  chooseAll: function () {
    let that = this;
    // console.log(that.data.orderList)
    var orderList = [];
    if (!that.data.chooseAllShow) {
      for (var i = 0; i < that.data.orderList.length; i++) {
        orderList[i] = {}
        var selected = 'orderList[' + i + '].selected';
        that.setData({
          [selected]: 1
        })
      }
    } else {
      for (var i = 0; i < that.data.orderList.length; i++) {
        orderList[i] = {}
        var selected = 'orderList[' + i + '].selected';
        that.setData({
          [selected]: 0
        })
      }
    }
    that.setData({
      chooseAllShow: !that.data.chooseAllShow
    })
    that.calculation(that);
  },
  /**
   * 推荐商品列表
   */
  tuijian: function (that) {
    wx.request({
      url: Globalhost + 'Api/goods/recommendgoodslist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        city_code: 110100
      },
      success: function (res) {
        let data = res.data.data;
        // console.log(data);
        var tuijian = [];
        for (var i = 0; i < data.length; i++) {
          tuijian[i] = {};
          var Tid = 'tuijian[' + i + '].goods_id',
            Tname = 'tuijian[' + i + '].goods_name',
            original_img = 'tuijian[' + i + '].original_img',
            Tprice = 'tuijian[' + i + '].shop_price',
            Tcount = 'tuijian[' + i + '].store_count',
            Tsub = 'tuijian[' + i + '].subtitle'
          that.setData({
            [Tid]: data[i].goods_id,
            [Tname]: data[i].goods_name,
            [original_img]: 'https://app.zhuoyumall.com:444' + data[i].original_img,
            [Tprice]: data[i].shop_price,
            [Tcount]: data[i].store_count,
            [Tsub]: data[i].subtitle
          })
        }
        // console.log(that.data.tuijian)
      }
    })
  },
  /**
   * 推荐商品加入购物车
   */
  addShopCart: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.goodsid)
    wx.request({
      url: Globalhost + 'Api/cart/addCart',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        goods_id: e.currentTarget.dataset.goodsid,
        goods_num: 1
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          that.createList(that); // 渲染列表
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  go: function (e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/commodityDetails/commodityDetails?goods_id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 判断全选按钮状态
   */
  isChooseAll: function (that) {
    if (that.data.cartList.length > 0) {
      if (that.data.cartList.length == that.data.orderList.length) {
        that.setData({
          chooseAllShow: false
        })
      }
    }
  }
})