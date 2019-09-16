const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    alertShow: false,
    loginShow: false,
    isShouquan: '', // 是否授权了
  },
  onLoad: function (options) {
    let that = this;
    console.log('*******************************loading********************************')
    console.log('options', options)
    console.log('goods_id', options.goods_id)
    console.log('share_userCode', options.share_userCode)
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      options: options
    })

    // 第一次登陆 需要加载欢迎页面
    wx.setStorageSync('readBackAlertStatus', 0);
    if(!wx.getStorageSync('FIRST')) {
      // 授权按钮
      this.setData({
        loginShow: true
      })
      wx.hideLoading();
      // wx.reLaunch({
      //   url: '/pages/welcome/welcome'
      // })
    } else {
      // 非第一次登陆，加载首页
      that.getUserLocation(that);
    }

    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("用户授权了");
          that.setData({
            isShouquan: true
          })
        } else {
          //用户没有授权
          console.log("用户没有授权");
          that.setData({
            isShouquan: false
          })
        }
      }
    });

  },
  onShow: function (options) {
    console.log('***********************onShow*************************');
    console.log(options)
  },
  onLaunch: function (options) {
    console.log('***********************onLaunch*************************');
    console.log(options)
  },
  tiaoguo: function (e) {
    console.log('跳过')
    
  },
  openSetting() {
    console.log('openSetting')
  },
  // 授权登陆
  bindGetUserInfo: function () {
    let that = this;
    let isShouquan = that.data.isShouquan;

    if(isShouquan) {
      that.setData({
        alertShow: true
      })
    } else {
      that.myLogin("1", that);
    }
  },

  myLogin(status, _that) {
    let that = this;
    if(status == "1") {
      that = _that;
    }
    wx.login({
      success: function (loginRes) {
        console.log('code :', loginRes.code) // code 码
        wx.setStorageSync('code', loginRes.code)
        console.log(loginRes)
        if (loginRes) {
          // 获取用户信息
          wx.getUserInfo({
            withCredentials: true, //非必填  默认为true
            success: function (infoRes) {
              console.log(infoRes);
              console.log("请求服务端的登录接口>>>>>>>>>>>>>>>")
              console.log(JSON.parse(infoRes.rawData))
              const USERINFO = JSON.parse(infoRes.rawData);
              wx.setStorageSync('iv', infoRes.iv)
              wx.setStorageSync('signature', infoRes.signature)
              wx.setStorageSync('userInfo', infoRes.userInfo)
              // 请求服务端的登录接口
              wx.request({
                url: Globalhost + 'Api/auth/getOpenid',
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  code: loginRes.code
                },
                success: function (res) {
                  let user = res.data.data
                  console.log(res);
                  wx.setStorageSync('openid', user.openid);
                  wx.setStorageSync('session_key', user.session_key);
                  wx.setStorageSync('login', '微信登陆');
                  wx.request({
                    url: Globalhost + 'Api/Auth/thirdLogin',
                    method: 'POST',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      type: 'weixin',
                      account_id: user.openid,
                      nickname: USERINFO.nickName,
                      head_pic: USERINFO.avatarUrl
                    },
                    success: function (res) {
                      console.log(res)
                      let data = res.data.data;
                      wx.setStorageSync('nickname', data.nickname);
                      wx.setStorageSync('token', data.token);
                      wx.setStorageSync('user_id', data.user_id);
                      wx.setStorageSync('user_money', data.user_money);
                      wx.setStorageSync('userCode', data.userCode);
                      wx.setStorageSync('role',data.role);
                      console.log("that", that)
                      that.getUserLocation(that);
                      wx.setStorageSync('FIRST', '不是第一次登陆了')
                      that.setData({
                        loginShow: false
                      })
                    }
                  })
                },
                complete: function () {
                  // wx.switchTab({
                  //   url: '/pages/index/index'
                  // })
                  // wx.reLaunch({
                  //   url: '/pages/welcome/welcome'
                  // })
                }
              })
            }
          });
        } else {

        }
      },
      fail: function () {
        console.log('fail>>>>>>>>>>>>>>>>>>>>>>>>')
      }
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
  getUserLocation: function (that) {
    wx.showToast({
      title: '正在定位...',
      icon: 'loading',
      duration: 20000
    })
    wx.getSetting({
      success: (res) => {
        // console.log(res)
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              console.log(res)
              if (res.cancel) {
                console.log('*********取消授权****************')
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
        wx.setStorageSync('location', location)
        that.getNearCity(that, latitude, longitude);
      },
      fail: function (error) {
        console.log(error)
        that.getUserLocation(that);
      },
      complete: function () {
        console.log('*********************授权结束*********************')
      }
    })
  },

  // 获取当前城市 城市码
  getNearCity(that, latitude, longitude) {
    wx.request({
      url: Globalhost + 'api/index/getNearCity',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        longitude: longitude,
        latitude: latitude,
      },
      success: function (res) {
        wx.setStorageSync('address', res.data.data.name);
        wx.setStorageSync('addressCode', res.data.data.code);
        wx.setStorageSync('addressId', res.data.data.id);
        that.setData({
          // 'array[0]': res.data.data.name
          address: res.data.data.name
        })
      },
      complete: function () {
        wx.hideToast();
        var shareMsg = {
          goods_id: '',
          user_id: '',
          share_userCode: '',
          shareStatus: ''
        }
        shareMsg = JSON.stringify(shareMsg)
        console.log(shareMsg)
        wx.setStorageSync("shareMsg", shareMsg);
        let options = that.data.options;
        console.log(options)
          // 分享商品
          if(that.data.options.shareAddressCode) {
            let shareMsg = {}; 
            if(that.data.options.shareAddressCode == wx.getStorageSync('addressCode')) {
              console.log('***************************本地城市******************************')
              console.log(options)
              shareMsg.goods_id = options.goods_id;
              shareMsg.user_id = options.user_id;
              shareMsg.share_userCode = options.share_userCode;
              shareMsg.shareStatus = '';
              shareMsg = JSON.stringify(shareMsg);
              console.log(shareMsg)
              wx.setStorageSync("shareMsg", shareMsg);
              // wx.navigateTo({
              //   url: '/pages/index/index?goods_id=' + options.goods_id + '&user_id=' + options.user_id + '&share_userCode=' + options.share_userCode
              // })
              wx.switchTab({
                url: '/pages/index/index'
              })
            } else {
              console.log('***************************外地城市******************************')
              console.log(options)
              shareMsg.goods_id = options.goods_id;
              shareMsg.user_id = options.user_id;
              shareMsg.share_userCode = options.share_userCode;
              shareMsg.shareStatus = 'Back';
              shareMsg = JSON.stringify(shareMsg);
              console.log(shareMsg)
              wx.setStorageSync("shareMsg", shareMsg);
              // wx.navigateTo({
              //   url: '/pages/index/index?goods_id=' + options.goods_id + '&user_id=' + options.user_id + '&share_userCode=' + options.share_userCode + '&shareStatus=Back'
              // })
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          } else {
            console.log('**************************不是分享**************************')
            console.log(options)
            if(wx.getStorageSync('user_id')) {
              wx.switchTab({
                url: '/pages/index/index'
              })
            } else {
              wx.showToast({
                title: '授权失败',
                icon: 'none'
              })
            }
          }
      }
    })
  },
  alertTips() {
    wx.showToast({
      title: '需要通过授权才能己写，请重新点击并授权',
      icon: "none",
      duration: 1500
    })
  },
  onReady: function () {

  },
})