;(function (window, undefined) {
    function Hotspot() {
      this.init()
    }

    Hotspot.prototype = {
        init: function () {

           this.onHotspotHover();            console.log('初始化了')
        },
        onHotspotHover: function () {
           var hotSports = this.$$('hotSpot')

           len = hotSports.length
           console.log(len)
           let i
           that = this
           let currDetialImg
           for (i=0;i<len;i++) {
               currDetialImg = that.$$('detailImg', hotSports[i])[0];
               console.log(currDetialImg )
               currDetialImg.timer =null;
               currDetialImg.alpha = 0;
               hotSports[i].onmouseover = function(e) {
                   console.log('1')
                   that.doTransform(that.$$('detailImg',this)[0],100);
                   that.$$('hotSpotSpan', this)[0].style.display = 'none';
               }
               hotSports[i].onmouseout = function(e) {
                   that.doTransform(that.$$('detailImg',this)[0],0)
                   that.$$('hotSpotSpan',this)[0].style.display = "block"
               }
           }
        },

        doTransform: function (me,alpha) {
            var times = 0
            if (alpha == 100) {
                times=5
            } else {
                times = -5
            }
            me.style.display = 'block'
            clearInterval(me.timer)
            me.timer = setInterval(function () {
                if (me.alpha == alpha) {
                    clearInterval(me.timer);
                    if (alpha == 0) {
                        me.style.display = 'none'
                    }
                } else {
                    me.alpha += times
                    me.style.opacity = me.alpha / 100
                    me.style.filter = 'alpha(opacity:'+ me.alpha + ')'
                }
            }, 30)
        },


        $$: function (clsName, ele) {
            if (document.getElementsByClassName) {
                console.log('兼容性检查',(ele || document).getElementsByClassName(clsName))
                return (ele || document).getElementsByClassName(clsName)
            } else {
                var nodes = (ele || document).getElementsByTagName('*'),
                    eles = []
                    len = nodes.length,
                    i,
                    j,
                    currNode,
                    clsNames;
                    clsLen;
                for (i=0;i<len;i++) {
                    currNode = nodes[i];
                    clsNames = currNode.className.split(' ');
                    clsLen = clsNames.length;
                    for (j=0; j<clsLen;j++) {
                        if (clsNames[j] == clsName) {
                            eles.push(currNode);
                            break;
                        }
                    }
                }
                return eles;
            
            }
        }
    }
    new Hotspot()
})(window)