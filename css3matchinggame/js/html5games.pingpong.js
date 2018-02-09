var KEY = {
    UP: 38,
    DOWN: 40,
    W: 87,
    S: 83
};
var pingpong = {
    scoreA: 0,
    scoreB: 0
}
pingpong.pressedKeys = [];
pingpong.ball = {
    speed: 5,
    x: 150,
    y: 100,
    directionX: 1,
    directionY: 1
};
// 定义moveBall 函数
function moveBall() {
   // 引用需要用的变量
   var playgroundHeight = parseInt($("#playground").height());
   var playgroundWidth = parseInt($("#playground").css("width"));
   var ball = pingpong.ball;
   // console.log(playgroundHeight)
   // console.log(playgroundWidth)
   // console.log(ball.y + ball.speed * ball.directionY)
   // 检测球台的边缘
   // 检测底边
   if ((ball.y + ball.speed * ball.directionY) > playgroundHeight) {
       ball.directionY = -1;
   }
   // 检测顶边
   if ((ball.y + ball.speed * ball.directionY )< 0) {
       ball.directionY = 1;
   }

   // 检测you边 
   if ((ball.x + ball.speed * ball.directionX) > playgroundWidth) {
       // alert("playerB lost!")
       ball.x = 150;
       ball.y = 100;
       $("#ball").css({
           "left": ball.x,
           "top": ball.y
       })
       ball.directionX = -1;
       pingpong.scoreA++;
       $("#scoreA").html(pingpong.scoreA)
   }

   // 检测ZUO边 
    if ((ball.x + ball.speed * ball.directionX) < 0) {
       // 玩家A丢分 重置乒乓球
       // alert("playerA lost!")
       ball.x = 150;
       ball.y = 100;
       $("#ball").css({
           "left": ball.x,
           "top": ball.y
       });
       ball.directionX = 1;
       pingpong.scoreB++;
       $("#scoreB").html(pingpong.scoreB)
   }
   ball.x += ball.speed * ball.directionX;
   ball.y += ball.speed * ball.directionY;
    
   // 检测球拍位置
   // 检测左边球拍
   var paddleAX = parseInt($("#paddleA").css("left")) + parseInt($("#paddleA").css("width"));
   var paddleAYBottom = parseInt($("#paddleA").css("top")) + parseInt($("#paddleA").css("height"));
   var paddleAYTop = parseInt($("#paddleA").css("top"));
   if (ball.x + ball.speed * ball.directionX < paddleAX) {
     if (ball.y + ball.speed * ball.directionY <= paddleAYBottom && 
     ball.y + ball.speed * ball.directionY >= paddleAYTop) {
         ball.directionX = 1;
     }
   }
   // 检测右边球拍
   var paddleBX = parseInt($("#paddleB").css("left"));
   var paddleBYBottom = parseInt($("#paddleB").css("top")) + parseInt($("#paddleB").css("height"));
   var paddleBYTop = parseInt($("#paddleB").css("top"));
   if (ball.x + ball.speed * ball.directionX >= paddleBX) {
       if (ball.y + ball.speed * ball.directionY <= paddleBYBottom && 
       ball.y + ball.speed * ball.directionY >= paddleBYTop) {
           ball.directionX = -1;
       }
   }

   // 根据速度与方向移动乒乓球
   $("#ball").css({
       "left": ball.x,
       "top": ball.y
   });
}


$(function() {
    // 设置interval 用于每30毫秒调用一次gameloop
    pingpong.timer = setInterval(gameloop, 30);
    
    // 标记下pressedKeys 数组里莫键的状态是按下还是放开
    $(document).keydown(function(e) {
        pingpong.pressedKeys[e.which] = true;
    });
    $(document).keyup(function(e) {
        pingpong.pressedKeys[e.which] = false;
    });
 });

 
     // 设置定时器不断调用移动球拍的函数
     function gameloop() {
        movePaddles();
        moveBall();
    }

    function movePaddles() {
        // 使用自动以定时器不断检测是否有按键被按下
        if (pingpong.pressedKeys[KEY.UP]) {
            //向上键
         // 获取球拍B的当前top值并转化为int类型
         var top = parseInt($("#paddleB").css("top"));
         // 球拍B向上移动5个像素
         $("#paddleB").css("top",top-5);
         console.log(top);
        }
        
        if (pingpong.pressedKeys[KEY.DOWN]) { 
         var top = parseInt($("#paddleB").css("top"));
         $("#paddleB").css("top",top + 5);
         }

        if (pingpong.pressedKeys[KEY.W]) {
         var top = parseInt($("#paddleA").css("top"));
         $("#paddleA").css("top",top - 5);
        }

        if (pingpong.pressedKeys[KEY.S]) {
         var top = parseInt($("#paddleA").css("top"))
         $("#paddleA").css("top", top + 5)
        }
     }
     // 定义一个保存乒乓球状态的全局变量
