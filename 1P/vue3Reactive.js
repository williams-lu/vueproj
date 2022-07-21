// 判断某个值是否是对象的辅助方法
function isObject(val){
    return val !== null && typeof val === 'object';
}

// 响应式核心方法
function reactive(target){
    return createReactiveObject(target);
}

//创建响应式对象的方法
function createReactiveObject(target){
    // 如果target不是对象，则直接返回
    if(!isObject(target)){
        return target;
    }
    const baseHandler = {
        get(target, property, receiver){
            console.log('获取值');
            const result = Reflect.get(target, property, receiver);
            return result;
        },
        set(target, property, value, receiver){
            console.log('设置值');
            const result = Reflect.set(target, property, value, reactive);
            return result;
        },
        deleteProperty(target, property){
            return Reflect.deleteProperty(target, property);
        }
    }
    const observed = new Proxy(target, baseHandler);
    return observed;
}

const proxy = reactive({name: '张三'});
proxy.name = '李四';
console.log(proxy.name);