
var app = angular.module("app", ["ngCookies"]);
app.controller("c", function ($scope, $http, $interval, $cookies) {




    //退出时删除cookie值
    $scope.leave = function () {
        $cookies.remove("name");
        window.location.href = "/";
    }

    //判断是否有cookie，有cookie就用展示已登录，没有cookie就展示未登录
    $scope.mycookie = true;
    if ($cookies.get("name")) {
        $scope.mycookie = false;
    } else {
        $scope.mycookie = true;
    }


    //设置banner,获取banner图片以及文字数据
    $http({
        method: "get",
        url: "/banner"
    }).then(function (msg) {
        $scope.bannerDatas = msg.data;
        var num = 0;
        $scope.carousel = function (index) {
            $(".show-nav li").eq(index).css("borderColor", "#ff9d00").siblings().css("borderColor", "transparent");
            $(".banner .show-image li").eq(index).css({ opacity: '1' }).siblings().css({ opacity: '0' });
            num = index;
        }

        //banner轮播(淡入淡出)，轮播时间3s
        var T1 = $interval(function () {
            num = num + 1;
            num = num % 5;
            $(".show-nav li").eq(num).css("borderColor", "#ff9d00").siblings().css("borderColor", "transparent");
            $(".banner .show-image li").eq(num).css({ opacity: '1' }).siblings().css({ opacity: '0' });
        }, 3000);

        //移入停止轮播，移出执行轮播
        $(".banner").hover(function () {
            $interval.cancel(T1);
        }, function () {
            T1 = $interval(function () {
                num = num + 1;
                num = num % 5;
                $(".show-nav li").eq(num).css("borderColor", "#ff9d00").siblings().css("borderColor", "transparent");
                $(".banner .show-image li").eq(num).css({ opacity: '1' }).siblings().css({ opacity: '0' });
            }, 3000);
        })

        //搜索框点击按钮切换
        $(".search-tab li").children().eq(0).css("backgroundPositionY", "-140px")
        $(".search-tab li").click(function () {
            $(this).children().css("backgroundPositionY", "-140px").parent().siblings().children().css("backgroundPositionY", "-110px");
            $(".search-bar .search-input").eq($(this).index()).css("display", "block").siblings().css("display", "none");
        });
    }, function () {
        alert("error");
    })

    //设置旅行家专栏,获取图片以及文字数据
    $http({
        method: "get",
        url: "/aside_traveller"
    }).then(function (msg) {
        var num1 = 0
        $scope.travellerDatas = msg.data;

        //设置点击白色按钮轮播（有缝）
        $(".slide-ol li").eq(0).css("background", "#ff9d00");
        $(".slide-ol li").click(function () {
            $(this).css("background", "#ff9d00").siblings().css("background", "");
            $(".slide-ul").css({ left: -$('.slide-ul').children().eq(0).outerWidth() * $(this).index() });
        });

        //设置自动轮播
        var T2 = $interval(function () {
            num1 = num1 + 1;
            num1 = num1 % 5;
            $(".slide-ol li").eq(num1).css("background", "#ff9d00").siblings().css("background", "");
            $(".slide-ul").css({ left: -$('.slide-ul').children().eq(0).outerWidth() * num1 });
        }, 3000);

        //移入停止轮播，移出执行轮播
        $(".box-traveller .slide-ul").hover(function () {
            $interval.cancel(T2);
        }, function () {
            T2 = $interval(function () {
                num1 = num1 + 1;
                num1 = num1 % 5;
                $(".slide-ol li").eq(num1).css("background", "#ff9d00").siblings().css("background", "");
                $(".slide-ul").css({ left: -$('.slide-ul').children().eq(0).outerWidth() * num1 });
            }, 3000);
        })
    }, function () {
        alert("error");
    });

    //设置我的活动，获取图片以及文字数据
    $http({
        method: "get",
        url: "/aside_activity"
    }).then(function (msg) {
        $scope.activityDatas = msg.data;
        //设置滚动条
        $(".h390 .asidebox-bd").slimScroll({
            height: "390px",
            color: "#666",
            size: "4px"
        });
        //设置点击切换事件
        $(".box-activity .hd-right a").eq(0).css("color", "#ff9d00")
        $(".box-activity .hd-right a").click(function () {
            $(this).css("color", "#ff9d00").siblings().css("color", "#666");
            if ($(this).text() == "正在进行") {
                $(".h390 .asidebox-bd").css("height", "390px");
            } else {
                $(".h390 .asidebox-bd").css("height", "0px");
            }
        });
    }, function () {
        alert("error");
    });

    //设置马蜂窝旅行网站最新进展,获取文字数据
    $http({
        method: "get",
        url: "/aside_news"
    }).then(function (msg) {
        $scope.newsDatas = msg.data;
    }, function () {
        alert("error");
    });

    //设置爆款热卖,获取图片及文字数据
    $http({
        method: "get",
        url: "/wrapper_sales"
    }).then(function (msg) {
        $scope.salesDatas = msg.data;
    }, function () {
        alert("error");
    });

    //热门（全部）分页事件  
    $scope.currentPage = 1;
    $scope.pages = function () {
        $http({
            method: "get",
            url: "/page",
        }).then(function (msg) {
            var datas = [];
            for (var i = 1; i <= msg.data; i++) {
                datas.push(i);
            }
            $scope.datas = datas;
            $scope.pageNum = msg.data;
            if ($scope.pageNum == 0) {
                $scope.currentPage = 1;
                $scope.showData($scope.currentPage);
            } else if ($scope.currentPage > $scope.pageNum && $scope.pageNum !== 0) {
                $scope.currentPage = $scope.pageNum;
                $scope.showData($scope.currentPage);
            }
        }, function () {
            alert("error");
        })
    }

    //兴趣分页事件 
    $scope.pages_interests = function () {
        $http({
            method: "get",
            url: "/page_interests",
            params: { title: $scope.title }
        }).then(function (msg) {
            var datas = [];
            for (var i = 1; i <= msg.data; i++) {
                datas.push(i);
            }
            $scope.datas = datas;
            $scope.pageNum = msg.data;
            if ($scope.pageNum == 0) {
                $scope.currentPage = 1;
                $scope.showData($scope.currentPage);
            } else if ($scope.currentPage > $scope.pageNum && $scope.pageNum !== 0) {
                $scope.currentPage = $scope.pageNum;
                $scope.showData($scope.currentPage);
            }
        }, function () {
            alert("error");
        })
    }


    //设置热门游记,获取图片及文字数据
    $http({
        method: "get",
        url: "/wrapper_notes"
    }).then(function (msg) {
        $http({
            method: "get",
            url: "/wrapper_notes",
            params: { pageNum: $scope.currentPage }
        }).then(function (msg) {
            $scope.noteDatas = msg.data;
            $scope.pages();
        }, function () {
            alert("error");
        })
        $scope.noteDatas = msg.data;
        //获取总条数 
        $http({
            method: "get",
            url: "/pageitems",
        }).then(function (msg) {
            $scope.pageitems = msg.data;
        }, function () {
            alert("error");
        })
    }, function () {
        alert("error");
    });

    //获取当页数据
    $scope.userDatas = [];
    $scope.getData = function () {
        $http({
            method: "get",
            url: "/wrapper_notes",
            params: { pageNum: $scope.currentPage }
        }).then(function (msg) {
            $scope.noteDatas = msg.data;
            console.log(msg.data)
            $scope.pages();
        }, function () {
            alert("error");
        })
    }

    //点击页数
    $scope.showData = function (index) {
        $(".tn-content").animate({ opacity: 0 }, 1000, function () {
            $scope.currentPage = index;
            if ($scope.showSelected == false) {

                $http({
                    method: "get",
                    url: "/wrapper_notes",
                    params: { pageNum: $scope.currentPage }
                }).then(function (msg) {
                    $scope.noteDatas = msg.data;
                    $scope.pages();
                }, function () {
                    alert("error");
                })
            } else {
                $http({
                    method: "get",
                    url: "/wrapper_notes_classify",
                    params: { pageNum: $scope.currentPage, title: $scope.title }
                }).then(function (msg) {
                    $scope.noteDatas = msg.data;
                    $scope.pages_interests();
                }, function () {
                    alert("error");
                })
            }

            //翻页时让页面跳转至note专栏的顶部
            $(".tn-content").css("opacity", "1");
            var tops = document.querySelector("#mfw-travelnotes").offsetTop;
            var t = setInterval(function () {
                var topTo = document.documentElement.scrollTop || document.body.scrollTop
                if (topTo <= tops) {
                    document.body.scrollTop = tops;
                    document.documentElement.scrollTop = tops;
                    clearInterval(t);
                }
                document.body.scrollTop = document.body.scrollTop - 30;
                document.documentElement.scrollTop = document.documentElement.scrollTop - 30;
                //匀速的变动
            }, 20)
        })

    }

    //插入文章头图
    $(".choose-file").change(function () {
        var fd = new FormData();
        fd.append("ff", $(".choose-file")[0].files[0])
        $.ajax({
            type: "post",
            url: "/insert_file",
            data: fd,
            processData: false,
            contentType: false,
            success: function (msg) {
                var imgs = "";
                imgs = imgs + "<img src='../" + msg.replace("/note/", "") + "'>";
                $(".set-bg").html(imgs);
            }
        })
    })

    //文章中插入图片
    var textarea = $(".textarea").html();
    $(".choose-file1").change(function () {
        var fd1 = new FormData();
        fd1.append("ff", $(".choose-file1")[0].files[0])
        $.ajax({
            type: "post",
            url: "/insert_file",
            data: fd1,
            processData: false,
            contentType: false,
            success: function (msg) {
                textarea = $(".textarea").html();
                textarea = textarea + "<img class='img-add' src='../" + msg.replace("/note/", "") + "'>";
                $(".textarea").html(textarea);
            }
        })
    })

    //点击弹出插入标题的框
    $scope.show = false;
    $scope.showPanel = function () {
        $scope.show = true;
    }

    //文章中插入标题
    $scope.addPanel = function ($event) {
        $event.stopPropagation();
        $scope.show = false;
        var innerPanel = $scope.aInput;
        textarea = $(".textarea").html();
        textarea = textarea + "<h2 class='t9'><span>" + innerPanel + "</span></h2>";
        $(".textarea").html(textarea);
    }

    //文章中上传音乐
    $(".choose-file2").change(function () {
        var fd2 = new FormData();
        fd2.append("ff", $(".choose-file2")[0].files[0])
        $.ajax({
            type: "post",
            url: "/insert_mp3",
            data: fd2,
            processData: false,
            contentType: false,
            success: function (msg) {
                var audio = "";
                audio = audio + "<span class='music'><audio loop='loop' autoplay='autoplay' controls='controls' src='../" + msg.path.replace("public/note/", "") + "'></audio>" + msg.name.replace(".mp3", "") + "</span>";
                $(".add-audio").html(audio)
            }
        })
    })

    //文章发表
    $scope.publish = function () {
        var string = ""
        $http({
            method: "get",
            url: "/publish",
            params: {
                imgUrl: $(".set-bg img").attr("src").replace("..", "note"),
                title: $(".set-title input").val(),
                userName: $cookies.get("name"),
                content: $(".textarea").text().substring(0, 100) + "...",
                html: document.documentElement.outerHTML
            }
        }).then(function (msg) {
            alert(msg.data);
            window.location.href = "../../index.html"
        });
    }

    //文章被顶加一
    $scope.dingAdd1 = function (idNum, dingNum, $event, title) {
        $event.stopPropagation();
        if ($scope.showSelected == false) {
            $http({
                method: "get",
                url: "/modify_dingNum",
                params: {
                    id: idNum,
                    dingNum: dingNum + 1
                }
            }).then(function (msg) {
                alert(msg.data)
                $http({
                    method: "get",
                    url: "/wrapper_notes"
                }).then(function (msg) {
                    $http({
                        method: "get",
                        url: "/wrapper_notes",
                        params: { pageNum: $scope.currentPage }
                    }).then(function (msg) {
                        $scope.noteDatas = msg.data;
                        $scope.pages();
                    }, function () {
                        alert("error");
                    })
                    $scope.noteDatas = msg.data;
                }, function () {
                    alert("error");
                });
            });
        } else {
            $http({
                method: "get",
                url: "/modify_dingNum",
                params: {
                    id: idNum,
                    dingNum: dingNum + 1
                }
            }).then(function (msg) {
                alert(msg.data);
                $http({
                    method: "get",
                    url: "/wrapper_notes_classify",
                    params: { pageNum: $scope.currentPage, title: $scope.title }
                }).then(function (msg) {
                    console.log(msg.data);
                    $scope.noteDatas = msg.data;
                    $scope.pages_interests();
                    $scope.showList = false;
                }, function () {
                    alert("error");
                })
            });
        }
    }

    //文章被阅读加一
    $scope.readAdd1 = function (idNum, readNum, $event) {
        $event.stopPropagation();
        if ($scope.showSelected == false) {
            $http({
                method: "get",
                url: "/modify_readNum",
                params: {
                    id: idNum,
                    readNum: readNum + 1
                }
            }).then(function (msg) {
                $http({
                    method: "get",
                    url: "/wrapper_notes",
                    params: { pageNum: $scope.currentPage }
                }).then(function (msg) {
                    $scope.noteDatas = msg.data;
                    $scope.pages();
                }, function () {
                    alert("error");
                })
                $scope.noteDatas = msg.data;
            }, function () {
                alert("error");
            });
        } else {
            $http({
                method: "get",
                url: "/modify_readNum",
                params: {
                    id: idNum,
                    readNum: readNum + 1
                }
            }).then(function (msg) {
                $http({
                    method: "get",
                    url: "/wrapper_notes_classify",
                    params: { pageNum: $scope.currentPage, title: $scope.title }
                }).then(function (msg) {
                    console.log(msg.data);
                    $scope.noteDatas = msg.data;
                    $scope.pages_interests();
                    $scope.showList = false;
                }, function () {
                    alert("error");
                })
            });
        }

    }

    //文章筛选框兴趣列表
    $http({
        method: "get",
        url: "/interests"
    }).then(function (msg) {
        $scope.interestsDatas = msg.data;
    }, function () {
        alert("error");
    });

    //点击关闭按钮关闭筛选框兴趣列表
    $scope.closeList = function () {
        $scope.showList = false;
    }

    //点击筛选按钮打开筛选框兴趣列表
    $scope.openList = function () {
        $scope.showList = true;
    }

    //选择感兴趣的列表完成筛选
    $scope.showSelected = false;
    $scope.title = "";
    $scope.chooseInterest = function (title) {
        $scope.currentPage = 1;
        $scope.showSelected = true;
        $scope.title = title;
        $http({
            method: "get",
            url: "/wrapper_notes_classify",
            params: { pageNum: $scope.currentPage, title: $scope.title }
        }).then(function (msg) {
            $scope.noteDatas = msg.data;
            $scope.pages_interests();
            $scope.showList = false;
            //获取总条数 
            $http({
                method: "get",
                url: "/pageitems_interests",
                params: { title: $scope.title }
            }).then(function (msg) {
                $scope.pageitems = msg.data;
            }, function () {
                alert("error");
            })
        }, function () {
            alert("error");
        })
    }

    //关闭已选兴趣，更新至热门游记
    $scope.closeSelected = function () {
        $scope.showSelected = false;
        $scope.currentPage = 1;
        $http({
            method: "get",
            url: "/wrapper_notes"
        }).then(function (msg) {
            $http({
                method: "get",
                url: "/wrapper_notes",
                params: { pageNum: $scope.currentPage }
            }).then(function (msg) {
                $scope.noteDatas = msg.data;
                $scope.pages();
            }, function () {
                alert("error");
            })
            $scope.noteDatas = msg.data;
            //获取总条数 
            $http({
                method: "get",
                url: "/pageitems",
            }).then(function (msg) {
                $scope.pageitems = msg.data;
            }, function () {
                alert("error");
            })
        }, function () {
            alert("error");
        });
    }

    //判断名字，如果是发布的文章就隐藏，如果是修改的文章就展示
    var filename = location.href;

    filename = filename.substr(filename.lastIndexOf('/') + 1);
    if (filename == "modify.html") {
        $scope.showall = true;
    } else {
        $scope.showall = false;
    }

    //
    // window.onscroll - function () {
    //     if (window.body.scrollTop > 500) {
    //         $(".container .sidebar").css({ position: "fixed", bottom: "150px", right: "100px" })
    //     }
    // }


    $(".top").click(function () {
        window.scrollTo(0, 0);
    });
})


