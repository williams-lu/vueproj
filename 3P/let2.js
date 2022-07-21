//函数内部
function changeState(flag){
    if(flag){
        let color = "red";
    }
    else{
        console.log(color);    //此处不能访问color,报错：color is not defined
        return null;
    }
}

changeState(false);

//块中
{
    let a = 1;
}
console.log("a = " + a);    //此处不能访问变量a,报错：a is not defined

//for循环中
for(let i = 0; i < 10; i++){
}
console.log("i = " + i);    //此处不能访问变量i,报错：i is not defined