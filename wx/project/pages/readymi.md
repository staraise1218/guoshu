

|插件|说明|使用页面|参数|
|---|---|---|---|
|recommend|推荐商品|commodityDetails、commodityList
|shopchart|购物车|commodityDetails
|  |components/commodityList/comList|
|  |components/recommend/rec|
|  |components/shopchart/cart|
| 购物车--插件 |components/preshopcart/precart|






|页面|路径|
|---|---|
| 引导页 |pages/welcome/welcome|
| 登录 / 账号不存在 | pages/login/login |
| 找回密码 | pages/retrieve/retrieve |
| 注册 | pages/singup/singup |



|首页|页面|
|---|---|
| 首页 |pages/index/index|
| 搜索--商品列表 |pages/commodityList/commodityList|
| 搜索 |pages/search/search|



. 

|分类|页面|
|----|----|
| 分类 |pages/classification/classification|



|团购|页面|
|----|----|
| 团购 / 正在抢购 /下期预告 |pages/group/group|
| 商品详情--立即购买 |pages/commodityDetails/commodityDetails|
| 商品详情--即将开售 |pages/preCommodityDetails/preCommodityDetails|





|购物车|页面|
|----|----|
| 购物车 / 全选 / 结算 |pages/shoppingCart/shoppingCart|
| 确认订单（提交订单） / 微信、支付宝、余额（付款） | pages/order/order |
| 支付成功 |pages/paySuccess/paySuccess|



|我的|页面|
|----|----|
| 我的 |pages/mine/mine|
| **用户信息** |pages/userInfo/userInfo|
| 余额 |pages/yue/yue|
| 余额--明细 |pages/mingxi/mingxi|
| 红包 |pages/hongBao/hongBao|
| 优惠券 |pages/youhuiquan/youhuiquan|
| 积分 |  |
| **全部订单** |pages/myOrder/myOrder|
| 全部订单--评论 |pages/pinglun/pinglun|
| 全部订单--等待卖家发货 |pages/fahuo/fahuo|
| 全部订单--等待买家付款 pages/loadFukuan/loadFukuan
| 全部订单--交易成功 | pages/orderSuccess/orderSuccess
| 全部订单--等待买家付款 | pages/loadFukuan/loadFukuan
| 全部订单--等待买家收货 | pages/loadFukuan/loadFukuan
| 全部订单--交易关闭 |----|
| 全部订单--拼团中 |----|
| 待评价 | |
| 退款/售后 | |
| 提交订单 |pages/myOrder/myOrder|
| **分享得红包** |pages/share/share|
| 收货地址 |pages/address/address|
| 收货地址--添加 |pages/addAddress/addAddress|
| 收货地址--修改 |pages/addressEdit/addressEdit|
| 客服 |pages/kefu/kefu|
| 设置 |pages/setting/setting|
| 设置--支付密码--支付密码 |pages/password/password|
| 设置--支付密码--验证手机 |pages/passwordSeeting/passwordSeeting|
| 用户协议 |pages/agreement/greement|
| 隐私策略 | pages/privacy/privacy |
| 版本检测 | 弹窗 |
| 清除缓存 | 弹窗 |





  "tabBar": {
    "color": "#a9b7b7",
    "selectedColor": "#F75433",
    "borderStyle": "black",
    "list": [
      {
        "selectedIconPath": "src/img/icon/shouye.png",
        "iconPath": "src/img/icon/shouye-pre.png",
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "selectedIconPath": "src/img/icon/fenlei.png",
        "iconPath": "src/img/icon/fenlei-pre.png",
        "pagePath": "pages/classification/classification",
        "text": "分类"
      },
      {
        "selectedIconPath": "src/img/icon/tuan.png",
        "iconPath": "src/img/icon/tuan-pre.png",
        "pagePath": "pages/group/group",
        "text": "团购"
      },
      {
        "selectedIconPath": "src/img/icon/gouwuche.png",
        "iconPath": "src/img/icon/gouwuche-pre.png",
        "pagePath": "pages/shoppingCart/shoppingCart",
        "text": "购物车"
      },
      {
        "selectedIconPath": "src/img/icon/wode.png",
        "iconPath": "src/img/icon/wode-pre.png",
        "pagePath": "pages/mine/mine",
        "text": "我的"
      }
    ]
  },