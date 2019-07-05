const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
    page: 1,
    poster: '',
    Grouplist: [],  // 团购列表
    MiaosaList: [], // 秒杀列表
    NextList: [],   // 下次预告
    Active: 'MIAOSA',
    nextStatus: '', // 切换下期预告
    STATUS: true
  },
  onLoad: function (options) {

  },
  onShow: function () {
    let that = this;
    that.setData({
      Grouplist: []
    })
    that.group(that, 1);
    that.miaosha(that);
    that.miaosha(that, 'next');
    if(wx.getStorageSync('nextStatus')) {
      that.setData({
        Active: 'NEXT'
      })
    } else {
      that.setData({
        Active: 'MIAOSA'
      })
    }
  },

  /**
   * 团购首页
   */
  group: function (that, page) {
    wx.request({
      url: Globalhost + 'Api/activity/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        city_code: wx.getStorageSync('addressCode'),//110100,
        page: page
      },
      success: function (res) {
        let data = res.data.data;
        console.log(data)
        that.setData({
          poster: data.bannerList[0].ad_code
        })
        var Grouplist = that.data.Grouplist;
        if(data.grouplist.length == 0) {
          that.setData({
            STATUS: false
          })
        }
        data.grouplist.forEach(item => {
          Grouplist.push(item);
        })
        that.setData({
          Grouplist: Grouplist
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
            NextList: data
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


  getMore(e) {
    console.log(e)
    let that = this;
    let page = that.data.page;
    if(that.data.STATUS) {
      ++page;
      that.setData({
        page: page
      })
      that.group(that, page);
    }
  },
  onShareAppMessage: function () {

  }
})