Page({
  data: {

  },
  onLoad: function (options) {

  },
  callNumber: function () {
    wx.showModal({
      title: '联系客服',
      content: '如果您在使用小程序的过程遇到任何问题可以拨打客服热线进行咨询或帮助，是否确定拨打客服电话 042-2465-8993？',
      success: function() {
        wx.makePhoneCall({
          phoneNumber: '042-2465-8993' // 仅为示例，并非真实的电话号码
        })
      }
    })
  }
})