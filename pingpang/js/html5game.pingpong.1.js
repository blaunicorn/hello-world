$(function() {
    var KEY = {
        UP: 38,
        DOWN: 40,
        W: 87,
        S: 83,
    }
    // alert("welcome to the Ping Pong battle.")
    // $("#paddleB").css({"top": "100px","left":"200px"})
    // 监听按键事件
    addEventListener('keydown', function(e){ 
    // $(document).keydown(function(e) {
        console.log(e.which)
        switch(e.which) {
            case KEY.UP:
                var top = parseInt($("#paddleB").css("top"))
                $("#paddleB").css("top",top-5);
                break;
            case KEY.DOWN: 
                var top = parseInt($("#paddleB").css("top"))
                $("#paddleB").css("top",top+5);
                break;
            case KEY.W:
                var top = parseInt($("#paddleA").css("top"))
                $("#paddleA").css("top",top-5);
                break;
            
            case KEY.S: 
                var top = parseInt($("#paddleA").css("top"))
                $("#paddleA").css("top",top+5)
                break;
        }
    }, false)
})