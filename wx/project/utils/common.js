
/**
 * 常量
 */
const Globalhost= 'https://app.zhuoyumall.com:444/';










  var cart2 = function (that, posdata2) {
    wx.request({
      url: Globalhost + 'Api/cart/cart2',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: posdata2,
      success: function(res) {
        console.log(res)
        }
    })
  }




















module.exports = {
    cart2 : cart2
}