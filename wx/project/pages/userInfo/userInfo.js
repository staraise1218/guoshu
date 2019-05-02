const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    nameShow: true,
    username: '',
    password: '',
    head_pic: 'http://img.hb.aicdn.com/0d073af2e0eb5b66d800bdc234571d2aeaec4c641700-aZonQZ_fw658',
    nickname: '未设置',
    sex: '未设置',
    test: ''
  },
  onLoad: function (options) {
    if(wx.getStorageSync('head_pic')) {
      this.setData({
        head_pic: wx.getStorageSync('head_pic')
      })
    }
    if(wx.getStorageSync('nickname')) {
      this.setData({
        nickname: wx.getStorageSync('nickname')
      })
    }
    if(wx.getStorageSync('sex')) {
      if(wx.getStorageSync('sex') == 1) {
        this.setData({
          sex: '男'
        })
      } else if (wx.getStorageSync('sex') == 2) {
        this.setData({
          sex: '女'
        })
      }
    }
  },
  onShow: function () {
    wx.getStorageSync('nickname')
  },
  changHeaderPic: function () { // 上传头像
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(res)
        wx.uploadFile({
          url: Globalhost + "Api/User/changeHeadPic",
          filePath: tempFilePaths[0], 
          name: 'head_pic',
          header: { "Content-Type": "multipart/form-data" },
          formData: {
            user_id: wx.getStorageSync('user_id')
          },
          success(res) {
            console.log(JSON.parse(res.data).data.head_pic)
            that.setData({
              head_pic: JSON.parse(res.data).data.head_pic
            })
            wx.setStorageSync('head_pic',  JSON.parse(res.data).data.head_pic)
            // that.setData({
            //   head_pic: Globalhost + JSON.parse(res.data).data.head_pic
            // })
            // wx.setStorageSync('head_pic',  Globalhost + JSON.parse(res.data).data.head_pic)
          }
        })
      }
    })
  },
  nameAlert: function () {
    this.setData({
      nameShow: !this.data.nameShow
    })
  },
  nameCanCel: function (){
    this.setData({
      nameShow: !this.data.nameShow
    })
  },
  nameConFirm: function () {
    var that = this;
    this.setData({
      nameShow: !this.data.nameShow,
      // nickname: this.data.test
    })
    if(that.data.nickname == '') {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: Globalhost + 'Api/user/changeField',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user_id: wx.getStorageSync('user_id'),
          field: 'nickname',
          fieldValue: this.data.nickname
        },
        success: function(res) {
          console.log(res)
          that.setData({
            nickname: that.data.nickname
          })
          wx.setStorageSync('nickname', that.data.nickname)
        }
      })
    }
  },
  changName: function (e) { // 修改昵称
    console.log(e.detail.value)
    this.setData({
      test: e.detail.value
    })
  },
  changSex: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['男', '女'],
      success(res) {
        console.log(res.tapIndex)
        if(res.tapIndex == 0) {
          that.setData({
            sex: '男'
          })
        } else if (res.tapIndex == 1) {
          that.setData({
            sex: '女'
          })
        }
        var sexVal = 0;
        if(that.data.sex == '男') {
          sexVal = 1;
        } else if(that.data.sex == '女') {
          sexVal = 2
        }
        wx.request({
          url: Globalhost + 'Api/user/changeField',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            user_id: wx.getStorageSync('user_id'),
            field: 'sex',
            fieldValue: sexVal
          },
          success: function(res) {
            console.log(res)
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  }
})