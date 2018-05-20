// initeialize the counterand the array
var numnames = 0
var names = new Array()


function SortNames () {
    // get the name from the text field
    thename = document.theform.newname.value
    //add the name to the array
    names[numnames] = thename;
    // increment the counter
    numnames ++
    // sort the array
    names.sort()
    document.theform.sorted.value= names.join("\n")
    document.theform.tongji.value = "名字数量：" + numnames + names
}