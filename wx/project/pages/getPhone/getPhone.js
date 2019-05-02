Page({
  data: {

  },
  onLoad: function (options) {

  },
  getPhoneNumber(e) {
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  /**
   * 用户点击,右上角分享
   */
  onShareAppMessage: function () {

  }
})