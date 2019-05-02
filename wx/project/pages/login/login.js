const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    loginPhone: '',
    loginPhonePassword: ''
  },
  onShow: function (options) {
    if (wx.getStorageSync('loginPhone')) {
      this.setData({
        loginPhone: wx.getStorageSync('loginPhone'),
        loginPhonePassword: wx.getStorageSync('loginPhonePassword')
      })
    }
  },
  getPhone: function (e) { // 获取手机号
    this.setData({
      loginPhone: e.detail.value
    })
    if ((/^1(3|4|5|7|8)\d{9}$/.test(this.data.loginPhone))) {
      console.log(e.detail.value)
      wx.setStorageSync('loginPhone', e.detail.value)
    }
  },
  getPassword: function (e) { // 获取密码
    console.log(e.detail.value)
    this.setData({
      loginPhonePassword: e.detail.value
    })
  },
  toLogin: function () { // 登陆
    wx.setStorageSync('role', '未设置')
    var that = this;
    wx.request({
      url: Globalhost + 'Api/Auth/login',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        mobile: this.data.loginPhone,
        password: this.data.loginPhonePassword
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          wx.setStorageSync('login', '手机号登陆');
          wx.setStorageSync('mobile', res.data.data.mobile);
          wx.setStorageSync('user_id', res.data.data.user_id);
          wx.setStorageSync('user_money', res.data.data.user_money);
          wx.setStorageSync('pay_password', res.data.data.pay_password);
          wx.setStorageSync('head_pic', res.data.data.head_pic);
          wx.setStorageSync('nickname', res.data.data.nickname);
          wx.setStorageSync('loginPhone', that.data.loginPhone);
          wx.setStorageSync('loginPhonePassword', that.data.loginPhonePassword);
          wx.setStorageSync('token', res.data.data.token);
          wx.setStorageSync('sex', res.data.data.sex);
          wx.setStorageSync('userCode', res.data.data.userCode);
          // role 1普通会员 2 配送员 3团长
          // if(res.data.data.role == 1) {
          //   wx.setStorageSync('role', '普通用户')
          // } else if(res.data.data.role == 2) {
          //   wx.setStorageSync('role', '配送员')
          // } else if (res.data.data.role == 3) {
          //   wx.setStorageSync('role', '自提点')
          // } else {
          //   wx.setStorageSync('role', '未设置')
          // }
          
          wx.setStorageSync('role', res.data.data.role)
          wx.showToast({
            title: '登陆成功',
            icon: 'success',
            duration: 1500,
            success(res) {
              wx.switchTab({
                url: '/pages/index/index'
              })
            }
          })
        } else if (res.data.code == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  toRetrieve: function () { // 忘记密码
    wx.navigateTo({
      url: '/pages/retrieve/retrieve'
    })
  },
  toSingup: function () { // 注册
    wx.navigateTo({
      url: '/pages/singup/singup'
    })
  },

  bindGetUserInfo: function () {
    let that = this;
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

                      wx.setStorageSync('head_pic', data.head_pic);
                      wx.setStorageSync('nickname', data.nickname);
                      wx.setStorageSync('token', data.token);
                      wx.setStorageSync('user_id', data.user_id);
                      wx.setStorageSync('user_money', data.user_money);
                      
                    }
                  })
                },
                complete: function () {
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                }
              })
            }
          });
        } else {

        }
      }
    });
  },
  test: function () {
    wx.showToast({
      title: '暂未开通',
      icon: 'none'
    })
  },
})