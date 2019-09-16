const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    goods_id: '',
    imgUrls: [],
    MSG: {
      goods_name: '',
      goods_id: '',
      subtitle: '',
      shop_price: '',
      store_count: '',

      
      // 弹窗
      my_error_alert_show: false,
      my_alert_title: '温馨提示',
      alert_errorMsg: '在您确定订单之前，请选择您的收货方式，我们提供了两种收货方式：门店自取和送货上门。',
      cancel: '门店自取',
      ok: '送货上门',
    },
    goodLists: {
      prom_type: 0
    },
    /**
     * 插入文本
     */
    html: '<div class="div_class" style="line-height: 60px; color: red;">暂无数据</div>',
    nodes: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 60px; color: red;text-indent:2em'
      },
      children: [{
        type: 'node',
        text: '暂无数据'
      }]
    }],
    /**
     * 购物车
     */
    num: '',
    tuijian: [{}],
    MP4: '', // 视频
    byNowFlag: 'true', // 立即购买按钮误触

    // 轮播图
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 300,
    bg: '#C79C77',
    Height: "", //这是swiper要动态设置的高度属性
    shareNum: 0,
    BackStatue: false,  // 分享 返回
    backTime: 10,       // 倒计时返回时间
    videoShow: false,   // 是否显示视频
    dots: true,

    firstLoad: true,  // 视频第一次加载
    haoping: '',     // 好评率
  },
  /**
   * 轮播图自适应高度
   */
  imgHeight: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width; //图片宽度
    var swiperH = winWid * imgh / imgw + "px" //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  ==》swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      Height: swiperH //设置高度
    })
  },
  onLoad: function (options) {
    let that = this;
    var haoping = 95 + Math.floor(Math.random() * 5);
    this.setData({
      haoping: haoping
    })
    console.log('**************商品详情***********************************************************************')
    wx.setStorageSync('shareMsg', '分享商品打开过')
    console.log("options ************> ",options)
    that.setData({
      optionState: options.state
    })
    console.log('optionState', this.data.optionState)
    // 商品不在本地城市
    if(options.shareStatus == 'Back') {
      that.setData({
        BackStatue: true
      })
      var timer = setInterval(() => {
        if(that.data.backTime <= 0) {
          clearInterval(timer);
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
        if(that.data.backTime > 0) {
          that.setData({
            backTime: --that.data.backTime
          })
        }
      }, 1000)
    }
    if (options.share_userCode) {
      console.log('*********************************接收到分享数据***************************')
      console.log(options)
      wx.request({
        url: Globalhost + 'api/goods/bindShareGoods',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user_id: wx.getStorageSync('user_id'),
          goods_id: options.goods_id,
          share_userCode: options.share_userCode
        },
        success: function (res) {
          console.log(res)
        }
      })
    }
    that.tuijian(that);
    that.setData({
      goods_id: options.goods_id
    })
    that.loading(that);
    that.loadingShopcartNum(that);
  },

  loading: function (that) {
    wx.request({
      url: Globalhost + 'Api/goods/goodsInfo',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        goods_id: that.data.goods_id
      },
      success: function (res) {
        let data = res.data.data
        console.log(data)
        // 视频
        if (data.video) {
          that.setData({
            MP4: data.video,
            videoShow: true
          })
        }
        that.setData({
          // share_ratio: ((data.share_ratio * 10000) * (data.shop_price)*10000) / 10000,
          shareNum: data.share_ratio//Math.floor(((data.share_ratio * 100) * (data.shop_price) * 10000) / 100000000)
        })
        if (data.goodsCommentList[0]) {
          that.setData({
            goodsCommentList: data.goodsCommentList[0],
            'goodsCommentList.goods_rank': Number(data.goodsCommentList[0].goods_rank),
          })
        }
        // 轮播图
        var imgUrls = [];
        for (var i = 0; i < data.goods_images_list.length; i++) {
          that.imgH(Globalhost + data.goods_images_list[0].image_url)
          var imgUrls_ = 'imgUrls[' + i + ']'
          that.setData({
            [imgUrls_]: 'https://app.zhuoyumall.com' + data.goods_images_list[i].image_url
          })
        }
        var reg = /src="/ig
        // reg.test(data.goods_content)
        console.log(data.goods_content)
        data.goods_content = data.goods_content.replace(reg, 'style="max-width:100%;height:auto" src="https://app.zhuoyumall.com')
        // 轮播图 END
        if (data.prom_type == 0) {
          that.setData({
            'MSM.shop_price': data.shop_price,
          })
        }
        data.virtual_num = Number(data.virtual_num);
        data.sales_sum = Number(data.sales_sum);
        that.setData({
          'MSM.goods_name': data.goods_name,
          'MSM.subtitle': data.subtitle,
          'MSM.store_count': data.store_count,
          html: data.goods_content,
          goodLists: data,
          poster: 'https://app.zhuoyumall.com' + data.goods_images_list[0].image_url
        })
        console.log(data.goods_images_list[0])
        if (data.prom_type != 0) {
          wx.request({
            url: Globalhost + 'Api/goods/activity',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              goods_id: that.data.goods_id,
              // goods_num: 1,
              // item_id: 0
            },
            success: function (res) {
              console.log(res)
              let data = res.data.data.activityInfo;
              that.setData({
                'MSM.shop_price': res.data.data.activityInfo.shop_price,
                'MSM.virtual_num': res.data.data.activityInfo.virtual_num,
                shareNum: data.share_ratio, //Math.floor(((data.share_ratio * 100) * (data.shop_price) * 10000) / 100000000),
                'goodLists.goods_name': data.activity_title
              })
              console.log(that.data)
              console.log(res.data.data.activityInfo.end_time)
              // 倒计时
              // that.TimeDown(Number(res.data.data.activityInfo.end_time) * 1000)
              var end_time = Number(res.data.data.activityInfo.end_time) * 1000;
              // var start_time = Number(res.data.data.activityInfo.start_time) * 1000;
              that.TimeDown(end_time);
            }
          })
        }

      }
    })
  },

  // 点击播放
  videoAlert() {
    console.log('视频加载中')
  },
  videoLoading() {
    console.log('视频加载中2')
    if(this.data.firstLoad) {
      wx.showLoading({
        title: '视频加载中',
      })
    }
  },
  videoplay() {
    console.log('视频加载中3')
    if(this.data.firstLoad) {
      wx.showLoading({
        title: '视频加载中',
      })
    }
  },
  videoIsPlay() {
    console.log('视频播放')
    this.setData({
      firstLoad: false
    })
    wx.hideLoading();
    // wx.hideToast();
  },
  /**
   * 加入购物车
   */
  addcart: function () {
    let that = this;
    wx.request({
      url: Globalhost + 'Api/cart/addCart',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        goods_id: this.data.goods_id,
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
          console.log(that.data.num)
          console.log(res.data.data.total_num)
          that.loading(that);
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
        city_code: wx.getStorageSync('addressCode'), //110100
      },
      success: function (res) {
        let data = res.data.data;
        console.log(data);
        var tuijian = [];
        that.setData({
          tuijian: data
        })
        console.log(that.data.tuijian)
      }
    })
  },
  /**
   * 加入购物车，推荐
   */
  addShopCart: function (e) {
    let that = this;
    // console.log(e.currentTarget.dataset.goodsid)
    wx.request({
      url: Globalhost + 'Api/cart/addCart',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        goods_id: e.currentTarget.dataset.goodsid,
        goods_num: 1
      },
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })

        that.loading(that);
        that.loadingShopcartNum(that);
        // that.createList(that);
      }
    })
  },
  // 关闭弹窗
  close_my_alert() {
    this.setData({
      my_error_alert_show: false
    })
    console.log(this.data)
  },
  // 门店自取
  my_alert_cancel() {
    let that = this;
    that.close_my_alert();
    console.log('门店自取')
    wx.setStorageSync('PAYSTATUS', 3);
    wx.setStorageSync('action', 'buy_now');
    wx.setStorageSync('send_method', 2);
    wx.setStorageSync('goods_id', that.data.goodsid);
    wx.setStorageSync('goods_num', 1);
    wx.navigateTo({
      url: '/pages/storeList/storeList?goodId=' + that.data.goodsid + '&status=byNow&page=commodityDeatils'
    })
  },
  // 送货上门
  my_alert_ok() {
    let that = this;
    that.close_my_alert();
    console.log('送货上门')
    wx.setStorageSync('PAYSTATUS', 2);
    wx.setStorageSync('action', 'buy_now');
    wx.setStorageSync('send_method', 1);
    wx.setStorageSync('goods_id', that.data.goodsid);
    wx.setStorageSync('goods_num', 1);
    wx.navigateTo({
      url: '/pages/demo/demo?goodId=' + that.data.goodsid + '&page=commodityDeatils&action=buy_now&send_method=2'
      // url: '/pages/order/order?goodId=' + e.currentTarget.dataset.goodsid  + '&status=byNow'
    })
    
  },
  /**
   * 立即购买
   */
  byNow: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset)
    that.setData({
      goodsid: e.currentTarget.dataset.goodsid,
      my_error_alert_show: true
    })
    // if (that.data.byNowFlag) {
    //   that.setData({
    //     byNowFlag: false
    //   })
    //   wx.showModal({
    //     title: '尊敬的用户：',
    //     content: '在您确定订单之前，请选择您的收货方式，我们提供了两种收货方式：门店自取和送货上门。',
    //     confirmText: '送货上门',
    //     cancelText: '门店自取',
    //     success(res) {
    //       if (res.confirm) {
    //         console.log('送货上门')
    //         wx.setStorageSync('PAYSTATUS', 2);
    //         wx.setStorageSync('action', 'buy_now');
    //         wx.setStorageSync('send_method', 1);
    //         wx.setStorageSync('goods_id', e.currentTarget.dataset.goodsid);
    //         wx.setStorageSync('goods_num', 1);
    //         wx.navigateTo({
    //           url: '/pages/demo/demo?goodId=' + e.currentTarget.dataset.goodsid + '&page=commodityDeatils&action=buy_now&send_method=2'
    //           // url: '/pages/order/order?goodId=' + e.currentTarget.dataset.goodsid  + '&status=byNow'
    //         })
    //       } else if (res.cancel) {
    //         console.log('门店自取')
    //         // that.getUserLocation(that);

    //         wx.setStorageSync('PAYSTATUS', 3);
    //         wx.setStorageSync('action', 'buy_now');
    //         wx.setStorageSync('send_method', 2);
    //         wx.setStorageSync('goods_id', e.currentTarget.dataset.goodsid);
    //         wx.setStorageSync('goods_num', 1);
    //         that.setData({
    //           goodId: e.currentTarget.dataset.goodsid
    //         })
    //         wx.navigateTo({
    //           url: '/pages/storeList/storeList?goodId=' + e.currentTarget.dataset.goodsid + '&status=byNow&page=commodityDeatils'
    //         })
    //       }
    //     }
    //   })
    //   setTimeout(function () {
    //     that.setData({
    //       byNowFlag: 'true'
    //     })
    //   }, 1000)
    // }
  },

  /**
   * 跳转详情
   */
  go: function (e) {
    // console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/commodityDetails/commodityDetails?goods_id=' + e.currentTarget.dataset.id + "&state=tuijian"
    })
  },
  toShopCart: function () {
    // wx.navigateTo({
    //   url: '/pages/shoppingCart/shoppingCart'
    // })
    wx.switchTab({
      url: '/pages/shoppingCart/shoppingCart'
    })
  },


  //图片滑动事件
  change: function (e) {
    // console.log(e.detail);
    var that = this;
    var index = e.detail.current;
    // console.log(index);
    var imgUrls = that.data.imgUrls;

    // that.imgH(imgUrls[index])
  },
  //获取图片的高度，把它设置成swiper的高度
  imgH: function (img) {
    var that = this
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度*2
    wx.getImageInfo({ //获取图片长宽等信息
      src: img,
      success: function (res) {
        var imgw = res.width;
        var imgh = res.height
        var swiperH = winWid * imgh / imgw
        that.setData({
          swiperHeight: swiperH //设置高度
        })
      }
    })
  },
  // 分享
  onShareAppMessage: function () {
    console.log(wx.getStorageSync('userCode'))
    var str = '?goods_id=' + this.data.goods_id + '&user_id=' + wx.getStorageSync('user_id') + '&share_userCode=' + wx.getStorageSync('userCode') + '&status=share' + '&shareAddressCode=' + wx.getStorageSync('addressCode')
    // str = JSON.stringify(str)
    console.log(str)
    return {
      title: '【' +this.data.MSM.goods_name + '】' + '仅售' + this.data.MSM.shop_price + '元' + '#' + this.data.MSM.subtitle,
      desc: this.data.MSM.goods_name,
      path: "/pages/loading/loading" + str
      // path: '/pages/loading/loading?goods_id=' + this.data.goods_id + 
      //   '&user_id=' + wx.getStorageSync('user_id') + 
      //   '&share_userCode=' + wx.getStorageSync('userCode') + 
      //   '&status=share' + 
      //   '&shareAddressCode=' + wx.getStorageSync('addressCode')
      // path: '/pages/commodityDetails/commodityDetails?goods_id=' + this.data.goods_id + '&user_id=' + wx.getStorageSync('user_id') + '&share_userCode=' + wx.getStorageSync('userCode')
    }
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
    var hours = Math.floor(modulo / (60 * 60));
    modulo = modulo % (60 * 60);
    //分钟
    var minutes = Math.floor(modulo / 60);
    //秒
    var seconds = modulo % 60;

    var obj = {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }
    // console.log(obj)
    that.setData({
      time: obj
    })
    setTimeout(function () {
      that.TimeDown(endDateStr);
    }, 1000)
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
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        let location = latitude + ',' + longitude
        // console.log('当前经纬度：', location)
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        wx.setStorageSync('latitude', latitude)
        wx.setStorageSync('longitude', longitude)
        // wx.setStorageSync('location', location)
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
        console.log('当前城市：', address);
        if (address == wx.getStorageSync('address')) {
          console.log('当前为本地')
          wx.navigateTo({
            url: '/pages/storeList/storeList?goodId=' + that.data.goodId + '&locationStatus=1&page=commodityDeatils' + '&status=byNow&latitude=' + that.data.latitude + '&longitude=' + that.data.longitude
          })
        } else {
          wx.navigateTo({
            url: '/pages/storeList/storeList?goodId=' + that.data.goodId + '&locationStatus=0&page=commodityDeatils' + '&status=byNow&latitude=' + that.data.latitude + '&longitude=' + that.data.longitude
          })
        }
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
      success: function (res) {
        console.log(res)
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
          cart_num: res.data.data.cartNum,
          num: res.data.data.cartNum
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
  goBack() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  // 视频
  playVideo() {
    this.setData({
      videoShow: true
    })
    VideoContext.play();
  },
  // 图片
  playImg() {
    this.setData({
      videoShow: false,
      dots: false
    })
  },
  toHome() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  }

})