//3.2.2字符串占位符
//在一个模板字面量中，可以将Javascript变量或任何合法的JavaSript表达式嵌入占位符并将其
//作为字符串的一部分输出到结果中

let name = "zhangsan";
let message = `Hello, ${name}`;
console.log(message);

let amount = 5;
let price = 86.5;
let total = `The total price is ${price * amount}`;
console.log(total);

//模板字面量嵌入另一个模板字面量

let ne = "lisi";
let msg = `Hello, ${
        `my name is ${ne}`
}.`;

console.log(msg); //输出： Hello, my name is lisi.