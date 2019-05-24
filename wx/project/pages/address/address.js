const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
    addressList : [],

  },
  onLoad: function (options) {
    console.log(options)
    // order -- > mi 选择地址
    if(options.page == "order") {
      this.setData({
        page: 'order'
      })
    }
  },
  onShow: function () {
    let that = this;
    wx.request({
      url: Globalhost + 'Api/Address/address_list',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        page: 1
      },
      success: function(res) {
        console.log(res)
        let data = res.data.data;
        if(res.data.code == 200) {
          that.setData({
            addressList: data
          })
        } else {
          wx.showToast({
            title: res.data.code,
            icon: 'none'
          })
        }
      }
    })
  },
  toEdit: function (e) {
    loadingfunc();
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/addressEdit/addressEdit?address_id=' + e.currentTarget.dataset.id
    })
  },
  toAddAddress: function () {
    var flag = true;
    loadingfunc();
    if(flag) {
      flag = false;
      wx.navigateTo({
        url: '/pages/addAddress/addAddress'
      })
      setTimeout(function () {
        flag = true;
      }, 300)
    }
  },
  /**
   * 选中地址
   */
  changeAddress: function (e) {
    if(this.data.page == 'order') {
      loadingfunc();
      console.log(e.currentTarget.dataset.id)
      wx.setStorageSync('retPage', 'address')
      wx.setStorageSync('chooseAddressId', e.currentTarget.dataset.id);
      wx.navigateBack({
        delta: 1
      });
    }
  },
})