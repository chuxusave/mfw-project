var simpleListData = []
//获取活动全部数据
$.ajax({
    type: "get",
    url: "/select_traveller",
    async: false,
    success: function (msg) {
        simpleListData = msg;
    }
})

angular.module("myApp", ["ngTable"]);


angular.module("myApp", ["ngTable"]).value("$travellerData", simpleListData);

(function () {
    "use strict";

    angular.module("myApp").controller("demoController", demoController);
    demoController.$inject = ["NgTableParams", "$scope", "$http", "$travellerData"];

    function demoController(NgTableParams, $scope, $http, $travellerData) {

        var self = this;

        var simpleList = $travellerData;
        var originalData = angular.copy(simpleList);

        self.tableParams = new NgTableParams({}, {
            filterDelay: 0,
            dataset: angular.copy(simpleList)
        });


        self.add = add;
        self.cancel = cancel;
        self.del = del;
        self.save = save;

        //添加数据
        function add() {
            self.isAdding = true;
            //建立新数据（添加的一行）
            self.newRow = {
                //新建数据初始化
                id: "",
                imgUrl: "",
                title: "",
                content: "",
                isEditing: true,
            }
            self.tableParams.settings().dataset.unshift(self.newRow);
            self.tableParams.sorting({});
            self.tableParams.page(1);
            self.tableParams.reload();
        }

        //取消当前的操作，数据恢复到原数据
        function cancel(row, rowForm) {
            if (self.isAdding) {
                _.remove(self.tableParams.settings().dataset, function (item) {
                    return row === item;
                });
                self.tableParams.reload().then(function (data) {
                    if (data.length === 0 && self.tableParams.total() > 0) {
                        self.tableParams.page(self.tableParams.page() - 1);
                        self.tableParams.reload();
                    }
                });
            } else {
                var originalRow = resetRow(row, rowForm);
                angular.extend(row, originalRow);
            }
        }

        //删除单行数据
        function del(row) {
            $http({
                method: "get",
                url: "/delete_traveller",
                params: { id: row.id }
            }).then(function (msg) {
                alert(msg.data);
                _.remove(self.tableParams.settings().dataset, function (item) {
                    return row === item;
                });
                self.tableParams.reload().then(function (data) {
                    if (data.length === 0 && self.tableParams.total() > 0) {
                        self.tableParams.page(self.tableParams.page() - 1);
                        self.tableParams.reload();
                    }
                });
            }, function () {
                alert("error")
            })

        }

        //重置当前行
        function resetRow(row, rowForm) {
            row.isEditing = false;
            rowForm.$setPristine();
            self.tableTracker.untrack(row);
            return _.find(originalData, function (r) {
                return r.id === row.id;
            });
        }

        //判断保存的是否是新增内容，如果是就插入数据，编辑的数据就修改
        function save(row, rowForm, oldId) {
            if (self.isAdding) {
                $http({
                    method: "get",
                    url: "/insert_traveller",
                    params: { imgUrl: row.imgUrl, title: row.title, content: row.content }
                }).then(function (msg) {
                    alert(msg.data);
                    row.id = msg.data;
                    angular.extend(self.newRow, row, { isEditing: false });
                    self.isAdding = false;
                    rowForm.$setPristine();
                }, function () {
                    self.isAdding = false;
                    alert("error")
                })
            } else {
                $http({
                    method: "get",
                    url: "/modify_traveller",
                    params: { id: row.id, imgUrl: row.imgUrl, title: row.title, content: row.content }
                }).then(function (msg) {
                    alert(msg.data);
                    if (msg.data == "修改成功!") {
                        //这里的save是为了让originalData变成最新的更改的样子，而不是去保存数据，因为数据已经通过双向绑定绑在了self上
                        var originalRow = resetRow(row, rowForm);
                        angular.extend(originalRow, row);
                    }
                }, function () {
                    alert("error")
                })
            }
        }
    }
})();

(function () {
    angular.module("myApp").directive("demoTrackedTable", demoTrackedTable);

    demoTrackedTable.$inject = [];

    function demoTrackedTable() {
        return {
            restrict: "A",
            priority: -1,
            require: "ngForm",
            controller: demoTrackedTableController
        };
    }

    demoTrackedTableController.$inject = ["$scope", "$parse", "$attrs", "$element"];

    function demoTrackedTableController($scope, $parse, $attrs, $element) {
        var self = this;
        var tableForm = $element.controller("form");
        var dirtyCellsByRow = [];
        var invalidCellsByRow = [];

        init();

        function init() {
            var setter = $parse($attrs.demoTrackedTable).assign;
            setter($scope, self);
            $scope.$on("$destroy", function () {
                setter(null);
            });

            self.reset = reset;
            self.isCellDirty = isCellDirty;
            self.setCellDirty = setCellDirty;
            self.setCellInvalid = setCellInvalid;
            self.untrack = untrack;
        }

        function getCellsForRow(row, cellsByRow) {
            return _.find(cellsByRow, function (entry) {
                return entry.row === row;
            })
        }

        function isCellDirty(row, cell) {
            var rowCells = getCellsForRow(row, dirtyCellsByRow);
            return rowCells && rowCells.cells.indexOf(cell) !== -1;
        }

        function reset() {
            dirtyCellsByRow = [];
            invalidCellsByRow = [];
            setInvalid(false);
        }

        function setCellDirty(row, cell, isDirty) {
            setCellStatus(row, cell, isDirty, dirtyCellsByRow);
        }

        function setCellInvalid(row, cell, isInvalid) {
            setCellStatus(row, cell, isInvalid, invalidCellsByRow);
            setInvalid(invalidCellsByRow.length > 0);
        }

        function setCellStatus(row, cell, value, cellsByRow) {
            var rowCells = getCellsForRow(row, cellsByRow);
            if (!rowCells && !value) {
                return;
            }

            if (value) {
                if (!rowCells) {
                    rowCells = {
                        row: row,
                        cells: []
                    };
                    cellsByRow.push(rowCells);
                }
                if (rowCells.cells.indexOf(cell) === -1) {
                    rowCells.cells.push(cell);
                }
            } else {
                _.remove(rowCells.cells, function (item) {
                    return cell === item;
                });
                if (rowCells.cells.length === 0) {
                    _.remove(cellsByRow, function (item) {
                        return rowCells === item;
                    });
                }
            }
        }

        function setInvalid(isInvalid) {
            self.$invalid = isInvalid;
            self.$valid = !isInvalid;
        }

        function untrack(row) {
            _.remove(invalidCellsByRow, function (item) {
                return item.row === row;
            });
            _.remove(dirtyCellsByRow, function (item) {
                return item.row === row;
            });
            setInvalid(invalidCellsByRow.length > 0);
        }
    }
})();

(function () {
    angular.module("myApp").directive("demoTrackedTableRow", demoTrackedTableRow);

    demoTrackedTableRow.$inject = [];

    function demoTrackedTableRow() {
        return {
            restrict: "A",
            priority: -1,
            require: ["^demoTrackedTable", "ngForm"],
            controller: demoTrackedTableRowController
        };
    }

    demoTrackedTableRowController.$inject = ["$attrs", "$element", "$parse", "$scope"];

    function demoTrackedTableRowController($attrs, $element, $parse, $scope) {
        var self = this;
        var row = $parse($attrs.demoTrackedTableRow)($scope);
        var rowFormCtrl = $element.controller("form");
        var trackedTableCtrl = $element.controller("demoTrackedTable");

        self.isCellDirty = isCellDirty;
        self.setCellDirty = setCellDirty;
        self.setCellInvalid = setCellInvalid;

        function isCellDirty(cell) {
            return trackedTableCtrl.isCellDirty(row, cell);
        }

        function setCellDirty(cell, isDirty) {
            trackedTableCtrl.setCellDirty(row, cell, isDirty)
        }

        function setCellInvalid(cell, isInvalid) {
            trackedTableCtrl.setCellInvalid(row, cell, isInvalid)
        }
    }
})();

(function () {
    angular.module("myApp").directive("demoTrackedTableCell", demoTrackedTableCell);

    demoTrackedTableCell.$inject = [];

    function demoTrackedTableCell() {
        return {
            restrict: "A",
            priority: -1,
            scope: true,
            require: ["^demoTrackedTableRow", "ngForm"],
            controller: demoTrackedTableCellController
        };
    }

    demoTrackedTableCellController.$inject = ["$attrs", "$element", "$scope"];

    function demoTrackedTableCellController($attrs, $element, $scope) {
        var self = this;
        var cellFormCtrl = $element.controller("form");
        var cellName = cellFormCtrl.$name;
        var trackedTableRowCtrl = $element.controller("demoTrackedTableRow");

        if (trackedTableRowCtrl.isCellDirty(cellName)) {
            cellFormCtrl.$setDirty();
        } else {
            cellFormCtrl.$setPristine();
        }

        $scope.$watch(function () {
            return cellFormCtrl.$dirty;
        }, function (newValue, oldValue) {
            if (newValue === oldValue) return;

            trackedTableRowCtrl.setCellDirty(cellName, newValue);
        });

        $scope.$watch(function () {
            return cellFormCtrl.$invalid;
        }, function (newValue, oldValue) {
            if (newValue === oldValue) return;

            trackedTableRowCtrl.setCellInvalid(cellName, newValue);
        });
    }
})();