const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    cityShow: false,
    value: [0, 0],
    multiArray: [], // 地区json
    index0: 0, // 地区index 0
    cityShow: false,
    codeChange: '',
    address: '请输入地址',
    addressCon: '',
    cityChange: '请输入地址',
    user_id: '',
    name: '',
    phone: '',
    code: '',

  },
  onLoad: function (options) {
    let that = this;
    that.location(that); // 地址
  },
  /**
   * 发送验证码
   */
  sondCode: function () {
    let that = this;
    console.log('发送验证码！')
    wx.request({
      url: Globalhost + 'api/auth/sendMobileCode',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        mobile: that.data.phone,
        scene: 4
      },
      success: function (res) {
        console.log(res)
        let code = res.data.data.code
        wx.showModal({
          title: '温馨提示',
          content: '您的验证码为' + code,
          success(res) {
            if (res.confirm) {
              console.log('验证码',code)
            }
          }
        })
      }
    })
  },
  // 姓名
  changUserName: function (e) {
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  // 手机号
  changPhone: function (e) {
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },
  // 验证码
  changCode: function (e) {
    console.log(e.detail.value)
    this.setData({
      code: e.detail.value
    })
  },
  // 详细地址
  changAddress: function (e) {
    console.log(e.detail.value)
    this.setData({
      addressCon: e.detail.value
    })
  },
  /**
   * 加盟
   */
  join: function () {
    let that = this;

    // console.log(wx.getStorageSync('user_id'))
    // console.log(that.data.name)
    // console.log(that.data.phone)
    // console.log(that.data.code)
    // console.log(that.data.codeChange)
    // console.log(that.data.addressCon)
    if (wx.getStorageSync('user_id') == '') {
      wx.showToast({
        title: '未登录',
        icon: 'none'
      })
    } else {
      if (that.data.name == '') {
        wx.showToast({
          title: '请输入用户名',
          icon: 'none'
        })
      } else {
        if (that.data.phone == '') {
          wx.showToast({
            title: '请输入手机号',
            icon: 'none'
          })
        } else {
          if (that.data.code == '') {
            wx.showToast({
              title: '请输入验证码',
              icon: 'none'
            })
          } else {
            if (that.data.codeChange == '') {
              wx.showToast({
                title: '请选择城市',
                icon: 'none'
              })
            } else {
              if (that.data.addressCon == '') {
                wx.showToast({
                  title: '请输入详细地址',
                  icon: 'none'
                })
              } else {
                wx.request({
                  url: Globalhost + 'Api/user/applyPickup',
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    user_id: wx.getStorageSync('user_id'), //	用户id
                    pickup_name: that.data.name, //	自提点名称
                    pickup_phone: that.data.phone, //	联系电话
                    mobile_code: that.data.code, //	验证码
                    city_code: that.data.codeChange, // 城市 code
                    pickup_address: that.data.addressCon //	详细地址
                  },
                  success: function (res) {
                    console.log(res)
                    if(res.data.code == 200) {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                      })
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 1
                        });
                      }, 500)
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none'
                      })
                    }
                  }
                })
              }
            }
          }

        }
      }
    }
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
    let that = this;
    if (this.data.cityChange == '请输入地址') {
      wx.setStorageSync('address', '北京')
      that.setData({
        address: '北京',
        codeChange: 110100
      })
    } else {
      wx.setStorageSync('address', that.data.cityChange)
      that.setData({
        address: that.data.cityChange
      })
    }
    this.setData({
      cityShow: false,
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
      url: 'https://app.zhuoyumall.com:444/api/region/getJson',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res.data.data)
        that.setData({
          multiArray: res.data.data
        })
      }
    })
  },





















  onShareAppMessage: function () {

  }
})