var parabola = require("./parabola.js").parabola;


Page({
    data: {
        data: [{
            img: './img/a.jpg',
            title: '回力居家棉拖鞋男冬季室内包跟厚底防滑防水保暖棉鞋情侣家居拖鞋',
            price: '39',
            id: 1
        }, {
            img: './img/b.jpg',
            title: '鞋柜秋冬款粗跟马丁靴女英伦风裸靴绒面短靴高跟女靴子天天瘦瘦靴',
            price: '59',
            id: 2
        }, {
            img: './img/c.jpg',
            title: '秋季男装NIANJEEP休闲裤男长裤直筒宽松男裤户外旅游工装裤子',
            price: '88',
            id: 3
        }, {
            img: './img/a.jpg',
            title: '回力居家棉拖鞋男冬季室内包跟厚底防滑防水保暖棉鞋情侣家居拖鞋',
            price: '39',
            id: 4
        }, {
            img: './img/b.jpg',
            title: '鞋柜秋冬款粗跟马丁靴女英伦风裸靴绒面短靴高跟女靴子天天瘦瘦靴',
            price: '59',
            id: 5
        }, {
            img: './img/c.jpg',
            title: '秋季男装NIANJEEP休闲裤男长裤直筒宽松男裤户外旅游工装裤子',
            price: '88',
            id: 6
        }, {
            img: './img/a.jpg',
            title: '回力居家棉拖鞋男冬季室内包跟厚底防滑防水保暖棉鞋情侣家居拖鞋',
            price: '39',
            id: 7
        }, {
            img: './img/b.jpg',
            title: '鞋柜秋冬款粗跟马丁靴女英伦风裸靴绒面短靴高跟女靴子天天瘦瘦靴',
            price: '59',
            id: 8
        }, {
            img: './img/c.jpg',
            title: '秋季男装NIANJEEP休闲裤男长裤直筒宽松男裤户外旅游工装裤子',
            price: '88',
            id: 9
        }, {
            img: './img/a.jpg',
            title: '回力居家棉拖鞋男冬季室内包跟厚底防滑防水保暖棉鞋情侣家居拖鞋',
            price: '39',
            id: 10
        }, {
            img: './img/b.jpg',
            title: '鞋柜秋冬款粗跟马丁靴女英伦风裸靴绒面短靴高跟女靴子天天瘦瘦靴',
            price: '59',
            id: 11
        }, {
            img: './img/c.jpg',
            title: '秋季男装NIANJEEP休闲裤男长裤直筒宽松男裤户外旅游工装裤子',
            price: '88',
            id: 12
        }],



        end: { //结束地方的位置，大小
            x: '',
            y: '',
            width: 16,
            height: 16,
        },
        _parabola: '', //抛物线对象
        ghost_arr: [], //抛物线数组，支持多个抛物线
        add_num: 0, //增加的数量
        sub_num: 0, //减少的数量
        all_num: 0, //所有的数量
    },
    onLoad: function () {


        var self = this;
        wx.getSystemInfo({
            success: function (res) {
                var width = res.windowWidth,
                    height = res.windowHeight;
                var _end = self.data.end,
                    _start = self.data.start;
                // console.log(width,height,_end);
                //计算出购物车的坐标
                _end.x = width - 132;
                _end.y = height - 46;
                self.setData({
                    end: _end
                });
            }
        });


    },
    goto_shopcart: function (e) {
        var self = this,
            start = { //找到开始点的位置，大小
                x: e.touches[0].clientX - 50,
                y: e.touches[0].clientY - 50,
                width: 100,
                height: 100
            },
            temp_ghost = {
                id: self.data.add_num,

            }; //数组的复制


        var str = 'ghost_arr[' + self.data.add_num + ']';

        self.data.add_num++;


        var _p = new parabola({
            start: start,
            end: this.data.end,
            callback: function (x, y, w, h) {

                temp_ghost.x = x;
                temp_ghost.y = y;
                temp_ghost.w = w;
                temp_ghost.h = h;
                temp_ghost.img = e.target.dataset.item.img;
                self.setData({
                    [str]: temp_ghost
                });
            },
            finish: function () {
                self.data.sub_num++;
                if (self.data.add_num == self.data.sub_num) { //全部完成了
                    self.data.sub_num = 0;
                    self.data.add_num = 0;
                    self.setData({ //清空ghost数组
                        ghost_arr: []
                    })
                }
                self.setData({
                    all_num: self.data.all_num + 1
                })
            }
        });
        _p.run();
    },

})