var matchingGame = {};
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
        // 监听每张纸牌DIV元素的单击事件
        $(this).click(selectCard); 
    })
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
    $(".card-remove").remove();
}