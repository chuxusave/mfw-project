var app = angular.module("app", ["ngCookies"]);
app.controller("c", function ($scope, $http, $interval, $cookies) {
    $(".row-hot .r-navbar a").eq(0).addClass("active");
    $(".row-hot .hot-list").eq(0).show().siblings("").hide();
    $(".row-hot .r-navbar a").mouseenter(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".row-hot .hot-list").eq($(this).index() / 2).show().siblings().hide();
    });

    //退出时删除cookie值
    $scope.leave = function () {
        $cookies.remove("name");
        window.location.href = "/";
    }

    // //判断是否有cookie，有cookie就用展示已登录，没有cookie就展示未登录
    // $scope.mycookie = true;
    // if ($cookies.get("name")) {
    //     $scope.mycookie = false;
    // } else {
    //     $scope.mycookie = true;
    // }


    //设置当季推荐,获取图片及文字数据
    $http({
        method: "get",
        url: "/seasons",
    }).then(function (msg) {
        $scope.seasonDatas = msg.data;
    }, function () {
        alert("error");
    });

    $scope.monthNum = 10;
    $scope.seasonChange = function (n) {
        $scope.monthNum = n;
    }

    //设置主题-全年适宜，获取图片及文字数据
    $http({
        method: "get",
        url: "/themes",
    }).then(function (msg) {
        $scope.themesDatas = msg.data;
        console.log($scope.themesDatas);
    }, function () {
        alert("error");
    });

    $scope.themeNum = 0;
    $scope.themeChange = function (n) {
        $scope.themeNum = n;
    }

})