Component({
  properties: {
    title: {
      type: String,
      value: '温馨提示：'
    },
    content: {
      type: String,
      value: '弹窗内容'
    },
    cancel: {
      type: String,
      value: '取消'
    },
    ok: {
      type: String,
      value: '确定'
    },
  },
  data: {
    my_alert_show: true
  },
  methods: {
    close_my_alert() {
      this.setData({
        my_alert_show: false
      })
    },
    my_alert_cancel () {
      this.close_my_alert()

    },
    my_alert_ok() {
      this.close_my_alert()

    }
  }
})
