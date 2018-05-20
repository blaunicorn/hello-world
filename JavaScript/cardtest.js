// define the functions

function PrintCard () {
    line1 = "<b>Name: </b>" + this.name + "<br>\n"
    line2 = "<b>Address:</b>" + this.address + "<br>\n"
    line3 = "<b>Word Phone:</b>" + this.workphone + "<br>\n"
    line4 = "<b>Home Phone:</b>" + this.homephone + "<br>\n"
    document.write(line1,line2,line3,line4)
}
function Card (name,address,workphone,homephone) {
    this.name = name
    this.address = address
    this.workphone = workphone
    this.homephone = homephone
    this.PrintCard =PrintCard
}
// creat the objects
sue = new Card("sue suthers","123 elm street","555-1234","555-9893")
phred = new Card("phred madsen","233 oak lane","555-234234","5334-3345345")
henry = new Card("henry tillma","2333 walnet circle","555-23424","3434-234234")
sue.PrintCard()
phred.PrintCard()
henry.PrintCard()
