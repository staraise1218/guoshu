const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    orderid: '',
    goods_list: [],  // 返回数据
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
        user_id: wx.getStorageSync('user_id')
      },
      success: function(res) {
        let data = res.data.data
        that.setData({
          goods_list: data.goods_list
        })
      }
    })
    setTimeout(function () {
      console.log(that.data.goods_list)
      for(var i = 0; i < that.data.goods_list.length; i++) {
        var str = 'goods_list[' + i + '].is_anonymous';
        that.setData({
          [str]: true
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
        for(var i = 0; i < that.data.goods_list.length; i++) {
          if(that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
            var str = 'goods_list[' + i + '].imgArr';
            var imgArr = that.data.goods_list[i].imgArr || [];
            imgArr.push(tempFilePaths[0])
            that.setData({
              [str]: imgArr
            })
          }
        }
        console.log(that.data.goods_list)
      }
    })
  },
  fabu: function () {
    wx.showToast({
      title: '占未开通',
      icon: 'none'
    })
  },
  /**
   * 切换是否匿名
   */
  anonymous: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.goodsid)
    for(var i = 0; i < that.data.goods_list.length; i++) {
      if(that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
        var str = 'goods_list[' + i + '].is_anonymous';
        that.setData({
          [str]: !that.data.goods_list[i].is_anonymous
        })
      }
    }
  },
  /**
   * 评论文字
   */
  changeinput: function (e) {
    console.log(e.detail.value)
    for(var i = 0; i < that.data.goods_list.length; i++) {
      if(that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
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
    for(var i = 0; i < this.data.goods_list.length; i++) {
      if(that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
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
    for(var i = 0; i < this.data.goods_list.length; i++) {
      if(that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
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
    for(var i = 0; i < this.data.goods_list.length; i++) {
      if(that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
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