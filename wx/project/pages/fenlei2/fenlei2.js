const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  page: 1,
  data: {
    NavList: [],      // 分类
    GoodList: [],     // 商品
    active: 0,        // 选中
    subActiveID: '',  // sub选中
    chooseAlerShow: false,
    address: '请选择配送点',
    MoreStatus: true, // 可以加载
    page: 0,          // 加载page
    LeftID: -1,       // 左侧点击id
    RightID: -1,      // 右侧点击id
    chooseIndex: [0, 0],  // 城市选中数组
  },
  onLoad() {
    let that = this;
    that.getFenlei(that);
    that.getDeliveryCity(that);
    that.setData({
      address: wx.getStorageSync('address') || '请选择配送点'
    })
  },
// 获取分类 -- 左侧
  getFenlei(that) {
    wx.request({ 
      url: Globalhost + 'Api/category/getAllCategory',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let data = res.data.data;
        console.log(data)
        that.setData({
          NavList: data,
          BaseID: data[0].id
        })
        that.getYiJi(that, data[0].id);
      },
    })
  },
// 一级分类
  getYiJi(that, id) {
    wx.request({
      url: Globalhost + 'Api/category/getCatesGoods',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        cat_id: id,
        city_code: wx.getStorageSync('addressCode') //110100
      },
      success: function (res) {
        let data = res.data.data;
        console.log(data);
        console.log(data[0])
        var arr = [];
        data.forEach(item => {
          item.goodslist.forEach(el => {
            arr.push(el)
          })
        })
        that.setData({
          GoodList: arr,//data[0] ? data[0].goodslist : [],
          subActiveID: -1
        })
      },
    })
  },
  
  /**
   * 获取二级分类下的商品列表
   */
  erji(that, id, page) {
    wx.request({
      url: Globalhost + 'Api/category/goodslist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        cat_id: id,
        city_code: wx.getStorageSync('addressCode'), //110100,
        page: page
      },
      success: function (res) {
        var data = res.data.data
        console.log(data)
        if(data.length == 0) {
          that.setData({
            page: -1
          })
        }
        var GoodList = that.data.GoodList;
        if(page == 1) {
          GoodList = [];
        }
        data.forEach(item => {
          GoodList.push(item);
        })
        that.setData({
          GoodList: GoodList
        })
      }
    })
  },
  // 切换分类
  changeNav(e) {
    let that = this;
    console.log(e.currentTarget.dataset)
    that.setData({
      active: e.currentTarget.dataset.index,
      subActiveID: -1,
      page: 1
    })
    that.getYiJi(that, e.currentTarget.dataset.id);
  },
  // sub切换
  changeSub(e) {
    let that = this;
    console.log(e.currentTarget.dataset.id);
    that.setData({
      subActiveID: e.currentTarget.dataset.id,
      page: 1
    })
    that.erji(that, e.currentTarget.dataset.id, 1);
  },
  /**
   * 加入购物车
   */
  addCart: function (e) {
    let that = this;
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
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
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
  /**
   * 加载购物车数量
   */
  loadingShopcartNum: function (that) {
    wx.request({
      url: Globalhost + 'Api/common/getCartNum',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        city_code: wx.getStorageSync('addressCode'),
        user_id: wx.getStorageSync('user_id')
      },
      success: function (res) {
        console.log(res)
        that.setData({
          cart_num: res.data.data.cartNum
        })
        if (res.data.data.cartNum > 0) {
          wx.setTabBarBadge({
            index: 3,
            text: '' + res.data.data.cartNum
          })
        } else {
          wx.hideTabBarRedDot({
            index: 3
          })
        }
      }
    })
  },
  /**
   * 搜索
   */
  toSearch: function (e) {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  // 显示城市弹窗
  showCity() {
    this.setData({
      chooseAlerShow: true
    })
  },
  // 隐藏城市弹窗
  closeCity() {
    this.setData({
      chooseAlerShow: false
    })
  },
  getDeliveryCity: function (that) {
    wx.request({
      url: Globalhost + 'Api/index/getDeliveryCity',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.data)
        var arr = [];
        for (var i = 0; i < res.data.data.length; i++) {
          arr[i] = res.data.data[i].name
        }
        that.setData({
          multiArray: res.data.data,
          array: arr,
          chooseAddressCode: res.data.data[0].sub[0].code,
          chooseAddressName: res.data.data[0].sub[0].name
        })
      }
    })
  },
  // 选择省
  changeProvince: function (e) {
    let that = this;
    console.log(e)
    that.setData({
      'chooseIndex[0]': e.currentTarget.dataset.index,
      'chooseIndex[1]': 0,
      chooseAddressCode: that.data.multiArray[e.currentTarget.dataset.index].sub[0].code,
      chooseAddressName: that.data.multiArray[e.currentTarget.dataset.index].sub[0].name
    })
    console.log(that.data)
  },
  // 选择配送点
  changeCity: function (e) {
    let that = this;
    console.log(e)
    that.setData({
      'chooseIndex[1]': e.currentTarget.dataset.index,
      chooseAddressCode: e.currentTarget.dataset.code,
      chooseAddressName: e.currentTarget.dataset.name
    })
  },
  // 确定修改
  chooseCity: function () {
    let that = this;
    that.setData({
      chooseAlerShow: false,
      address: that.data.chooseAddressName,
      active: 0
    })
    wx.setStorageSync('address', that.data.chooseAddressName);
    wx.setStorageSync('addressCode', that.data.chooseAddressCode);
    that.getYiJi(that, that.data.NavList[0].id);
    that.loadingShopcartNum(that);
  },
  /**
   * 跳转消息页面
   */
  toNews: function () {
    wx.navigateTo({
      url: '/pages/news/news'
    })
  },
  /**
   * 跳转商品详情
   */
  toCon: function (e) {
    console.log(e.currentTarget.dataset.goodsId)
    wx.navigateTo({
      url: '/pages/commodityDetails/commodityDetails?goods_id=' + e.currentTarget.dataset.goodsId + '&msg=fenlei' + "&state=putong"
    })
  },
  getMore(e) {
    console.log("**********加载更多****************")
    let that = this;
    let subActiveID = that.data.subActiveID;
    let page = that.data.page;
    if(page != -1) {
      ++page
      that.setData({
        page: page
      })
      if(subActiveID != -1) {
        that.erji(that, subActiveID, page);
      }
    }
  }
})