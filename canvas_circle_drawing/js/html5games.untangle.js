var untangleGame = {
    circles: [],
    thinLineThickness: 1,
    boldLineThickness: 5,
    lines: []
};
function drawCircle(ctx, x, y, radius) {
    ctx.fillStyle = "rgba(200,100,100,.6)";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, true)
    ctx.closePath;
    ctx.fill();
}
function Circle(x,y,radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}
function Line(startPoint, endPoint, thickness) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.thickness = thickness;
}

function drawLine(ctx,x1,y1,x2,y2,thickness) {
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = "#cfc";
    ctx.stroke();
}

$(function() {
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    var circleRadius = 10;
    var width = canvas.width;
    var height = canvas.height;

    // 随机放5个圆点
    var circlesCount = 5;
    for (var i = 0; i < circlesCount; i++) {
        var x = Math.random()*(width-10); //确保圆点不超出图画区域
        var y =Math.random()*(height-10);
        drawCircle(ctx, x, y, circleRadius);
        untangleGame.circles.push(new Circle(x,y,circleRadius));

    } 
    console.log(untangleGame.circles)
    connectCircles();

    // 给Canvas添加鼠标事件监听器，检查按下鼠标的位置是否在任何一个小圆之上，并设置那个圆为拖曳目标小圆球
    $("#game").mousedown(function(e) {
        var canvasPosition = $(this).offset();
        var mouseX = (e.pageX - canvasPosition.left) || 0;
        var mouseY = (e.pageY - canvasPosition.top) || 0;

        for (var i = 0; i < untangleGame.circles.length; i++) {
            var circleX = untangleGame.circles[i].x;
            var circleY = untangleGame.circles[i].y;
            var radius = untangleGame.circles[i].radius;
            if (Math.pow(mouseX - circleX, 2) + Math.pow(mouseY - circleY, 2) < Math.pow(radius, 2))
            {
                untangleGame.targetCircle = i;
                break;
            }
        }
    });

    // 当鼠标移动时，移动拖曳目标小圆球
    $("#game").mousemove(function(e) {
        if (untangleGame.targetCircle != undefined) {
            var canvasPosition = $(this).offset(); 
            var mouseX = (e.pageX -canvasPosition.left) || 0;
            var mouseY = (e.pageY - canvasPosition.top) || 0;
            var radius = untangleGame.circles[untangleGame.targetCircle].radius;
            untangleGame.circles[untangleGame.targetCircle] = new Circle(mouseX, mouseY, radius);
        }
        connectCircles();
    });

    // 当鼠标放下时，清楚拖曳目标小圆球的数据
    $("#game").mouseup(function(e) {
        untangleGame.targetCircle = undefined;
    });

    // 设置游戏主循环的循环间隔
    setInterval(gameloop, 30);
})

// 创建清除所有绘画的函数
function clear(ctx) {
    var canvas = document.getElementById("game");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 添加为每个圆分配连接线的函数。这些线将在稍后进行绘制。
function connectCircles() {
    // 将每个圆用线相互连接
    untangleGame.lines.length = 0;
    for (var i = 0; i < untangleGame.circles.length; i++) {
        var startPoint = untangleGame.circles[i];
        for (var j = 0; j < i; j++) {
            var endPoint = untangleGame.circles[j];
            untangleGame.lines.push(new Line(startPoint, endPoint, untangleGame.thinLineThinckness));
        }
    }
}
//添加用于绘制线条和圆的更新
function gameloop() {
    // 获取Canvas元素的引用和绘图上下文
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");

    //重绘钱清空canvas
     clear(ctx);

     // 绘制所有保存的线
     for (var i = 0; i< untangleGame.lines.length; i++) {
         var line = untangleGame.lines[i];
         var startPoint = line.startPoint;
         var endPoint = line.endPoint;
         var thickness = line.thickness;
         drawLine(ctx, startPoint.x, startPoint.y,endPoint.x, endPoint.y, thickness);
     }

     //绘制所有保存的圆
     for (var i = 0; i < untangleGame.circles.length; i++) {
         var circle = untangleGame.circles[i];
         drawCircle(ctx, circle.x, circle.y, circle.radius);
     }
}

// 检测给定的两条线是否相交
function isIntersect(line1, line2) {
    //转换line1 成一般式：Ax + By = C
    var a1 = line1.endPoint.y - line1.startPoint.y;
    var b1 = line1.startPoint.x - line1.endPoint.x;
    var c1 = a1 * line1.startPoint.x + b1 * line1.startPoint.y;

    //转换line2 成一般式： Ax + By = C
    var a2 = line2.endPoint.y - line2.startPoint.y;
    var b2 = line2.startPoint.x - line2.endPoint.x;
    var c2 = a2 * line2.startPoint.x + b2 * line2.startPoint.y;

    // 计算交点
    var d = a1 * b2 - a2 * b1;

    // 当d等于0时，两线平行
    if (d == 0) {
        return false;
    } else {
        var x = (b2 * c1 - b1 * c2) / d;
        var y = (a1 * c2 - a2 * c1) / d;
    
    
    // 检测截点是否在两条线段之上
    if ((isInBetween(line1.startPoint.x, x, line1.endPoint.x) || isInBetween(line1.startPoint.y, y, line1.endPoint.y)) &&
    (isInBetween(line2.startPoint.x, x, line2.endPoint.x) || isInBetween(line2.startPoint.y, y, line2.endPoint.y))) {
        return true;
    } 
    } return false;
}

// 如果b在a与c之间返回true
// 如果a==b或者b==c时 排除结果，返回false
function isInBetween(a, b, c) {
    // 如果b几乎等于a或c，返回false
    // 为了避免在浮点运算时两值几乎相等，但存在相差0.0000000.。。。00001的这种情况出现
    // 使用下面的方式进行避免
    if (Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.00001) {
        return false;
    }

    // 如果b在a与c之间返回true
    return (a < b && b < c) || (c < b && b < a ) 
}