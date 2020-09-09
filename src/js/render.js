// 渲染图片 音乐信息 是否喜欢该音乐
(function(root){
    // 渲染图片
    function renderImg(src){
        var img = document.querySelector(".songImg img");
        root.blurImg(src);
        img.src = src;
        
    }
    // 渲染信息
    function renderInfo(data){
        var name = document.querySelector(".songInfo .name");
        var singer = document.querySelector(".songInfo .singer");
        var album = document.querySelector(".songInfo .album");
        name.innerText = data.name;
        singer.innerText = data.singer;
        album.innerText = data.album;
    }
    // 渲染是否喜欢该音乐
    function renderIslike(key){
        var liking = document.querySelectorAll(".control li")[0];
        if(key){
            liking.classList.add("liking");
        }else{
            liking.className = "";
        }
    }
    root.render = function(data){
        renderImg(data.image);
        renderInfo(data);
        renderIslike(data.isLike);
    }
})(window.player || (window.player = {}))