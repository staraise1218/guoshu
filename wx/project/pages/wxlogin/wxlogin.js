const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  bindGetUserInfo: function () {
    let that = this;
    wx.login({
      success: function (loginRes) {
        console.log('code :', loginRes.code) // code 码
        wx.setStorageSync('code', loginRes.code)
        console.log(loginRes)
        if (loginRes) {
          // 获取用户信息
          wx.getUserInfo({
            withCredentials: true, //非必填  默认为true
            success: function (infoRes) {
              console.log(infoRes);
              console.log(JSON.parse(infoRes.rawData))
              const USERINFO = JSON.parse(infoRes.rawData);
              wx.setStorageSync('iv', infoRes.iv)
              wx.setStorageSync('signature', infoRes.signature)
              wx.setStorageSync('userInfo', infoRes.userInfo)
              // 请求服务端的登录接口
              wx.request({
                url: Globalhost + 'Api/auth/getOpenid',
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  code: loginRes.code
                },
                success: function (res) {
                  let user = res.data.data
                  console.log(res);
                  wx.setStorageSync('openid', user.openid);
                  wx.setStorageSync('session_key', user.session_key);
                  // wx.setStorageSync('login', '微信登陆');
                  // wx.request({
                  //   url: Globalhost + 'Api/Auth/thirdLogin',
                  //   method: 'POST',
                  //   header: {
                  //     'content-type': 'application/x-www-form-urlencoded'
                  //   },
                  //   data: {
                  //     type: 'weixin',
                  //     account_id: user.openid,
                  //     nickname: USERINFO.nickName,
                  //     head_pic: USERINFO.avatarUrl
                  //   },
                  //   success: function (res) {
                  //     console.log(res)
                  //     let data = res.data.data;

                  //     wx.setStorageSync('head_pic', data.head_pic);
                  //     wx.setStorageSync('nickname', data.nickname);
                  //     wx.setStorageSync('token', data.token);
                  //     wx.setStorageSync('user_id', data.user_id);
                  //     wx.setStorageSync('user_money', data.user_money);
                  //   }
                  // })
                },
                complete: function () {
                  wx.navigateBack({
                    delta: 1
                  });
                }
              })
            }
          });
        } else {

        }
      }
    });
},
onShareAppMessage: function (options ) {

}
})