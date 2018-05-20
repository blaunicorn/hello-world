<script language="javascrpit">
    var comment = "采莲南塘秋，莲花过人头；低头弄莲子，莲子清如水。今晚若有采莲人，这儿的莲花也算的“过人头"了；
只不见一些流水的影子，是不行的。这令我到底惦着江南了。"
    var newComment = "";
   for(n=0;n<comment.length;n++)
   {
       var curChar=comment.charAt(n);
       if (curChar=="莲")
       {
           newComment+=(curChar.bold()).fontcolor("red");
       }
       else
       {
           newComment+=curChar;
       }
   }
   document.write("<li><b>原文：</b><br>"+comment+"<br>");
   document.write("<li><b>标记“莲”字的文章：</b><br>"+newComment+"<br>");
</script>