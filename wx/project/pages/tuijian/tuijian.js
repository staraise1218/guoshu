const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
    page: 1,
    GOODLIST: [],
    getMore: true
  },
  onLoad: function (options) {
    const that = this;
    that.getList(that);
  },
  onShow: function () {
    let that = this;
    
  },
  // 获取商品列表
  getList (that, id, page) {
    wx.request({
      url: Globalhost + 'Api/goods/recommendgoodslist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        city_code: wx.getStorageSync('addressCode'),//110100
        user_id: wx.getStorageSync('user_id')
      },
      success: function(res) {
        console.log(res)
        var arr = that.data.GOODLIST;
        res.data.data.forEach(item => {
          arr.push(item)
        });
        console.log(arr)
        that.setData({
          GOODLIST: arr
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
  // 加载更多
  getMore: function (e) {
    console.log(e)
    let that = this;
    console.log('***************More**************')
    // if(that.data.getMore) {
    //   wx.showToast({
    //     title: '加载更多',
    //     icon: 'loading'
    //   })
    //   that.setData({
    //     page: ++that.data.page
    //   })
    // } else {
    //   wx.showToast({
    //     title: '没有更多了',
    //     icon: 'none'
    //   })
    // }
  },
  onShareAppMessage: function () {

  }
})