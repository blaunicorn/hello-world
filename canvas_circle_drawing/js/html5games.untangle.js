var untangleGame = {
    circles: [],
    thinLineThickness: 1,
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
        var x = Math.random()*width;
        var y =Math.random()*height;
        drawCircle(ctx, x, y, circleRadius);
        untangleGame.circles.push(new Circle(x,y,circleRadius));

    } 
    console.log(untangleGame.circles)

    for (var i = 0; i<untangleGame.circles.length; i++) {
        var startPoint = untangleGame.circles[i];
        for (var j = 0; j<i; j++) {
            var endPoint = untangleGame.circles[j];
            drawLine(ctx, startPoint.x, startPoint.y, endPoint.x, endPoint.y,1);
            untangleGame.lines.push(new Line(startPoint, endPoint, untangleGame.thinLineThickness));
        }
    }
    console.log(untangleGame.lines)
})
function clear(ctx) {
    ctx.clearRect(0,0,canvas.width,canvas.height)
}
