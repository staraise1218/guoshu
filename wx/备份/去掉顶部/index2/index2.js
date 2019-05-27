const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
    currentTab: 0,
    index: 0,
    imgUrls: [], // 轮播图
    imgUrlsLen: 0, // 轮播图 length
    dots: 1, // 轮播图 小点初始值
    categoryList: {}, // tab
    // height: 0,  // 轮播图
    time: {}, // 秒杀倒计时
    navBtn: [
      {
      url: 'http://img.hb.aicdn.com/e5b2e8a1f30c9fc3ba4460d50c36cc244838ade31070-Xe3xpS_fw658',
      title: '热卖',
      func: ''
    }, {
      url: 'http://img.hb.aicdn.com/b4cbe5bd214e1a1c49cddde07e5b49db0121c3df2a67-B8NBgz_fw658',
      title: '鲜果',
      func: 'toXianguo'
    }, {
      url: 'https://hbimg.huabanimg.com/013306c1d0bf626d34fc8c91a6b569ac084502932a0a-1Yyc9t_fw658',
      title: '干果',
      func: 'toGanguo'
    }, {
      url: 'http://img.hb.aicdn.com/4ec94a7282b29432ba23bd4f5631a40a55ab2a912d71-1ShwcV_fw658',
      title: '时蔬',
      func: 'toShiShu'
    }, {
      url: 'http://img.hb.aicdn.com/5c394ca6d8c5b1c6e5b78c4e871fb1b1574aa39527fb-yOObT8_fw658',
      title: '乳品',
      func: 'toRuPin'
    }, {
      url: 'http://img.hb.aicdn.com/c64c4f4500721d42c6b1f75944e3b2bb74995d5c2bd5-DIIHJy_fw658',
      title: '酒饮',
      func: 'toJiuYin'
    }, {
      url: 'http://img.hb.aicdn.com/9e3837087e91797bd4b4230c76176e4cf990283c2fd5-uLKVty_fw658',
      title: '粮油',
      func: 'toLiangYou'
    }, {
      url: 'http://img.hb.aicdn.com/8d092ef966000b115a9bbb3e40f5335b97f7c639313a-elsS83_fw658',
      title: '零食',
      func: 'toLingShi'
    }, {
      url: 'http://img.hb.aicdn.com/03c208861c98ed69e81d3931318caa79a4c4e9282432-AOKCSy_fw658',
      title: '日百',
      func: 'toRiBai'
    }, {
      url: 'http://img.hb.aicdn.com/6fa8d18ec18d9eea5231622d1a7808dbb085c1b5c72-CsPSeI_fw658',
      title: '更多',
      func: 'more'
    }],

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
    value: [0, 0],
    multiArray: [], // 地区json
    index0: 0, // 地区index 0
    cityShow: false,
    cityChange: '北京',

    youhuiAlert: true, // 是否显示优惠券弹窗
    coup: {           // 优惠券弹窗
      money: '',
      name: '',
      status: 0
    },
    scrollLeft: 0,  // 滑动
  },
  onLoad: function () {
    let that = this;
    /**
     * 修改
     * 每次加载都要获取地理位置
     */
    if(wx.getStorageSync('LOCATIONSTATUS') == 0) {
      that.getUserLocation(); // 获取定位
    }
  },
  onShow: function () {
    let that = this;
    if (!wx.getStorageSync('login')) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
    that.index(that);   // 首页
    that.miaosha(that); // 秒杀商品
    that.location(that); // 地址
    if (wx.getStorageSync('alertStatus') == 1) {
      that.setData({
        youhuiAlert: false
      })
    } else {
      that.coupList(that);
    }

    var date = new Date();
    var str = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + (date.getDate() + 1)
    that.TimeDown(str)
  },
  /**
   * 设置轮播图高度
   */
  setContainerHeight: function (e) {
    console.log(e)

    // 图片原始宽度
    let imgWidth = e.detail.width; 

    // 图片原始高度
    let imgHeight = e.detail.height;

    // 同步获取设备宽度
    let sysInfo = wx.getSystemInfoSync();
    console.log('sysInfo:', sysInfo);

    // 获取屏幕宽度
    let screenWidth = sysInfo.screenWidth;

    // 获取屏幕和原图的比例
    let scale = screenWidth / imgWidth;

    // 设置容器的高度
    this.setData({
      height: imgHeight * scale
    })
  },

  /**
   * 首页接口
   */
  index: function (that) {
    loadingfunc(); // 加载函数
    wx.request({
      url: Globalhost + 'Api/index/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        city_code: 110100
      },
      success: function (res) {
        let data = res.data.data
        // console.log(data)
        /**
         * 轮播图
         */
        that.setData({
          imgUrls: data.bannerList
        })
        console.log(that.data.imgUrls)

        that.setData({
          imgUrlsLen: data.bannerList.length,  // 轮播图len
          categoryList: data.categoryList,    // 分类
          grouplist: data.grouplist,          // 团购商品
          // multiArray: region.region.data,     //城市选择json
          topCateGoods: data.topCateGoods
        })
        for(var j = 0; j < data.topCateGoods.length; j++) {
          var current = 'topCateGoods[' + j + '].STATUS';
          that.setData({
            [current]: 0
          })
        }
        for(var i = 0; i < that.data.categoryList.length; i++) {
          var str = 'categoryList[' + i + '].GOODLISTSS';
          that.setData({
            [str]: {}
          })
        }
        /**
         * Ad
         */
        that.setData({
          adImg: 'https://app.zhuoyumall.com:444' + data.adv[0].ad_code,
          shareImg: 'https://app.zhuoyumall.com:444' + data.adv[1].ad_code,
          jingcaiAdvl: 'https://app.zhuoyumall.com:444' + data.shareGoods[0].ad_code,
          jingcaiAdvr: 'https://app.zhuoyumall.com:444' + data.shareGoods[1].ad_code,
          shareGoods: data.shareGoods
        })
        that.loadingShopcartNum(that);
      }
    })
  },

  //滑动切换 
  swiperTab: function (e) {
    loadingfunc(); // 加载函数
    var that = this;
    console.log(e)
    // console.log(that.data.categoryList)
    const ID = that.data.categoryList[e.detail.current].id;
    that.setData({
      scrollLeft: (e.detail.current - 1)*60
    })
    if (e.detail.source == "touch") {
      //防止swiper控件卡死
      if (this.data.currentTab == 0 && this.data.preIndex>1 ) {//卡死时，重置current为正确索引
        // this.setData({ currentTab: this.data.currentTab });
        that.setData({
          currentTab: e.detail.current
        });
        // console.log(e.detail.current)
        var str = '.item-box-' + (Number(e.detail.current) + 1)

        that.changeTab(that,ID);
        var query = wx.createSelectorQuery()
        // query.select('.item-box-1').boundingClientRect()
        query.select(str).boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (res) {
          res[0].top // #the-id节点的上边界坐标
          res[1].scrollTop // 显示区域的竖直滚动位置
          // console.log('打印demo的元素的信息', res);
          // console.log('打印高度', res[0].height);
          that.setData({
            reaHeight: 'height:' + (res[0].height + 200) + 'px'
          })
        })
      }
      else {//正常轮转时，记录正确页码索引
        that.setData({ currentTab: e.detail.current });
        that.changeTab(that,ID);
        e.currentTarget.offsetLeft == -100
      }
    }
  },
  //点击切换 
  clickTap: function (e) {
    loadingfunc(); // 加载函数
    var that = this;
    console.log(e.currentTarget.dataset.current)
    that.setData({
      currentTab: e.currentTarget.dataset.current
    })
    for(var i = 0; i < that.data.categoryList.length; i++) {
      // if(that.data.categoryList[i].id == e.currentTarget.dataset.id) {
        that.changeTab(that, e.currentTarget.dataset.id);
        var query = wx.createSelectorQuery()
        var str = '.item-box-' + (Number(e.currentTarget.dataset.current) + 1)
        query.select(str).boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function (res) {
          // console.log(res)
          // res[0].top // #the-id节点的上边界坐标
          // res[1].scrollTop // 显示区域的竖直滚动位置
          // console.log('打印demo的元素的信息', res);
          // console.log('打印高度', res[0].height);
          // that.setData({
          //   reaHeight: 'height:' + (res[0].height + 20) + 'px'
          // })
        })
      // }
    }
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
        city_code: 110100
      },
      success: function (res) {
        if(res.data.code == 200) {
          console.log(res.data.data);
          that.setData({
            fenleiList: res.data.data
          })
          console.log(that.data.categoryList)
          console.log(that.data.categoryList)
          let len = that.data.categoryList.length;
          // console.log(len)
          let categoryList = that.data.categoryList;
          for(var i = 0; i < len; i++) {
            if(categoryList[i].id == id) {
              var str = 'categoryList[' + i + '].GOODLISTSS';
              that.setData({
                [str]: res.data.data[0]
              })
            }
          }
          // console.log(that.data)
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
  },
  /**
   * NAV 点击
   */
  tapchange: function (e) {
    console.log(e.currentTarget.dataset.id)
    // this.setData({
    //   currentTab: e.currentTarget.dataset.currenttab
    // })
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
  miaosha: function (that) {
    loadingfunc(); // 加载函数
    wx.request({
      url: Globalhost + 'Api/activity/flash_sale_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_if'),
        city_code: 110100
      },
      success: function (res) {
        // console.log(res);
        that.setData({
          miaosha: res.data.data
        })
        // console.log(that.data.miaosha[0])
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
   * 跳转搜索
   */
  toSearch: function () {
    loadingfunc(); // 加载函数
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  /**
   * 跳转团购
   */
  toNext: function () { // 下期预告
    loadingfunc(); // 加载函数
    wx.setStorageSync('nextStatus', true)
    wx.switchTab({
      url: '/pages/group/group'
    })
  },
  /**
   * 跳转团购
   */
  toGroup: function () { // 下期预告
    loadingfunc(); // 加载函数
    wx.setStorageSync('nextStatus', false)
    wx.switchTab({
      url: '/pages/group/group'
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
            icon: 'none'
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
   * 倒计时
   */
  TimeDown: function (endDateStr) {
    var that = this;
    //结束时间
    var endDate = new Date(endDateStr);
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
    // wx.getShareInfo({
    //   shareTicket: res.shareTickets[0],
    //   success: function (res) {
    //     console.log(res)
    //     wx.request({
    //       url: Globalhost + 'Api/user/shareSystemLog',
    //       method: 'POST',
    //       header: {
    //         'content-type': 'application/x-www-form-urlencoded'
    //       },
    //       success: function(res) {
    //         console.log('分享成功')
    //         console.log(res)
    //       }
    //     })
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //     console.log('分享失败')
    //   }
    // })

    wx.showShareMenu({
      withShareTicket: false,
      success: (result)=>{
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
          success: function(res) {
            console.log('分享成功')
            console.log(res)
          }
        })
      },
      fail: (res)=>{console.log(res)},
      complete: ()=>{}
    });
  },

  /**
   * =================================
   *      位置相关   调起定位
   * =================================
   */
  /**
   * 小程序调起定位
   */
  getUserLocation: function () {
    var that = this;
    wx.getSetting({
      success: (res) => {
        // console.log(res)
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.geo();
                      wx.setStorageSync('LOCATIONSTATUS', 1)
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          that.geo();
        } else {
          // console.log('授权成功')
          //调用wx.getLocation的API
          that.geo();
        }
      }
    })

  },
  /**
   * 获取定位城市
   */
  geo: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        let location = latitude + ',' + longitude
        // console.log('当前经纬度：', location)
        wx.setStorageSync('location', location)
        that.loadCity(latitude, longitude, that)
      }
    })
  },
  /**
   * 逆地理编码
   */
  loadCity: function (latitude, longitude, that) {
    var _self = this;
    let location = longitude + "," + latitude
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        key: '18964fba3ee3a4e672956a24b0090f75',
        location: location,
        extensions: "all",
        s: "rsx",
        sdkversion: "sdkversion",
        logversion: "logversion"
      },
      success: function (res) {
        console.log(res)
        let address = res.data.regeocode.addressComponent.city
        // console.log('当前城市：', address);
        wx.setStorageSync('address', address)
        that.setData({
          address: address
        })
        wx.request({
          url: 'https://restapi.amap.com/v3/geocode/geo?address=' + address + '&key=d1155b6ce952cd80d4ab61f16a9dcb41',
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            let data = res.data.geocodes;
            // console.log(data)
            const adcode = data[0].adcode;
            // console.log('当前城市码：', adcode);
            // wx.setStorageSync('adcode', adcode)
          }
        })
      },
      fail: function (res) {
        console.log('获取地理位置失败')
      }
    })
    wx.request({
      url: 'https://restapi.amap.com/v3/place/around?key=d1155b6ce952cd80d4ab61f16a9dcb41&location=' + location + '&keywords=&types=120302&radius=3000&offset=20&page=1&extensions=all',
      // url: 'https://restapi.amap.com/v3/geocode/regeo?&location=' + location + '&poitype=商务住宅&key=d1155b6ce952cd80d4ab61f16a9dcb41&radius=10000&extensions=all&roadlevel=1&batch =true',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res)
      }
    })
  },
  


  /**
   * ================================
   *     选择城市相关
   * ================================
   */
  cityshow: function () {
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
    this.setData({
      cityShow: false,
      address: this.data.cityChange
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
      url: Globalhost + 'api/region/getJson',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        // console.log(res.data.data)
        that.setData({
          multiArray: res.data.data
        })
      }
    })
  },
/**
 * 点击banner跳转
 */
  toLink: function (e) {
    loadingfunc(); // 加载函数
    console.log(e.currentTarget.dataset.link)
    if(e.currentTarget.dataset.link) {
      wx.navigateTo({
        url: e.currentTarget.dataset.link
      })
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
    // this.setData({
    //   currentTab: e.currentTarget.dataset.catid
    // })
    wx.setStorageSync('indexCatid', e.currentTarget.dataset.catid)
    // wx.switchTab({
    //   url: '/pages/classification/classification'
    // })
    console.log(that.data.topCateGoods)
    for(var i = 0; i < that.data.topCateGoods.length; i++) {
      if(that.data.topCateGoods[i].id == e.currentTarget.dataset.catid) {
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
    wx.navigateTo({
      url: '/pages/stationmaster/stationmaster'
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
   * 跳转到领取优惠券页面
   */
  toCoup: function () {
    this.setData({
      'coup.status': 1
    })
    wx.navigateTo({
      url: '/pages/couponlist/couponlist'
    })
  },
  
  /**
   * 优惠券数据
   */
  coupList: function (that) {
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
        console.log(data)
        if(data.length > 0) {
          that.setData({
            youhuiAlert: true,
            'coup.money': data[0].money,
            'coup.name': data[0].name,
            'coup.status': 0
          })
          // wx.hideTabBar()
        }
      }
    })
  },
  /**
   * 关闭弹窗
   */
  alertClose: function () {
    this.setData({youhuiAlert: false})
    wx.setStorageSync('alertStatus', 1)
    // wx.showTabBar();
  },
  /**
   * 加载购物车数量
   */
  loadingShopcartNum: function (that) {
    console.log(that.data.grouplist)
    wx.request({
      url: Globalhost + 'Api/goods/goodsInfo',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        goods_id: that.data.grouplist[0].goods_id,
        user_id: wx.getStorageSync('user_id')
      },
      success: function(res) {
        console.log(res)
        that.setData({
          cart_num: res.data.data.cart_num
        })
        wx.setTabBarBadge({
          index: 3,
          text: '' + res.data.data.cart_num
        })
      }
    })
  },

  /**
   * footer 跳转
   */
  LINK: function (e) {
    console.log(e) // index classification group shopcart mine
    console.log(this)
    switch (e.currentTarget.dataset.link) {
      case 'classification':
        wx.redirectTo({
          url: '/pages/classification/classification'
        })
        break;
      case 'group':
        wx.redirectTo({
          url: '/pages/group/group'
        })
        break;
        case 'shoppingCart':
          wx.redirectTo({
            url: '/pages/shoppingCart/shoppingCart'
          })
          break;
      case 'mine':
        wx.redirectTo({
          url: '/pages/mine/mine'
        })
    }
  },
  /**
   * 换一批
   */
  chang6: function (e) {
    let that = this;
    for(var i = 0; i < that.data.topCateGoods.length; i++) {
      if(that.data.topCateGoods[i].id == e.currentTarget.dataset.id) {
        var str = 'topCateGoods[' + i + '].STATUS';
        if(that.data.topCateGoods[i].goodslist.length == 0) {
          console.log(that.data.topCateGoods[i].goodslist.length)
          that.setData({
            [str]: -1
          })
        } else if(that.data.topCateGoods[i].goodslist.length >= 0 && that.data.topCateGoods[i].goodslist.length < 6) {
          wx.showToast({
            title: '没有更多了',
            icon: 'none'
          })
        } else if (that.data.topCateGoods[i].goodslist.length >= 6 && that.data.topCateGoods[i].goodslist.length < 12) {
          console.log(that.data.topCateGoods[i].goodslist.length)
          if(that.data.topCateGoods[i].STATUS == 0) {
            that.setData({
              [str]: 1
            })
          }
        } else if (that.data.topCateGoods[i].goodslist.length >= 12) {
          console.log(that.data.topCateGoods[i].goodslist.length)
          if(that.data.topCateGoods[i].STATUS == 0) {
            that.setData({
              [str]: 1
            })
          } else if(that.data.topCateGoods[i].STATUS == 1) {
            that.setData({
              [str]: 2
            })
          } else if(that.data.topCateGoods[i].STATUS == 2) {
            that.setData({
              [str]: 0
            })
          }
        }
      }
    }
  }
})