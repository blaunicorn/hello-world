$(function() {
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(200,200,100,.6)";
    console.log(ctx.fillStyle)
    ctx.beginPath();
    ctx.arc(100,100,50,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();

    ctx1 = canvas.getContext("2d");
    ctx1.fillStyle = "rgba(200,100,100,.4)";
    ctx1.beginPath();
    ctx1.arc(200,100,40,0,Math.PI,false);
    ctx1.closePath;
    ctx1.fill();

    ctx2 = canvas.getContext("2d");
    ctx2.fillStyle = "rgba(0,200,0,.5)";
    ctx2.beginPath();
    ctx2.arc(300,100,40,0,Math.PI, true);
    ctx2.closePath;
    ctx2.fill();
    ctx2.fillStyle = "rgba(0,200,200,.5)";
    ctx2.beginPath();
    ctx2.arc(400,100,40,Math.PI/2,Math.PI*3/2, true);
    ctx2.closePath;
    ctx2.fill();
    ctx2.fillStyle = "rgba(100,200,200,.5)";
    ctx2.beginPath();
    ctx2.arc(500,100,40,Math.PI/2,Math.PI*3/2 );

    ctx2.fill();
});