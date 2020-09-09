// 处理进度条的时间格式和样式

(function (root) {
    // 渲染结束时间处理
    function renderProgress(data) {
        var duration = data.duration || 0;
        totalTime = document.querySelector(".progress .totalTime");
        var minute = parseInt(duration / 60); // 分钟
        second = duration - (minute * 60);
        var time = timeFormat(minute,second);
        totalTime.innerText = time;
    }
    // 更改时间的 改为 00 ：00 的格式
    function timeFormat(minute, second) {
        var minuteStr = "";
        secondStr = "";
        if (minute < 10) {
            minuteStr = "0" + minute;
        } else {
            minuteStr = minute;
        }
        if (second < 10) {
            secondStr = "0" + second;
        } else {
            secondStr = second;
        }
        return minuteStr + ":" + secondStr;
    }
    root.renderProgress = renderProgress;
    root.timeFormat = timeFormat;
}(window.player))