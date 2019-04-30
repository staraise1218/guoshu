const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    List: [], // 列表数据
    currentID: -1, 
    goodId: '', // 商品 id 【立即购买进入页面时】
    Page: '', // 页面
  },
  onLoad: function (options) {
    let that = this;
    that.loadList(that);
    console.log(options)
    if(options.goodId) {
      that.setData({
        goodId: options.goodId
      })
    }
    if(options.good_id) {
      that.setData({
        goodId: options.good_id
      })
    }
    if(options.page == 'demo') {
      that.setData({
        Page: 'demo'
      })
    }
    if(options.status) {
      that.setData({
        status: options.status
      })
    }
    if(options.page == 'commodityDeatils') {
      that.setData({
        status: 'buy_now'
      })
    }
    if(options.page == 'shoppingCart') {
      that.setData({
        status: 'cart'
      })
    }
    if(options.page == 'shoppingCart') {
      that.setData({
        status: 'cart'
      })
    }

  },
  /**
   * 选择
   */
  choose: function(e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      currentID: e.currentTarget.dataset.id
    })
  },
  /**
   * 列表加载
   */
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
   * 跳转订单详情
   */
  toOrder: function () {
    let that = this;
    if(this.data.currentID != -1) {
      wx.navigateTo({
        url: '/pages/demo/demo?Store_id=' + this.data.currentID + '&goodId=' + that.data.goodId + '&page=storeList' + '&status=' + that.data.status
      })
    }
  },
  

  onShareAppMessage: function () {

  }
})