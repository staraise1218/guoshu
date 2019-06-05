const app = getApp()
const Globalhost = getApp().globalData.Globalhost;
Page({
  data: {
    newsList: [],
    my_error_alert_show: false,
    my_alert_title: '系统公告',
    alert_message: '123',
    alert_time: '',

  },
  onLoad: function (options) {
    let that = this;
    that.getList(that);
  },
  getList(that) {
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
  readMessage(that, id) {
    wx.request({
      url: Globalhost + 'Api/User/readMessage',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        user_id: wx.getStorageSync('user_id'),
        message_id: id
      },
      success: function(res) {
        console.log(res)
        that.getList(that);
      }
    })
  },
  show_alert(e) {
    let that = this;
    console.log(e.currentTarget.dataset)
    this.setData({
      my_error_alert_show: true,
      alert_message: e.currentTarget.dataset.message,
      alert_time: e.currentTarget.dataset.time
    })
    that.readMessage(that, e.currentTarget.dataset.id); // 读
  },
  close_my_alert() {
    this.setData({
      my_error_alert_show: false
    })
  },
  onShow: function (options) {
    
  },
})