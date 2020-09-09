(function ($, root) {
    function MusicPlayer(dom) {
        this.wrap = dom;
        // 请求数据列表
        this.dataList = [];
        // 请求地址
        this.url = "../mock/data.json";
        // // 索引值
        // this.now = 0;
        this.indexObj = null;
        // 图片旋转的定时器
        this.imgTimer = null;
        // 列表控制对象
        this.listControl = null;
        // 进度条的定时器
        this.proTimer = null;
        // 进度条动画60hz刷新的定时器
        this.barTimer = null;
    }
    // 初始化
    MusicPlayer.prototype.init = function () {
        // 获取数据
        this.getData(this.url);
        // 获取dom元素
        this.getDom();
        // console.log(this.controlBtns);

    }
    // 进度条定时器
    MusicPlayer.prototype.progressMusic = function (data) {
        var This = this;
        // 清理两个定时器
        clearInterval(this.barTimer);
        clearInterval(this.proTimer);
        this.proTimer = setInterval(function () {
            // 判断当前音乐是否播放完毕
            if(root.music.audio.ended){
                // 播放完毕载入下一首歌
                This.loadMusic(This.dataList, This.indexObj.next());
            }
            // root.music.end(This.loadMusic(This.dataList, This.indexObj.next()))
            // 获取当前播放的时间
            var curTime = parseInt(root.music.curTime()),
                minute = parseInt(curTime / 60), //分钟
                second = (curTime % 60);// 秒
            parsent = (curTime) / root.music.duration() * 100; // 当前播放进度的百分比
            var nowTime = root.timeFormat(minute, second); // 改变时间格式
            This.curTime.innerHTML = nowTime; // 每隔1是赋值
            // 每秒刷新一次
            // console.log(parsent);
        }, 1000)

        this.barTimer = setInterval(function () {
            var curTime = parseInt(root.music.curTime()),
                parsent = (curTime) / root.music.duration() * 100;
            This.fontBg.style.width = parsent + "%"; //为进度条长度赋值
            
            This.circle.style.left = (-3 + (parsent/100) * 65) + "vw"; // 小圆点的位置变化
            // console.log();
            // 60刷新更新
        }, 1000 / 60)
    }
    // 加载音乐 
    MusicPlayer.prototype.loadMusic = function (data, index) {
        // 渲染数据
        root.render(data[index]);
        // 渲染进度条
        root.renderProgress(data[index]);
        // 加载音乐
        root.music.load(data[index].audioSrc);
        
        if (root.music.status == "play") { // 如果音乐的状态是播放
            this.curTime.innerHTML = "00:00"
            // 开启定时器 进度条变化
            this.progressMusic();
            this.controlBtns[2].className = "playing";
            root.music.play(); //播放
            this.rotateImg(0); // 旋转图片
        }
        // console.log(this.indexObj.index);
        this.indexObj.index = index; // 存储当前歌曲对应的索引值
        // 改变选中的列表中 active的选中状态
        this.listControl.changeSelect(this.listControl.musicDom, this.indexObj.index);
        // root.music.play();
    }
    // 获取dom元素
    MusicPlayer.prototype.getDom = function () {
        // 获取所有控制按钮
        this.controlBtns = document.querySelectorAll(".control li");
        // 获取图片为了旋转
        this.img = document.querySelector(".songImg img");
        // 控制歌曲播放时间
        this.curTime = document.querySelector(".progress .curTime");
        this.totalTime = document.querySelector(".progress .totalTime");
        // 进度条的元素
        // 小圆点
        this.circle = document.querySelector(".drag .circle");
        // 前背景
        this.fontBg = document.querySelector(".drag .fontBg");
        // 进度条
        this.drag = document.querySelector(".drag");
    }
    // 得到数据
    MusicPlayer.prototype.getData = function (url) {
        var This = this;
        console.log(This);
        $.ajax({
            url: url,
            method: "get",
            success: function (data) {
                This.dataList = data; // 数据获取
                This.playList(); // 列表控制
                This.indexObj = new root.CurIndex(data.length); // 索引值的建立
                console.log(This.dataList[This.indexObj.index]);
                This.seekBar(); // 为进度条上的元素绑定事件
                This.loadMusic(This.dataList, This.indexObj.index) // 加载音乐
                This.musicControl(); // 控制加载
            },
            error: function () {
                console.log("请求失败")
            }
        })
    }
    // 控制音乐上一首下一首的处理
    MusicPlayer.prototype.musicControl = function () {
        var This = this;
        // 是否喜欢
        this.controlBtns[0].addEventListener("touchend", function () {
            if (This.dataList[This.indexObj.index].isLike) { //true
                This.dataList[This.indexObj.index].isLike = false;
                This.controlBtns[0].className = "";
            } else {
                This.dataList[This.indexObj.index].isLike = true;
                This.controlBtns[0].className = "liking";
            }
        })
        // 上一首
        this.controlBtns[1].addEventListener("touchend", function () {
            root.music.status = "play";
            // This.now--;
            This.loadMusic(This.dataList, This.indexObj.prev());
            // 边界处理
            // if (This.now < 0) {
            //     This.now = 0;
            // } else {
            //     root.music.status = "play";
            //     This.loadMusic(This.dataList, This.now);
            // }
            // console.log(This.now)
            // // console.log("按下")
        })
        // 播放暂停
        this.controlBtns[2].addEventListener("touchend", function () {
            if (root.music.status == "play") { //播放状态处理
                root.music.status = "pause";
                root.music.pause();
                This.controlBtns[2].className = "";
                clearInterval(This.imgTimer);
            } else if (root.music.status == "pause") {
                root.music.status = "play";
                root.music.play();
                This.progressMusic();
                This.controlBtns[2].className = "playing";
                // 第一次为0 容错处理 其他都是通过记录的位置再旋转
                var rotate = This.img.dataset.rotate || 0;
                This.rotateImg(rotate);
            }
            console.log(root.music.status)
            // console.log("按下")
        })
        // 下一首
        this.controlBtns[3].addEventListener("touchend", function () {
            root.music.status = "play";
            This.loadMusic(This.dataList, This.indexObj.next());
            // This.controlBtns[2].className = "playing";
            // This.now++;
            // 边界处理
            // if (This.now > This.dataList.length - 1) {
            //     This.now = This.dataList.length - 1;
            //     // root.music.status= "";
            // } else {
            //     root.music.status = "play";
            //     This.loadMusic(This.dataList, This.now);
            // }
            // console.log(This.now);
            // console.log("按下")
        })
    }
    //图片旋转
    MusicPlayer.prototype.rotateImg = function (deg) {
        var This = this;
        clearInterval(this.imgTimer);
        this.imgTimer = setInterval(function () {
            deg = +deg + 0.2; //
            This.img.style.transform = 'rotate(' + deg + 'deg)';
            This.img.dataset.rotate = deg;
        }, 1000 / 60);
    }
    // 进度条的事件
    MusicPlayer.prototype.seekBar = function(){
        var This = this;
        // this.circle.addEventListener("touchmove",function(e){
        //     var pageX = e.changedTouches[0].pageX, // 64 - 308
        //         parsent = ((pageX - 64)/244)*100;
        //     // This.circle.style.left = (-3 + (parsent/100) * 65) + "vw";
        //     console.log(e.changedTouches[0].pageX);
        // })
        this.drag.addEventListener("touchend",function(e){
            root.music.play(); //进度条拖拽后直接播放音乐
            This.controlBtns[2].className = "playing"; // 改变菜单栏的播放图标
            var pageX = e.changedTouches[0].pageX; // 64 - 308
                parsent = ((pageX - 64)/244)*100;
            var duration = root.music.duration();
            root.music.playTo(parseInt(duration * (parsent/100)));
            // This.fontBg.style.width = parsent +"%";
            // console.log(e.changedTouches[0].pageX);
        })
    }

    // 列表控制
    MusicPlayer.prototype.playList = function () {
        var This = this;
        // 获取菜单的控制的对象
        this.listControl = root.listControl(this.wrap, this.dataList);
        this.controlBtns[4].addEventListener("touchend", function () {
            This.listControl.sildUp(); // 点击出现菜单
        })
        this.listControl.musicDom.forEach(function (ele, index) {
            ele.addEventListener("touchend", function () {
                // 如果点击同样歌曲的则什么都不作
                if (This.indexObj.index === index) {
                    return;
                }
                console.log(index, This.indexObj.index);
                // 改变。active
                This.listControl.changeSelect(This.listControl.musicDom, index);
                
                // console.log(This.listControl.musicDom,index);

                // ele.className = "active";
                // // musicDom
                // var outher = This.listControl.musicDom.filter(function(ement){
                //     return ement !== ele;
                // })
                // console.log(outher);
                // outher.forEach(function(ele){
                //     ele.className = "";
                // })
                // 切歌 
                root.music.status = "play";
                This.loadMusic(This.dataList, index);
                // This.loadMusic(This.dataList,index);
                This.indexObj.index = index;
                // root.music.play();
            })
        })
        console.log(this.listControl);
    }

    // MusicPlayer.prototype = {
    //     init(){
    //         this.getData(this.src);
    //     },
    //     getData(url){
    //         var This = this;
    //         $.ajax({
    //             url : url,
    //             method : "get",
    //             success : function(data){
    //                 This.dataList = data;
    //             },
    //             error : function(){
    //                 console.log("请求失败")
    //             }
    //         })
    //     }
    // }


    var musicPlayer = new MusicPlayer(document.querySelector("#wrap"));
    musicPlayer.init();
    console.log(musicPlayer.wrap);


})(window.Zepto, window.player)