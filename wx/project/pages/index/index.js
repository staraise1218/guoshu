const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
const parabola = require("../../utils/animate.js").parabola;
Page({
  data: {
    currentTab: 0,
    imgUrls: [], // 轮播图
    imgUrlsLen: 0, // 轮播图 length
    dots: 1, // 轮播图 小点初始值
    categoryList: {}, // tab
    // height: 0,  // 轮播图
    time: {}, // 秒杀倒计时
    navBtn: [],

    adImg: '',
    shareImg: '',
    jingcaiAdvl: '', // 分享1
    jingcaiAdvr: '', // 分享2
    showMore: false, // nav 更多按钮显示
    miaoshaArr: [],
    goodlists: [{
      goods_id: "3",
      goods_name: "香椿芽",
      original_img: Globalhost + "public/upload/goods/2019/03-06/87a32c55dc43e46eb3d4c09433188095.png",
      shop_price: "70.00",
      store_count: "100",
      subtitle: "好吃的香椿芽"
    }],
    grouplist: [], // 团购商品
    miaosha: [], // 秒杀商品
    address: '',
    topCateGoods: [], // 底部商品
    /**
     * ===============
     *  选择城市相关
     * ===============
     */
    chooseIndex: [0, 0],
    multiArray: [], // 地区json
    index0: 0, // 地区index 0

    // cityShow: false,
    // cityChange: '北京',

    redBagNum: 0, // 是否显示优惠券弹窗
    coup: { // 优惠券弹窗
      money: '',
      name: '',
      status: 0
    },
    scrollLeft: 0, // 滑动
    hide_good_box: true,


    // 选择城市
    array: [],
    index: 0,
    addressStatus: 0,
    chooseAlerShow: false,



    newShow: false, // 消息显示
    toNews: true
  },
  onLoad: function (options) {

    console.log("options", options)
    let that = this;
    console.log('*****************************加载首页********************************')
    
    that.location(that); // 地址
    let user_id = wx.getStorageSync("user_id") || "0"
    if(user_id != "0") {
      console.log("有 user_id 登录了 》》》 user_id ：", user_id)

      // 应该是红包部分
      if (wx.getStorageSync('readBackAlertStatus') == 0) {
        that.coupList(that);
        that.getNews(that); // 加载消息列表
      }
    } else {
      console.log("没有 user_id 未登录")
    }

    if(!wx.getStorageSync('addressCode')) {
        wx.setStorageSync('addressCode', "111000")
    }




    if(wx.getStorageSync('shareMsg')) {
      console.log(wx.getStorageSync('shareMsg'))
      let shareMsg = wx.getStorageSync('shareMsg');
      shareMsg = JSON.parse(shareMsg);
      console.log("shareMsg", shareMsg)
      if (shareMsg.shareAddressCode != '') {
          // 判断分享
          if (shareMsg.share_userCode) {
            // 外地
            if (shareMsg.shareStatus == 'Back') {
              console.log('*******************首页 分享 外地************************')
              wx.navigateTo({
                url: '/pages/commodityDetails/commodityDetails?goods_id=' + shareMsg.goods_id + '&user_id=' + shareMsg.user_id + '&share_userCode=' + shareMsg.share_userCode + '&shareStatus=Back'
              })
            } else {
              // 本地
              console.log('*******************首页 分享 本地************************')
              wx.navigateTo({
                url: '/pages/commodityDetails/commodityDetails?goods_id=' + shareMsg.goods_id + '&user_id=' + shareMsg.user_id + '&share_userCode=' + shareMsg.share_userCode
              })
            }
          }
        }
    }



    console.log("wx.getStorageSync('address')", wx.getStorageSync('address'))
    //  else {
    that.setData({
      address: wx.getStorageSync('address')
    })
    // }
  },
  onShow: function () {
    let that = this;
    let user_id = wx.getStorageSync("user_id") || "0"
    that.setData({
      user_id: user_id
    })
    that.setData({
      address: wx.getStorageSync('address'),
      toNews: true
    })
    that.index(that); // 首页
    that.miaosha(that); // 秒杀商品
    that.getTuijian(that);
    // if (!wx.getStorageSync('user_id')) {
    //   wx.navigateTo({
    //     url: '/pages/loading/loading'
    //   })
    // }
    that.TimeDown(); // 倒计时
  },

  // 跳转登录
  toLogin(that) {
      wx.showModal({
        title: '未登录',
        content: '是否跳转到登陆页面',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.navigateTo({
              url: '/pages/loading/loading'
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
  },
  getTuijian(that) {
    wx.request({
      url: Globalhost + 'Api/goods/recommendgoodslist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        city_code: wx.getStorageSync('addressCode')
      },
      success: function(res) {
        that.setData({
          tuijianList: res.data.data
        })
      }
    })
  },
  /**
   * 首页接口
   */
  index: function (that, status) {
    loadingfunc(); // 加载函数
    wx.request({
      url: Globalhost + 'Api/index/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        city_code: wx.getStorageSync('addressCode') // 110100
      },
      success: function (res) {
        let data = res.data.data
        if (status == 'Refresh') {
          that.miaosha(that, 'Refresh'); // 下拉刷新 秒杀商品
        }
        // console.log(data)
        /**
         * 轮播图
         */
        that.setData({
          imgUrls: data.bannerList
        })
        data.topCateGoods.forEach((item, index) => {
          item.goodslist.forEach((item, index) => {
            item.SHOW = false;
            item.loadImg = '/wx/img/loading.gif'
          })
        })
        that.setData({
          imgUrlsLen: data.bannerList.length, // 轮播图len
          categoryList: data.categoryList, // 分类
          grouplist: data.grouplist, // 团购商品
          // multiArray: region.region.data,     //城市选择json
          topCateGoods: data.topCateGoods,
          otherPic: data.otherPic
        })
        // console.log(that.data.topCateGoods)
        for (var j = 0; j < data.topCateGoods.length; j++) {
          var current = 'topCateGoods[' + j + '].STATUS';
          that.setData({
            [current]: 0
          })
        }
        for (var i = 0; i < that.data.categoryList.length; i++) {
          var str = 'categoryList[' + i + '].GOODLISTSS';
          that.setData({
            [str]: {}
          })
        }
        /**
         * Ad
         */
        that.setData({
          adImg: 'https://app.zhuoyumall.com' + data.adv[0].ad_code,
          shareImg: 'https://app.zhuoyumall.com' + data.adv[1].ad_code,
          jingcaiAdvl: 'https://app.zhuoyumall.com' + data.shareGoods[0].ad_code,
          jingcaiAdvr: 'https://app.zhuoyumall.com' + data.shareGoods[1].ad_code,
          shareGoods: data.shareGoods
        })
        that.loadingShopcartNum(that);
      }
    })
  },

  /**
   * 分类切换
   */
  changeTab: function (that, id) {
    loadingfunc(); // 加载函数
    wx.request({
      url: Globalhost + 'Api/index/getTopCateGoods',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        cat_id: id, //e.currentTarget.dataset.id,
        city_code: wx.getStorageSync('addressCode') //110100
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log(res.data.data);
          that.setData({
            fenleiList: res.data.data
          })
          console.log(that.data.categoryList)
          console.log(that.data.categoryList)
          let len = that.data.categoryList.length;
          // console.log(len)
          let categoryList = that.data.categoryList;
          for (var i = 0; i < len; i++) {
            if (categoryList[i].id == id) {
              var str = 'categoryList[' + i + '].GOODLISTSS';
              that.setData({
                [str]: res.data.data[0]
              })
            }
          }
        }
      }
    })
  },


  /**
   * 轮播图dots 小点
   */
  swChange: function (e) {
    this.setData({
      dots: e.detail.current + 1
    })
  },
  /**
   * 点击更多
   */
  more: function () {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc(); // 加载函数
      if (this.data.showMore) {
        this.setData({
          showMore: !this.data.showMore,
          'navBtn[9].title': '更多',
          'navBtn[9].url': 'http://img.hb.aicdn.com/6fa8d18ec18d9eea5231622d1a7808dbb085c1b5c72-CsPSeI_fw658',
          'navBtn[9].func': 'more'
        })
      } else {
        this.setData({
          showMore: !this.data.showMore,
          'navBtn[9].title': '水产',
          'navBtn[9].url': 'http://img.hb.aicdn.com/ea77f389f9db130a375d1f18d52679658f9f0cb52a18-vn6IjL_fw658',
          'navBtn[9].func': 'toShuiCan'
        })
      }
    }
  },
  /**
   * NAV 点击
   */
  tapchange: function (e) {
    let that = this;
      wx.navigateTo({
        url: '/pages/fenleiList/fenleiList?id=' + e.currentTarget.dataset.id
      })
  },
  toShuiCan: function () { // 水产
    this.setData({
      currentTab: 9
    })
  },
  toRouDan: function () { // 肉蛋
    this.setData({
      currentTab: 10
    })
  },
  /**
   * 秒杀商品
   */
  miaosha: function (that, status) {
    loadingfunc(); // 加载函数
    wx.request({
      url: Globalhost + 'Api/activity/flash_sale_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_if'),
        city_code: wx.getStorageSync('addressCode') //110100
      },
      success: function (res) {
        // console.log(res);
        that.setData({
          miaosha: res.data.data
        })
        // console.log(that.data.miaosha[0])
      },
      complete: function () {
        if (status == 'Refresh') {
          wx.stopPullDownRefresh();
        }
      }
    })
  },


  /**
   * 跳转商品详情
   */
  toCon: function (e) {
    let that = this;
    let user_id = that.data.user_id;
    console.log("user_id", user_id)
      loadingfunc(); // 加载函数
      console.log(e.currentTarget.dataset)
      wx.navigateTo({
        url: '/pages/commodityDetails/commodityDetails?goods_id=' + e.currentTarget.dataset.id + '&msg=index' + "&state=tuijian"
      })
  },
  /**
   * 跳转商品详情
   */
  toConMs: function (e) {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc(); // 加载函数
      console.log(e.currentTarget.dataset)
      wx.navigateTo({
        url: '/pages/commodityDetails/commodityDetails?goods_id=' + e.currentTarget.dataset.id + '&msg=index' + "&state=miaosha"
      })
    }
  },
  /**
   * 跳转商品详情
   */
  toConPt: function (e) {
    let that = this;
    loadingfunc(); // 加载函数
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/commodityDetails/commodityDetails?goods_id=' + e.currentTarget.dataset.id + '&msg=index' + "&state=putong"
    })
  },
  /**
   * 跳转搜索
   */
  toSearch: function () {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc(); // 加载函数
      wx.navigateTo({
        url: '/pages/search/search'
      })
    }
  },
  /**
   * 跳转团购
   */
  toNext: function () { // 下期预告
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc(); // 加载函数
      wx.setStorageSync('nextStatus', 1)
      wx.switchTab({
        url: '/pages/group2/group2'
      })
    }
  },
  /**
   * 跳转团购
   */
  toGroup: function () { // 下期预告
    let that = this;
    let user_id = that.data.user_id;
      loadingfunc(); // 加载函数
      wx.setStorageSync('nextStatus', false)
      wx.switchTab({
        url: '/pages/group2/group2'
      })
  },
  /**
   * 跳转详情
   */
  toxiangqing: function (e) {
    loadingfunc(); // 加载函数
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/commodityDetails/commodityDetails?goods_id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 倒计时
   */
  TimeDown: function (endDateStr) {
    var that = this;
    // endDateStr = endDateStr.replace(/-/g, '/');
    //结束时间
    var endDate = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1; //new Date().getHours(23);
    //当前时间
    var nowDate = new Date();

    //相差的总秒数
    var totalSeconds = parseInt((endDate - nowDate) / 1000);
    //天数
    var days = Math.floor(totalSeconds / (60 * 60 * 24));
    //取模（余数）
    var modulo = totalSeconds % (60 * 60 * 24);
    //小时数
    var hours = Math.floor(modulo / (60 * 60)) + '';
    modulo = modulo % (60 * 60);
    //分钟
    var minutes = Math.floor(modulo / 60) + '';
    //秒
    var seconds = modulo % 60 + '';

    var obj = {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }
    that.setData({
      time: obj
    })
    setTimeout(function () {
      that.TimeDown(endDateStr);
    }, 1000)
  },



  /**
   * 分享
   */
  onShareAppMessage(res) {
    wx.showShareMenu({
      withShareTicket: false,
      success: (result) => {
        console.log(result)
        wx.request({
          url: Globalhost + 'Api/user/shareSystemLog',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            user_id: wx.getStorageSync('user_id')
          },
          success: function (res) {
            console.log('分享成功')
            console.log(res)
          }
        })
      },
      fail: (res) => {
        console.log(res)
      },
      complete: () => {}
    });
  },



  /**
   * ================================
   *     选择城市相关
   * ================================
   */
  location: function (that) {
    wx.request({
      url: Globalhost + 'Api/index/getDeliveryCity',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("res 》》》》》》》》》》》》》》》", res)
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
   * 点击banner跳转
   */
  toLink: function (e) {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc(); // 加载函数
      console.log("link", e.currentTarget.dataset.link)
      // wx.navigateTo({
      //   url: "/pages/article/article"
      // })
    }
  },
  /**
   * 跳转分类
   */
  toFenlei: function (e) {
    let that = this;
    loadingfunc(); // 加载函数
    console.log(e)
    console.log(e.currentTarget.dataset.catid)
    wx.setStorageSync('targetID', e.currentTarget.dataset.catid)
    wx.setStorageSync('indexCatid', e.currentTarget.dataset.catid)
    // wx.switchTab({
    //   url: '/pages/classification/classification'
    // })
    console.log(that.data.topCateGoods)
    for (var i = 0; i < that.data.topCateGoods.length; i++) {
      if (that.data.topCateGoods[i].id == e.currentTarget.dataset.catid) {
        console.log(that.data.topCateGoods[i])
        that.setData({
          currentTab: i
        })
      }
    }
    loadingfunc(); // 加载函数
    wx.switchTab({
      url: '/pages/classification/classification'
    })
  },
  /**
   * 跳转到站点申请
   */
  toMaster: function () {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      wx.navigateTo({
        url: '/pages/stationmaster/stationmaster'
      })
    }
  },
  /**
   * 跳转消息页面
   */
  toNews: function () {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      this.setData({
        newShow: false,
        toNews: false
      })
      wx.navigateTo({
        url: '/pages/news/news'
      })
    }
  },
  /**
   * 跳转到领取优惠券页面
   */
  toCoup: function () {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      this.setData({
        'coup.status': 1,
        redBagNum: 0
      })
      wx.navigateTo({
        url: '/pages/couponlist/couponlist'
      })
    }
  },

  /**
   * 优惠券数据
   */
  coupList: function (that) {
    wx.setStorageSync('readBackAlertStatus', 1);
    wx.request({
      url: Globalhost + 'Api/user/couponlist',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        page: 1
      },
      success: function (res) {
        let data = res.data.data;
        // console.log(data)
        var redBagNum = 0;
        var redBagTitle = '';
        for (var i = 0; i < data.length; i++) {
          if (data[i].is_get == 0) {
            redBagNum++;
            redBagTitle = data[i].money;
          }
        }
        console.log(wx.getStorageSync('readBackAlertStatus'))

        if (user_id == "0") {
          redBagNum = 0;
        }

        that.setData({
          redBagNum: redBagNum,
          redBagTitle: redBagTitle
        })
        if (data.length > 0) {
          that.setData({
            'coup.money': data[0].money,
            'coup.name': data[0].name,
            'coup.status': 0
          })
        }
      }
    })
  },
  /**
   * 关闭弹窗
   */
  alertClose: function () {
    this.setData({
      redBagNum: 0
    })
    wx.setStorageSync('alertStatus', 1)
    // wx.showTabBar();
  },
  /**
   * 加载购物车数量
   */
  loadingShopcartNum: function (that) {
    // let user_id = that.data.user_id;
    console.log("that.data.user_id", that.data.user_id)
    if(that.data.user_id == 0) {
      return;
    }
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
        // console.log(res)
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
  onPullDownRefresh: function () {
    let that = this;
    console.log('下拉')
    that.index(that, 'Refresh'); // 首页
  },
  // 购物车动画

  /**
   * 加入购物车
   */
  addCart: function (e) {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      var event = e;
      console.log(e)
      // loadingfunc(); // 加载函数
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
            that.loadingShopcartNum(that)
            wx.setTabBarBadge({
              index: 3,
              text: '' + res.data.data.total_num
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    }
  },
  toReadBag: function () {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc();
      wx.navigateTo({
        url: '/pages/couponlist/couponlist'
      })
    }
  },
  toSearMsg: function () {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      let user_id = that.data.user_id;
      if (user_id == "0") {
        this.toLogin(that)
      } else {
        loadingfunc();
        wx.navigateTo({
          url: '/pages/searMsg/searMsg'
        })
      }
    }
  },
  toSiteMsg: function () {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc();
      wx.navigateTo({
        url: '/pages/siteMsg/siteMsg'
      })
    }
  },




  // 数据 [code, code, code]
  chooseAddressShow: function () {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      this.setData({
        chooseAlerShow: true
      })
    }
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
      address: that.data.chooseAddressName
    })
    wx.setStorageSync('address', that.data.chooseAddressName);
    wx.setStorageSync('addressCode', that.data.chooseAddressCode);
    that.index(that); // 首页
    that.miaosha(that); // 秒杀商品
    that.getTuijian(that);  // 推荐商品
  },
  // 取消修改
  cancleCity: function () {
    this.setData({
      chooseAlerShow: false
    })
  },
  getNews(that) {
    wx.request({
      url: Globalhost + 'Api/user/message',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        page: 1
      },
      success: function (res) {
        // console.log(res)
        let data = res.data.data;
        let count = 0;
        data.forEach((item) => {
          // console.log(item)
          if (item.status != 1) {
            count++;
          }
        })
        if (count > 0) {
          that.setData({
            newShow: true
          })
        }
      }
    })
  },
  toTuijian() {
    let that = this;
    let user_id = that.data.user_id;
      wx.navigateTo({
        url: '/pages/tuijian/tuijian'
      })
  },
  toMingxi() {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      wx.navigateTo({
        url: '/pages/mingxi/mingxi'
      })
    }
  },
  toLoading() {


    wx.showModal({
      title: '您未登录',
      content: '是否前往登录界面',

    })
    // if (!wx.getStorageSync('user_id')) {
    //   wx.navigateTo({
    //     url: '/pages/loading/loading'
    //   })
    // }
  }

})