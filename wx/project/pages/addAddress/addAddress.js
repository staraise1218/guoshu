const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
    multiIndex: [0, 0, 0], // picker
    // region: ['请选择您的收货地址', '', ''], // picker
    areaCode: [
      {name: '请选择收货地址'}
    ],
    addressList: {
      user_id: '', //	是	string	用户id
      consignee: '', //	是	string	收货人
      mobile: '', //	是	string	联系电话
      province: '', //	是	string	省
      city: '', //	是	string	市
      district: '', //	是	string	区
      address: '街道、社区等信息', //	是	string	详细地址
      is_default: '', //	是	string	是否默认,
      longitude: '',
      latitude: '',
      menpaihao: ''
    },
    cityShow: false,  
    retCITY: '',  // 到搜索页的city
  },

  onLoad: function () {
    let that = this;
    that.location(that);
  },
  onShow: function () {
    if(wx.getStorageSync('LOCATIONMSG') != '未设置详细地址') {
      if(wx.getStorageSync('LOCATIONMSG')) {
        let LOCATIONMSG = wx.getStorageSync('LOCATIONMSG')
        LOCATIONMSG = JSON.parse(LOCATIONMSG)
        console.log(LOCATIONMSG)
        this.setData({
          'addressList.address': LOCATIONMSG.address + LOCATIONMSG.name,
          'addressList.longitude': LOCATIONMSG.longitude,
          'addressList.latitude': LOCATIONMSG.latitude
        })
      }
      console.log(this.data)
      wx.setStorageSync('LOCATIONMSG', '未设置详细地址')
    }
  },



/**
 * 默认地址
 */
  onChange({ detail }) {
    console.log(detail) 
    this.setData({ checked: detail });
    if(detail) {
      this.setData({
        'addressList.is_default' : 1
      });
    } else {
      this.setData({
        'addressList.is_default' : 0
      });
    }
  },
/**
 * 收货人
 */
  userName: function (e) {
    this.setData({
      'addressList.consignee': e.detail
    })
  },

/**
 * 手机
 */
phoneNumber: function (e) {
  this.setData({
    'addressList.mobile': e.detail
  })
},

/**
 * 地址
 */
address: function (e) {
  this.setData({
    'addressList.address': e.detail.value
  })
},
/**
 * 门牌号
 */
chengeMenPaiHao: function (e) {
  this.setData({
    'addressList.menpaihao': e.detail
  })
},


/**
 * 保存
 */
  toSave: function () {
    loadingfunc();
    let that = this;
    if(that.data.addressList.consignee) {
      if(that.data.addressList.mobile) {
        var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(that.data.addressList.mobile)) {
          wx.showToast({
            title: '请输入正确的手机号',
            icon: 'none'
          })
        } else {
          if(that.data.areaCode[0].name == '请选择收货地址') {
            wx.showToast({
              title: '请选择收货地址',
              icon: 'none'
            })
          } else {
            if(that.data.addressList.address == '街道门派、楼层房间等信息') {
              wx.showToast({
                title: '请输入详细地址',
                icon: 'none'
              })
            } else {
              let posdata = {}
              if(that.data.areaCode[2].code) {
                posdata = {
                  user_id: wx.getStorageSync('user_id'),//	是	string	用户id
                  consignee: that.data.addressList.consignee,//	是	string	收货人
                  mobile: that.data.addressList.mobile,//	是	string	联系电话
          
                  province: that.data.areaCode[0].code,//	是	string	省
                  city: that.data.areaCode[1].code,//	是	string	市
                  district: that.data.areaCode[2].code,//	是	string	区
          
                  address: that.data.addressList.address,//	是	string	详细地址
                  floor: that.data.addressList.menpaihao,
                  is_default: that.data.addressList.is_default,//that.data.addressList.is_default,//	是	string	是否默认
                  longitude: that.data.addressList.longitude,
                  latitude: that.data.addressList.latitude
                }
              } else {
                posdata = {
                  user_id: wx.getStorageSync('user_id'),//	是	string	用户id
                  consignee: that.data.addressList.consignee,//	是	string	收货人
                  mobile: that.data.addressList.mobile,//	是	string	联系电话
          
                  province: that.data.areaCode[0].code,//	是	string	省
                  city: that.data.areaCode[1].code,//	是	string	市
          
                  address: that.data.addressList.address,//	是	string	详细地址
                  floor: that.data.addressList.menpaihao,
                  is_default: that.data.addressList.is_default,//that.data.addressList.is_default,//	是	string	是否默认
                  longitude: that.data.addressList.longitude,
                  latitude: that.data.addressList.latitude
                }
            }
              console.log('>>>>>>>> posdata >>>>>>>>>>>>', posdata)
              if (!posdata.longitude) {
                wx.showToast({
                  title: '请选择详细地址',
                  icon: 'none'
                })
                return;
              }
              if (!posdata.floor) {
                wx.showToast({
                  title: '请填写门牌号',
                  icon: 'none'
                })
                return;
              }
              wx.request({
                url: Globalhost + 'api/address/add_address',
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: posdata,
                success: function(res) {
                  console.log(res)
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000,
                    complete: function () {
                      wx.navigateBack({
                        delta: 1
                      });
                    }
                  })
                }
              })
            }
          }
        }
      } else {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      })
    }
  },
















  tochooseAddress: function () {
    let that = this;
    if(that.data.areaCode[0].name == '请选择收货地址') {
      // that.getUserLocation(that);
      wx.showToast({
        title: '请先选择所在城市',
        icon: 'none'
      })
    } else {
      let areaCode = that.data.areaCode;
      areaCode = JSON.stringify(areaCode);
      wx.navigateTo({
        url: '/pages/chooseAddress/chooseAddress?areaCode=' + areaCode
      })
    }
  },







  /***
   * 获取位置json
   */
  location: function (that) {
    wx.request({
      url: Globalhost + 'api/region/getJson',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        // console.log(res.data.data)
        that.setData({
          multiArray: res.data.data
        })
      }
    })
  },

  cityshow: function () {
    this.setData({
      // cityShow: true
      chooseAlerShow: true,
      areaCode: []
    })
  },
  cityCancel: function () {
    this.setData({
      cityShow: false
    })
  },
  cityOk: function () {
    this.setData({
      cityShow: false,
    })
    if(this.data.province.name) {
      this.setData({
        'region[0]': this.data.province.name,
        retCITY: this.data.province.name
      })
    }
    if(this.data.city.name) {
      this.setData({
        'region[1]': this.data.city.name,
        retCITY: this.data.city.name
      })
    }
    if(this.data.district.name) {
      this.setData({
        'region[2]': this.data.district.name,
        retCITY: this.data.district.name
      })
    }
    console.log(this.data)
  },
  
  changeCity: function (e) {
    let that = this;
    var str = 'value[1]';
    console.log(e)
    if (that.data.index0 != e.detail.value[0]) {
      that.setData({
        index0: e.detail.value[0],
        'value[0]': e.detail.value[0],
        'value[1]': 0,
        'value[2]': 0,
      })
    } else {
      that.setData({
        index0: e.detail.value[0],
        index1: e.detail.value[1],
        'value[0]': e.detail.value[0],
        'value[1]': e.detail.value[1],
        'value[2]': e.detail.value[2],
      })
    }
    let index0 = e.detail.value[0]
    let index1 = e.detail.value[1]
    let index2 = e.detail.value[2]

    console.log(that.data.multiArray[index0])
    console.log(that.data.multiArray[index0].sub[index1])
    console.log(that.data.multiArray[index0].sub[index1].sub[index2])
    if(that.data.multiArray[index0].code) {
      that.setData({
        'province.code': that.data.multiArray[index0].code,
        'province.name': that.data.multiArray[index0].name,
        'province.parentCode': that.data.multiArray[index0].parentCode
      })
    }
    if(that.data.multiArray[index0].sub[index1].code) {
      that.setData({
        'city.code': that.data.multiArray[index0].sub[index1].code,
        'city.name': that.data.multiArray[index0].sub[index1].name,
        'city.parentCode': that.data.multiArray[index0].sub[index1].parentCode
      })
    }
    if(that.data.multiArray[index0].sub[index1].sub[index2].code) {
      that.setData({
        'district.code': that.data.multiArray[index0].sub[index1].sub[index2].code,
        'district.name': that.data.multiArray[index0].sub[index1].sub[index2].name,
        'district.parentCode': that.data.multiArray[index0].sub[index1].sub[index2].parentCode
      })
    }
  },
  cityt: function () {
    this.setData({
      cityShow: !this.data.cityShow
    })
  },
  location: function (that) {
    wx.request({
      url: Globalhost + 'api/region/getJson',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        // console.log(res.data.data)
        that.setData({
          multiArray: res.data.data
        })
      }
    })
  },



// 数据 [code, code, code]
  changeProvince: function (e) {
    let that = this;
    console.log(e)
    let areaCode = [{},{},{}];
    that.setData({
      'areaCode[0].code' : e.target.dataset.code,
      'areaCode[0].name' : e.target.dataset.name,
      'areaCode[1]' : '',
      'areaCode[2]' : ''
    })
    console.log(that.data)
  },
  changeCity: function (e) {
    let that = this;
    console.log(e)
    that.setData({
      'areaCode[1].code' : e.target.dataset.code,
      'areaCode[1].name' : e.target.dataset.name,
    })
  },
  changeArea: function (e) {
    let that = this;
    console.log(e)
    that.setData({
      'areaCode[2].code' : e.target.dataset.code,
      'areaCode[2].name' : e.target.dataset.name,
    })
  },

  chooseCity: function () {
    let that = this;
    that.setData({
      chooseAlerShow: false
    })
    console.log(that.data.areaCode)
  },
  cancleCity: function () {
    this.setData({
      chooseAlerShow: false
    })
  },



})