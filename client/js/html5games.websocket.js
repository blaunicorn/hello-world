var websocketGame = {

}
// 当DOM加载完成后进行初始化
$(function () {
    // 检测浏览器是否支持webSocket
    if (window.WebSocket) {
        //建立连接  
        console.log('该浏览器支持')
        websocketGame.socket = new WebSocket('ws://localhost:8001/');

        //开启连接  处理open事件
        websocketGame.socket.onopen = function () {
            console.log('webSocket open');
            document.getElementById('recv').innerHTML = 'Connected';
        };

        //关闭连接  
        websocketGame.socket.onclose = function () {
            console.log('webSocket close');
        };

        //拿到返回  
        websocketGame.socket.onmessage = function (e) {
            console.log(e.data);
            document.getElementById('recv').innerHTML = e.data;
        };

        //发送信息  
        document.getElementById('sendBtn').onclick = function () {
            var text = document.getElementById('sendTxt').value;
            websocketGame.socket.send(text);
        };
    }

})

$("#send").click(sendMessage);

$("#chat-input").keypress(function(event) {
    if (event.keyCode == '13') {
        sendMessage()
    }
})

function sendMessage() {
    var message = $("#chat-input").val();
    websocketGame.socket.send(message);
    $("#chat-input").val("")
}
