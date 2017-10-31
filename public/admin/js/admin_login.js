var app = angular.module("app", ["ngCookies"]);
app.controller("adminLoginC", function ($scope, $http, $cookies) {
    $scope.mycookie = $cookies.get("name");
    if ($scope.mycookie) {
        window.location.href = "../admin/admin.html";
        return;
    }
    //管理员登录
    $scope.checked = false;
    $scope.errorTip = false;
    $scope.login = function () {
        $http({
            method: "get",
            url: "/admin_login",
            params: { name: $scope.Name, pwd: $scope.Pwd }
        }).then(function (msg) {
            if (msg.data == "登录成功") {
                if ($scope.checked) {
                    var d = new Date();
                    d.setDate(d.getDate() + 5);
                    $cookies.put("name", $scope.Name, { expires: d, path: '/admin' });
                } else {
                    $cookies.put("name", $scope.Name, { expires: "", path: '/admin' });
                }
                window.location.href = "../admin.html";
            } else {
                $scope.errorTip = true;
            }
        }, function () {
            alert("error");
        })
    }
});