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

## 3.10 类

大多数面向对象的编程语言支持类和类继承的特性，而JavaScript不支持这种特性，只能通过其他方式模拟类的定义和类的继承。ES6引入了class(类)的概念，新的class写法让对象原型的写法更加清晰，也更像传统的面向对象变成语言的写法

### 3.10.1 类的定义

在ES5及早期版本中国，没有类的概念，可以通过构造函数和原型混合使用的方式模拟定义一个类。

示例1：
```
function Car(sColor, iDoors)
{
    this.color = sColor;
    this.doors = iDoors;
}

Car.prototype.showColor=function() {
    console.log(this.color);
};

var oCar = new Car("red", 4);
oCar.showColor();
```

ES6引入了class关键字，使类的定义更接近Java、C++等面向对象语言中的写法。使用ES6中的类声明语法改写上述代码。
示例2：
```
class Car {
    // 等价于Car构造函数
    constructor(sColor, iDoors) {
        this.color = sColor;
        this.doors = iDoors;
    }
    // 等价于Car.prototype.showColor
    showColor() {
        console.log(this.color);
    }
}

let oCar = new Car("red", 4);
oCar.showColor();
```

在类声明语法中，使用特殊的constructor方法名定义构造函数，且由于这种类使用简写语法定义方法，因此不需要添加function关键字。

自由属性时对象实例中的属性，不会出现在原型上，如本例中的color和doors。自有属性只能在类的构造函数（即constructor方法）或方法中创建，一般建议在构造函数中创建所有的自由属性，从而只通过一处就可以控制类中的自有属性。本例中的showColor()方法实际上是Car.prototype的一个方法。

类也可以使用表达式的形式定义。
实例3：
```
let Car = class {
    // 等价于Car构造函数
    constructor(sColor, iDoors) {
        this.color = sColor;
        this.doors = iDoors;
    }
    // 等价于Car.prototype.showColor
    showColor() {
        console.log(this.color);
    }
}

let oCar = new Car("red", 4);
oCar.showColor();
```
使用类的表达式，可以实现立即调用类构造函数从而创建一个类的单例对象。使用new调用类表达式，紧接着通过一对圆括号调用这个表达式。
```
let Car = new class {
    // 等价于Car构造函数
    constructor(sColor, iDoors) {
        this.color = sColor;
        this.doors = iDoors;
    }
    // 等价于Car.prototype.showColor
    showColor() {
        console.log(this.color);
    }
}("red", 4)

car.showColor();
```
上述代码创建了一个匿名类表达式，然后立即执行。按照这种模式可以其使用类语法创建单例，并且不会在作用域中暴露类的引用。

#### 3.10.2 访问器属性

访问器属性是通过关键字get和set创建的，语法为关键字get或set后跟一个空格和相应的标识符，实际上是为了某个属性定义取值和设值函数，在使用时以属性访问的方式使用。与自由属性不同的是，访问器属性是在原型上创建的。

示例1：
```
class Car {
    constructor(sName, iDoors) {
        this._name = sName;
        this.doors = iDoors;
    }
    // 只读属性
    get desc() {
        return `${this.name} is worth having.`;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
}

let car = new Car("Benz", 4);
console.log(car.name);      //Benz
console.log(car.desc);      //Benz is worth having
car.name = "Ferrari";
console.log(car.name);      //Ferrari
car.prototype.desc="very googd";  //TypeError:Cannot set property'desc'of undifined
```
在构造函数中定义了一个"_name"属性，前面的下划线是一种常用的约定记号，用于表示只能通过对象方法访问的属性。当访问属性name时，实际上是调用它的取值方法；当给属性name赋值时，实际上是调用它的设值方法。因为是方法实现，所以定义访问器属性时，可以添加一些访问控制或额外的代码逻辑。

如果需要只读的属性，那么只提供get()方法即可，如本例中的desc属性；同理，如需要只写属性，只提供set()方法即可。

### 3.10.3 静态方法

ES6引入了关键字static，用于定义静态方法。类中所有的方法和访问器属性都可以使用static关键字定义。

示例1：
```
class Car {
    constructor(sName, iDoors) {
        this._name = sName;
        this.doors = iDoors;
    }

    showName() {
        console.log(this.name);
    }

    static createDefault() {
        return new Car("Audi", 4);
    }
}

let car = Car.createDefault();
car.showName();      // Audi
car.createDefault();   //TypeError: car.createDefault is not a function
```
使用static关键字定义的静态方法，只能通过类名访问，不能通过实例访问。此外，ES6并没有提供静态属性，不能在实例属性前面添加static关键字。

### 3.10.4 类的继承

ES6提供了extends关键字，可以实现类的继承。

示例1：
```
class Person {
    constructor(name) {
        this.name = name;
    }

    work() {
        console.log("working...");
    }
}

class Student extends Person {
    constructor(name, no) {
        super(name);    // 调用父类的constructor(name)
        this.no = no;
    }
}

let stu = new Student("zhangsan", 1);
stu.work();   // working...
```
Student类通过使用关键字extents继承自Person类，Student类称为派生类。在Student的构造函数中，通过super()函数调用Person的构造函数并传入相应参数。需注意，如果在派生类中定义了构造函数，则必须调用super()函数，并且一定要在访问super()函数并传入所有参数。例如下面的示例：
```
class Person {
    constructor(name) {
        this.name = name;
    }

    work() {
        console.log("working...");
    }
} 

class Teacher extends Person {
    //没有构造函数
}
//等价于
<!-- 
class Teacher extends Person {
    constructor(...args)  {
        super(...args);
    }
}
 -->

let teacher = new Teacher("lisi");
teacher.work();   // working...
```
>定义了Teacher类，从Person类继承，在类声明中，没有定义函数

在派生类中，可以重写基类中的方法，覆盖基类中的同名方法。

```
class Person {
    constructor(name) {
        this.name = name;
    }

    work() {
        console.log("working...");
    }
}

class Student extends Person {
    constructor(name, no) {
        super(name);    // 调用父类的constructor(name)
        this.no = no;
    }
    //覆盖Person.prototype.work()方法
    work() {
        console.log("studying...");
    }
}

let stu = new Student("zhangsan", 1);
stu.work();    //studying...
```
在Student的work()方法中需要调用基类的work()方法，可以使用super关键字调用。
```
class Person {
    ...
}

class Student extends Person {
    ...
    work() {
        super.work();
        console.log("studying...");
    }
}

let stu = new Student("zhangsan", 1);
stu.work();    // working...
               //studying...
```

## 3.11 模块

ES6在语言标准层面上实现了模块功能。

一个模块通常是一个独立js文件，该文件内部定义的变量和函数除非被导出，否则不能被外部访问。

使用export关键字放置在需要暴露给其他模块使用的变量、函数或类声明前面，以将它们从模块中导出。

#### 导出

Modules.js示例：
```
//导出数据
export var color = "red";
export let name = "module";
export const sizeOfPage = 10;

//导出函数
export function sum(a, b) {
    return a + b;
}

// 将在模块末尾进行导出
function subtract(a, b) {
    return a - b;
}

// 将在模块末尾进行导出
function multiply(a, b) {
    return a * b;
}

// 将在模块末尾进行导出
function divide(a, b) {
    if(b !== 0)
        return a / b;
}

//导出类
export class Car {
    constructor(sColor, iDoors) {
        this.color = sColor;
        this.doors = iDoors;
    }
    showColor() {
        console.log(this.color);
    }
}

//模块私有的变量
var count = 0;
//模块私有的函数
function changeCount() {
    count++;
}

//导出multiply函数
export {multiply};
// subtract是本地名称，sub是导出时使用的名称
export {subtract as sub}
//导出模块默认值
export default divide;
```
>**说明**

(1)导出时可以分别对变量、函数和类进行导出，也可以将导出语句集中书写在模块的末尾，当导出内容较多时，采用后者会更加清晰。

(2)没有添加export关键字而定义的变量、函数和类在模块外部是不允许被访问的。

(3)导出的函数和类声明都需要一个名称。如果要用一个不同的名称导出变量、函数和类，可以使用as关键字指定变量、函数和类在模块外应该按照什么样的名字来使用。

(4)一个模块可以导出且只能导出一个默认值，默认值是通过使用default关键字指定的单个变量、函数或类。非默认值的导出，需要使用一对花括号包裹名称，而默认值的导出则不需要。

(5)默认值的导出还可以采用下面两种语法形式。
```
// 第二种语法形式使用default关键字导出一个函数作为模块的默认值
// 因为导出的函数被模块所代表，所以它不需要一个名称
export default function(a, b) {
    if(b !== 0)
        return a / b;
}
//-------------------------------------//
function divide(a, b){
    if(b !== 0)
        return a / b;
}
//第三种语法形式
export { divide as default }
```

如果想在一条导出语句指定多个导出（包括默认导出），那么就需要用到第三种语法形式。下面将Module.js中模块尾部的导出合并为一条导出语句。
```
export {multiply, subtract as sub, divide as default};
```

#### 导入

导入是使用import关键字引入其他模块导出的功能。import语句由两部分组成：要导入的标识符和标识符应当从哪个模块导入。

index.js示例
```
//导入模块默认值
import divide from "./Modules.js";
//导入多个绑定
import { color, name, sizeOfPage } from "./Modules.js";
//导入单个绑定
import {multiply} from "./Modules.js";
//因Modules模块中导出subtract()函数时使用了名称sub，这里导入也要用该名称
import {sub} from "./Modules.js"
//导入时重命名导入的函数
import {sum as add} from "./Modules.js";
//导入类
import {Car} from "./Modules.js";
//导入整个模块
import * as example from "./Modules.js";

console.log(color);     //red
console.log(name);    //module
console.log(sizeOfPage);    //10
//只能用add而不能用sum
console.log(add(6, 2));    //8
console.log(sub(6, 2));    //4
console.log(multiply(6, 2)); //12
console.log(divide(6, 2));   //3
let car = new Car("black", 4);
car.showColor();             //black
console.log(example.name);    //module
//注意这里是sum，而不是add
console.log(example.sum(6, 2));    //8
//count是Modules模块私有的变量，在外部不能访问
console.log(example.count);         //undefined
//changeCount()函数是Modules模块私有的函数，在外部不能访问
vconsole.log(example.changeCount());  //TypeError: example.changeCount is not a function.
```
>**说明**

(1)导入模块时，模块文件的位置可以使用相对路径，也可以使用绝对路径。使用相对路径时，对于同一个目录下的文件，不能使用Modules.js引入，而要使用"./Modules.js"。

(2)导入时，可以导入单个绑定，也可以同时导入多个绑定。导入时，也可以使用as关键字对导入的绑定重命名。

(3)对于模块非默认值的导入，需要使用一对花括号包裹名称，而默认值的导入则不需要。

(4)可以导入整个模块作为一个单一对象，然后所有的导出将作为该对象的属性使用。

(5)多个import语句引用同一个模块，该模块也执行一次。被导入的模块代码执行后，实例化后的模块被保存在内存中，只要另一个import语句引用它就可以重复使用。

>**提示：**
>export和import语句必须在其他语句或函数之外使用，换句话说，import和export语句只能在模块的顶层使用。

## 3.12 Promise

JavaScript引擎是基于单线程时间循环的概念构建的，它采用任务队列的方式，将要执行的代码块放到队列中，当JavaScript引擎中的一段代码结束，事件循环会指定队列中的下一个任务执行。事件循环是JS引擎中的一段程序，负责监控代码执行并管理任务队列。

JS执行异步调用的传统方式是时间和回调函数，随着应用的复杂化，事件和回调函数无法完全满足开发者需求，因此ES6给出Promise用作异步编程的解决方案。

### 3.12.1 基本用法

一个Promise可以通过Promise构造函数创建，这个构造函数只接受一个参数：包含初始化Promise代码的执行器(executor)函数，在该函数内包含需要异步执行的代码。执行器函数接受两个参数，分别是resolve()函数和reject()函数，这个两个函数由JavaScript引擎提供，不需要用户自己编写。异步操作结束成功时调用resolve()函数，失败时调用reject()函数。

示例1：使用Promise构造函数创建Promise
```
const Promise = new Promise(function(resolve, reject) {
    //开启异步操作
    setTimeout(function() {
        try {
            let c = 6 / 2;
            //执行成功时，调用resolve()函数
            resolve(c);
        }catch(ex) {
            //执行失败时，调用reject()函数
            reject(ex);
        }
    }, 1000)
});
```
在执行器函数内包含了异步调用，在1s后执行两个数的除法运算，如果成功，则用相除的结果作为参数调用resolve()函数，失败则调用reject()函数。

每个Promise都会经历一个短暂的生命周期：先是处于执行中(pending)的状态，此时操作尚未完成，所以它也是未处理的(unsettled),一旦异步操作执行结束，Promise则变为已处理(settled)状态。操作结束后，根据异步操作执行成功与否，可以进入以下两个状态。

+ (1)fulfilled: Promise异步操作成功完成。
+ (2)rejected: 由于程序错误或其他一些原因，Promise异步操作未能成功。

一旦Promise状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只能两种可能： 从pending变为fulfilled,或者从pending变为rejected。

如何根据不同的Promise状态做相应处理呢？

Promise对象有一个then()方法，它接受两个参数：第一个是当Promise的状态变为fulfilled时要调用的函数，与异步操作相关的附加数据通过调用resolve()函数传递给这个完成函数；第二个是当Promise的状态变为rejected时要调用的函数，所有与失败相关的附加数据通过调用reject()函数传递给这个拒绝函数。

在示例1的基础上添加Promise的then()方法的调用。

示例2：
```
promise.then(function(value) {
    //完成
    console.log(value);     //3
}, function(err) {
    //拒绝
    console.error(err.message);
})
```
then()方法的两个参数都是可选的。例如，只在执行失败后进行处理，可以给then()方法的第一个参数传递null。
```
promise.then(null, function(err) {
    //拒绝
    console.error(err.message);
})
```
Promise对象还有一个catch()方法，用于执行失败后进行处理，等价于上述只给then()方法传入拒绝处理函数的代码。
```
promise.catch(function(err) {
    console.error(err.message);
})
```
通常是将then()方法和catch()方法一起使用来对异步操作的结果进行处理，这样能更清楚地指明操作结果是成功还是失败。
```
promise.then(function(value) {
    //完成
    console.log(value);    //3
}).catch(function(err) {
    //拒绝
    console.error(err.message);
});
```
修改示例1,将除数修改为0，在Node.js中运行代码，结果未Infinity。

上述代码使用箭头函数会更加简洁。
```
promise.then(value => console.log(value))
       .catch(err => console.error(err.message));
```
>**提示：**
>如果调用resolve()函数或reject()函数时带有参数，那么它们的参数会被传给then()或catch()方法的回调函数。

Promise支持方法链的调用形式，如上述代码所示。每次调用then()或catch()方法时实际上会创建并返回另一个Promise，因此可以将Promise串联调用。在串联调用时，只有在前一个Promise完成或被拒绝时，第二个才会被调用。
```
const promise = new Promise((resolve, reject) => {
    //调用setTimeout模拟异步操作
    setTimeout( () => {
        let intArray = new Array(20);
        for(let i = 0; i < 20; i++) {
            inArray[i] = parseInt(Math.random() * 20, 10);
        }
        //成功后调用resolve
        resolve(intArray);
    }, 1000);
    //该代码会立即执行
    console.log("开始生成一个随机数的数组")
});

promise.then(value => {
    value.sort((a, b) => a-b);
    return value;
}).then(value => console.log(value));
```
>**说明：**
(1)Promise的执行器函数内的代码会立即执行，因此无论setTimeout()指定的回调函数执行成功与否，console.log("开始生成一个随机数的数组")语句都会执行。

(2)在20个随机数生成完毕后，调用resolve(intArray)函数，因而then()方法的完成处理函数被调用，对数组进行排序，之后返回value；接着下一个then()方法的完成处理函数开始调用，输出排序后的数组。

(3)Promise链式调用时，有一个重要特性就是可以为后续的Promise传递数据，只需要在完成处理函数中指定一个返回值(如上述代码中的return value)，就可以沿着Promise链继续传递数据。

结果输出：
```
开始生成一个随机数的数组
[0,1,2,2,4,4,4,5,6,7,7,9,9,10,12,12,14,15,15,16] 
```
在完成处理程序或拒绝处理程序中也可能会产生错误，使用Promise链式调用可以很好地捕获错误。

示例：
```
const promise = new Promise((resolve, reject) => {
    resolve("Hello World");
});

promise.then((value) => {
    console.log(value);
    throw new Error("错误");
}).catch(err => console.error(err.message));
```
Node.js运行结果：
```
Hello World
错误
```
需要注意，JavaScript中的try/catch代码块不同，如果没有使用catch()方法指定错误处理的回调函数，那么Promise对象抛开的错误不会传递到外层代码，即不会有任何反应。

### 3.12.2 创建已处理的Promise

如果要将一个现有的对象转换为Promise对象，可以调用Promise.resolve()方法，该方法接收一个参数并返回一个完成状态的Promise，之后在返回的Promise对象上调用then()方法来获取值。

示例：
```
const promise = Promise.resolve("hello Vue.js");
promise.then(value => console.log(value));   //hello Vue.js
```

Promise.resolve()方法的参数分别以下3种情况：
+ (1)如果参数是一个Promise实例，那么将直接返回Promise,不做任何改动。
+ (2)如果参数是一个thenable对象（即具有then()方法的对象），那么会创建一个新的Promise对象，并立即执行thenable对象的then()方法，返回的Promise对象的最终状态由then()方法的执行决定。

示例：
```
const thenable = {
    then(resolve, reject) {
        resolve("Hello");
    }
}

const promise = Promise.resolve(thenable);   //会执行thenable对象的then()方法
promise.then(value => console.log(value));    //Hello
```
+ (3)如果参数为空，或者是基本数据类型，或者不带then()对象，那么返回Promise对象状态为fulfilled,并且将参数值传递给对应的then()方法。

通常来讲，如果不知道一个值是否为Promise对象，使用Promise.resolve(value)方法返回一个Promise对象，这样就能将该value以Promise对象形式使用。

Promise.reject(reason)方法也会返回一个新的Promise对象，并将给定的失败信息传递给对应的处理方法，返回的Promise对象状态为rejected。

实例：
```
const promise = Promise.reject('fail');
promise.catch(err => console.log(err)); //fail
```

### 3.12.3 响应多个Promise

如果需要等待多个异步任务完成后，再执行下一步的操作，那么可以调用Promise.all()方法，该方法可以接受一个参数并返回一个新的Promise对象，参数是一个包含多个Promise的可迭代对象（如数组）。返回的Promise对象在参数给出的所有Promise对象都成功的时候才会触发成功，一旦有任何一个Promise对象失败，则立即触发该Promise对象的失败。这个新的Promise对象在触发成功状态以后，会把所有Promise返回值的数组作为成功回调的返回值，顺序与可迭代对象中的Promise顺序保持一致；如果这个新的Promise对象触发了失败状态，它会把可迭代对象中第一个触发失败的Promise对象的错误信息作为它的失败错误信息。Promise.all()方法通常被用于处理多个Promise对象的状态集合。

示例：
```
const promise1 = Promise.resolve(5);
const promise2 = 10;
const promise3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'Hello');
});
const promise4 = new Promise((resolve, reject) => {
    throw new Error("错误");
});
Promise.all([promise1, promise2, promise3]).then(values => {
    console.log(values);
});
Promise.all([promise1, promise2, promise4]).then(values => {
    console.log(values);
}).catch(err => console.log(err.message));
```

如果Promise.all()方法的参数中包含非Promise值，这些值将被忽略，但任然会被放到返回的数组中（如果Promise都完成成功）。

上述结果：
```
错误
[ 5, 10, 'Hello' ]
```
ES6还提供了一个Promise.race()方法，同样也是传入多个Promise对象，但与Promise.all()方法的区别是，该方法是只要有任意一个Promise成功或失败，则返回的新的Promise对象就会用这个Promise对象的成功返回值或失败信息作为参数调用对应的回调函数。

示例：
```
const promise1 = Promise.resolve(5);
const promise2 = new Promise((resolve, reject) => {
    resolve(10);
});
const promise3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'Hello');
});

Promise.race([promise1, promise2, promise3]).then(value => {
    console.log(value);
});
```
运行结果：5

## 3.13 async函数

async函数是在ES2017标准引入的。async函数是使用async关键字声明的函数，async函数时AsyncFunction构造函数的实例。在async函数内部可以使用await关键字，表示紧跟在后面的表达式需要等待结果。async和await关键字可以用一种更简洁的方式写出基于Promise的异步行为，从而无须刻意链式调用Promise。

### 3.13.1 基本用法

async函数会返回一个Promise对象，如果一个async函数的返回值不是Promise，那么它会被隐式地包装到一个Promise中。

示例：
```
async function helloAsync() {
    return "Hello";
}

<!-- 等价于
function helloAsync() {
    return Promise.resolve("Hello");
}
 -->
console.log(helloAsync())  //Promise { 'Hello' }

helloAsync().then(v => {
    console.log(v);      //Hello
})
```
async函数内部return语句返回的值，会成为then()方法回调函数的参数。
async函数中可以有await表达式，async函数执行时，如果遇到await，就会先暂停执行，等到触发的异步操作完成后，再恢复async函数的执行并返回解析值。

```
function asyncOp() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("延时任务");
            resolve();
        }, 1000)
    });
}

async function helloAsync() {
    await asyncOp();
    console.log("Hello");
}

helloAsync();
```
如果helloAsync()函数执行时，在await处没有暂停，由于计时器设定的是在1s后才执行传入的匿名函数，那么在Console窗口中应该先看到Hello，然后才是“延时任务”。上述代码结果：
```
延时任务
Hello
```
async函数的函数体可以看作是由0个或多个await表达式分隔开来，从第一行代码开始直到第一个await（如果有）都是同步运行得。也就是一个不含await表达式的async函数时会同步运行得。然而，如果函数体有一个await表达式，async函数就一定会异步执行。

在await关键字后面，可以是Promise对象和原始类型的值。如果是原始类型的值，会自动转成立即resolved的Promise对象。

### 3.13.2 await和并行任务执行

在async函数中可以有多个任务，如果多个任务之间并不要求顺序执行，那么可以在await后面接Promise.all()方法并行执行多个任务。

示例：
```
const resolveAfter2Seconds = function() {
    console.log("starting slow promise");
    return new Promise(resolve => {
        setTimeout(function() {
            resolve("slow");
            console.log("slow promise is done");
        }, 2000);
    });
};

const resolveAfter1Seconds = function() {
    console.log("starting fast promise");
    return new Promise(resolve => {
        setTimeout(function() {
            resolve("fast");
            console.log("fast promise is done");
        }, 1000);
    });
};

const parallel = async function() {
    console.log("使用await Promise.all并行执行任务");
    //并行启动两个任务，等待两个任务都完成
    await Promise.all([
        (async() => console.log(await resolveAfter2Seconds()))(),
        (async() => console.log(await resolveAfter1Seconds()))(),
    ]);
}

parallel();
```
上述运行结果：
```
使用await Promise.all并行执行任务
starting slow promise
starting fast promise
fast promise is done
fast
slow promise is done
slow
```

### 3.13.3 使用async函数重写Promise链

返回Promise的API将产生一个Promise链，它将函数拆解成许多部分。
```
function getProcessedData(url) {
    return downloadData(url)           // 返回一个 promise 对象
        .catch(e => {
            return downloadFallbackData(url)   // 返回一个 promise 对象
        })
        .then(v => {
            return processDataInWorker(v);   // 返回一个 promise 对象
        });
}
```
可以重写单个async函数
```
async function getProcessedData(url) {
    let v;
    try {
        v = await downloadData(url);
    } catch (e) {
        v = await downloadFallbackData(url);
    }
    return processDataInWorker(v);
}
```

### 3.13.4 错误处理

如果async函数内部抛出错误，则会导致返回的Promise对象变为reject状态。抛出的错误对象会被catch()方法回调函数接收到。
```
async function helloAsync() {
    await new Promise(function (resolve, reject) {
        throw new Error('错误');
    });
}

helloAsync().then(v => console.log(v))
            .catch(e => console.log(e.message));    //错误
```
上述代码中，async函数helloAsync()执行后，await后面的Promise对象会抛出一个错误对象，导致catch()方法的回调函数会被调用，它的参数就是抛出的错误对象。

防止出错的方法是将await放到try/catch语句中
```
async function helloAsync() {
    try {
        await new Promise(function (resolve, reject) {
            throw new Error('错误');
        });
    } catch(e) {
        //错误处理
    }
    return await('hello');
}
```
如果有多个await，可以统一放到try/catch语句中。