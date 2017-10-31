//验证码模块
// exports.code = function (app) {
//     console.log("验证码模块执行成功");
//     var code = null;
//     var captchapng = require('captchapng');
//     app.get("/code.png", function (req, res) {
//         code = parseInt(Math.random() * 9000 + 1000)
//         var p = new captchapng(80, 30, code);
//         p.color(0, 0, 0);
//         p.color(255, 255, 255);
//         var img = p.getBase64();
//         var imgbase64 = new Buffer(img, 'base64');
//         res.set('Content-Type', 'image/png');
//         res.send(imgbase64);
//     })
// }