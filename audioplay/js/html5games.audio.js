var audiogame = {

};

// 存储所有音符数据的数组
audiogame.musicNotes = [];
audiogame.leveldata = "1.592,3;1.984,2;2.466,1;2.949,2;4.022,3;4.523,1"
// dom准备完成时的初始化函数
audiogame.dots = [];
audiogame.startingTime = 0;
audiogame.dotImage = new Image();

// 存储点击数
audiogame.totalDotsCount = 0;
audiogame.totalSuccessCount = 0;

// 存储最近5个结果的成功计数
audiogame.successCount = 5;

// 创建一个变量切换记录模式和正常播放模式
audiogame.isRecordMode = true;

$(function () {

    audiogame.melody = document.getElementById("melody");
    audiogame.base = document.getElementById("base");

    // 加载音乐点图像
    audiogame.dotImage.src = "images/dot.png";


    audiogame.buttonActiveSound = document.getElementById("buttonactive");
    audiogame.buttonActiveSound.volume = 0.3;
    $("a[href='#game']").click(function () {
        audiogame.buttonActiveSound.currentTime = 0;
        audiogame.buttonActiveSound.play();
        $("#game-scene").addClass("show-scene");
        // document.getElementById("game-scene").style.top="0px"
        startGame();
        return false;

    })

    // 获取audio元素的引用
    // audiogame.buttonOverSound = document.getElementById("buttonover");
    // audiogame.buttonOverSound.volume = 0.3;
    // audiogame.buttonActiveSound = document.getElementById("buttonactive");
    // audiogame.buttonActiveSound.volume = 0.3;

    // // 监听链接为#game的按钮事件
    // $("a[href='#game']")
    // .hover(function() {
    //     var audio = $("#buttonover")
    //     var au = audio[0]
    //     au.currentTime = 0;
    //     au.play();
    //     return false;
    //  } , function() {
    //    audiogame.buttonActiveSound.pause();
    // }     ) 
    // .click(function() {
    //     audiogame.buttonActiveSound.currentTime = 0;
    //     audiogame.buttonActiveSound.play();

    //     return false;
    // })
    drawBackground()
    if (!audiogame.isRecordMode) {
        setupLevelData();
        setInterval(gameloop, 30);
    }
    // document.addEventListener('click', startGame);
    // startGame();

    // 按键事件
    $(document).keydown(function (e) {
        var line = e.which - 73;
        $("#hit-line-" + line).removeClass('hide');
        $("#hit-line-" + line).removeClass("show");


        if (audiogame.isRecordMode) {
            // 当按下“；”（186）时，输出存储的音符数据
            if (e.which == 186) {
                var musicNotesString = "";
                for (var i in audiogame.musicNotes) {
                    musicNotesString += audiogame.musicNotes[i].time + "," + audiogame.musicNotes[i].line + ";";
                }
                console.log(musicNotesString);
            }
            var currentTime = parseInt(audiogame.melody.currentTime * 1000) / 1000
            var note = new MusicNote(currentTime, e.which - 73);
            audiogame.musicNotes.push(note)
        } else {
            // 我们的目标是J（74）、K（75）、L（76)三个键
            var hitLine = e.which - 73;
            //检测是否击中了一个音符点
            for (var i in audiogame.dots) {
                if (hitLine = audiogame.dots[i].line && Math.abs(audiogame.dots[i].distance) < 20) {
                    // 从dots数组中移除已击中的音乐点
                    audiogame.dots.splice(i, 1)

                    // 递增成功计数
                    audiogame.successCount++;

                    // 保持成功计数最大值为5
                    audiogame.successCount = Math.min(5, audiogame.successCount);

                    // 递增总成功计数
                    audiogame.totalSuccessCount++;
                }
            }
            console.log(e.which)
        }
    });

    // 音播放完后处理audio事件
    $(audiogame.melody).bind("ended", onMelodyEnded)


})

function startGame() {
    // 开始游戏
    console.log("开始游戏")
    var date = new Date();
    audiogame.startingTime = date.getTime();
    setTimeout(playMusic, 3550);
}

function playMusic() {
    // 同时播放旋律和节奏
    console.log(audiogame.melody)
    audiogame.melody.play();
    audiogame.base.play();
}

function gameloop() {
    var game = document.getElementById("game-canvas");
    var ctx = game.getContext("2d");

    // 显示新的音乐点
    // 判断游戏是否开始
    if (audiogame.startingTime != 0) {
        for (var i in audiogame.musicNotes) {
            // 获取从旋律开始时间与当前时间之间所流逝的时间
            var date = new Date();
            var elapsedTime = (date.getTime() - audiogame.startingTime) / 1000;
            var note = audiogame.musicNotes[i]

            // 检测音乐点出现的时间是否与流逝时间一样
            var timeDiff = note.time - elapsedTime;
            if (timeDiff >= 0 && timeDiff <= .3) {
                // 当出现时间处于两帧的流逝时间之间时，就创建一个音乐点
                var dot = new Dot(game.height - 150, note.line);
                audiogame.dots.push(dot)
            }
        }
    }
    // 移动音乐点
    for (var i in audiogame.dots) {
        audiogame.dots[i].distance -= 2.5;
    }

    // 只清除脏区域（发生更新的区域），也就是中间区域
    ctx.clearRect(game.width / 2 - 200, 0, 400, game.height);

    // 绘制音符点 
    for (var i in audiogame.dots) {
        // 准备径向渐变的填充样式
        var circle_gradiet = ctx.createRadialGradient(-3, -3, 1, 0, 0, 20);
        circle_gradiet.addColorStop(0, "#fff");
        circle_gradiet.addColorStop(1, "#cc0");
        ctx.fillStyle = circle_gradiet;

        // 准备要绘制的音乐点的位置
        ctx.save();
        var center = game.width / 2;
        var dot = audiogame.dots[i];
        var x = center - 100
        if (dot.line === 2) {
            x = center;
        } else if (dot.line === 3) {
            x = center + 100;
        }

        // 根据所在竖线和距离，在特定的位置绘制音乐点
        ctx.translate(x, game.height - 80 - audiogame.dots[i].distance);
        ctx.drawImage(audiogame.dotImage, -audiogame.dotImage.width / 2, -audiogame.dotImage.height / 2);
        ctx.restore();

    }

    // 检测丢失的音乐点
    for (var i in audiogame.dots) {
        if (!audiogame.dots[i].missed && audiogame.dots[i].distance < -10) {
            // 如果音乐点以前未标记，就将其标记为已丢失
            audiogame.dots[i].missed = true;

            // 减少成功计数
            audiogame.successCount--

            // 如果成功计数小于0时，将其重置回0
            audiogame.successCount = Math.max(0, audiogame.successCount);

        }

        // 在丢失的音乐点移动到底部后将其移除
        if (audiogame.dots[i].distance < -100) {
            audiogame.dots.splice(i, 1);
        }
    }

    // 计算最近5个音乐点的成功率的百分比
    var successPercent = audiogame.successCount / 5;

    // 防止成功率的百分比超出范围
    successPercent = Math.max(0, Math.min(1, successPercent));

    // 根据成功率调整旋律音量
    audiogame.melody.volume = successPercent;

}

function drawBackground() {
    // 获取Canvas的引用和上下文
    var game = document.getElementById("game-background-canvas")
    var ctx = game.getContext('2d');
    console.log(ctx)

    // 为三条竖线设置样式
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#000";

    var center = game.width / 2

    // 绘制三条竖线

    // 左边竖线放在canvas 中间偏左100像素的位置
    ctx.beginPath();
    ctx.moveTo(center - 100, 50);
    ctx.lineTo(center - 100, game.height - 50);
    ctx.stroke()

    // 中间竖线放在canvas的中间
    ctx.beginPath();
    ctx.moveTo(center, 50);
    ctx.lineTo(center, game.height - 50);
    ctx.stroke();

    // 右侧竖线放在canvas中间偏右100像素的位置
    ctx.beginPath();
    ctx.moveTo(center + 100, 50)
    ctx.lineTo(center + 100, game.height - 50);
    ctx.stroke();

    // 绘制横线

    ctx.beginPath();
    ctx.moveTo(center - 150, game.height - 80);
    ctx.lineTo(center + 150, game.height - 80);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(50,50,50,.8)";
    ctx.stroke();
}


function MusicNote(time, line) {
    this.time = time;
    this.line = line;
}

function Dot(distance, line) {
    this.distance = distance;
    this.line = line;
    this.missed = false;
}

function setupLevelData() {

    var notes = audiogame.leveldata.split(";");
    // 存储音乐点的总数
    audiogame.totalDotsCount = notes.length;
    console.log(notes)
    for (var i in notes) {
        var note = notes[i].split(",");
        var time = parseFloat(note[0]);
        var line = parseInt(note[1], 10);
        var musicNote = new MusicNote(time, line);
        audiogame.musicNotes.push(musicNote);
    }
    console.log(audiogame)
}

function onMelodyEnded() {
    console.log("song ended");
    console.log("success percent:" , audiogame.totalSuccessCount / audiogame.totalDotsCount * 100 + "%");
}