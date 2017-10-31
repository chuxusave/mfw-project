var app = angular.module("app", ["ngCookies"]);
app.controller("loginC", function ($scope, $http, $cookies) {
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

    //用户登录
    $scope.checked = false;
    $scope.loginTips = "";
    $scope.errorTip = false;
    $scope.login = function () {
        $http({
            method: "get",
            url: "/login",
            params: { name: $scope.Name, pwd: $scope.Pwd }
        }).then(function (msg) {
            $scope.loginTips = msg.data;
            if (msg.data == "登录成功") {
                if ($scope.checked) {
                    var d = new Date();
                    d.setDate(d.getDate() + 5);
                    $cookies.put("name", $scope.Name, { expires: d });
                } else {
                    $cookies.put("name", $scope.Name, { expires: "" });
                }
                window.location.href = "http://localhost:5000/index.html"
            } else {
                $scope.errorTip = true;
                $http({
                    method: "get",
                    url: "/register_bg"
                }).then(function (msg) {
                    var bgNum = parseInt(Math.random() * 20);
                    $scope.bgSrc = msg.data[bgNum].imgUrl
                }, function () {
                    alert("error")
                });
            }
        }, function () {
            alert("error");
        })
    }

});