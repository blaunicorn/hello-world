var untangleGame = {
    circles: [],
    thinLineThickness: 1,
    boldLineThickness: 5,
    lines: [],
    currentLevel: 0
};
untangleGame.levels = [
    {
        "level": 0,
        "circles": [
            {"x":400, "y": 156}, {"x":381, "y": 241},{"x":84, "y":233},{"x": 88, "y":73}
        ],
        "relationship": {
            "0": {"connectedPoints": [1, 2]},
            "1": {"connectedPoints": [0, 3]},
            "2": {"connectedPoints": [0, 3]},
            "3": {"connectedPoints": [1, 2]}
        }
    },
    {
        "level": 1,
        "circles": [
            {"x":401, "y": 73}, {"x": 400, "y": 240}, {"x": 88, "y": 241}, {"x": 84, "y": 72}
        ],
        "relationship": {
            "0": {"connectedPoints": [1, 2, 3]},
            "1": {"connectedPoints": [0, 2, 3]},
            "2": {"connectedPoints": [0, 1, 3]},
            "3": {"connectedPoints": [0, 1, 2]}
        }
    },
    {
        "level": 2,
        "circles": [
            {"x": 92, "y": 85}, {"x":253, "y": 13}, {"x": 393, "y": 86},
            {"x":390, "y":214}, {"x":248, "y": 275}, {"x":95, "y": 216}
        ],
        "relationship": {
            "0": {"connectedPoints": [2, 3, 4]},
            "1": {"connectedPoints": [3,5]},
            "2": {"connectedPoints": [0, 4, 5]},
            "3": {"connectedPoints": [0, 1, 5]},
            "4": {"connectedPoints": [0, 2]},
            "5": {"connectedPoints": [1, 2, 3]}
        }
    }
]
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

  /*  因为要根据关卡数据来绘制圆而不再是随机绘制，所以隐藏这段随机代码  
    // 随机放5个圆点
    var circlesCount = 5;
    for (var i = 0; i < circlesCount; i++) {
        var x = Math.random()*(width-10); //确保圆点不超出图画区域
        var y =Math.random()*(height-10);
        drawCircle(ctx, x, y, circleRadius);
        untangleGame.circles.push(new Circle(x,y,circleRadius));

    } 
    */
    // 根据关卡数据设置圆的位置
    setupCurrentLevel();

    console.log(untangleGame.circles)
    connectCircles();
    console.log(untangleGame.lines)
    updateLineIntersection();
    console.log(untangleGame.lines)

    // 给Canvas添加鼠标事件监听器，检查按下鼠标的位置是否在任何一个小圆之上，并设置那个圆为拖曳目标小圆球
    $("#game").mousedown(function(e) {
        var canvasPosition = $(this).offset();
        var mouseX = (e.pageX - canvasPosition.left) || 0;
        var mouseY = (e.pageY - canvasPosition.top) || 0;
        console.log(mouseX)
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
            // console.log(untangleGame.circles[untangleGame.targetCircle])
        }
        connectCircles();
        updateLineIntersection();
        updateLevelProgress();
    });

    // 当鼠标放下时，清楚拖曳目标小圆球的数据
    $("#game").mouseup(function(e) {
        untangleGame.targetCircle = undefined;
        //每次放开鼠标，都检测是否过关
        checkLevelCompleteness();
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
    // 更新函数，根据关卡数据来连接圆
    // 根据圆的关卡数据设置所有连接线
    var level = untangleGame.levels[untangleGame.currentLevel];
    untangleGame.lines.length = 0;
    for (var i in level.relationship) {
        var connectedPoints = level.relationship[i].connectedPoints;
        var startPoint = untangleGame.circles[i];
        for (var j in connectedPoints) {
            var endPoint = untangleGame.circles[connectedPoints[j]];
            untangleGame.lines.push(new Line(startPoint, endPoint, untangleGame.thinLineThickness))
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
    } 
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

// 测试相交线，并把这些线加粗
function updateLineIntersection() {
    //检测相交的线 ，并加粗这些线
    for (var i = 0; i < untangleGame.lines.length; i++) {
        for (var j = 0; j < i; j++) {
            var line1 = untangleGame.lines[i];
            var line2 = untangleGame.lines[j];
            // 如果检测到如果两条线相交，将加粗该线
            if (isIntersect(line1, line2)) {
                line1.thickness = untangleGame.boldLineThickness;
                line2.thickness = untangleGame.boldLineThickness;
            }
        }
    }
}

// 设置初始关卡数据
function setupCurrentLevel() {
    untangleGame.circles = [];
    var level = untangleGame.levels[untangleGame.currentLevel];
    for (var i = 0; i < level.circles.length; i++) {
        untangleGame.circles.push(new Circle(level.circles[i].x, level.circles[i].y, 10));
    }

  // 设置圆之后再设置连接线数据
  connectCircles();
  updateLineIntersection();
}

//检测玩家是否已解决难题，如果已解决就跳到下一关
function checkLevelCompleteness() {
    if ($("#progress").html() == "100") {
        if (untangleGame.currentLevel + 1 <untangleGame.levels.length) 
        untangleGame.currentLevel++;
        alert("你已完成本关卡 ，请进入下一关。")
        setupCurrentLevel();
    }
}

//添加函数更新游戏进度
function updateLevelProgress() {
    //检测当前关卡的解题进度
    var progress = 0;
    for (var i = 0; i < untangleGame.lines.length; i++) {
        if (untangleGame.lines[i].thickness == untangleGame.thinLineThickness) {
            progress++
        }
    }
    var progressPercentage = Math.floor(progress / untangleGame.lines.length * 100);
    $("#progress").html(progressPercentage);

    //显示当前关卡
    $("#level").html(untangleGame.currentLevel);
}