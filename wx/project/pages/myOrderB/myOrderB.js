const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    currentTab: 0,
    reaHeight: 0,
    orderInfo: [],
    orderMsg: [], // 全部
    loadTihuo: [],     // 已提货
    weiTiHuo: [], // 未提货
    user_money: 0, // 收益

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
    that.listLoad(that);  // 全部
    that.loadTihuo(that); // 已提货
    that.weiTiHuo(that);  // 未提货
  },
  onShow: function () {
    let that = this;
    that.listLoad(that);  // 全部
    that.loadTihuo(that); // 已提货
    that.weiTiHuo(that);  // 未提货
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
   * 列表
   */
  listLoad: function (that) {
    wx.request({
      url: Globalhost + 'Api/order/pickup_order_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        page: 1,
      },
      success: function (res) {
        let data = res.data.data;
        console.log(data)
        that.setData({
          orderMsg: data.order_list
        })
        console.log(that.data.orderMsg)
      }
    })
  },
  /**
   * 已提货
   */
  loadTihuo: function (that) {
    wx.request({
      url: Globalhost + 'Api/order/pickup_order_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        type: 'WAITRECEIVE',
        page: 1
      },
      success: function (res) {
        let data = res.data.data;
        console.log(data)
        that.setData({
          loadTihuo: data.order_list,
          user_money: data.user_money
        })
        wx.setStorageSync('user_money', data.user_money)
      }
    })
  },
  /**
   * 未提货
   */
  weiTiHuo: function (that) {
    wx.request({
      url: Globalhost + 'Api/order/pickup_order_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        type: 'WAITRECEIVE',
        page: 1
      },
      success: function (res) {
        let data = res.data.data;
        console.log(data)
        that.setData({
          weiTiHuo: data.order_list
        })
      }
    })
  },
  /**
   * 确定提货
   */
  toOk: function (e) {
    console.log(e.currentTarget.dataset.orderId)
    wx.showModal({
      content: '确定提货吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: Globalhost + 'Api/order/confirm_tihuo',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              user_id: wx.getStorageSync('user_id'),
              order_id:e.currentTarget.dataset.orderId
            },
            success: function (res) {
              console.log(res)
              wx.showToast({
                title: res.data.msg,
                icon: 'none'
              })
              that.listLoad(that);  // 全部
              that.loadTihuo(that); // 已提货
              that.weiTiHuo(that);  // 未提货
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  toYue: function () {
    wx.navigateTo({
      url: '/pages/shouyiB/shouyiB'
    })
  },
})