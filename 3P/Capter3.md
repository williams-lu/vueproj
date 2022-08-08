# 第三章 ECMAScript 6语法简介

## 3.1 块作用域构造let 和 const

### 3.1.1 let声明
&emsp;&emsp;在函数作用域或全局作用域中通过关键字var声明的变量，无论在哪里声明，都会被当成在当前作用域顶部声明的变量，这就是JavaScript的变量提升机制。

ES6引入let声明，用法与var相同，不过用let声明的变量不会被提升，可以将变量的作用域限制在当前代码中。

### 3.1.2 const声明
ES6还提供了const关键字，用于声明常量。每个通过const关键字声明的常量必须在声明的同时进行初始化。
与let声明类似，在同一作用域下用const声明已经存在的标识符也会导致语法错误，无论该标识符是使用var，还是let声明的。
如果使用const声明对象，对象本身的绑定不能修改，但对象的属性和值是可以修改的。

### 3.1.3 全局块作用域绑定

在全局作用域中使用var声明的变量或对象，将作为浏览器环境中的windows对象的属性，这意味着使用var可能会无意中覆盖一个已经存在的全局属性。
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <script>
        var greeting = "Welcome";
        console.log(window.greeting); //Welcome

        console.log(window.Screen); //function Screen() {[native code]}
        var Screen = "liquid crystal";
        console.log(window.Screen); //liquid crystal
    </script>
</head>
<body>
    ...
</body>
</html>
```
greeting被定义为一个全局变量，并立即成为window对象的属性。定义的全局变量Screen，则覆盖了window对象中原有的Screen属性。

如果在全局作用域下使用let或const，则会在全局作用域下创建一个新的绑定，但该绑定不会成为window对象的属性。
```
<!DOCTYPE html>
<html lang="en">
<head>
    <script>
        let greeting = "Welcome";
        console.log(window.greeting); //undefined

        const Screen = "liquid crystal";
        console.log(window.Screen); //false
    </script>
</head>
<body>
    ...
</body>
</html>
```
综上所述，如不想全局对象window创建属性，或者为了避免覆盖window对象的属性，则应该使用let和const声明变量和常量。

## 3.8 箭头函数

ES6允许使用“箭头”(=>)定义函数，箭头函数的语法多变，根据实际的使用场景有多种形式，但都需要由函数参数、箭头和函数体组成。根据JavaScript函数定义的各种不同形式，箭头函数的参数和函数体可以分别采取不同的形式。

### 3.8.1 箭头函数的语法

单一参数、函数体只要一条语句的箭头函数定义形式如下：
```
let welcome = msg => msg;

<!-- 相当于
function welcome(msg) {
    return msg;
}
 -->

console.log(welcome("welcome you.")); //welcome you.
```
如果函数有多于一个的参数，则需要在参数的两侧添加一对圆括号。如下：
```
let welcome = (user, msg) => `${user}, ${msg}`;

<!-- 相当于 
function welcome(user, msg) {
    return user + ", " + msg;
}
 -->

console.log(welcome("zhangsan", "welcome you.")); //zhangsan, welcome you.
```
如果函数没有参数，则需要使用一对空的圆括号。示例：
```
let welcome = () => "welcome you";

<!-- 相当于 
function welcome() {
    return "welcome you";
}
 -->

console.log(welcome("welcome you")); //welcome you.
```
如果函数体有多条语句，则需要用花括号包裹函数体。示例：
```
let add = (a, b) => {
    let c = a + b;
    return c;
}

<!-- 相当于 
function add(a, b) {
    let c = a + b;
    return c;
}
-->

console.log(add(5, 3)); //8
```
如果要创建一个空函数，则需要写一对没有内容的圆括号代表参数部分，一对没有内容的花括号代表空的函数体。示例：
```
let emptyFunction = () => {};

<!-- 相当于 
function emptyFunction() {}
-->
```
如果箭头函数的返回值是一个对象字面量，则需要将对对象字面量包裹在圆括号中。示例：
```
let createCar = (color, doors) => ({ color: color, doors: doors});

<!-- 相当于 
function createCar(color, doors) {
    color: color,
    doors: doors,
}
-->
console.log(createCar("black", 4)); //{ color: 'black', doors: 4 }
```
将对象字面量包裹在圆括号中是为了将其与函数体区分开。

箭头函数可以和对象解构结合使用。示例：
```
let personInfo = ({name, doors}) => `${name}'s age is ${age} years old.`;

<!-- 相当于 
function personInfo({name, doors}) {
    return `${name}'s age is ${age} years old.`;
}
-->

let person = {name: "zhangsan", age: 18 };
console.log(personInfo(person)); 
//zhangsan's age is 18 years old.
```

### 3.8.2 箭头函数与this

JavaScript中的this关键字是一个神奇的东西，与其他高级语言中的this引用或this指针不同的是，JavaScript的this并不是指向对象本身，其指向是可以改变的，根据当前执行上下文的变化而变化。
示例1：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <script>
        var greeting = "Welcome";
        function sayHello(user) {
            alert(this.greeting + ", " + user);
        }

        var obj = {
            greeting: "Hello",
            sayHello: sayHello,
        }
        
        syaHello("zhangsan"); // Welcome, zhangsan
        obj.sayHello("lisi"); // Hello, lisi
        var sayHi = obj.sayHello;
        sayHi("wangwu");  //Welcome,wangwu
    </script>
</head>
<body>
    ...
</body>
</html>
```
分析上述代码：
(1)调用sayHello("zhagnsan")时，相当于执行window.sayHello("zhangsan"),因此函数内部的this指向的是windows对象，在代码第一行定义的全局变量greeting将自动成为window对象的属性，因此最后的结果是“Welcome，zhangsan”。
(2)调用obj.sayHello("lisi")时，函数内部的this指向的是obj对象，而obj对象内部定义了greeting属性，因此最后的结果是“Hello，lisi”。
(3)调用sayHi("wangwu")时，虽然该函数是由obj.sayHello赋值得到的，但是在执行sayHi()函数时，当前执行的上下文对象是windows对象，相当于调用windows.sayHi("wangwu")，因此，最后的结果是"Welcome,wangwu"。

实例2：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <script>
        var obj = {
            greeting: "Hello",
            sayHello: function() {
                setTimeout(function() {
                    alert(this.greeting);
                }, 2000);
            }
        }
        
        obj.sayHello();     //undefined
    </script>
</head>
<body>
    ...
</body>
</html>
```
最后输出的结果是undefined。当调用obj.sayHello()时，只是执行了setTimeout()函数，2s之后才开始执行setTimeout()函数参数中定义的匿名函数，而该匿名函数的执行上下文对象是window，因此this执行的是window对象，而在window对象中并没有定义greeting属性，所以找不到该属性，输出undefined。

为了解决this指向的问题，可以使用函数对象的 **_bind()_** 方法,将this明确绑定到某个对象上，实例3：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <script>
        var greeting = "Welcome";

        function sayHello(user) {
            alert(this.greeting + ", " + user);
        }

        var obj = {
            greeting: "Hello",
            sayHello: sayHello,
        }

        var sayHi = obj.sayHello.bind(obj);
        sayHi("wangwu");     //Hello, wangwu

        var obj = {
            greeting: "Hello",
            sayHello: function() {
                setTimeout((function() {
                    alert(this.greeting);
                }).bind(this), 2000);
            }

            // 或者
            <!-- 
            sayHello: function() {
                var that = this;
                setTimeout(function() {
                    alert(that.greeting);
                }, 2000);
            }
            -->
        }
        
        obj.sayHello();     // Hello
    </script>
</head>
<body>
    ...
</body>
</html>
```
使用 **_bind()_** 方法实际上是创建了一个新的函数，称为绑定函数，该函数的this被绑定到参数传入的对象。为了避免创建一个额外的函数，下面使用箭头函数来解决this的问题。

箭头函数中没有this绑定，必须通过查找作用域决定其值。如果箭头函数被非箭头函数包含，则this绑定的是最近一层非箭头函数的this；否则，this的值会被设置为全局对象。使用箭头函数修改上述代码。

实例4：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <script>
        var obj = {
            greeting: "Hello",
            sayHello: function() {
                setTimeout(() => alert(this.greeting), 2000);
            }
        }
        
        obj.sayHello();     //Hello
    </script>
</head>
<body>
    ...
</body>
</html>
```
alert()函数参数中的this与sayHello()方法中的this一致，而这个this指向的是obj对象，因此最后调用obj.sayHello()的结果是Hello。

箭头函数中的this取值取决于该函数外部非箭头函数的this值，且不能通过call()、apply()或bind()方法改变this的值。

箭头函数在使用有几个需要注意的地方：
(1)没有this、super、arguments和new.target绑定。箭头函数中的this、super、arguments和new.target这些值由外围最近一层非箭头函数决定。
(2)不能通过new关键字调用。箭头函数不能被用作构造函数，也就是不能使用new关键字调用箭头函数，否则会抛出错误。
(3)没有原型。由于不能通过new关键字调用箭头函数，因而没有构建原型的需求，所以不存在prototype这个属性。
(4)不可以改变this的绑定。函数内的this值不可被改变，在函数的生命周期内始终保持一致。
(5)不支持arguments对象。箭头函数没有arguments绑定，所以只能通过命名参数和rest参数两种形式访问函数的参数。

## 3.9 Symbol

在ES5及早期版本中，有5中原始数据类型：字符串(String)、数值型(Number)、布尔型(Boolean)、null和undefined，ES6引入了一种新的原始数据类型--Symbol，表示独一无二的值。

### 3.9.1 创建Symbol

一个具有Symbol数据类型的值可以被称为“符号类型值”。在JavaScript运行环境中，一个符号类型值是通过调用函数Symbol()函数创建的，这个函数动态生成一个匿名的、唯一的值。
实例1:
```
let sn1 = Symbol();

// 使用typeof操作符检测sn变量是否是Symbol类型
console.log(typeof sn1);      //symbol
console.log(sn1);            // Symbol()

let sn2 = Symbol();
console.log(sn1 === sn2);  //false
```
Symbol是原始值，所以不能使用new Symbol()创建Symbol值，这回抛出错误。每一个Symbol实例都是唯一且不可改变的。

Symbol()函数可以接受一个可选的字符串参数，用于为新创建的Symbol实例提供描述，这个描述不可用于属性访问，主要用于调试目的，方便阅读。
实例2:
```
let sn1 = Symbol("sn1");
let sn2 = Symbol("sn2");
console.log(sn1);   // Symbol(sn1)
console.log(sn2);   // Symbol(sn2)

let sn3 = Symbol("sn1");
console.log(sn1 === sn3);  // false
```
> 注解
sn1和sn2是两个Symbol值。如果不加参数，他们在Console窗口的输出都是Symbol(),不利于区分。有了参数以后，就等于为他们各自加上描述，输出能够区分。

Symbol是唯一的，参数只是表示当前Symbol值的描述，因此相同参数的Symbol()函数返回值是不行等的。

如果调用Symbol()函数传入的参数是一个对象，就会调用该对象的toString()方法，将其转换为字符串，然后再生成一个Symbol值。

实例3：
```
let obj = {
    toString() {
        return "sn";
    }
}
console.log(Symbol(obj)); //Symbol(sn)
```

### 3.9.2 Symbol与类型转换

自动转换是JavaScript中的一个重要的语言特性，利用这个特性能够在特定的场景下将某个数据强制转换为其他类型，然而Symbol类型比较特殊，其他类型没有与Symbol逻辑等价的值，因此不能将Symbol值与其他类型的值进行运算。

虽然Symbol不能与字符串进行运算，但是可以显式地调用String()函数将Symbol值转换为字符串。

示例1：
```
let sn = Symbol("sn");
let str = Symbol(sn);

console.log(str);                 //Symbol(sn)
console.log(sn.toString());       //Symbol(sn)
```
当使用console.log()方法输出Symbol的值时，它实际上也是调用sn的toString()方法。

有一个例外是，Symbol可以参与逻辑运算，这是因为JavaScript将非空值都看成true。
```
let sn = Symbol("sn");
console.log(Boolean(sn));    //true
console.log(!sn);            //false
if(sn) console.log("true");   //true
```

### 3.9.3 作为属性名使用

Symbol类型唯一合理的用法是用变量存储Symbol值，然后使用存储的值创建对象属性。由于每一个Symbol值都是不相同的，所以Symbol作为对象的属性名，可以保证属性不重名。

示例1：
```
let sn = Symbol("sn");

//第一种方式
let obj = {};
obj[sn] = "1111-11";
console.log(obj);           // { [Symbol(sn)]: '1111-11' }

//第二种方式
let obj = {
    [sn]: "1111-11"
};
console.log(obj);         // { [Symbol(sn)]: '1111-11' }

//第三种方式
let obj = {};
Object.defineProperty(obj, sn, {value: "1111-11"});
console.log(obj[sn]);         // 1111-11
```
需要注意的是，Symbol作为对象属性名时不能使用点(.)运算符，要用方括号。因为点运算符后面是字符串，所以不会读取变量sn所表示的Symbol值，而是直接将sn作为字符串属性名。

Symbol值作为属性名时，该属性时公有属性而不是私有属性，可以在类的外部访问，但是不会出现在for...in和for...of的循环中，也不会被Object.keys()、Object.getOwnPropertyNames()函数返回。如果读取一个对象的Symbol属性，可以通过Object.getOwnPropertySymbol()和Reflect.ownKeys()方法得到。

示例2：
```
let sn = Symbol("sn");
let obj = {};
obj[sn] = "1111-11";
console.log(obj);

for (let prop in obj) {
    console.log(prop);
}
console.log(Object.keys(obj));              // []
console.log(Object.getOwnPropertyNames(obj));   // []
console.log(Object.getOwnPropertySymbol(obj)); //[Symbol(sn)]
console.log(Object.ownKeys(obj));       //[Symbol(sn)]
```

### 3.9.4 共享的Symbol

有时候我们可能希望在不同的代码中使用同一个Symbol值，为此，可以使用Symbol.for()方法创建一个可共享的Symbol，该方法接受一个字符串参数，即要创建的Symbol的标识符，同时这个参数也被用作Symbol的描述。

ES6提供了一个可随时访问的全局Symbol注册表，当调用Symbol.for()方法时，它首先在全局Symbol注册表中搜索作为名称的Symbol值，如果找到了，则直接返回已有的Symbol；如果没有找到，则创建一个新的Symbol，以参数作为key，注册到全局Symbol注册表中，然后返回新创建的Symbol。

实例1：
```
let sn1 = Symbol.for("sn");
let sn2 = Symbol.for("sn");
let sn3 = Symbol("sn");

console.log(sn1);   //Symbol(sn)
consolo.log(sn1 === sn2);     //true
console.log(sn1 === sn3);      //false
```
调用Symbol.for()和Symbol()方法都会生成新的Symbol值，区别在于前者会被注册到全局Symbol注册表中，之后以相同的key调用Symbol.for()方法则会返回同一个Symbol值；而后者每次调用，都会创建一个新的Symbol值。

另一个与共享Symbol相关的方法是Symbol.keyFor(),该方法在全局Symbol注册表中搜索已注册的Symbol的key。

实例2：
```
let sn1 = Symbol.for("sn");
console.log(Symbol.keyFor(sn1));     //sn

let sn2 = Symbol("sn");
console.log(Symbol.keyFor(sn2));      //undefined
```
全局Symbol注册表中并不存在sn2这个Symbol，自然不存在与之相关的key，因此返回undefined。