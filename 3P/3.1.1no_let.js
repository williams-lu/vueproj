function changeState(flag) {
    if(flag) {
        var color = "red";
    }
    else{
        console.log(color);     //此处可以访问变量color， 其值为undefined
        return null;
    }
}

changeState(false);

{
    var a = 1;
}
console.log("a= " + a);           //此处可以访问变量a，输出a=1

for(var i = 0; i < 10; i++){
}

console.log("i = " + i);          //此处可以访问变量i，输出i=10