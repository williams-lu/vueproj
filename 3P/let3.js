//防止变量的重复声明
var index = 0;
var index = 10;         //OK
let index = 100;         //报错：Identifier 'index' has already been declared


var pp = 0;
{
    let pp = 10;      //OK
}