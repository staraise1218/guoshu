const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    html: '<div class="div_class" style="line-height: 60px; color: red;">暂无数据</div>',
    nodes: [{
        name: 'div',
        attrs: {
            class: 'div_class',
            style: 'font-size:22rpx'
        }
    }]
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: Globalhost + 'Api/article/getContent',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        type: 1
      },
      success: function(res) {
        console.log(res)
        that.setData({
          html: res.data.data.content
        })
      }
    })
  },
})