var websocketGame = {}

// 当dom加载完成后进行初始化
$(function() {
    //首先检测浏览器是否支持webSocket
    if (window.WebSocket) {
        // 创建连接
        websocketGame.socket = new WebSocket("ws://localhost:8000/");

        // 处理open事件
        websocketGame.socket.onopen = function(e) {
            console.log('WebScoket connection established.');
        };

        // 处理message事件
        websocketGame.socket.onmessage = function(e) {
            console.log(e.data);
        };

        // 处理close事件
        websocketGame.socket.onclose = function(e) {
            console.log('webSocket connection closed.')
        }
    }
})