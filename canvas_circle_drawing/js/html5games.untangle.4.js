$(function () {
 
    untangleGame.layers = new Array();
    var canvas_bg = document.getElementById("bg");
    untangleGame.layers[0] = canvas_bg.getContext("2d")
    
    var canvas_guide = document.getElementById("guide");
    untangleGame.layers[1] = canvas_guide.getContext("2d")
    
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d")
    untangleGame.layers[2] = ctx;
    
    var canvas_ui = document.getElementById("ui");
    untangleGame.layers[3] = canvas_ui.getContext("2d");



    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    var circlRadius = 10;
    var width = canvas.width;
    var height = canvas.height;
    var bg_gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
    bg_gradient.addColorStop(0, "#cccccc");
    bg_gradient.addColorStop(1, "#efefef");
    ctx.fillStyle = bg_gradient;
    ctx.fillRect(0, 0, ctx.canvas.widht, ctx.canvas.height);
    ctx.font = "34px 'Rock Salt'";
    ctx.textAlign = "center";
    ctx.fillStyle = "#333333";
    ctx.fillText("loading...", ctx.canvas.width / 2, canvas.height / 2)


    untangleGame.guide = new Image();
    untangleGame.guide.onload = function () {
        untangleGame.guideReady = true;

        untangleGame.guideFrame = 0;
        setInterval(guideNextFrame, 500)
    }
    untangleGame.guide.src = "images/guide_sprite.png"
    // var circlesCount = 5;
    // for (var i = 0; i < circlesCount; i++) {
    //     var x = Math.random() * width;
    //     var y = Math.random() * height;
    //     drawCircle(ctx, x, y, circlRadius)
    //     untangleGame.circles.push(new Circle(x, y, circlRadius))
    setupCurrentLevel();
    // }
    // 抽取出来作为一个函数
    // for (var i=0; i< untangleGame.circles.length;i++) {
    //     var startPoint=untangleGame.circles[i];
    //     for (var j=0;j<i;j++) {
    //         var endpoint = untangleGame.circles[j];
    //         drawLine(ctx,startPoint.x,startPoint.y,endpoint.x,endpoint.y,untangleGame.thinLineThickness);
    //         untangleGame.lines.push(new Line(startPoint,endpoint,untangleGame.thinLineThickness))
    //     }    
    // }
    connectCircles();
    updateLineIntersection()
    console.log(untangleGame)
    set("1", untangleGame)
    get("1", "1")

    $("#layers").mousedown(function (e) {
        // $("#game").mousedown(function (e) {
        var canvasPosition = $(this).offset();
        var mouseX = (e.pageX - canvasPosition.left) || 0;
        var mouseY = (e.pageY - canvasPosition.top) || 0;

        console.log(e.pageX)
        console.log(canvasPosition.left)
        var sss = e.pageX - canvasPosition.left
        console.log(sss)
        console.log(mouseX)
        for (var i = 0; i < untangleGame.circles.length; i++) {
            var circleX = untangleGame.circles[i].x;
            var circleY = untangleGame.circles[i].y;
            var radius = untangleGame.circles[i].radius;
            if (Math.pow(mouseX - circleX, 2) + Math.pow(mouseY - circleY, 2) < Math.pow(radius, 2)) {
                untangleGame.targetCircle = i;
                console.log(untangleGame.targetCircle)
                break
            }
        }

    });

    $("#layers").mousemove(function (e) {
        // $("#game").mousemove(function (e) {
        if (untangleGame.targetCircle != undefined) {
            var canvasPosition = $(this).offset();
            var mouseX = (e.pageX - canvasPosition.left) || 0;
            var mouseY = (e.pageY - canvasPosition.top) || 0;
            var radius = untangleGame.circles[untangleGame.targetCircle].radius;
            untangleGame.circles[untangleGame.targetCircle] = new Circle(mouseX, mouseY, radius)
        }
        connectCircles()
        updateLineIntersection()
        updateLevelProgress()
    })

    $("#layers").mouseup(function (e) {
        // $("#game").mouseup(function (e) {
        untangleGame.targetCircle = undefined
        checkLevelCompleteness();
    })

    untangleGame.background = new Image();
    untangleGame.background.onload = function () {
        drawLayerBG()
        setInterval(gameloop, 30)
    }
    untangleGame.background.onerror = function () {
        console.log("Error loading the image")
    }
    untangleGame.background.src = "images/timg.jpg"

    // setInterval(gameloop, 30)
})

function drawLayerBG() {
    var ctx = untangleGame.layers[0];
    clear(ctx);
    ctx.drawImage(untangleGame.background, 0, 0)
}

var untangleGame = {
    circles: [],
    thinLineThickness: 1,
    boldLineThickness: 5,
    lines: [],
    currentLevel: 0,
    // targetCircle,
    progressPercentage: 0,

}



untangleGame.levels = [
    {
        "level": 0,
        "circles": [
            { "x": 400, "y": 156 }, { "x": 381, "y": 241 }, { "x": 84, "y": 233 }, { "x": 88, "y": 73 }
        ],
        "relationship": {
            "0": { "connectedPoints": [1, 2] },
            "1": { "connectedPoints": [0, 3] },
            "2": { "connectedPoints": [0, 3] },
            "3": { "connectedPoints": [1, 2] }
        }
    },
    {
        "level": 1,
        "circles": [
            { "x": 401, "y": 73 }, { "x": 400, "y": 240 }, { "x": 88, "y": 241 }, { "x": 84, "y": 72 }
        ],
        "relationship": {
            "0": { "connectedPoints": [1, 2, 3] },
            "1": { "connectedPoints": [0, 2, 3] },
            "2": { "connectedPoints": [0, 1, 3] },
            "3": { "connectedPoints": [0, 1, 2] }
        }
    },
    {
        "level": 2,
        "circles": [
            { "x": 92, "y": 85 }, { "x": 253, "y": 13 }, { "x": 393, "y": 86 },
            { "x": 390, "y": 214 }, { "x": 248, "y": 275 }, { "x": 95, "y": 216 }
        ],
        "relationship": {
            "0": { "connectedPoints": [2, 3, 4] },
            "1": { "connectedPoints": [3, 5] },
            "2": { "connectedPoints": [0, 4, 5] },
            "3": { "connectedPoints": [0, 1, 5] },
            "4": { "connectedPoints": [0, 2] },
            "5": { "connectedPoints": [1, 2, 3] }
        }
    }
]

function guideNextFrame() {
    untangleGame.guideFrame++
    if (untangleGame.guideFrame > 9) {
        untangleGame.guideFrame = 0
    }
}

function drawLayerGuide() {
    var ctx = untangleGame.layers[1];
    clear(ctx);

    if (untangleGame.guideReady) {
        var nextFrameX = untangleGame.guideFrame * 80;
        ctx.drawImage(untangleGame.guide, nextFrameX, 0, 80, 130, 325, 130, 80, 130);

    }

    if (untangleGame.currentLevel === 1) {
        $("#gudie").addClass('fadeout')
    }
}

function drawLayerGame() {
    var ctx = untangleGame.layers[2];
    clear(ctx);

    // ctx.font = "40px Arial";
    // ctx.fillStyle = "red";
    // ctx.fillText("Hello World", 10, 50);
    // // var grd=ctx.createLinearGradient(0,0,170,0);
    // // grd.addColorStop(0,"black");
    // // grd.addColorStop(1,"white");

    // // ctx.fillStyle=grd;
    // // ctx.fillRect(20,20,150,100);

    // // ctx.font = "26px Arial";
    // // ctx.textAlign = "center";
    // // ctx.fillStyle  = "#ffffff";
    // // ctx.fillText = ("Untangle Game", ctx.canvas.width/2,50);

    // clear(ctx);

    // ctx.drawImage(untangleGame.background, 0, 0)

    for (var i = 0; i < untangleGame.lines.length; i++) {
        var line = untangleGame.lines[i];
        var startPoint = line.startPoint;
        var endPoint = line.endPoint;
        var thickness = line.thickness;
        drawLine(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y, thickness)
    }

    for (var i = 0; i < untangleGame.circles.length; i++) {
        var circle = untangleGame.circles[i];
        drawCircle(ctx, circle.x, circle.y, circle.radius)
    }
    // ctx.font = "40px Arial";
    // ctx.fillStyle = "red";
    // ctx.textAlign = "center";
    // ctx.fillText("Untangle Game", ctx.canvas.width / 2, 50);
    // ctx.textAlign = "left";
    // ctx.textBaseline = "bottom";
    // ctx.fillText(`Puzzle ${untangleGame.currentLevel} , Completeness: ${untangleGame.progressPercentage} %`, 20, ctx.canvas.height - 5)

    // if (untangleGame.currentLevel == 0 && untangleGame.guideReady) {
    //     var nextFrameX = untangleGame.guideFrame * 50;
    //     ctx.drawImage(untangleGame.guide, nextFrameX, 0, 50, 72, 325, 7, 50, 72)
    // }
    // var grd=ctx.createLinearGradient(0,0,170,0);
    // grd.addColorStop(0,"black");
    // grd.addColorStop(1,"white");

    // ctx.fillStyle=grd;
    // ctx.fillRect(20,20,150,100);

    // ctx.font = "26px Arial";
    // ctx.textAlign = "center";
    // ctx.fillStyle  = "#ffffff";
    // ctx.fillText = ("Untangle Game", ctx.canvas.width/2,50);
}

function drawLayerUI() {
    var ctx = untangleGame.layers[3];
    clear(ctx);

    ctx.font = "26px , Rock Salt"
    ctx.fillStyle = "#dddddd";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(`Puzzle ${untangleGame.currentLevel} , Completeness: `, 60, ctx.canvas.height - 80);
    ctx.fillText(`${untangleGame.progressPercentage} %`, 450,ctx.canvas.height-80)
    var isOverlappedWithCircle = false;
    for (var i in untangleGame.circles) {
        var point = untangleGame.circles[i];
        if (point.y > 310) {
            isOverlappedWithCircle = true;
        }
    }
    if (isOverlappedWithCircle) {
        $("#ui").addClass('dim')
    } else {
        $("#ui").removeClass('dim')
    }

}

function gameloop() {
    drawLayerGuide();
    drawLayerGame();
    drawLayerUI()


}

function set(key, val) {
    var curTime = new Date().getTime();
    localStorage.setItem(key, JSON.stringify({ data: val, time: curTime }))
}
function get(key, exp) {
    var data = localStorage.getItem(key);
    var dataObj = JSON.parse(data);
    if (new Date().getTime() - dataObj.time > exp) {
        console.log("已过期")
    } else {
        console.log(exp + ":" + data)
        console.log(new Date().getTime() - dataObj.time)
        console.log("data=", dataObj.data)
    }
}
function drawCircle(ctx, x, y, radius) {

    var circle_gradient = ctx.createRadialGradient(x - 3, y - 3, 10, x, y, radius);
    circle_gradient.addColorStop(0, "#fff");
    circle_gradient.addColorStop(1, "#cc0");
    ctx.fillStyle = circle_gradient;

    // ctx.fillStyle = "rgba(200,200,100,.9)";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill()
}

function Circle(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
}

function Line(startPoint, endPoint, thickness) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.thickness = thickness;
}

function drawLine(ctx, x1, y1, x2, y2, thickness) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = "#cfc";
    ctx.stroke();
}


function clear(ctx) {
    // var canvas = document.getElementById("game");
    // ctx.clearRect(0, 0, 500, 400);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function connectCircles() {
    var level = untangleGame.levels[untangleGame.currentLevel]
    untangleGame.lines.length = 0;
    for (var i in level.relationship) {
        var connectedPoints = level.relationship[i].connectedPoints;
        var startPoint = untangleGame.circles[i];
        for (var j in connectedPoints) {
            var endPoint = untangleGame.circles[connectedPoints[j]];
            untangleGame.lines.push(new Line(startPoint, endPoint, untangleGame.thinLineThickness));
        }
    }
}

function isIntersect(line1, line2) {
    var a1 = line1.endPoint.y - line1.startPoint.y;
    var b1 = line1.startPoint.x - line1.endPoint.x;
    var c1 = a1 * line1.startPoint.x + b1 * line1.startPoint.y;

    var a2 = line2.endPoint.y - line2.startPoint.y;
    var b2 = line2.startPoint.x - line2.endPoint.x;
    var c2 = a2 * line2.startPoint.x + b2 * line2.startPoint.y;

    var d = a1 * b2 - a2 * b1;

    if (d == 0) {
        return false;
    } else {
        var x = (b2 * c1 - b1 * c2) / d
        var y = (a1 * c2 - a2 * c1) / d;


        if ((isInBetween(line1.startPoint.x, x, line1.endPoint.x) ||
            isInBetween(line1.startPoint.y, y, line1.endPoint.y)) &&
            (isInBetween(line2.startPoint.x, x, line2.endPoint.x) ||
                isInBetween(line2.startPoint.y, y, line2.endPoint.y))
        ) {
            return true;
        }
    }
    return false;
}

function isInBetween(a, b, c) {
    if (Math.abs(a - b) < 0.000001 || Math.abs(b - c) < 0.000001) {
        console.log()
        return false;
    }
    return (a < b && b < c) || ((c < b) && (b < a))
}

function updateLineIntersection() {
    for (var i = 0; i < untangleGame.lines.length; i++) {
        for (var j = 0; j < i; j++) {
            var line1 = untangleGame.lines[i];
            var line2 = untangleGame.lines[j]

            if (isIntersect(line1, line2)) {
                console.log(i + "和" + j + "相交")
                line1.thickness = untangleGame.boldLineThickness;
                line2.thickness = untangleGame.boldLineThickness;
            }
        }
    }
}

function setupCurrentLevel() {
    untangleGame.circles = [];
    var level = untangleGame.levels[untangleGame.currentLevel];
    for (var i = 0; i < level.circles.length; i++) {
        untangleGame.circles.push(new Circle(level.circles[i].x, level.circles[i].y, 10))
    }
    connectCircles();
    updateLineIntersection();
}

function checkLevelCompleteness() {
    if ($("#progress").html() === "100") {
        if (untangleGame.currentLevel + 1 < untangleGame.levels.length) {
            untangleGame.currentLevel++;
            setupCurrentLevel()
        }
    }

}

function updateLevelProgress() {
    var progress = 0;
    for (var i = 0; i < untangleGame.lines.length; i++) {
        if (untangleGame.lines[i].thickness === untangleGame.thinLineThickness) {
            progress++
        }
    }
    untangleGame.progressPercentage = Math.floor(progress / untangleGame.lines.length * 100);
    // var progressPercentage = Math.floor(progress/untangleGame.lines.length * 100);

    $("#progress").html(untangleGame.progressPercentage)
    // if ($("#progress").html() === "100") {
    //     alert("恭喜您过关！")
    // }
    $("#level").html(untangleGame.currentLevel)
}