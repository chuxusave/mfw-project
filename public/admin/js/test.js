var app = angular.module("app", []);
app.controller("activityC", function ($scope, $http, $interval) {
    //获取活动全部数据
    $http({
        method: "get",
        url: "/select_activity",
    }).then(function (msg) {
        console.log(msg.data)
        var new_data = msg.data.map(function (user) {
            return {
                id: user.id,
                imgUrl: user.imgUrl,
                title: user.title,
                content: user.content,
                selected: false,
            }
        });
        $scope.userdata = new_data;
    }, function () {
        alert("error");
    })

    //删除单行数据
    $scope.delData = function (idIndex, index) {
        $http({
            method: "get",
            url: "/delete_activity",
            params: { id: idIndex }
        }).then(function (msg) {
            alert(msg.data);
            $scope.userdata.splice(index, 1);
        }, function () {
            alert("error")
        })
    }

    //删除多行数据
    var filteredData = null;
    var filteredDataSelected = null;
    $scope.delMoreData = function () {
        var filteredData = $scope.userdata.filter(function (user) {
            return user.selected == true;
        });
        var filteredDataId = filteredData.map(function (user) {
            return user.id;
        })
        var filteredDataSelected = filteredData.map(function (user) {
            return user.selected
        })
        $http({
            method: "get",
            url: "/delete_more",
            params: { id: filteredDataId }
        }).then(function (msg, index) {
            alert(msg.data);
            $scope.userdata = $scope.userdata.filter(function (user) {
                return user.selected == false;
            })
        }, function () {
            alert("error");
        })
    }

})