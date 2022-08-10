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