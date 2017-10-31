var userData = []
//获取用户全部数据
$.ajax({
    type: "get",
    url: "/select_user",
    async: false,
    success: function (msg) {
        userData = msg;
    }
})


var app = angular.module("app", ["ngTable"]);

app.controller("editStoreItemController", editStoreItemController);
editStoreItemController.$inject = ["NgTableParams"];


app.controller("editStoreItemController", editStoreItemController);
editStoreItemController.$inject = ["NgTableParams"];

function editStoreItemController(NgTableParams) {
    var simpleList = userData;
    var vm = this;
    vm.tableParams = new NgTableParams({}, {
        dataset: simpleList
    });
}