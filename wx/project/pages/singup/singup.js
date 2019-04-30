const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    code: '',
    phone: '',
    password1: '',
    password2: ''
  },
  onLoad: function (options) {

  },
  getPhone: function (e) { // 获取手机号
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },
  getCode: function (e) { // 获取验证码
    console.log(e.detail.value)
    this.setData({
      code: e.detail.value
    })
  },
  getOassword1: function (e) { // 获取密码1
    console.log(e.detail.value)
    this.setData({
      password1: e.detail.value
    })
  },
  getOassword2: function (e) { // 获取密码2
    console.log(e.detail.value)
    this.setData({
      password2: e.detail.value
    })
  },
  sendCode: function () { // 发送验证码
    var that = this;
    console.log(this.data.phone)
    if (this.data.phone == '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
    } else {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.phone))) {
        console.log("手机号码有误，请重填");
        wx.showToast({
          title: '手机号码有误，请重填',
          icon: 'none',
          mask: true,
          duration: 1500
        })
      } else {
        console.log('手机号正确')
        wx.request({
          url: Globalhost + 'api/auth/sendMobileCode',
          method: 'POST', //请求方式
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            mobile: this.data.phone,
            sence: 1
          },
          success: function (res) {
            console.log(res)
            // wx.showToast({
            //   title: res.data.msg,
            //   icon: 'success'
            // })
            var code = res.data.data.code
            wx.showModal({
              content: '您的code为：' + code,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.setData({
                    code: code
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      }
    }
  },
  toSingUp: function () {
    console.log('点击注册')
    var that = this;
    if (this.data.phone == '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
    } else {
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.phone))) {
        console.log("手机号码有误，请重填");
        wx.showToast({
          title: '手机号码有误，请重填1',
          icon: 'none',
          mask: true,
          duration: 1500
        })
      } else {
        if (this.data.code == '') {
          wx.showToast({
            title: '请输入验证码',
            icon: 'none'
          })
        } else {
          if(this.data.password1 == '') {
            wx.showToast({
              title: '请输入密码',
              icon: 'none'
            })
          } else {
            if(this.data.password2 == '') {
              wx.showToast({
                title: '请确认密码',
                icon: 'none'
              })
            } else {
              var patrn = /^(\w){6,20}$/;
              if (patrn.exec(this.data.password1)) {
                console.log('密码验证成功')
                if (this.data.password1 == this.data.password2) {
                  console.log('密码相同')
                  wx.request({
                    url: Globalhost + 'api/auth/register',
                    method: 'POST', //请求方式
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                      mobile: this.data.phone,  // 手机号
                      password: this.data.password1,  // 密码
                      password_confirm: this.data.password2,  // 确认密码
                      code: this.data.code  // 验证码
                    },
                    success: function(res) {
                      console.log(res);
                      if(res.data.code == 200) {
                        wx.setStorageSync('login', '手机号登陆');
                        wx.setStorageSync('mobile', res.data.data.mobile);
                        wx.setStorageSync('user_id', res.data.data.user_id);
                        wx.setStorageSync('user_money', res.data.data.user_money);
                        wx.setStorageSync('pay_password', res.data.data.pay_password);
                        wx.setStorageSync('head_pic', res.data.data.head_pic);
                        wx.setStorageSync('nickname', res.data.data.nickname);
                        wx.setStorageSync('loginPhone', that.data.phone);
                        wx.setStorageSync('loginPhonePassword', that.data.password1)
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'success'
                        })
                        wx.navigateBack({
                          delta: 1
                        });
                      } else if(res.data.code == 400) {
                        wx.showToast({
                          title: res.data.msg,
                          icon: 'none'
                        })
                      }
                    }
                  })
                } else {
                  console.log('密码不相同')
                  wx.showToast({
                    title: '两次输入的密码不相同',
                    icon: 'none',
                    duration: 1500
                  })
                }
              } else {
                console.log('密码验证不成功')
              }
            }
          }

        }
      }
    }
  }
})