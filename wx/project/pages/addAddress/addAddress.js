const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
    multiIndex: [0, 0, 0], // picker
    region: ['请选择您的收货地址', '', ''], // picker
    addressList: {
      user_id: '', //	是	string	用户id
      consignee: '', //	是	string	收货人
      mobile: '', //	是	string	联系电话
      province: '', //	是	string	省
      city: '', //	是	string	市
      district: '', //	是	string	区
      address: '', //	是	string	详细地址
      is_default: '', //	是	string	是否默认
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
    console.log(e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
/**
 * 收货人
 */
  userName: function (e) {
    this.setData({
      'addressList.consignee': e.detail.value
    })
  },

/**
 * 手机
 */
phoneNumber: function (e) {
  this.setData({
    'addressList.mobile': e.detail.value
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
 * 保存
 */
  toSave: function () {
    loadingfunc();
    let that = this;
    wx.request({
      url: Globalhost + 'api/address/add_address',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),//	是	string	用户id
        consignee: that.data.addressList.consignee,//	是	string	收货人
        mobile: that.data.addressList.mobile,//	是	string	联系电话
        province: 110100,//that.data.addressList.province,//	是	string	省
        city: 110100,//that.data.addressList.city,//	是	string	市
        district: 110100,// that.data.addressList.district,//	是	string	区
        address: that.data.addressList.address,//	是	string	详细地址
        is_default: that.data.addressList.is_default//that.data.addressList.is_default,//	是	string	是否默认
      },
      success: function(res) {
        console.log(res)
        wx.navigateBack({
          delta: 1
        });
      }
    })
  }



























})