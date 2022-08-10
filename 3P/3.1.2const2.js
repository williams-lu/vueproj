const person = {
    name:"zhangsan"
};

person.name = "lisi";   //OK
person.age = 20;     //OK

//错误，报错：Assignment to constant variable.
person = {
    name: "wangwu"
};