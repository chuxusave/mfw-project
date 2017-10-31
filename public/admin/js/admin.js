var app = angular.module("app", ["ngCookies"]);
app.controller("adminC", function ($scope, $http, $interval, $cookies) {
    $scope.mycookie = $cookies.get("name");
    if (!$scope.mycookie) {
        window.location.href = "../admin/tpl/admin_login.html";
        return;
    }
    $scope.username = $cookies.get("name");
    $scope.showList1 = true;
    $scope.showList2 = false;
    $scope.show1 = function () {
        if ($scope.showList1) {
            $scope.showList1 = false;
        } else {
            $scope.showList1 = true;
        }
    }

    $scope.show2 = function () {
        if ($scope.showList2) {
            $scope.showList2 = false;
        } else {
            $scope.showList2 = true;
        }
    }

    $scope.leave = function () {
        $cookies.remove("name");
    }

})
