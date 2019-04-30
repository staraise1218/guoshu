const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    phoneNumber: '',
    code: ''
  },
  onLoad: function (options) {

  },
  getPhone: function (e) {
    console.log(e.detail.value)
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  getCode: function () {
    let that = this;
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    if (myreg.test(this.data.phoneNumber)) {
      console.log('手机号符合')
      wx.request({
        url: Globalhost + 'api/auth/sendMobileCode',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          mobile: this.data.phoneNumber,
          scene: 3 
        },
        success: function(res) {
          console.log(res)
          let code = res.data.data.code
          wx.showModal({
            title: '',
            content: ""+code,
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
  },
  changeCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  next: function () {
    wx.request({
      url: Globalhost + 'Api/user/checkMobile',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        mobile: this.data.phoneNumber,
        code: this.data.code
      },
      success: function(res) {
        console.log(res.data)
        if(res.data.code == 400) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        } else if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1500,
            complete (res) {
              wx.navigateTo({
                url: '/pages/password/password'
              })
            }
          })
        }
      }
    })
  },
  onShareAppMessage: function () {

  }
})