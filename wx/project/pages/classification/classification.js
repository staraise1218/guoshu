const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    tabList: [{
      id: 1,
      name: '热卖',
      parent_id: 0
    }],
    sub: [{
      id: 0,
      name: "今日热卖",
      parent_id: 1
    }],
    targetID: '', // 左侧分类
    subID: '', // 小分类ID
    currentTab: 0,
    reaHeight: 0,
    subRight: [], // 小分类列表
    status: 'left',
    address: '位置', //
    value: [0, 0],
    multiArray: [], // 地区json
    index0: 0, // 地区index 0
    cityShow: false,


    
    chooseIndex: [0, 0],
    multiArray: [], // 地区json
    index0: 0, // 地区index 0

  },

  onShow: function (options) {
    var that = this;
    console.log(options)
    console.log(that.data.targetID)
    
    that.setData({
      address: wx.getStorageSync('address')
    })
    that.all(that);
    that.location(that);
    that.loadingShopcartNum(that);
    
    if(!wx.getStorageSync('user_id')) {
      wx.navigateTo({
        url: '/pages/loading/loading'
      })
    }
    // if(wx.getStorageSync('targetID')) {
    //   that.setData({
    //     targetID: wx.getStorageSync('targetID')
    //   })
    //   that.yiji(that, that.data.targetID) 
    // } 
    // else {
      wx.request({ // 获取分类 -- 左侧
        url: Globalhost + 'Api/category/getAllCategory',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          that.setData({
            targetID: res.data.data[0].id
          })
        },
        complete: function() {
          if (wx.getStorageSync('indexCatid')) {
            that.setData({
              targetID: wx.getStorageSync('indexCatid')
            })
            that.yiji(that, wx.getStorageSync('indexCatid'));
          } else {
            that.yiji(that, that.data.targetID);
          }
        }
      })
      // setTimeout(function () {
      //     if (wx.getStorageSync('indexCatid')) {
      //       that.setData({
      //         targetID: wx.getStorageSync('indexCatid')
      //       })
      //       that.yiji(that, wx.getStorageSync('indexCatid'));
      //     } else {
      //       that.yiji(that, that.data.targetID);
      //     }
      //   }, 1000)
    // }
  },
  toLik: function () {
    console.log(this.data)
  },
  onLoad: function () {
    let that = this;
  },

  /**
   * 侧栏 tab 切换
   */
  tabClick: function (e) {
    let that = this;
    console.log(that.data)
    console.log('分类id：', e.currentTarget.dataset.id)
    
    that.setData({
      sub: [],
      targetID: e.currentTarget.dataset.id,
      subID: '',
      subRight: '',
      status: 'left',
    })
    that.yiji(that, that.data.targetID)
    if(that.data.targetID) {
      wx.setStorageSync('targetID', that.data.targetID)
    }
  },
  /**
   * 小分类
   */
  subClick: function (e) {
    let that = this;
    console.log('小分类id', e.currentTarget.dataset.id)
    this.setData({
      sub: [],
      subID: e.currentTarget.dataset.id
    })
    that.erji(that, e.currentTarget.dataset.id)
  },

  /**
   * 搜索
   */
  toSearch: function (e) {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  /**
   * 跳转商品详情
   */
  toCon: function (e) {
    console.log(e.currentTarget.dataset.goodsId)
    wx.navigateTo({
      url: '/pages/commodityDetails/commodityDetails?goods_id=' + e.currentTarget.dataset.goodsId + '&msg=fenlei'
    })
  },
  /**
   * 获取所有分类（层级关系）
   */
  all: function (that) {
    wx.request({ // 获取分类 -- 左侧
      url: Globalhost + 'Api/category/getAllCategory',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;
        console.log(data)
        for (var i = 0; i < data.length; i++) {
          var tabList = [];
          tabList[i] = {
            id: '',
            name: '',
            parent_id: '',
            sub: []
          }
          var tabId = 'tabList[' + i + '].id',
            tabName = 'tabList[' + i + '].name',
            taBparent_id = 'tabList[' + i + '].parent_id'
          that.setData({
            [tabId]: data[i].id,
            [tabName]: data[i].name,
            [taBparent_id]: data[i].parent_id
          })
          if (data[i].sub) {
            // console.log(data[i].sub)
            for (var j = 0; j < data[i].sub.length; j++) {
              tabList[i].sub[j] = {
                id: '',
                name: '',
                parent_id: ''
              }
              var subId = 'tabList[' + i + '].sub[' + j + '].id',
                subName = 'tabList[' + i + '].sub[' + j + '].name',
                subParent_id = 'tabList[' + i + '].sub[' + j + '].parent_id'
              that.setData({
                [subId]: data[i].sub[j].id,
                [subName]: data[i].sub[j].name,
                [subParent_id]: data[i].sub[j].parent_id
              })
            }
          }
        }
        console.log('获取所有分类（层级关系）')
        console.log(that.data.tabList)
      }
    })
  },
  /**
   * 获取一级分类下的商品列表
   */
  yiji: function (that, id) {
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
        console.log(' 获取一级分类下的商品列表')
        let data = res.data.data;
        console.log(data);
        var sub = [];
        if (data.length == 0) {
          that.setData({
            sub: ''
          })
        }
        for (var i = 0; i < data.length; i++) {
          sub[i] = {
            id: '',
            name: '',
            goodslist: []
          }
          var subId = 'sub[' + i + '].id',
            subName = 'sub[' + i + '].name'
          that.setData({
            [subId]: data[i].id,
            [subName]: data[i].name
          })
          for (var j = 0; j < data[i].goodslist.length; j++) {
            sub[i].goodslist[j] = {
              goods_id: '',
              goods_name: '',
              original_img: '',
              shop_price: '',
              store_count: '',
              subtitle: '',
              virtual_num: 0,
            }
            var goodslistGoods_id = 'sub[' + i + '].goodslist[' + j + '].goods_id',
              goodslistGoods_name = 'sub[' + i + '].goodslist[' + j + '].goods_name',
              goodslistOriginal_img = 'sub[' + i + '].goodslist[' + j + '].original_img',
              goodslistShop_price = 'sub[' + i + '].goodslist[' + j + '].shop_price',
              goodslistStore_count = 'sub[' + i + '].goodslist[' + j + '].store_count',
              goodslistSubtitle = 'sub[' + i + '].goodslist[' + j + '].subtitle',
              goodslistSales_sum = 'sub[' + i + '].goodslist[' + j + '].virtual_num',
              goodslistSales_tag = 'sub[' + i + '].goodslist[' + j + '].tag'

            that.setData({
              [goodslistGoods_id]: data[i].goodslist[j].goods_id,
              [goodslistGoods_name]: data[i].goodslist[j].goods_name,
              [goodslistOriginal_img]: Globalhost + data[i].goodslist[j].original_img,
              [goodslistShop_price]: data[i].goodslist[j].shop_price,
              [goodslistStore_count]: data[i].goodslist[j].store_count,
              [goodslistSubtitle]: data[i].goodslist[j].subtitle,
              [goodslistSales_sum]: data[i].goodslist[j].virtual_num,
              [goodslistSales_tag]: data[i].goodslist[j].tag
            })
          }
        }
      }
    })
  },
  /**
   * 获取二级分类下的商品列表
   */
  erji: function (that, id) {
    wx.request({
      url: Globalhost + 'Api/category/goodslist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        cat_id: id,
        city_code: wx.getStorageSync('addressCode'),//110100,
        page: 0
      },
      success: function (res) {
        console.log(' 获取二级分类下的商品列表')
        var data = res.data.data
        console.log(data)
        console.log(data.length)
        that.setData({
          sub: '',
          subRight: data,
          status: 'right'
        })
        console.log(that.data.sub)
        console.log(that.data.subRight)
      }
    })
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
   * ================================
   *     选择城市相关
   * ================================
   */
  changCity: function () {
    this.setData({
      cityShow: true
    })
  },
  cityCancel: function () {
    this.setData({
      cityShow: false
    })
  },
  cityOk: function () {
    wx.setStorageSync('address', this.data.cityChange)
    wx.setStorageSync('addressCode', this.data.codeChange || '110100')
    this.setData({
      cityShow: false,
      address: this.data.cityChange,
      addressCODE: this.data.codeChange
    })
  },
  changeCity: function (e) {
    let that = this;
    var str = 'value[1]';
    if (that.data.index0 != e.detail.value[0]) {
      that.setData({
        index0: e.detail.value[0],
        'value[0]': e.detail.value[0],
        'value[1]': 0,
      })
    } else {
      that.setData({
        index0: e.detail.value[0],
        'value[0]': e.detail.value[0],
        'value[1]': e.detail.value[1],
      })
    }
    let index0 = e.detail.value[0]
    let index1 = e.detail.value[1]


    console.log(that.data.multiArray[index0])
    console.log(that.data.multiArray[index0].sub[index1])
    that.setData({
      cityChange: that.data.multiArray[index0].sub[index1].name,
      codeChange: that.data.multiArray[index0].sub[index1].code
    })
  
  },
  cityt: function () {
    this.setData({
      cityShow: !this.data.cityShow
    })
  },
  location: function (that) {
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
  /**
  * 跳转消息页面
  */
 toNews: function () {
   wx.navigateTo({
     url: '/pages/news/news'
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
      success: function(res) {
        console.log(res)
        that.setData({
          cart_num: res.data.data.cartNum
        })
        if(res.data.data.cartNum > 0) {
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





  
// 数据 [code, code, code]
chooseAddressShow: function () {
  console.log(111111111111111111111111111)
  this.setData({
    chooseAlerShow: true
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
    chooseAddressName:  that.data.multiArray[e.currentTarget.dataset.index].sub[0].name
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
    address: that.data.chooseAddressName
  })
  wx.setStorageSync('address', that.data.chooseAddressName);
  wx.setStorageSync('addressCode', that.data.chooseAddressCode);
  that.yiji(that, wx.getStorageSync('targetID')) 
},
// 取消修改
cancleCity: function () {
  this.setData({
    chooseAlerShow: false
  })
},
})