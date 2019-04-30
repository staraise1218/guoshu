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
  Focus1(e) {
    var that = this;
    console.log(e.detail.value);
    var ilen = e.detail.value.length;
    that.setData({
      Value1: e.detail.value,
      flag: false
    })
    if(that.data.Value1.length == 6) {
      if(that.data.Value2.length == 6) {
        if(that.data.Value1 == that.data.Value2) {
          console.log('相同')
          that.setData({
            flag: true
          })
        }
      }
    }
  },
  Focus2(e) {
    var that = this;
    console.log(e.detail.value);
    var ilen = e.detail.value.length;
    that.setData({
      Value2: e.detail.value,
      flag: false
    })
    if(that.data.Value1.length == 6) {
      if(that.data.Value2.length == 6) {
        if(that.data.Value1 == that.data.Value2) {
          console.log('相同')
          that.setData({
            flag: true
          })
        }
      }
    }
  },
  tijiao: function () {
    let that = this;
    if(this.data.flag) {
      wx.request({
        url: Globalhost + 'Api/user/setPayPassword',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user_id: wx.getStorageSync('user_id'),
          password: that.data.Value1,
          password_confirm: that.data.Value2
        },
        success: function(res) {
          console.log(res)
          if(res.data.code == 200) {
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 1500,
              complete (res) {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请输入正确的密码',
        icon: 'none'
      })
    }
  },
  onShareAppMessage: function () {

  }
})