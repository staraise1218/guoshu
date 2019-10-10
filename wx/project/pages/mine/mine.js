const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
    headPic: '/wx/img/2/empty.png',
    NickName: '请输入用户名',
    money: '', // 零钱
    readBag: '', // 红包
    waitOrder: '', // 未付订单
    role: 1,  // 1普通会员 2 配送员 3团长
    shenqing: false,  // 申请弹窗


  },
  onShow() {
    let that = this;
    console.log('*************************onLoad************************');
    let user_id = wx.getStorageSync("user_id") || "0"
    that.setData({
      user_id: user_id
    })
    if (wx.getStorageSync('user_id')) {
      console.log('用户已登录');
      that.getUserInfoMsg(that);
      that.getIndex(that);
    }
    that.setData({
      role: wx.getStorageSync('role') || 1
    })
  },


  // 获取用户信息
  getUserInfoMsg(that) {
    if (wx.getStorageSync('user_id')) {
      wx.request({
        url: Globalhost + 'Api/user/getUserInfo',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user_id: wx.getStorageSync('user_id')
        },
        success: function (res) {
          console.log(res)
          let data = res.data.data;

          let userInfo = wx.getStorageSync("userInfo");
          console.log("userInfo", userInfo);
          
          that.setData({
            NickName: data.nickname,
            headPic: data.head_pic,
            money: data.user_money,
            WXheadPic: userInfo.avatarUrl
          })

          wx.setStorageSync('userCode', data.userCode);
          wx.setStorageSync('head_pic', data.head_pic);
        }
      })
    }
  },

  // Index
  getIndex(that) {
    wx.request({
      url: Globalhost + 'Api/user/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id')
      },
      success: function (res) {
        console.log(res)
        let data = res.data.data;
        if (res.data.code == 200) {
          that.setData({
            readBag: data.redpack_num,
            // headPic: data.userInfo.head_pic || '/wx/img/2/设置.png',
            NickName: data.userInfo.nickname || '请输入用户名',
            money: data.userInfo.user_money || 0, // 零钱,
            waitOrder: data.unpaidOrderNum
          })
        } else {
          console.log('ERROR***************************')
        }
      }
    })
  },





  toYue: function () { // 余额
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc();
      wx.navigateTo({
        url: '/pages/mingxi/mingxi'
        // url: '/pages/yue/yue'
      })
    }
  },
  toYouhui: function () { // 优惠券
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc();
      wx.navigateTo({
        url: '/pages/youhuiquan/youhuiquan'
      })
    }
  },
  toUserinfo: function () {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc();
      wx.navigateTo({
        url: '/pages/userInfo/userInfo'
      })
    }
  },
  toWeiZhiFu: function () { // 未支付
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc();
      wx.navigateTo({
        url: '/pages/myOrder/myOrder?pageStatus=0'
      })
    }
  },
  toKefu: function () { // 客服
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc();
      wx.navigateTo({
        url: '/pages/kefu/kefu'
      })
    }
  },
  toAddress: function () { // 收货地址
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      loadingfunc();
      wx.navigateTo({
        url: '/pages/address/address'
      })
    }
  },
  toSetting: function () { // 设置
    loadingfunc();
    wx.navigateTo({
      url: '/pages/setting/setting'
    })
  },
  toPeisong: function () { // 配送1
    wx.navigateTo({
      url: '/pages/peisongList/peisongList?opSTATUS=SENDING'
    })
  },
  // 关于我们
  toAgreement: function () {
    wx.navigateTo({
      url: '/pages/aboutus/aboutus'
    })
  },
  // 跳转到站点申请
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
  // 自提点说明
  toSiteMsg: function () {
    loadingfunc();
    wx.navigateTo({
      url: '/pages/siteMsg/siteMsg'
    })
  },
  // 跳转到自提点订单
  toZiti() {
    loadingfunc();
    wx.navigateTo({
      // url: '/pages/peisongList/peisongList?opSTATUS=SENDING'
      url: '/pages/myOrderB/myOrderB?opSTATUS=WAITRECEIVE'
    })
  },
  shenqing() {
    let that = this;
    let user_id = that.data.user_id;
    if (user_id == "0") {
      this.toLogin(that)
    } else {
      this.setData({
        shenqing: true
      })
    }
  },
  closeShenqing() {
    console.log('alsjknm')
    this.setData({
      shenqing: false
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




  // 获取站点名
  getPickupInfo() {
    let that = this;
    wx.request({
      url: Globalhost + 'Api/user/getPickupInfo',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id')
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            pickupName: res.data.data.pickup_name
          })
        } else {
          console.log('获取站点名 ERROR')
        }
      }
    })
  },
  toLogin(){

    if (!wx.getStorageSync('login')) {
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
    }
  }
})