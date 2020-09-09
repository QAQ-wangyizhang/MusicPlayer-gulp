// 列表创建
(function (root) {
    function listControl(wrap, data) {
        var list = document.createElement("div");
        dl = document.createElement("dl");
        palyList = document.createElement("dt");
        close = document.createElement("div");
        musicDom = []; // 保存列表的dom元素

        list.className = "list";
        palyList.innerText = "播放列表";
        close.innerText = "关闭";
        close.className = "close";
        dl.appendChild(palyList);
        // for (var i = 0; i < data.length; i++) {
        //     var dd = document.createElement("dd");
        //     dd.innerText = data[i].name;
        //     musicDom.push(dd);
        //     dl.appendChild(dd);
        // }
        data.forEach(function (ele) {
            var dd = document.createElement("dd");
            dd.innerText = ele.name;
            musicDom.push(dd); 
            dl.appendChild(dd);
        });


        list.appendChild(dl);
        list.appendChild(close);
        wrap.appendChild(list);
        // list.offsetHeight;
        close.addEventListener("touchend", function () {
            sildDown(); // 列表关闭事件
        })
        list.style.transform = "translateY(" + list.offsetHeight +"px)";
        // 列表出现
        function sildUp(){
            list.style.transform = "translateY(0px)";
            // list.style.transform
        }
        // 列表关闭
        function sildDown(){
            list.style.transform = "translateY(" + list.offsetHeight +"px)";
            // dom.
        }
        /**
         * 
         * @param {elements} doms 一组dom元素
         * @param {int} index 选择其中一个添加active类名其余全部为空
         */
        function changeSelect(doms,index){
            doms.forEach(function(ele){
                ele.className = "";
            })
            doms[index].className = "active";
        }

        // 返回一个对象
        return {
            musicDom: musicDom,
            sildUp : sildUp,
            sildDown: sildDown,
            changeSelect : changeSelect
        }
    }

    root.listControl = listControl;
})(window.player || (window.player = {}))