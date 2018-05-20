// // window.onload = function(){
// //     var obj_lis = document.getElementById("test").getElementsByTagName("li");
// //     for(i=0;i<obj_lis.length;i++){
// //         obj_lis[i].onclick = function(){
// //             alert(this.innerHTML);
// //         }
// //     }
// // }
//     $(function(){
//     var quotas = {
//         1:{name:"工商银行",oneTime:1000},
//         2:{name:"农业银行",oneTime:800},
//         3:{name:"中国银行",oneTime:2000},
//         4:{name:"建设银行",oneTime:10}};

//     $(":radio").click(function(){
//         console.info("click:"+$(this).val());
//         var quota = quotas[$(this).val()];
//         var quotaHtml = [];
//         quotaHtml = quotaHtml.concat([
//             '<tr>',
//                 '<td>'+quota.name+'</td>',
//                 '<td>'+quota.oneTime+'</td>',
//                 '<td>100</td>',
//                 '<td>100</td>',
//                 '<td>100</td>',
//             '</tr>'
//         ])
//         console.info("html:"+quotaHtml);
//         $("#quota").html(quotaHtml)
//     });
//  });
 $("li").click(function(){
    alert($(this).text())
    })
