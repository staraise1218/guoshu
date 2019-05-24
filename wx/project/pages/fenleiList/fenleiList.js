const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {

  },
  onLoad: function (options) {
    const that = this;
    console.log(options.id)
    wx.request({
      url: Globalhost + 'Api/index/getGoodsByCat',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        cat_id: options.id,
        city_code: wx.getStorageSync('addressCode'),//110100
      },
      success: function(res) {
        console.log(res)
        that.setData({
          msg: res.data.data.category[0],
          GOODLIST: res.data.data.goodslist
        })
      }
    })
  },
  /**
   * 跳转商品详情
   */
  toCon: function (e) {
    loadingfunc(); // 加载函数
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/commodityDetails/commodityDetails?goods_id=' + e.currentTarget.dataset.id + '&msg=index'
    })
  },
  /**
   * 加入购物车
   */
  addCart: function (e) {
    let that = this;
    loadingfunc(); // 加载函数
    wx.request({
      url: Globalhost + 'Api/cart/addCart',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        goods_id: e.currentTarget.dataset.id,
        goods_num: 1
      },
      success: function (res) {
        console.log(res)
        if(res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            image: '../../src/img/shopcart.png',
            duration: 2000
          })
          that.loadingShopcartNum(that);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  onShareAppMessage: function () {

  }
})