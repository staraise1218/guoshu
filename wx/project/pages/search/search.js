const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    goodList: [], // 推荐商品
    searchList: [], // 列表商品
    tagList: [], // 搜索历史
    searchText: '', // 搜索文字
    isSearch: false, // 是否搜索了
    historyShow: true, // 历史记录是否加载
  },
  onLoad: function (options) {
    let that = this;
    that.tuijian(that);
    that.setData({
      tagList: wx.getStorageSync('tagList')
    })
  },
  onShow: function () {
    let that = this;
  },
  toCommo: function () {
    wx.navigateTo({
      url: '/pages/commodityList/commodityList'
    })
  },
  search: function (e) {
    let that = this;
    console.log(e.detail.value)
    wx.request({
      url: Globalhost + 'Api/goods/goodslist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        city_code: 110100,
        keyword: e.detail.value,
        page: 1
      },
      success: function (res) {
        let data = res.data.data
        console.log(data)
        var goodList = [];
        for (var i = 0; i < data.length; i++) {
          goodList[i] = {
            goods_id: '',
            goods_name: '',
            original_img: '',
            shop_price: '',
            store_count: '',
            subtitle: ''
          }
          var goodListId = 'goodList[' + i + '].goods_id',
            goodListName = 'goodList[' + i + '].goods_name',
            goodListImg = 'goodList[' + i + '].original_img',
            goodListPrice = 'goodList[' + i + '].shop_price',
            goodListCount = 'goodList[' + i + '].store_count',
            goodListTitle = 'goodList[' + i + '].subtitle';
          that.setData({
            [goodListId]: data[i].goods_id,
            [goodListName]: data[i].goods_name,
            [goodListImg]: 'https://app.zhuoyumall.com:444' + data[i].original_img,
            [goodListPrice]: data[i].shop_price,
            [goodListCount]: data[i].store_count,
            [goodListTitle]: data[i].subtitle
          })
        }
        console.log(that.data.goodList)
      }
    })
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
        console.log(data);
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
        console.log(that.data.tuijian)
      }
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
        if (res.data.code == 200) {
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


  /**
   * 搜索
   */
  searchChange: function (e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      searchText: e.detail.value
    })
  },
  toSearch: function (e) {
    let that = this;
    wx.request({
      url: Globalhost + 'Api/goods/goodslist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        city_code: 110100,
        keyword: e.detail.value,
        page: 1
      },
      success: function (res) {
        console.log(res)
        that.setData({
          searchList: res.data.data,
          historyShow: false
        })
        that.searchList(that, that.data.searchText);
      }
    })

  },
  searchList: function (that, keyword) {
    if (that.data.searchText == '') {
      wx.showToast({
        title: '请输入你要搜索的商品',
        icon: 'none'
      })
    } else {
      console.log(that.data.tagList)
      that.data.tagList.length
      var tag = 'tagList[' + Number(that.data.tagList.length) + ']';
      console.log(that.data.tagList.length, tag)
      that.setData({
        [tag]: that.data.searchText
      })
      that.unque(that, that.data.tagList); // 去重
      wx.setStorageSync('tagList', that.data.tagList)

      wx.request({
        url: Globalhost + 'Api/goods/goodslist',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          city_code: 110100,
          keyword: keyword, // that.data.searchText,
          page: 1
        },
        success: function (res) {
          console.log(res)
          that.setData({
            searchList: res.data.data,
          })
        }
      })
    }
  },

  /**
   * 清空历史
   */
  clearHistory: function () {
    let that = this;
    wx.removeStorage({
      key: 'tagList',
      success(res) {
        that.setData({
          tagList: ''
        })
        wx.showToast({
          title: '历史记录已清除',
          icon: 'success'
        })
      }
    })
  },
  /**
   * 点击搜索历史
   */
  tagSearch: function (e) {
    let that = this;
    that.setData({
      searchText: e.currentTarget.dataset.text
    })
    that.searchList(that, e.currentTarget.dataset.text);
  },
  /**
   * 点击搜索按钮
   */
  searchBtn: function () {
    let that = this;
    that.searchList(that, that.data.searchText);
    that.setData({
      historyShow: false
    })
  },
  /**
   * 数组去重
   */
  unque: function (that, arr) {
    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i] == arr[j]) {
          arr.splice(j, 1); //console.log(arr[j]);
          j--;
        }
      }
    }
    return arr;
    that.setData({
      tagList: arr
    })
  },



})