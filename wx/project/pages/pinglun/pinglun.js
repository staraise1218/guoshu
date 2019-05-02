const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    orderid: '',
    goods_list: [], // 返回数据
    test: [],
  },
  onLoad: function (options) {
    console.log(options)
    let that = this;
    this.setData({
      orderid: options.orderid
    })
    wx.request({
      url: Globalhost + 'Api/order/order_detail',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        order_id: options.orderid,
        user_id: wx.getStorageSync('user_id'),
      },
      success: function (res) {
        let data = res.data.data
        that.setData({
          goods_list: data.goods_list
        })
      }
    })
    setTimeout(function () {
      console.log(that.data.goods_list)
      for (var i = 0; i < that.data.goods_list.length; i++) {
        var str = 'goods_list[' + i + '].is_anonymous';
        that.setData({
          [str]: 1
        })
      }
      console.log(that.data.goods_list)
    }, 500)
  },
  upimg: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.goodsid)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths)
        console.log(res)
        for (var i = 0; i < that.data.goods_list.length; i++) {
          if (that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
            var str = 'goods_list[' + i + '].images';
            var images = that.data.goods_list[i].images || [];
            images.push(tempFilePaths[0])
            that.setData({
              [str]: images
            })
          }
        }
        console.log(that.data.goods_list)
      }
    })
  },
  fabu: function () {
    let that = this;
    let imgList = [];
    console.log(that.data.goods_list)
    for (let i = 0; i < that.data.goods_list.length; i++) {
      var img = that.data.goods_list[i].images
      img = JSON.stringify(img)
      console.log(img)
      that.data.goods_list[i].images = img;
      console.log(that.data.goods_list)
      that.data.goods_list[i].order_id = that.data.orderid;
      that.data.goods_list[i].user_id = wx.getStorageSync('user_id');
      wx.request({
        url: Globalhost + 'Api/order/add_comment',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: that.data.goods_list[i],
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      })
    }
  },
  /**
   * 切换是否匿名
   */
  anonymous: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.goodsid)
    for (var i = 0; i < that.data.goods_list.length; i++) {
      if (that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
        var str = 'goods_list[' + i + '].is_anonymous';
        if(that.data.goods_list[i].is_anonymous == 0) {
          that.setData({
            [str]: 1
          })
        } else {
          that.setData({
            [str]: 0
          })
        }
      }
    }
  },
  /**
   * 评论文字
   */
  changeinput: function (e) {
    let that = this;
    console.log(e.detail.value)
    for (var i = 0; i < that.data.goods_list.length; i++) {
      console.log(that.data.goods_list[i].goods_id)
      console.log(e.currentTarget.dataset.goodsid)
      if (that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
        console.log(e.detail.value)
        var str = 'goods_list[' + i + '].content';
        that.setData({
          [str]: e.detail.value
        })
      }
    }
  },
  /**
   * 商品评分
   */
  goods_rank: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.goodsid)
    console.log(e.target.dataset.id)
    for (var i = 0; i < this.data.goods_list.length; i++) {
      if (that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
        var str = 'goods_list[' + i + '].goods_rank';
        that.setData({
          [str]: e.target.dataset.id
        })
      }
    }
  },
  /**
   * 商品评分
   */
  deliver_rank: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.goodsid)
    console.log(e.target.dataset.id)
    for (var i = 0; i < this.data.goods_list.length; i++) {
      if (that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
        var str = 'goods_list[' + i + '].deliver_rank';
        that.setData({
          [str]: e.target.dataset.id
        })
      }
    }
  },
  /**
   * 商品评分
   */
  service_rank: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.goodsid)
    console.log(e.target.dataset.id)
    for (var i = 0; i < this.data.goods_list.length; i++) {
      if (that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
        var str = 'goods_list[' + i + '].service_rank';
        that.setData({
          [str]: e.target.dataset.id
        })
      }
    }
  },






  onShareAppMessage: function () {

  }

})