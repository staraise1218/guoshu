const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    List: [], // 列表数据
    currentID: -1, 
    goodId: '', // 商品 id 【立即购买进入页面时】
    Page: '', // 页面
    TARGET: '', // 选中的id
    LoadStatus: 0,
  },
  onLoad: function (options) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 20000
    })
    let that = this;
    console.log(options)
    that.getUserLocation(that);
    that.setData({
      options: options
    })


    console.log(options)
    if(options.goodId) {
      that.setData({
        goodId: options.goodId
      })
    }
    if(options.good_id) {
      that.setData({
        goodId: options.good_id
      })
    }
    that.setData({
      page: options.page
    })

  },
  /**
   * 选择
   */
  choose: function(e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      currentID: e.currentTarget.dataset.id
    })
  },
  /**
   * 列表加载
   */
  loadList: function (that, posdata) {
    wx.request({
      url: Globalhost + 'Api/cart/getPickupList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: posdata,
      success: function(res) {
        wx.showToast({
          title: '加载中....',
          icon: 'loading',
          duration: 20000
        })
        console.log(res)
        if(res.data.code == 200) {
          posdata = JSON.stringify(posdata);
          wx.setStorageSync('getPickupListData', posdata);
          that.setData({
            List: res.data.data
          })
        } else {
          wx.showToast({
            title: '数据出错',
            icon: 'none'
          })
        }
      },
      complete: function() {
        wx.hideToast();
        that.setData({
          LoadStatus: 1
        })
      }
    })
  },
  /**
   * 跳转订单详情
   */
  toOrder: function () {
    let that = this;
    if(this.data.currentID != -1) {
      console.log(that.data)
      wx.setStorageSync('pickup_id', this.data.currentID)
      wx.redirectTo({
        url: '/pages/demo/demo'
      })
    } else {
      wx.showToast({
        title: '请选择自提点',
        icon: 'none'
      })
    }
  },
  










  /***
   * active
   */
  chooseActive: function (e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      currentID: e.currentTarget.dataset.id
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
        let location = longitude + ',' +  latitude
        console.log(location)
        // console.log('当前经纬度：', location)
        wx.setStorageSync('location', location)
        that.loadCity(latitude, longitude, that)
      }
    })
  },
  /**
   * 逆地理编码
   */
  loadCity: function (latitude, longitude, that) {
    var _self = this;
    let location = longitude + "," + latitude
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        key: '18964fba3ee3a4e672956a24b0090f75',
        location: location,
        extensions: "all",
        s: "rsx",
        sdkversion: "sdkversion",
        logversion: "logversion"
      },
      success: function (res) {
        console.log(res)
        let address = res.data.regeocode.addressComponent.city
        // console.log('当前城市：', address);
        // wx.setStorageSync('address', address)
        that.setData({
          address: address
        })
        wx.request({
          url: 'https://restapi.amap.com/v3/geocode/geo?address=' + address + '&key=d1155b6ce952cd80d4ab61f16a9dcb41',
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            let data = res.data.geocodes;
            // console.log(data)
            const adcode = data[0].adcode;
            console.log('当前城市码：', adcode);
            wx.setStorageSync('ADDRESSCODE', adcode)
            wx.setStorageSync('location', data[0].location)
            setTimeout(function () {
              var posdata = {};
              // if(wx.getStorageSync('ADDRESSCODE') == wx.getStorageSync('addressCode')) { // 本地
              //   posdata = {
              //     user_id: wx.getStorageSync('user_id'),
              //     user_longitude: longitude,
              //     user_latitude: latitude,
              //     // isLocalCity: 1,
              //     city_code: wx.getStorageSync('addressCode'),
              //     page: 1
              //   }
              //   that.setData({
              //     user_longitude: longitude,
              //     user_latitude: latitude,
              //     getPickupListPosdata: JSON.stringify(posdata)
              //   })
              //   that.loadList(that, posdata);
              // } else { // 非本地
              //   posdata = {
              //     user_id: wx.getStorageSync('user_id'),
              //     // isLocalCity: 0,
              //     city_code: wx.getStorageSync('addressCode'),
              //     page: 1
              //   }
              //   that.setData({
              //     getPickupListPosdata: JSON.stringify(posdata)
              //   })
              //   that.loadList(that, posdata);
              // }



              
              posdata = {
                user_id: wx.getStorageSync('user_id'),
                user_longitude: longitude,
                user_latitude: latitude,
                city_code: wx.getStorageSync('addressCode'),
                page: 1
              }
              that.setData({
                getPickupListPosdata: JSON.stringify(posdata)
              })
              that.loadList(that, posdata);
            }, 300)
          }
        })
      },
      fail: function (res) {
        console.log('获取地理位置失败')
      }
    })
    wx.request({
      url: 'https://restapi.amap.com/v3/place/around?key=d1155b6ce952cd80d4ab61f16a9dcb41&location=' + location + '&keywords=&types=120302&radius=3000&offset=20&page=1&extensions=all',
      // url: 'https://restapi.amap.com/v3/geocode/regeo?&location=' + location + '&poitype=商务住宅&key=d1155b6ce952cd80d4ab61f16a9dcb41&radius=10000&extensions=all&roadlevel=1&batch =true',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res)
      }
    })
  },
  




  onShareAppMessage: function () {

  }
})