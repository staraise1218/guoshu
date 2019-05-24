const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
    MSG: [],  // POI 储存位置
    city: '', 
  },
  onLoad: function (options) {
    console.log(options)
    let areaCode = JSON.parse(options.areaCode)
    console.log(areaCode)
    let city = '';
    if(areaCode[0] != '') {
      city = areaCode[0].name
    }
    if(areaCode[1] != '') {
      city = areaCode[1].name
    }
    if(areaCode[2] != '') {
      city = areaCode[2].name
    }
    this.setData({
      city: city
    })
  },

  searchChange: function (e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      keyWors: e.detail.value
    })
    clearInterval(timer);
    var timer = setTimeout(function () {
      wx.request({
        url: 'https://restapi.amap.com/v3/place/text?key=d1155b6ce952cd80d4ab61f16a9dcb41&keywords=' + e.detail.value + '&types=&city=' + that.data.city + '&children=1&offset=20&page=1&extensions=all',
        header: {
          'Content-Type': 'application/json'
        },
        success: function(res) {
          console.log(res)  
          that.setData({
            MSG: res.data.pois
          })
        }
      })
    }, 500)
  },
  searchBtn: function () {
    let that = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/place/text?key=d1155b6ce952cd80d4ab61f16a9dcb41&keywords=' + that.data.keyWors + '&types=&city=' + that.data.city + '&children=1&offset=20&page=1&extensions=all',
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res)  
        that.setData({
          MSG: res.data.pois
        })
      }
    })
  },
  go: function (e) {
    console.log(e.currentTarget.dataset.loactioin)
    console.log(e.currentTarget.dataset.name)
    var arr = e.currentTarget.dataset.loactioin.split(',')
    console.log(arr)
    var obj = {
      location: e.currentTarget.dataset.loactioin,
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address,
      latitude: arr[1],
      longitude: arr[0]
    }
    obj = JSON.stringify(obj);
    wx.setStorageSync('LOCATIONMSG', obj);
    wx.navigateBack({
      delta: 1
    });
  }
  
})