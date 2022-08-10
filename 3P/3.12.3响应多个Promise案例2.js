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