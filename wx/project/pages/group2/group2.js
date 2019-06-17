const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
    poster: '',
    Grouplist: [],  // 团购列表
    MiaosaList: [], // 秒杀列表
    NextList: [],   // 下次预告
    Active: 'MIAOSA'
  },
  onLoad: function (options) {

  },
  onShow: function () {
    let that = this;
    that.group(that);
    that.miaosha(that);
    that.miaosha(that, 'next');
  },

  /**
   * 团购首页
   */
  group: function (that) {
    wx.request({
      url: Globalhost + 'Api/activity/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        city_code: wx.getStorageSync('addressCode'),//110100,
        page: 1
      },
      success: function (res) {
        let data = res.data.data;
        console.log(data)
        that.setData({
          poster: data.bannerList[0].ad_code,
          Grouplist: data.grouplist
        })
      }
    })
  },
  /**
   * 获取秒杀商品
   */
  miaosha: function (that, status) {
    let posData = {
      user_id: wx.getStorageSync('user_id'), //   	    用户id
      city_code: wx.getStorageSync('addressCode'),//110100, //    	用户的城市编码
    }
    if(status == 'next') {
      posData.type = 'next';
    }
    wx.request({
      url: Globalhost + 'Api/activity/flash_sale_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: posData,
      success: function (res) {
        let data = res.data.data;
        console.log(data)
        if(status == 'next') {
          that.setData({
            NextList: ''
          })
        } else {
          that.setData({
            MiaosaList: data
          })
        }
      }
    })
  },

  changeActive(e) {
    console.log(e.currentTarget.dataset.active)
    this.setData({
      Active: e.currentTarget.dataset.active
    })
  },

  /**
   * 跳转商品详情
   */
  toCon: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/commodityDetails/commodityDetails?goods_id=' + e.currentTarget.dataset.id + '&msg=index'
    })
  },





  onShareAppMessage: function () {

  }
})