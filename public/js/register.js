var app = angular.module("app", []);
app.controller("registerC", function ($scope, $http) {
    //获取注册页面背景图片
    $http({
        method: "get",
        url: "/register_bg"
    }).then(function (msg) {
        var bgNum = parseInt(Math.random() * 20);
        $scope.bgSrc = msg.data[bgNum].imgUrl
    }, function () {
        alert("error")
    })

    //判断是否为手机号码的正则表达式
    $scope.regexName = '^[1][34578][0-9]{9}$';

    //点击验证码进行更换
    $("#code").click(function () {
        var date = new Date().getTime();
        var imgSrc = "/code.png?date=" + date;
        $(this).children().attr("src", imgSrc);
    });

    //点击文字验证码进行更换
    $("label").click(function () {
        var date = new Date().getTime();
        var imgSrc = "/code.png?date=" + date;
        $(this).children().children().attr("src", imgSrc);
    });

    //用户注册，并将数据存入服务器数据库
    $scope.signin = function () {
        $http({
            method: "post",
            url: "/register",
            data: { Name: $scope.Name, Pwd: $scope.Pwd, Code: $scope.Code }
        }).then(function (msg) {
            alert(msg.data);
            if (msg.data == "验证码不正确") {
                var date = new Date().getTime();
                var imgSrc = "/code.png?date=" + date;
                $("#code img").attr("src", imgSrc);
                $http({
                    method: "get",
                    url: "/register_bg"
                }).then(function (msg) {
                    var bgNum = parseInt(Math.random() * 20);
                    $scope.bgSrc = msg.data[bgNum].imgUrl
                }, function () {
                    alert("error")
                })
            } else if (msg.data == "注册成功") {
                window.location.href = "http://localhost:5000/tpl/login.html"
            }
        }, function () {
            alert("error");
        })
    }
});