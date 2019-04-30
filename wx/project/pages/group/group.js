const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    timeStart: '',
    timeEnd: '',
    bannerList: '',
    currentTab: 0,
    currentTab2: 0,
    reaHeight: 0,
    shangpin: [],
    nextshangpin: [],
    toDayTuijian: [], // 今日推荐
  },
  goTest: function () {
    wx.navigateTo({
      url: '/pages/commodityDetails/commodityDetails'
    })
  },
  goPre: function () {
    wx.navigateTo({
      url: '/pages/preCommodityDetails/preCommodityDetails'
    })
  },
  onShow: function () {
    if(wx.getStorageSync('nextStatus')) {
      wx.setStorageSync('nextStatus', 'false');
      this.setData({
        currentTab2: 1
      })
    }
    var that = this;
    if (wx.getStorageSync('next')) {
      that.setData({
        currentTab: 1
      })
      wx.setStorageSync('next', false)
    }
  },
  onLoad: function (options) {
    var that = this;
    that.Times()
    that.group(that);     // 团购首页
    that.tuijian(that);   // 推荐商品
    that.miaosha(that);   // 秒杀
    that.next(that);      // 下期预告
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
    }
  },
  //滑动切换 
  swiperTab2: function (e) {
    var that = this;
    that.setData({
      currentTab2: e.detail.current
    });
  },
  //点击切换 
  clickTap2: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.current)
    that.setData({
      currentTab2: e.currentTarget.dataset.current
    })
  },
  /**
   * 获取秒杀商品
   */
  miaosha: function (that, start_time,end_time) {
    wx.request({
      url: Globalhost + 'Api/activity/flash_sale_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'), //   	    用户id
        city_code: 110100, //    	用户的城市编码
      },
      success: function (res) {
        let data = res.data.data;
        // console.log(data)
        that.setData({
          qianggou: data
        })
      }
    })
  },
  /**
   * 获取下期预告
   */
  next: function (that) {
    wx.request({
      url: Globalhost + 'Api/activity/flash_sale_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'), //   	    用户id
        city_code: 110100, //    	用户的城市编码
        type: 'next'
      },
      success: function (res) {
        let data = res.data.data;
        // console.log(data)
        that.setData({
          nextList: data
        })
      }
    })
  },
  /**
   * 今日推荐
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
        // console.log('今日推荐');
        // console.log(data);
        that.setData({
          toDayTuijian: data
        })
        // console.log(that.data.toDayTuijian)
      }
    })
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
        city_code: 110100,
        page: 1
      },
      success: function (res) {
        let data = res.data.data;
        // console.log('团购首页')
        // console.log(data)
        that.setData({
          bannerList: Globalhost + data.bannerList[0].ad_code
        })
      }
    })
  },
  Times: function () {
    let date = new Date();
    let Y = date.getFullYear();
    let M = date.getMonth() + 1;
    let D = date.getDay();
    let D2 = date.getDay() + 1;
    var str = Y + '/' + M + '/' + D;
    var str2 = Y + '/' + M + '/' + D2
    var timeStart = new Date(str).getTime();
    var timeEnd = new Date(str2).getTime();
    // console.log(timeStart)
    // console.log(timeEnd)
    this.setData({
      timeStart: timeStart,
      timeEnd: timeEnd
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
  /**
   * 加入购物车
   */
  addCart: function (e) {
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
            icon: 'none'
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
})