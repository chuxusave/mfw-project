var express = require("express");
var app = express();
//配置静态资源目录
app.use(express.static("public"));

//配置接收post请求数据
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
//设置接收json数据
app.use(bodyParser.json())

//配置接收文件的模块
var fs = require("fs");

//配置sql模块
var mysql = require("mysql");
var mysql_connect = mysql.createConnection({
    host: "127.0.0.1",
    user: "web",
    password: "javascriptISawesome123@@@",
    database: "mfw"
})

mysql_connect.connect();

//引入验证码模块
var captchapng = require("captchapng");
var code = null;

app.get("/code.png", function (req, res) {
    code = parseInt(Math.random() * 9000 + 1000);
    var p = new captchapng(80, 45, code);
    p.color(255, 168, 0);
    p.color(255, 255, 255);
    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    res.set('Content-Type', 'image/png');
    res.send(imgbase64)
})

//用户注册
app.post("/register", function (req, res) {
    console.log(code);
    console.log(req.body.Code);
    if (code == req.body.Code) {
        var sqlName = "select Name from user where Name=?";
        mysql_connect.query(sqlName, [req.body.Name], function (error, data) {
            if (data.length) {
                res.send("该用户已注册");
            } else {
                var sql = "insert into user(Name,Pwd) value(?,?)";
                var datas = [req.body.Name, req.body.Pwd];
                mysql_connect.query(sql, datas, function (error, data) {
                    if (error) {
                        res.send("服务器出错");
                    } else {
                        res.send("注册成功");
                    }
                })
            }
        })
    } else {
        res.send("验证码不正确")
    }
})

//加载路由模块
var route = require("./user_modules/route");
route.route(app, mysql_connect, code, fs);

//加载文件上传模块
var file = require("./user_modules/file");
file.file(app, "public/note/img/user_imgs");

//配置服务器端口号
app.listen(5000);