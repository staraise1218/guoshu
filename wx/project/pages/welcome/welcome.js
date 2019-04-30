// pages/welcome/welcome.js
Page({
  data: {
    imgUrls: [
      'http://img.hb.aicdn.com/42be056e2b3844e56e8f30f6b7e8342d98eec9d096347-DlKv3t_fw658',
      'http://img.hb.aicdn.com/afaae138f8b676febf6a1475ac4abea8901c316833c3c-WCC8sM_fw658',
      'http://img.hb.aicdn.com/f755aac247b2abf13a81bc494ffa1ae3e9ff98a74204a-k9hPjF_fw658',
      'http://img.hb.aicdn.com/04a3e5f724b2a6de1ee7fd89b87d6c4a764726843ac37-Hdi2RV_fw658'
    ]
  },
  toIndex: function () {
    console.log(111111111)
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})