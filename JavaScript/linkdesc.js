function cleardesc() {
    d = document.getElementById('description')
    d.innerHTML = ''
}
function hover(e) {
    if (!e) var e = window.event
    // which link was the mouse over:
    whichlink = (e.target) ? e.target.id: e.srcElement.id
    // choose the appropriate description
    if (whicelink == "order") desc = "Order a product"
    else if (whicelink == "email") desc = "Send us a message"
    else if (whicelink == "complain") desc = "Insult us ,our products,or our families"
    // display the description in the H2
    d = document.getElementById('description')
    d.innerHTML= desc
}
// set up the event handlers
orderlink = document.getElementById("order")
orderlink.onmouseover = hover
d = document.getElementById('description')
d.innerHTML= 'desc'
orderlink.onmouseout = cleardesc()
emaillink = document.getElementById('email')
emaillink.onmouseover = hover
emaillink.onmouseout = cleardesc
complainlink = document.getElementById('complain')
complainlink.onmouseover = hover
complainlink.onmouseout = cleardesc