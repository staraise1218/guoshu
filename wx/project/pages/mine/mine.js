const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  data: {
    nickname: '未设置',
    head_pic: 'http://img.hb.aicdn.com/0d073af2e0eb5b66d800bdc234571d2aeaec4c641700-aZonQZ_fw658',
    infoMsg: [
      {
        num: 0,
        title: '余额',
        func: 'toYue'
      },{
        num: 0,
        title: '红包',
        func: 'toYouhui'
      },
      // {
      //   num: 0,
      //   title: '积分'
      // }
    ],
    orderMsg: [
      {
        url: 'http://img.hb.aicdn.com/34e2c06fe2e2bdd28b1687c4f1f2e4d6909a93a965e-lE6fEc_fw658',
        title: '全部订单',
        func: 'toMyOrder'
      },
      {
        url: 'http://img.hb.aicdn.com/ea1e30c09e5d34530d1670e2f95532f8061c6b847ea-wMoJhN_fw658',
        title: '待评价',
        func: 'toLoadPinglun'
      },
      {
        url: 'http://img.hb.aicdn.com/f9cb87fd436c0be2da0917754d92fdbc734d15b68ef-iLZpRU_fw658',
        title: '退款/售后',
        func: 'toTuikuan'
      }
    ],
    zhandian: [
      {
        url: 'https://hbimg.huabanimg.com/a762eb29424005cced4b0b4cfcb11ed99a2377b965d-smw58j_fw658',
        title: '全部订单',
        func: 'toMyOrderB'
      },
      {
        url: 'https://hbimg.huabanimg.com/5ac27cc5f1dd184c2ce3b0b45af294960bc39a966bd-O5zJVF_fw658',
        title: '已提货',
        func: 'toLoadPinglunB'
      },
      {
        url: 'https://hbimg.huabanimg.com/d5ca7feae4a8b05631125a2736727bdd37089fc6771-5ZfC4k_fw658',
        title: '未提货',
        func: 'toTuikuanB'
      }
    ],
    peisong: [
      {
        url: 'https://hbimg.huabanimg.com/63a3f4ac37fa4572fae03d1dd2dd8db71910df0163b-hskLOg_fw658',
        title: '全部订单',
        func: 'toPeisong'
      },
      {
        url: 'https://hbimg.huabanimg.com/c8498c8fd5d1d2a58cae4c4e39a5666fa61ddf02851-xFCgOa_fw658',
        title: '已提货',
        func: 'toPeisong1'
      },
      {
        url: 'https://hbimg.huabanimg.com/14fa2b764da0496ef868dadda39be76b835853fe5f5-kltWPr_fw658',
        title: '未提货',
        func: 'toPeisong2'
      }
    ],
    serviceMsg: [
      // {
      //   url: 'https://hbimg.huabanimg.com/fccc80fd56d9c9936b23f1ee5f345a4b531af6491c27-9DaYj9_fw658',
      //   title: '邀请得红包',
      //   style: 'serviceActive',
      //   func: 'toShare'
      // },
      {
        url: 'http://img.hb.aicdn.com/a5b64c56d1f785c25286e484d43696409bda8d9b9b9-Cl3bvW_fw658',
        title: '收货地址',
        style: '',
        func: 'toAddress'
      },
      {
        url: 'http://img.hb.aicdn.com/3c3d540462bc068b20bb61470f318a588195af9f7ff-pehLlq_fw658',
        title: '帮助与客服',
        style: '',
        func: 'toKefu'
      },
      {
        url: 'http://img.hb.aicdn.com/9f88ccd17e358c03cc6d6504227b5b3b5623fced961-TsyyoP_fw658',
        title: '设置',
        style: '',
        func: 'toSetting'
      }
    ],
    role: '未设置', // 用户权限
    
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      role: wx.getStorageSync('role')
    })
    if(wx.getStorageSync('user_id')) {
      wx.request({
        url: Globalhost + 'Api/user/getUserInfo',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user_id: wx.getStorageSync('user_id')
        },
        success: function(res) {
          console.log(res)
          that.setData({
            head_pic: Globalhost + res.data.data.head_pic,
            nickname: res.data.data.nickname,
            user_id: res.data.data.user_id,
            'infoMsg[0].num': res.data.data.user_money
          })
        }
      })
    } 
    if(!wx.getStorageSync('login')) {
      wx.showModal({
        title: '未登录',
        content: '是否跳转到登陆页面',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/login/login'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  onShow: function () {
    let that = this;
    if(wx.getStorageSync('nickname')) {
      console.log(123)
      this.setData({
        nickname: wx.getStorageSync('nickname')
      })
    }
    that.setData({
      role: wx.getStorageSync('role')
    })
    if(wx.getStorageSync('head_pic')) {
      this.setData({
        head_pic: Globalhost + wx.getStorageSync('head_pic')
      })
    }
  },
  toYue: function () { // 余额
    loadingfunc();
    wx.navigateTo({
      url: '/pages/yue/yue'
    })
  },
  toYouhui: function () { // 优惠券
    loadingfunc();
    wx.navigateTo({
      url: '/pages/youhuiquan/youhuiquan'
    })
  },
  toHongbao: function () { // 我的红包
    loadingfunc();
    wx.navigateTo({
      url: '/pages/hongBao/hongBao'
    })
  },
  toMyOrder: function () { // 全部订单
    loadingfunc();
    wx.navigateTo({
      url: '/pages/myOrder/myOrder'
    })
  },
  toLoadPinglun: function () { // 待评论
    loadingfunc();
    wx.navigateTo({
      url: '/pages/myOrder/myOrder?pageStatus=1'
    })
  },
  toTuikuan: function () { // 退款/售后
    loadingfunc();
    wx.navigateTo({
      url: '/pages/myOrder/myOrder?pageStatus=2'
    })
  },

  toMyOrderB: function () { // 全部订单
    loadingfunc();
    wx.navigateTo({
      url: '/pages/myOrderB/myOrderB'
    })
  },
  toLoadPinglunB: function () { // 待评论
    loadingfunc();
    wx.navigateTo({
      url: '/pages/myOrderB/myOrderB?pageStatus=1'
    })
  },
  toTuikuanB: function () { // 退款/售后
    loadingfunc();
    wx.navigateTo({
      url: '/pages/myOrderB/myOrderB?pageStatus=2'
    })
  },
  toPeisong: function () { // 配送1
    wx.navigateTo({
      url: '/pages/peisongList/peisongList'
    })
  },
  toPeisong1: function () { // 配送2
    wx.navigateTo({
      url: '/pages/peisongList/peisongList?pageStatus=1'
    })
  },
  toPeisong2: function () { // 配送3
    wx.navigateTo({
      url: '/pages/peisongList/peisongList?pageStatus=2'
    })
  },

  toKefu: function () { // 客服
    loadingfunc();
    wx.navigateTo({
      url: '/pages/kefu/kefu'
    })
  },
  toAddress: function () { // 收货地址
    loadingfunc();
    wx.navigateTo({
      url: '/pages/address/address'
    })
  },
  toShare: function () { // 邀请
    loadingfunc();
    wx.navigateTo({
      url: '/pages/share/share'
    })
  },
  toSetting: function () { // 设置
    loadingfunc();
    wx.navigateTo({
      url: '/pages/setting/setting'
    })
  },
  toUserinfo: function () {
    loadingfunc();
    wx.navigateTo({
      url: '/pages/userInfo/userInfo'
    })
  },
  /**
   * 跳转消息页面
   */
  toNews: function () {
    wx.navigateTo({
      url: '/pages/news/news'
    })
  }

})