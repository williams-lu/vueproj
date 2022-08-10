async function helloAsync() {
    await new Promise(function (resolve, reject) {
        throw new Error('错误');
    });
}

helloAsync().then(v => console.log(v))
            .catch(e => console.log(e.message));    //错误