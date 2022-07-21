
// 对Object.defineProperty（） 方法进行封装
function defineReactive(obj, key, value){
    Object.defineProperty(obj, key, {
        get(){
            return vaule;
        },
        set(newValue){
            if(newValue !== value){
                updateView(); //在set（）方法中触发更新
                value = newValue;
            }
        }
    });
}

//对一个对象中所有属性的变化进行侦测
function observer(target){
    //如果不是对象数据类型，则直接返回
    if(typeof target !== 'object'){
        return target;
    }

    //循坏遍历对象的所有属性，并将它们转换为getter和setter形式
    for(let key in target){
        defineReactive(target, key, target[key]);
    }
}

//模拟更新视图的方法
function updateView(){
    console.log("更新视图");
}

let user = {name: '张三'}
//对user对象的所有属性变化进行侦测
observer(user);
user.name = '李四';