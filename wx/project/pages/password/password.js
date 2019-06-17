const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    Length: 6,        //输入框个数
    isFocus: true,    //聚焦
    ispassword: true, //是否密文显示 true为密文， false为明文。
    disabled:true,
    Value1: "",        //输入的内容
    Value2: "",        //输入的内容
    flag: false
  },
  tijiao: function () {
    let that = this;
    if(that.data.wallets_password1 == that.data.wallets_password2) {
      wx.request({
        url: Globalhost + 'Api/user/setPayPassword',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user_id: wx.getStorageSync('user_id'),
          password: that.data.wallets_password1,
          password_confirm: that.data.wallets_password2
        },
        success: function(res) {
          console.log(res)
          if(res.data.code == 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1500,
              complete (res) {
                setTimeout(() => {
                  wx.switchTab({
                    url: '/pages/index/index'
                  })
                }, 1500)
              }
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '密码错误或两次输入不一致',
        icon: 'none',
        duration: 3000
      })
    }
  },

  // 密码1
  set_Focus1() { //聚焦input
    this.setData({
      isFocus1: true
    })
  },
  set_notFocus1() { //失去焦点
    console.log(1)
    this.setData({
      isFocus1: false
    })
  },
  set_wallets_password1(e) { //获取钱包密码
    let that = this;
    console.log(e)
    this.setData({
      wallets_password1: e.detail.value
    })
    if (this.data.wallets_password1.length == 6) {
      that.setData({
        wxShow1: false
      })
    }
  },


  // 密码2
  set_Focus2() { //聚焦input
    this.setData({
      isFocus2: true
    })
  },
  set_notFocus2() { //失去焦点
    this.setData({
      isFocus2: false
    })
  },
  set_wallets_password2(e) { //获取钱包密码
    let that = this;
    console.log(e)
    this.setData({
      wallets_password2: e.detail.value
    })
    if (this.data.wallets_password2.length == 6) {
      that.setData({
        wxShow2: false
      })
    }
  },





  onShareAppMessage: function () {

  }
})