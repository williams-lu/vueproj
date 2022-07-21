// ES6引入了模板字面量（Template Literals),对字符串的操作进行了增强
// 1.多行字符串：真正的多行字符串。
// 2.字符串占位符：可以将变量或JavaScript表达式嵌入占位符并将其作为字符串的一部分输出到结果中

// 3.2.1多行字符串

let message = `Hello World`;

let msg = `Hello\` World`;

// ES5例子

let m5 = "Hello \
World";

let greeting = "Welcome"
               + " you";
console.log(m5);
console.log(greeting);
//此两种语法均利用JavaScript的语法Bug来实现，后者是利用字符串的拼接操作来实现的
//当把字符串m5和greeting打印到Console窗口中时，这两个字符串均未跨行显示，前者
//使用反斜杠(\)只是代表行的延续，并未真正插入新的一行。如果要输出新行，就要手动加入换行符。ES5

let msg2 = "Hello \n\
World";
let greeting2 = "welcome"
                           + "\n"
                           + " you";

console.log(msg2);
console.log(greeting2);

//ES6 模板字面量例子

let msg3 = `Hello
World`;

console.log(msg3);





