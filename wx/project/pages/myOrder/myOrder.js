const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    currentTab: 0,
    reaHeight: 0,
    orderInfo: [],
    orderMsg: {
      0: {
        add_time: "1552297167",
        count_goods_num: 8,
        goods_list: [{
          goods_id: "2",
          goods_num: "8",
          goods_price: "19.00",
          original_img: 'http://img.hb.aicdn.com/31a74c50f9a1d938d8026f4978665eb1f3af59491c5a-VC6S3o_fw658',
          rec_id: "4"
        }],
        goods_price: "152.00",
        order_amount: "152.00",
        order_id: "8",
        order_status: "2",
        order_status_code: "WAITCCOMMENT",
        order_status_desc: "待评价"
      }
    },
    wait: [],
  },
  onLoad: function (options) {
    let that = this;
    console.log(options.pageStatus == "loadPinglun")
    that.setData({
      currentTab: options.pageStatus
    })

    /**
     * 判断高度
     */
    setTimeout(function () {
      var query = wx.createSelectorQuery()
      query.select('.item-box-1').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        res[0].top // #the-id节点的上边界坐标
        res[1].scrollTop // 显示区域的竖直滚动位置
        // console.log('打印demo的元素的信息', res);
        // console.log('打印高度', res[0].height);
        that.setData({
          reaHeight: 'height:' + (res[0].height + 20) + 'px'
        })
      })
    }, 1000)
    // 判断高度 END
    that.listLoad(that);
    that.loadPintlun(that);
  },
  onShow: function () {
    let that = this;
    that.listLoad(that);
    that.loadPintlun(that);
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
  /**
   * 列表
   */
  listLoad: function (that) {
    wx.request({
      url: Globalhost + 'Api/order/order_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id') ,
        page: 1
      },
      success: function (res) {
        let data = res.data.data;
        console.log(data)
        that.setData({
          orderMsg: data
        })
        console.log(that.data.orderMsg)
      }
    })
  },
  /**
   * 待评价
   */
  loadPintlun: function (that) {
    
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
        console.log(data)
        that.setData({
          wait: data
        })
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
              that.listLoad(that);
            }
          })
          wx.showToast({
            title: '订单已取消',
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
   * 去付款
   */
  toPay: function (e) {
    console.log(e.currentTarget.dataset)
    wx.request({
      url: Globalhost + 'Api/Wxapplet/unifiedOrder',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        order_sn: e.currentTarget.dataset.orderSn,
        openid: 'omnTc4kbM0dc4Cj3Q6V32EF8jXaQ'
      },
      success: function(res) {
        console.log(res)
        let data = res.data.data;
        wx.request({
          url: Globalhost + 'api/WxappletBuyGoodsCallback/testpay',
          method: 'POST',
          data: {
            order_sn: e.currentTarget.dataset.orderSn
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            that.listLoad(that);
            that.loadPintlun(that);
            if(res.data.code == 200) {
              wx.showToast({
                title: res.data.msg,
                icon: 'success'
              })
            }
          }
        })
      }
    })
  },

})