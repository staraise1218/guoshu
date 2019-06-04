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
        var img = 'goods_list[' + i + '].images';
        var postImages = 'goods_list[' + i + '].postImages';
        that.setData({
          [str]: 1,
          [img]: [],
          [postImages]: []
        })
      }
      console.log(that.data.goods_list)
    }, 500)
  },
  // upimg: function (e) {
  //   let that = this;
  //   console.log(e.currentTarget.dataset.goodsid)
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success(res) {
  //       // tempFilePath可以作为img标签的src属性显示图片
  //       const tempFilePaths = res.tempFilePaths
  //       console.log(res)

  //       for (var i = 0; i < that.data.goods_list.length; i++) {
  //         if (that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
  //           for(var j = 0; i < that.data.goods_list[i].images.length; j++) {
  //             var str = 'goods_list[' + i + '].images[' + j + ']';
  //             that.setData({
  //               [str]: tempFilePaths || []
  //             })

  //           }
  //         }
  //       }
  //       console.log(that.data.goods_list)
  //     },
  //     complete: function() {

  //       // for(var j = 0; j < tempFilePaths.length; j++) {
  //       //   console.log(tempFilePaths[j])
  //       //   wx.uploadFile({
  //       //     url: Globalhost + 'Api/Common/uploadFile',
  //       //     filePath: tempFilePaths[j],
  //       //     name: 'file',
  //       //     formData: {
  //       //       type: 'goods_comment',
  //       //       'file[]': tempFilePaths[j]
  //       //     },
  //       //     success: (resp) => {
  //       //       console.log(resp);
  //       //       console.log('成功');
  //       //     },
  //       //     complete: () => {
  //       //       console.log('执行完了');
  //       //     }
  //       //   });
  //       // }
        
  //     }
  //   })
  // },
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
              [str]: images,
              postImages: []
            })
          }
        }
        console.log(that.data.goods_list)
      },
      complete: function() {
        for (var i = 0; i < that.data.goods_list.length; i++) {
          if (that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
            for(var j = 0; j < that.data.goods_list[i].images.length; j++) {
                wx.uploadFile({
                  url: Globalhost + 'Api/Common/uploadFile',
                  filePath: that.data.goods_list[i].images[j],
                  name: 'file',
                  formData: {
                    type: 'goods_comment',
                    'file[]': that.data.goods_list[i].images[j]
                  },
                  success: (resp) => {
                    console.log(resp);
                    let data = JSON.parse(resp.data)
                    console.log(data)

                    // filepath = data.data.filepath;
                    console.log(data.data.filepath)
                    console.log('成功');
                    var postImages = [];
                    for (var i = 0; i < that.data.goods_list.length; i++) {
                      if (that.data.goods_list[i].goods_id == e.currentTarget.dataset.goodsid) {
                        for(var j = 0; j < that.data.goods_list[i].images.length; j++) {
                          postImages[j] = data.data.filepath
                        }
                        var str = 'goods_list[' + i + '].postImages';
                      }
                    }
                    console.log(postImages)
                    that.setData({
                      [str]: postImages
                    })
                  },
                  complete: () => {
                    console.log('执行完了');
                    console.log(that.data.goods_list)
                  }
                });
            }
          }
        }
      }
    })
},
  fabu: function () {
    let that = this;
    let imgList = [];
    console.log(that.data.goods_list)
    let len = that.data.goods_list.length;
    for (let i = 0; i < len; i++) {
      var asd = that.data.goods_list[i].postImages;
      console.log(asd)
      asd = JSON.stringify(asd)
      console.log(asd)
      var posData = {
        user_id: wx.getStorageSync('user_id'),
        images: asd,
        content: that.data.goods_list[i].content,
        rec_id: that.data.goods_list[i].rec_id,
        goods_id: that.data.goods_list[i].goods_id,
        is_anonymous: that.data.goods_list[i].is_anonymous,
        order_id: that.data.orderid,
        service_rank: that.data.goods_list[i].service_rank,
        deliver_rank: that.data.goods_list[i].deliver_rank,
        goods_rank: that.data.goods_list[i].goods_rank
      }
      console.log(posData)
      wx.request({
        url: Globalhost + 'Api/order/add_comment',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: posData,
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          if(res.data.code == 200) {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 500)
          }
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
        if (that.data.goods_list[i].is_anonymous == 0) {
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