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