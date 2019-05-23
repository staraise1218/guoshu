App({



  //获取屏幕[宽、高]
  screenSize: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.ww = res.windowWidth;
        that.globalData.hh = res.windowHeight;
      }
    })
  },
  /**
   * @param sx 起始点x坐标
   * @param sy 起始点y坐标
   * 
   * @param cx 控制点x坐标
   * @param cy 控制点y坐标
   * 
   * @param ex 结束点x坐标
   * @param ey 结束点y坐标
   * 
   * @param part 将起始点到控制点的线段分成的份数，数值越高，计算出的曲线越精确
   * @return 贝塞尔曲线坐标
   */
  bezier: function (points, part) {
    let sx = points[0]['x'];
    let sy = points[0]['y'];
    let cx = points[1]['x'];
    let cy = points[1]['y'];
    let ex = points[2]['x'];
    let ey = points[2]['y'];
    var bezier_points = [];
    // 起始点到控制点的x和y每次的增量
    var changeX1 = (cx - sx) / part;
    var changeY1 = (cy - sy) / part;
    // 控制点到结束点的x和y每次的增量
    var changeX2 = (ex - cx) / part;
    var changeY2 = (ey - cy) / part;
    //循环计算
    for (var i = 0; i <= part; i++) {
      // 计算两个动点的坐标
      var qx1 = sx + changeX1 * i;
      var qy1 = sy + changeY1 * i;
      var qx2 = cx + changeX2 * i;
      var qy2 = cy + changeY2 * i;
      // 计算得到此时的一个贝塞尔曲线上的点
      var lastX = qx1 + (qx2 - qx1) * i / part;
      var lastY = qy1 + (qy2 - qy1) * i / part;
      // 保存点坐标
      var point = {};
      point['x'] = lastX;
      point['y'] = lastY;
      bezier_points.push(point);
    }
    //console.log(bezier_points)
    return {
      'bezier_points': bezier_points
    };
  },






















  onLoad: function () {
    if (!wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  onLaunch: function () {
    this.screenSize();
  },
  globalData: {
    Globalhost: 'https://app.zhuoyumall.com:444/',
    // Globalhost : 'http://guoshu.staraise.com.cn/',
    loadingfunc: function () {
      wx.showLoading({
        title: '加载中',
        mask: 'true'
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    },
  },
})