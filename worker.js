
console.log('init woker')

self.onmessage = function (msg) {
    console.log(msg.data)
    eval(msg.data);
}