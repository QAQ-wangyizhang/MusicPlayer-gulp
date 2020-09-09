// 边界处理索引值处理

(function(root){
    function CurIndex(len){
        this.index = 0;
        this.len = len;
    }
    CurIndex.prototype = {
        // 上一个索引
        prev: function(){
            return this.get(-1);
        },
        // 下一个索引
        next: function(){
            return this.get(1);
        },
        get : function(val){
            this.index = (this.index + val + this.len) % this.len;
            // 范围为 0 - len
            return this.index;
        }
    }

    root.CurIndex = CurIndex;
})(window.player || (window.player={}))