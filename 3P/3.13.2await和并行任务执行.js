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