Page({
  data: {
    imgUrl: '/src/img/图层3@2x.png'
  },
  onLoad: function (options) {

  },
  previewImage: function (e) {
    console.log(1);
    var current = e.target.dataset.src; //这里获取到的是一张本地的图片 
    wx.previewImage({
      current: this.data.imgUrl, //需要预览的图片链接列表 
      urls: [this.data.imgUrl] //当前显示图片的链接 
    })
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '果蔬直销', // 转发后 所显示的title
      path: '/pages/index/index', // 相对的路径
      imgUrl: '/src/img/图层3@2x.png',
      success: (res) => { // 成功后要做的事情
        console.log(res.shareTickets[0])
        // console.log
        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
            console.log(that.setData.isShow)
          },
          fail: function (res) {
            console.log(res)
          },
          complete: function (res) {
            console.log(res)
          }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})