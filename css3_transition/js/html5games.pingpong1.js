var KEY = {
    UP: 38,
    DOWN: 40,
    W: 87,
    S: 83
}

$(function() {
 $(document).keydown(function(e) {
     console.log(e.which)
     switch(e.which) {
         case KEY.UP: //向上键
         // 获取球拍B的当前top值并转化为int类型
         var top = parseInt($("#paddleB").css("top"));
         // 球拍B向上移动5个像素
         $("#paddleB").css("top",top-5);
         console.log(top)
         break;
         case KEY.DOWN: 
         var top = parseInt($("#paddleB").css("top"));
         $("#paddleB").css("top",top + 5);
         break;
         case KEY.W:
         var top = parseInt($("#paddleA").css("top"));
         $("#paddleA").css("top",top - 5);
         break;
         case KEY.S:
         var top = parseInt($("#paddleA").css("top"))
         $("#paddleA").css("top", top + 5)
         break;
     }
 })
})