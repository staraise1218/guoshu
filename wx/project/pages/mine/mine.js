const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
const loadingfunc = getApp().globalData.loadingfunc;
Page({
  // data: {
  //   nickname: '未设置',
  //   head_pic: 'http://img.hb.aicdn.com/0d073af2e0eb5b66d800bdc234571d2aeaec4c641700-aZonQZ_fw658',
  //   infoMsg: [
  //     {
  //       num: 0,
  //       title: '余额',
  //       func: 'toYue'
  //     },{
  //       num: 0,
  //       title: '红包',
  //       func: 'toYouhui'
  //     },
  //   ],
  //   orderMsg: [
  //     {
  //       url: 'http://img.hb.aicdn.com/34e2c06fe2e2bdd28b1687c4f1f2e4d6909a93a965e-lE6fEc_fw658',
  //       title: '未支付',
  //       func: 'toWeiZhiFu'
  //     },
  //     {
  //       url: 'http://img.hb.aicdn.com/34e2c06fe2e2bdd28b1687c4f1f2e4d6909a93a965e-lE6fEc_fw658',
  //       title: '已支付',
  //       func: 'toYiZhiFu'
  //     },
  //     {
  //       url: 'http://img.hb.aicdn.com/ea1e30c09e5d34530d1670e2f95532f8061c6b847ea-wMoJhN_fw658',
  //       title: '待评价',
  //       func: 'toDaiPingLun'
  //     },
  //     {
  //       url: 'http://img.hb.aicdn.com/f9cb87fd436c0be2da0917754d92fdbc734d15b68ef-iLZpRU_fw658',
  //       title: '退款',
  //       func: 'toTuikuan'
  //     }
  //   ],
  //   zhandian: [
  //     {
  //       url: 'https://hbimg.huabanimg.com/d5ca7feae4a8b05631125a2736727bdd37089fc6771-5ZfC4k_fw658',
  //       title: '未提货',
  //       func: 'toTuikuanB'
  //     },
  //     {
  //       url: 'https://hbimg.huabanimg.com/5ac27cc5f1dd184c2ce3b0b45af294960bc39a966bd-O5zJVF_fw658',
  //       title: '今日提货',
  //       func: 'toLoadPinglunB'
  //     },
  //     {
  //       url: 'https://hbimg.huabanimg.com/a762eb29424005cced4b0b4cfcb11ed99a2377b965d-smw58j_fw658',
  //       title: '已提货',
  //       func: 'toMyOrderB'
  //     },
  //   ],
  //   peisong: [
  //     {
  //       url: 'https://hbimg.huabanimg.com/63a3f4ac37fa4572fae03d1dd2dd8db71910df0163b-hskLOg_fw658',
  //       title: '配送中',
  //       func: 'toPeisong'
  //     },
  //     {
  //       url: 'https://hbimg.huabanimg.com/c8498c8fd5d1d2a58cae4c4e39a5666fa61ddf02851-xFCgOa_fw658',
  //       title: '今日送达',
  //       func: 'toPeisong1'
  //     },
  //     {
  //       url: 'https://hbimg.huabanimg.com/14fa2b764da0496ef868dadda39be76b835853fe5f5-kltWPr_fw658',
  //       title: '已送达',
  //       func: 'toPeisong2'
  //     }
  //   ],
  //   serviceMsg: [
  //     {
  //       url: 'http://img.hb.aicdn.com/a5b64c56d1f785c25286e484d43696409bda8d9b9b9-Cl3bvW_fw658',
  //       title: '收货地址',
  //       style: '',
  //       func: 'toAddress'
  //     },
  //     {
  //       url: 'http://img.hb.aicdn.com/3c3d540462bc068b20bb61470f318a588195af9f7ff-pehLlq_fw658',
  //       title: '帮助与客服',
  //       style: '',
  //       func: 'toKefu'
  //     },
  //     {
  //       url: 'http://img.hb.aicdn.com/9f88ccd17e358c03cc6d6504227b5b3b5623fced961-TsyyoP_fw658',
  //       title: '设置',
  //       style: '',
  //       func: 'toSetting'
  //     }
  //   ],
  //   role: '未设置', // 用户权限
  // },
  // onLoad: function (options) {
  //   var that = this;
  //   that.setData({
  //     role: wx.getStorageSync('role')
  //   })
  //   if(wx.getStorageSync('user_id')) {
  //     wx.request({
  //       url: Globalhost + 'Api/user/getUserInfo',
  //       method: 'POST',
  //       header: {
  //         'content-type': 'application/x-www-form-urlencoded'
  //       },
  //       data: {
  //         user_id: wx.getStorageSync('user_id')
  //       },
  //       success: function(res) {
  //         console.log(res)
  //         that.setData({
  //           nickname: res.data.data.nickname,
  //           user_id: res.data.data.user_id,
  //         })
  //         if(wx.getStorageSync('login') == '手机号登陆') {
  //           if(res.data.data.head_pic) {
  //             that.setData({
  //               head_pic: Globalhost + wx.getStorageSync('head_pic')
  //             })
  //           } else {
  //             that.setData({
  //               head_pic: 'http://img.hb.aicdn.com/0d073af2e0eb5b66d800bdc234571d2aeaec4c641700-aZonQZ_fw658'
  //             })
  //           }
  //         } else {
  //           if(res.data.data.head_pic) {
  //             that.setData({
  //               head_pic: wx.getStorageSync('head_pic')
  //             })
  //           }else {
  //             that.setData({
  //               head_pic: 'http://img.hb.aicdn.com/0d073af2e0eb5b66d800bdc234571d2aeaec4c641700-aZonQZ_fw658'
  //             })
  //           }
  //         }
  //         if(res.data.data.nickname) {
  //           that.setData({
  //             nickname: res.data.data.nickname,
  //           })
  //         } else {
  //           that.setData({
  //             nickname: '请输入用户名'
  //           })
  //         }
  //       }
  //     })
  //   }
  //   if(!wx.getStorageSync('login')) {
  //     wx.showModal({
  //       title: '未登录',
  //       content: '是否跳转到登陆页面',
  //       success(res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //           wx.navigateTo({
  //             // url: '/pages/login/login'
  //             url: '/pages/loading/loading'
  //           })
  //         } else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   }
  //   that.getPickupInfo()
  // },
  // onShow: function () {
  //   let that = this;

  //   if(!wx.getStorageSync('user_id')) {
  //     wx.navigateTo({
  //       url: '/pages/loading/loading'
  //     })
  //   }
  //   that.loadingShopcartNum(that);
  //   if(wx.getStorageSync('nickname')) {
  //     console.log(123)
  //     this.setData({
  //       nickname: wx.getStorageSync('nickname')
  //     })
  //   }
  //   that.setData({
  //     role: wx.getStorageSync('role')
  //   })
  //   this.setData({
  //     head_pic: wx.getStorageSync('head_pic')
  //   })
  //   wx.request({
  //     url: Globalhost + 'Api/user/index',
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     data: {
  //       user_id: wx.getStorageSync('user_id')
  //     },
  //     success: function(res) {
  //       console.log(res)
  //       if(res.data.code == 200) {
  //         wx.setStorageSync('head_pic', Globalhost + res.data.data.userInfo.head_pic);
  //         wx.setStorageSync('nickname', res.data.data.userInfo.nickname);
  //         that.setData({
  //           head_pic: Globalhost + res.data.data.userInfo.head_pic,
  //           nickname: res.data.data.userInfo.nickname,
  //           'infoMsg[0].num': res.data.data.userInfo.user_money,
  //           'infoMsg[1].num': res.data.data.redpack_num
  //         })
  //       } else {
  //         console.log('ERROR***************************')
  //       }
  //     }
  //   })
  // },



  // toYue: function () { // 余额
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/yue/yue'
  //   })
  // },
  // toYouhui: function () { // 优惠券
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/youhuiquan/youhuiquan'
  //   })
  // },
  // toHongbao: function () { // 我的红包
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/hongBao/hongBao'
  //   })
  // },
  // toWeiZhiFu: function () { // 未支付
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/myOrder/myOrder?pageStatus=0'
  //   })
  // },
  // toYiZhiFu: function () { // 已支付
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/myOrder/myOrder?pageStatus=1'
  //   })
  // },
  // toDaiPingLun: function () { // 待评价
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/myOrder/myOrder?pageStatus=2'
  //   })
  // },
  // toTuikuan: function () { // 退款
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/myOrder/myOrder?pageStatus=3'
  //   })
  // },

  // toMyOrderB: function () { // 全部订单
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/myOrderB/myOrderB?opSTATUS=ALL'
  //   })
  // },
  // toLoadPinglunB: function () { // 待评论
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/myOrderB/myOrderB?opSTATUS=TODAYRECIEVE'
  //   })
  // },
  // toTuikuanB: function () { // 退款/售后
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/myOrderB/myOrderB?opSTATUS=WAITRECEIVE'
  //   })
  // },
  // toPeisong: function () { // 配送1
  //   wx.navigateTo({
  //     url: '/pages/peisongList/peisongList?opSTATUS=SENDING'
  //   })
  // },
  // toPeisong1: function () { // 配送2
  //   wx.navigateTo({
  //     url: '/pages/peisongList/peisongList?opSTATUS=TODAY'
  //   })
  // },
  // toPeisong2: function () { // 配送3
  //   wx.navigateTo({
  //     url: '/pages/peisongList/peisongList?opSTATUS=SENDED'
  //   })
  // },

  // toKefu: function () { // 客服
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/kefu/kefu'
  //   })
  // },
  // toAddress: function () { // 收货地址
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/address/address'
  //   })
  // },
  // toShare: function () { // 邀请
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/share/share'
  //   })
  // },
  // toSetting: function () { // 设置
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/setting/setting'
  //   })
  // },
  // toUserinfo: function () {
  //   loadingfunc();
  //   wx.navigateTo({
  //     url: '/pages/userInfo/userInfo'
  //   })
  // },
  // /**
  //  * 跳转消息页面
  //  */
  // toNews: function () {
  //   wx.navigateTo({
  //     url: '/pages/news/news'
  //   })
  // },



  data: {
    headPic: '/wx/img/2/设置.png',
    NickName: '请输入用户名',
    money: 123, // 零钱
    readBag: 234, // 红包
    waitOrder: 345, // 未付订单


  },
  onShow() {
    let that = this;
    console.log('*************************onLoad************************');
    if (wx.getStorageSync('user_id')) {
      console.log('用户已登录');
      that.getUserInfoMsg(that);
      that.getIndex(that);
    }
    if (!wx.getStorageSync('login')) {
      wx.showModal({
        title: '未登录',
        content: '是否跳转到登陆页面',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.navigateTo({
              url: '/pages/loading/loading'
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    }
  },

  // 获取用户信息
  getUserInfoMsg(that) {
    if (wx.getStorageSync('user_id')) {
      wx.request({
        url: Globalhost + 'Api/user/getUserInfo',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          user_id: wx.getStorageSync('user_id')
        },
        success: function (res) {
          console.log(res)
          let data = res.data.data;
          that.setData({
            NickName: data.nickname,
            headPic: data.head_pic,
            money: data.user_money,
          })
          wx.setStorageSync('userCode', data.userCode)
        }
      })
    }
  },

  // Index
  getIndex(that) {
    wx.request({
      url: Globalhost + 'Api/user/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id')
      },
      success: function (res) {
        console.log(res)
        let data = res.data.data;
        if (res.data.code == 200) {
          that.setData({
            readBag: data.redpack_num,
            headPic: data.userInfo.head_pic || '/wx/img/2/设置.png',
            NickName: data.userInfo.nickname || '请输入用户名',
            money: data.userInfo.user_money || 0, // 零钱,
            waitOrder: data.unpaidOrderNum
          })
        } else {
          console.log('ERROR***************************')
        }
      }
    })
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
  toUserinfo: function () {
    loadingfunc();
    wx.navigateTo({
      url: '/pages/userInfo/userInfo'
    })
  },
  toYue: function () { // 余额
    loadingfunc();
    wx.navigateTo({
      url: '/pages/yue/yue'
    })
  },
  toWeiZhiFu: function () { // 未支付
    loadingfunc();
    wx.navigateTo({
      url: '/pages/myOrder/myOrder?pageStatus=0'
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
  toSetting: function () { // 设置
    loadingfunc();
    wx.navigateTo({
      url: '/pages/setting/setting'
    })
  },
  toPeisong: function () { // 配送1
    wx.navigateTo({
      url: '/pages/peisongList/peisongList?opSTATUS=SENDING'
    })
  },
  // 关于我们
  toAgreement: function () {
    wx.navigateTo({
      url: '/pages/agreement/greement'
    })
  },
  // 跳转到站点申请
  toMaster: function () {
    wx.navigateTo({
      url: '/pages/stationmaster/stationmaster'
    })
  },
  // 自提点说明
  toSiteMsg: function () {
    loadingfunc();
    wx.navigateTo({
      url: '/pages/siteMsg/siteMsg'
    })
  },


  /**
   * 加载购物车数量
   */
  loadingShopcartNum: function (that) {
    wx.request({
      url: Globalhost + 'Api/common/getCartNum',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        city_code: wx.getStorageSync('addressCode'),
        user_id: wx.getStorageSync('user_id')
      },
      success: function (res) {
        console.log(res)
        that.setData({
          cart_num: res.data.data.cartNum
        })
        if (res.data.data.cartNum > 0) {
          wx.setTabBarBadge({
            index: 3,
            text: '' + res.data.data.cartNum
          })
        } else {
          wx.hideTabBarRedDot({
            index: 3
          })
        }
      }
    })
  },




  // 获取站点名
  getPickupInfo() {
    let that = this;
    wx.request({
      url: Globalhost + 'Api/user/getPickupInfo',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id')
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          that.setData({
            pickupName: res.data.data.pickup_name
          })
        } else {
          console.log('获取站点名 ERROR')
        }
      }
    })
  }

})