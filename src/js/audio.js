(function (root) {
    function AudioMusic() {
        this.audio = new Audio();
        this.status = "pause";
    }
    AudioMusic.prototype = {
        // 载入音乐
        load : function (src) {
            this.audio.src = src;
            this.audio.load();
        },
        // 播放音乐
        play : function () {
            this.audio.play();
            this.status = "play";
        },
        // 暂停
        pause: function () {
            this.audio.pause();
            this.status = "pause";
        },
        // 从什么位置开始播放
        playTo : function (time) {
            this.audio.currentTime = time;
        },
        // 当前播放时间
        curTime : function(){
            return this.audio.currentTime;
        },
        // 当前载入的音乐的时长
        duration : function(){
            return this.audio.duration;
        }
    }
    root.music = new AudioMusic();

})(window.player || (window.player = {}))