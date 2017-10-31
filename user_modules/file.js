//配置文件上传模块
exports.file = function (app, path) {
    console.log("文件上传模块配置成功");
    var multipart = require("connect-multiparty");
    //设置文件上传路径
    app.use(multipart({ uploadDir: path }));
    //单文件上传
    app.post("/insert_file", function (req, res) {
        console.log(req.files);
        console.log(req.files.ff.name);
        res.send(req.files.ff.path.replace("public", ""));
    })
    //多文件上传
    app.post("/insert_files", function (req, res) {

        res.send(req.files);
    });

    app.post("/insert_mp3", function (req, res) {
        console.log(req.files.ff.path);
        console.log(req.files.ff.name);
        res.send(req.files.ff);
    })

}