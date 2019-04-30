const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    newsList: []
  },
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: Globalhost + 'Api/user/message',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        page: 1
      },
      success: function(res) {
        let time = '';
        let newsList = [];
        for(let i= 0;i < res.data.data.length; i++) {
          time = 'newsList[' + i + '].send_time';
          that.setData({
            newsList: res.data.data,
            [time]: that.formatDate(res.data.data[i].send_time)
          })
        }
      }
    })
  },
  // 时间转换
  formatDate : function (timestamp = +new Date()) {
    timestamp = timestamp * 1000;
    if (timestamp) {
      var time = new Date(timestamp);
      var y = time.getFullYear(); //getFullYear方法以四位数字返回年份
      var M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
      var d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
      var h = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
      var m = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
      var s = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
      console.log(y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s)
      return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
    } else {
        return '';
    }
  },
  onShow: function (options) {
    
  },
})