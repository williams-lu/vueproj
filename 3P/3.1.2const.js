const person = {
    name: "zhangsan"
};

person.name = "lisi";
person.age = 20;

//错误，报错：Assignment to constant variable
person = {
    name: "wangwu"
};