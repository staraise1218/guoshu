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
      cost_price: '',
      store_count: ''
    },
    goodLists: [],
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
    num: 0,
    tuijian: [{
      original_img: 'http://img.hb.aicdn.com/31a74c50f9a1d938d8026f4978665eb1f3af59491c5a-VC6S3o_fw658',
      goods_name: '[预售]伊利金典',
      subtitle: '副标题副标题副标题副标题',
      shop_price: '55.9'
    }],
    MP4: '', // 视频
  },
  onLoad: function (options) {
    let that = this;
    console.log(options)
    if(options.share_userCode) {
      wx.request({
        url: Globalhost + 'api/goods/bindShareGoods',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user_id: options.user_id,
          goods_id: options.goods_id,
          share_userCode: options.share_userCode
        },
        success: function(res) {
          console.log(res)
        }
      })
    }
    that.tuijian(that);
    that.setData({
      goods_id: options.goods_id
    })
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
            MP4: data.video
          })
        }
        that.setData({
          goodsCommentList: data.goodsCommentList[0],
          'goodsCommentList.goods_rank': Number(data.goodsCommentList[0].goods_rank),
          num: data.cart_num
        })
        // 轮播图
        var imgUrls = [];
        for (var i = 0; i < data.goods_images_list.length; i++) {
          that.imgH(Globalhost + data.goods_images_list[0].image_url)
          var imgUrls_ = 'imgUrls[' + i + ']'
          that.setData({
            [imgUrls_]: 'https://app.zhuoyumall.com:444' + data.goods_images_list[i].image_url
          })
        }
        console.log(data.goods_content)

        var reg = /src="/m
        reg.test(data.goods_content)
        console.log(reg.test(data.goods_content))
        console.log(data.goods_content.replace(reg, 'https://app.zhuoyumall.com:444'))

        data.goods_content = data.goods_content.replace(reg, 'style="max-width:100%;height:auto" src="https://app.zhuoyumall.com:444')
        console.log(data.goods_content)
        // 轮播图 END
        that.setData({
          'MSM.goods_name': data.goods_name,
          'MSM.subtitle': data.subtitle,
          'MSM.cost_price': data.cost_price,
          'MSM.store_count': data.store_count,
          html: data.goods_content,
          goodLists: data
        })
      }
    })
    wx.request({
      url: Globalhost + 'Api/goods/activity',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        goods_id: options.goods_id,
        // goods_num: 1,
        // item_id: 0
      },
      success: function(res) {
        console.log(res.data.data.activityInfo.end_time)
        // 倒计时
        that.TimeDown(Number(res.data.data.activityInfo.end_time) * 1000)
        that.setData({

        })
      }
    })
    // ,
    // wx.request({
    //   url: Globalhost + 'Api/cart/addCart',
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   data: {
    //     user_id: wx.getStorageSync('user_id'),
    //     goods_id: that.data.goods_id,
    //     goods_num: 1
    //   },
    //   success: function (res) {
    //     console.log(res)
    //   }
    // })
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
   * 加入购物车，推荐
   */
  addShopCart: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.goodsid)
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
        that.createList(that);
      }
    })
  },
  /**
   * 立即购买
   */
  byNow: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset)
    wx.showModal({
      title: '尊敬的用户：',
      content: '在您确定订单之前，请选择您的收货方式，我们提供了两种收货方式：门店自取和送货上门。',
      confirmText: '送货上门',
      cancelText: '门店自取',
      success(res) {
        if (res.confirm) {
          console.log('送货上门')
          wx.navigateTo({
            url: '/pages/demo/demo?goodId=' + e.currentTarget.dataset.goodsid + '&page=commodityDeatils'
            // url: '/pages/order/order?goodId=' + e.currentTarget.dataset.goodsid  + '&status=byNow'
          })
        } else if (res.cancel) {
          console.log('门店自取')
          wx.navigateTo({
            url: '/pages/storeList/storeList?goodId=' + e.currentTarget.dataset.goodsid + '&status=byNow'
          })
        }
      }
    })
  },

  /**
   * 跳转详情
   */
  go: function (e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/commodityDetails/commodityDetails?goods_id=' + e.currentTarget.dataset.id
    })
  },
  toShopCart: function () {
    wx.switchTab({
      url: '/pages/shoppingCart/shoppingCart'
    })
  },
  /**
   * 用户点击右上角分享（index.js）
   */
  // onShareAppMessage: function () {
  //   let users = wx.getStorageSync('user');
  //   if (res.from === 'button') {}
  //   return {
  //     title: '转发',
  //     path: '/pages/index/index',
  //     success: function (res) {
  //       console.log(res)
  //     }
  //   }
  // },
  // toShare: function () {
  //   wx.updateShareMenu({
  //     withShareTicket: true,
  //     success(res) {
  //       console.log(res)
  //     }
  //   })
  // },


  
  //图片滑动事件
  change: function (e) {
    console.log(e.detail);
    var that=this;
    var index = e.detail.current;
    console.log(index);
    var imgUrls = that.data.imgUrls;

    // that.imgH(imgUrls[index])
  },
  //获取图片的高度，把它设置成swiper的高度
  imgH: function (img) {
    console.log(img)
    var that=this
    var winWid = wx.getSystemInfoSync().windowWidth;         //获取当前屏幕的宽度*2
    wx.getImageInfo({//获取图片长宽等信息
      src: img,
      success: function (res) {
        var imgw=res.width;
        var imgh = res.height
        var swiperH = winWid * imgh / imgw
        that.setData({
          swiperHeight: swiperH//设置高度
        })
      }
    })
  },
  onShareAppMessage: function () {
    console.log(this.data)
    return {
      title: '果蔬直销',
      desc: this.data.MSM.goods_name,
      path: '/pages/commodityDetails/commodityDetails?goods_id=' + this.data.goods_id + '&user_id=' + wx.getStorageSync('user_id') + '&share_userCode=' + wx.getStorageSync('userCode')
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
})