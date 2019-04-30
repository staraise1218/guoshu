const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
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
      },
  },
  onLoad: function (options) {
    let that = this;
    console.log(options)
    console.log(options.address_id)
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
          for(var i = 0; i < data.length; i++) {
            if(data[i].address_id == options.address_id) {
              that.setData({
                  'addressList.user_id': data[i].user_id,
                  'addressList.consignee': data[i].consignee,
                  'addressList.address': data[i].address,
                  'addressList.city': data[i].city,
                  'addressList.province': data[i].province,
                  'addressList.mobile': data[i].mobile,
                  'addressList.country': data[i].country,
                  'addressList.fulladdress': data[i].fulladdress,
                  'addressList.address_id': data[i].address_id
              })
              console.log(that.data.addressList)
            }
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
      'addressList.consignee': e.detail.value
    })
  },
/**
 * 电话
 */
  phoneNumber: function (e) {
    console.log(e)
    this.setData({
      'addressList.mobile': e.detail.value
    })
  },
/**
 * 详细地址
 */
  address: function (e) {
    console.log(e)
    this.setData({
      'addressList.address': e.detail.value
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
        province: 110100,//that.data.addressList.province, //	是	string	所在省市
        city: that.data.addressList.city, //	是	string	所在城镇区
        district: 110100,//110100, //	是	string	区
        address: that.data.addressList.address, //	是	string	详细地址
        is_default: that.data.addressList.is_default //	是	string	是否默认
      },
      success: function(res) {
        console.log(res)
        if(res.data.code == 200) {
          wx.navigateBack({
            delta: 1
          });
        } else {
          wx.showModal({
            title: res.data.msg,
            content: 'none',
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
  onShareAppMessage: function () {

  }
})