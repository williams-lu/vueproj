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