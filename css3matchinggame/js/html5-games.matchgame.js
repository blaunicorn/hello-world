// h5实现翻牌游戏以及local storage的运用
var matchingGame = {};
matchingGame.savingObject = {};
matchingGame.savingObject.card = [];
matchingGame.savingObject.removedCards = [];
matchingGame.savingObject.currentElaspedTime = 0;
matchingGame.deck = [
    'cardAK', 'cardAK',
    'cardAQ', 'cardAQ',
    'cardAJ',    'cardAJ',
    'cardBK',    'cardBK',
    'cardBQ',    'cardBQ',
    'cardBJ',    'cardBJ',
];
$(function() {
     matchingGame.deck.sort(shuffle);
     matchingGame.savingObject.card = matchingGame.deck.slice();
     var savedObject = saveSavingObject();
     if (savedObject != undefined) {
         matchingGame.deck = savedObject;
     }
    // 复制12张纸牌
    for (var i = 0; i<11; i++) {
        $(".card:first-child").clone().appendTo("#cards");
    }
    // 初始化每张纸牌的位置
    $("#cards").children().each(function(index) {
        // 让纸牌以4*3的形式对齐
        $(this).css({
            "left": ($(this).width() + 20) * (index % 4),
            "top": ($(this).height()+20) * Math.floor(index / 4)
        });
        // 从已经洗过的纸牌中获取图案
        var pattern = matchingGame.deck.pop();
        // 应用纸牌的背面图案，并让其可见
        $(this).find(".back").addClass(pattern);
        // 把图案数据嵌入DOM元素中
        $(this).attr("data-pattern", pattern);
        $(this).attr("data-card-index", index);
        // 监听每张纸牌DIV元素的单击事件
        $(this).click(selectCard); 
    });
    if (savedObject != undefined) {
         //alert(savedObject.removedCards);
         matchingGame.savingObject.removedCards = saveObject.removedCards;
         for (var i in matchingGame.savingObject.removeCards) {
             //alert (matchingGame.savingObject.removeCards);
             $(".card[data-card-index =" + matchingGame.savingObject.removedCards[i] + "]").remove();
         }
    }
    matchingGame.elapsedTime = 0;
    if (savedObject != undefined) {
        matchingGmae.elapsedTime = savedObject.currentElaspedTime;
        matchingGame.savingObject.currentElaspedTime = saveObject.currentElapsedTime;
    }
    matchingGame.timer = setInterval(countTimer, 1000)
});
//洗牌
function shuffle() {
    return 0.5 - Math.random();
};
// 单击纸牌时，需要翻转纸牌并调用检测函数。
function selectCard() {
    // alert($(".card-flipped").length);
    // 如果已经翻开了两张纸牌，我们将做的事
    if ($(".card-flipped").length > 1) {
        return;
    }
    $(this).addClass("card-flipped");
    //0.7秒后，检测两张已翻开的牌的图案
    if ($(".card-flipped").length == 2) {
        setTimeout(checkPattern, 700);
    }
};
// 当两张纸牌都翻开的时候，将执行下面函数，控制删除纸牌还是翻回背面
function checkPattern() {
    if (isMatchPattern()) {
        $(".card-flipped").removeClass("card-flipped").addClass("card-removed")
        $(".card-removed").bind("webkitTransitionEnd", removeTookCards);
    } else {
        $(".card-flipped").removeClass("card-flipped")
    }
};

// 图案检测函数，访问已翻开纸牌的自定义图案属性，并比较他们是不是一样的图案
function isMatchPattern() {
    var cards = $(".card-flipped");
    // alert('cards');
    var pattern = $(cards[0]).data("pattern");
    var anotherPattern = $(cards[1]).data("pattern");
    return (pattern == anotherPattern);
}
// 已配对纸牌淡出函数，执行下面的函数删除纸牌
function removeTookCards() {
    // $(".card-remove").remove();
    $(".card-removed").each(function() {
        // alert($(this).data("card-index"));
        // alert(matchingGame.savingObject.removeCards);
        matchingGame.savingObject.removedCards.push($(this).data("card-index"));
        $(this).remove();
        });
    if($(".card").length == 0) {
        gameover();
    }
};

// 统计时间
function countTimer() {
    matchingGame.elapsedTime++;
    matchingGame.savingObject.currentElaspedTime = matchingGame.elapsedTime;
    var minute = Math.floor(matchingGame.elapsedTime/60);
    var second = matchingGame.elapsedTime % 60;
    if (minute < 10 ) minute = "0" + minute;
    if (second < 10 ) second = "0" + second;
    $("#elapsed-time").html(minute + ":" + second);
    saveSavingObject();
}

//游戏结束后统计时间
function gameover() {
    clearInterval(matchingGame.timer);
    $(".score").html($("#elapsed-time").html());
    var lastScore = localStorage.getItem("last-score");
    lastScoreObj = JSON.parse(lastScore);
    if (lastScoreObj == null) {
      lastScoreObj = {
          "savedTime" : "no record",
          "score": 0,
          "bestscore": 0
      };
      // localStorage.removeItem("savingObject")
    }
    var lastElapsedTime = lastScoreObj.score;
    var bestElapsedTime = lastScoreObj.bestscore;
    if (bestElapsedTime == 0 || matchingGame.elapsedTime <= bestElapsedTime) {
        var bestscore = matchingGame.elapsedTime;
    } else {
        var bestscore = bestElapsedTime;
    }
    var minute = Math.floor(lastElapsedTime / 60);
    var second = lastElapsedTime % 60;
    if (minute < 10) minute = "0" + minute;
    if (second < 10) minute = "0" + second;
    $(".last-score").html(minute + ":" + second);
    var savedTime = lastScoreObj.savedTime;
    $(".saved-time").html(savedTime);
    $(".best-score").html(bestElapsedTime);
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDay();
    var year = currentTime.getFullYear();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    var now = day + "/" + month + "/" + year + ":" + minutes + ":" + seconds;
    // localStorage.setItem("last-elapsed-time", matchingGame.elapsedTime);
    var obj = {
        "savedTime": now,
        "score": matchingGame.elapsedTime,
        "bestscore": bestscore
    };
    localStorage.setItem("last-score", JSON.stringify(obj));
    $("#popup").removeClass("hide");
}

function saveSavingObject() {
    localStorage["savingObject"] = JSON.stringify(matchingGame.savingObject)
};

function savedSavingObject() {
    var savingObject = localStorage["savingObject"];
    if (savingObject != undefined) {
        savingObject = JSON.parse(savingObject)
    }
    return savingObject;
}
