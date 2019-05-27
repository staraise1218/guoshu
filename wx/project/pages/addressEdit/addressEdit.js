const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
    areaCode: [
      {name: '请选择收货地址'}
    ],
    multiIndex: [0, 0, 0], // picker
    region: ['未选择', '', ''], // picker
    addressList : {
        address_id: 1, // 地址id
        user_id: '', //	用户id
        consignee: '收货人', //	收货人
        address: '详细地址', //	详细地址
        city: '所在城镇区', //	所在城镇区
        province: '所在省市', //	所在省市
        mobile: '联系电话', //	联系电话
        country: '国家', //	国家
        is_default: 0, //	是否默认 1是 0 否
        fulladdress: '完整地址', //	完整地址
        longitude: '',  // 
        latitude: '',   //
        menpaihao: '',
      },
      retCITY: '',  //
  },
  onLoad: function (options) {
    let that = this;
    console.log(options)
    console.log(options.address_id)
    that.location(that);
    wx.request({
      url: Globalhost + 'Api/address/detail',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        address_id: options.address_id
      },
      success: function(res) {
        console.log(res)
        let data = res.data.data;
        if(res.data.code == 200) {
              that.setData({
                  'addressList.user_id': data.user_id,
                  'addressList.consignee': data.consignee,
                  'addressList.address': data.address,
                  'addressList.city': data.city,
                  'addressList.province': data.province,
                  'addressList.mobile': data.mobile,
                  'addressList.country': data.country,
                  'addressList.address_id': data.address_id,
                  'addressList.is_default': data.is_default,
                  'addressList.menpaihao': data.floor,
                  'region[0]': data.province_name,
                  'region[1]': data.city_name,
                  'region[2]': data.district_name,
                  'areaCode[0].name': data.province_name,
                  'areaCode[0].code': data.province,
                  'areaCode[1].name': data.city_name,
                  'areaCode[1].code': data.city,
                  'areaCode[2].name': data.district_name,
                  'areaCode[2].code': data.district,
                  'addressList.latitude': data.latitude,
                  'addressList.longitude': data.longitude,
                  baseMsg: data
                })
                console.log(that.data.addressList)
                if(data.province_name) {
                  that.setData({
                    retCITY: data.province_name
                  })
                }
                if(data.city_name) {
                  that.setData({
                    retCITY: data.city_name
                  })
                }
                if(data.district_name) {
                  that.setData({
                    retCITY: data.district_name
                  })
                }
        } else {
          wx.showToast({
            title: res.data.code,
            icon: 'none'
          })
        }
      }
    })
  },
  onShow: function () {
    if(wx.getStorageSync('LOCATIONMSG') != '未设置详细地址') {
      let LOCATIONMSG = wx.getStorageSync('LOCATIONMSG')
      LOCATIONMSG = JSON.parse(LOCATIONMSG)
      console.log(LOCATIONMSG)
      this.setData({
        'addressList.address': LOCATIONMSG.address + LOCATIONMSG.name,
        'addressList.longitude': LOCATIONMSG.longitude,
        'addressList.latitude': LOCATIONMSG.latitude
      })
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
 * 选择城市
 */
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
/**
 * 联系人
 */
  userName: function (e) {
    console.log(e.detail.value)
    this.setData({
      'addressList.consignee': e.detail
    })
  },
/**
 * 电话
 */
  phoneNumber: function (e) {
    console.log(e)
    this.setData({
      'addressList.mobile': e.detail
    })
  },
/**
 * 详细地址
 */
  address: function (e) {
    console.log(e)
    this.setData({
      'addressList.address': e.detail
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
  saveAddress: function () {
    loadingfunc();
    let that = this;
    wx.request({
      url: Globalhost + 'Api/Address/edit_address',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        address_id: that.data.addressList.address_id, //	是	string	地址id
        user_id: that.data.addressList.user_id, //	是	string	用户id
        mobile: that.data.addressList.mobile, //	是	string	联系电话
        consignee: that.data.addressList.consignee, //	是	string	收货人
        province: that.data.areaCode[0].code,//that.data.addressList.province, //	是	string	所在省市
        city: that.data.areaCode[1].code,//that.data.addressList.city, //	是	string	所在城镇区
        district: that.data.areaCode[2].code,//that.data.addressList,//110100,//110100, //	是	string	区
        address: that.data.addressList.address,//	是	string	详细地址
        floor: that.data.addressList.menpaihao,
        is_default: that.data.addressList.is_default, //	是	string	是否默认
        longitude: that.data.addressList.longitude,
        latitude: that.data.addressList.latitude
      },
      success: function(res) {
        console.log(res)
        if(res.data.code == 200) {
          wx.navigateBack({
            delta: 1
          });
        } else {
          wx.showToast({
            title: res.data.data,
            icon: 'none'
          })
        }
      }
    })
  },
  delete: function () {
    loadingfunc();
    wx.request({
      url: Globalhost + 'Api/Address/del_address',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: this.data.addressList.user_id,
        address_id: this.data.addressList.address_id
      },
      success: function(res) {
        console.log(res)
        if(res.data.code == 200) {
          wx.navigateBack({
            delta: 1
          });
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
   * =================================
   *      位置相关   调起定位
   * =================================
   */
  /**
   * 小程序调起定位
   */
  getUserLocation: function () {
    var that = this;
    console.log(123)
    wx.getSetting({
      success: (res) => {
        // console.log(res)
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
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


  tochooseAddress: function () {
    let that = this;
    console.log(that.data)
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






  cityshow: function () {
    let that = this;
    this.setData({
      // cityShow: true
      chooseAlerShow: true,
      // areaCode: []
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
  console.log(that.data.areaCode)
},
changeCity: function (e) {
  let that = this;
  console.log(e)
  that.setData({
    'areaCode[1].code' : e.target.dataset.code,
    'areaCode[1].name' : e.target.dataset.name,
  })
  console.log(that.data.areaCode)
},
changeArea: function (e) {
  let that = this;
  console.log(e)
  that.setData({
    'areaCode[2].code' : e.target.dataset.code,
    'areaCode[2].name' : e.target.dataset.name, 
  })
  console.log(that.data.areaCode)
},
chooseCity: function () {
  let that = this;
  that.setData({
    chooseAlerShow: false,
    'addressList.address': ''
  })
  console.log(that.data.areaCode)
},
  cancleCity: function () {
    let that = this;
    that.setData({
      chooseAlerShow: false,
      'region[0]': that.data.baseMsg.province_name,
      'region[1]': that.data.baseMsg.city_name,
      'region[2]': that.data.baseMsg.district_name,
      'areaCode[0].name': that.data.baseMsg.province_name,
      'areaCode[0].code': that.data.baseMsg.province,
      'areaCode[1].name': that.data.baseMsg.city_name,
      'areaCode[1].code': that.data.baseMsg.city,
      'areaCode[2].name': that.data.baseMsg.district_name,
      'areaCode[2].code': that.data.baseMsg.district,
    })
  console.log(that.data.areaCode)
  },
  onShareAppMessage: function () {

  }
})