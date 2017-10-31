//配置路由模块
exports.route = function (app, mysql, code, fs) {
    console.log("路由模块执行成功");

    //广告位置信息
    app.get("/banner", function (req, res) {
        var sql = "select * from banner";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //注册页面背景图片
    app.get("/register_bg", function (req, res) {
        var sql = "select * from register";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //登录页面
    app.get("/login", function (req, res) {
        var sql = "select Name,Pwd from user where (Name=? and Pwd=?)";
        mysql.query(sql, [req.query.name, req.query.pwd], function (error, data) {
            if (data.length) {
                res.send("登录成功");
            } else {
                res.send("用户名或密码不正确");
            }
        })
    });

    //aside旅行家专栏位置信息
    app.get("/aside_traveller", function (req, res) {
        var sql = "select * from aside_traveller";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //aside我的活动位置信息
    app.get("/aside_activity", function (req, res) {
        var sql = "select * from aside_activity";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //aside马蜂窝旅行网站最新进展位置信息
    app.get("/aside_news", function (req, res) {
        var sql = "select * from aside_news";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //wrapper爆款热卖位置信息
    app.get("/wrapper_sales", function (req, res) {
        var sql = "select * from wrapper_sales";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //wrapper热门游记位置信息
    app.get("/wrapper_notes", function (req, res) {
        var m = 10;
        var n = (req.query.pageNum - 1) * m;
        var sql = "select * from wrapper_note limit " + n + "," + m;
        mysql.query(sql, function (error, data) {
            // console.log(data);
            res.send(data);
        })
    });

    //总页数
    app.get("/page", function (req, res) {
        var sql = "select * from wrapper_note";
        mysql.query(sql, function (error, data) {
            var c = Math.ceil(data.length / 10);
            // console.log(c);
            res.send("" + c);
        })
    })

    //总条数
    app.get("/pageitems", function (req, res) {
        var sql = "select * from wrapper_note";
        // var start_time = new Date();
        mysql.query(sql, function (error, data) {
            // console.log(data);
            // var end_time = new Date();
            // console.log(end_time - start_time);
            res.send(data.length + "");
        })
    })


    //发布，插入一条数据
    app.get("/publish", function (req, res) {
        var sql = "insert into wrapper_note(imgUrl,title,userName,content) value(?,?,?,?)";
        mysql.query(sql, [req.query.imgUrl, req.query.title, req.query.userName, req.query.content], function (error, data) {
            fs.writeFile('public/note/create/' + data.insertId + '.html', req.query.html, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            res.send("发布成功")
        })
    })

    //修改文章被顶数
    app.get("/modify_dingNum", function (req, res) {
        var sql = "update wrapper_note set dingNum=? where id=?";
        mysql.query(sql, [req.query.dingNum, req.query.id], function (error, data) {
            res.send("游记成功被指定到前列");
        })
    })

    //修改文章被顶数
    app.get("/modify_readNum", function (req, res) {
        var sql = "update wrapper_note set readNum=? where id=?";
        mysql.query(sql, [req.query.readNum, req.query.id], function (error, data) {
            res.send("修改成功");
        })
    })

    //wrapper游记兴趣信息
    app.get("/interests", function (req, res) {
        var sql = "select * from interests";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //按照兴趣筛选wrapper_note信息
    app.get("/wrapper_notes_classify", function (req, res) {
        // console.log(req.query.title);
        var m = 10;
        var n = (req.query.pageNum - 1) * m;
        var sql = "select * from wrapper_note where classify='" + req.query.title + "' limit " + n + "," + m;
        // console.log(sql)
        mysql.query(sql, function (error, data) {
            // console.log(data);
            res.send(data);
        })
    });

    //按兴趣页数
    app.get("/page_interests", function (req, res) {
        var sql = "select * from wrapper_note where classify='" + req.query.title + "'";
        mysql.query(sql, function (error, data) {
            var c = Math.ceil(data.length / 10);
            // console.log(c);
            res.send("" + c);
        })
    })

    //按照兴趣筛选条数
    app.get("/pageitems_interests", function (req, res) {
        var sql = "select * from wrapper_note where classify='" + req.query.title + "'";
        mysql.query(sql, function (error, data) {
            res.send(data.length + "");
        })
    })

    //选择侧边栏活动数据
    app.get("/select_activity", function (req, res) {
        var sql = "select * from aside_activity";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //删除侧边栏活动单条数据
    app.get("/delete_activity", function (req, res) {
        var sql = "delete from aside_activity where id=?";
        mysql.query(sql, [req.query.id], function (error, data) {
            res.send("成功删除" + data.affectedRows + "条数据");
        })
    })

    //删除侧边栏活动多条数据
    // app.get("/delete_more", function (req, res) {
    //     var sql = "delete from aside_activity where id in(" + req.query.id + ")";
    //     mysql.query(sql, function (error, data) {
    //         res.send("成功删除" + data.affectedRows + "条数据");
    //     })
    // })

    //修改侧边栏活动数据
    app.get("/modify_activity", function (req, res) {
        // console.log(req.query);
        var sql = "update aside_activity set imgUrl=?,title=?,content=? where id=?";
        mysql.query(sql, [req.query.imgUrl, req.query.title, req.query.content, req.query.id], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                res.send("修改成功!");
            }
        });
    });

    //插入侧边栏活动数据
    app.get("/insert_activity", function (req, res) {
        var sql = "insert into aside_activity(imgUrl,title,content) value(?,?,?)";
        mysql.query(sql, [req.query.imgUrl, req.query.title, req.query.content], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                // console.log(data);
                res.send(data.insertId + "");
            }
        })
    });

    //选择侧边栏旅行家专栏数据
    app.get("/select_traveller", function (req, res) {
        var sql = "select * from aside_traveller";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //删除侧边栏旅行家专栏单条数据
    app.get("/delete_traveller", function (req, res) {
        var sql = "delete from aside_traveller where id=?";
        mysql.query(sql, [req.query.id], function (error, data) {
            res.send("成功删除" + data.affectedRows + "条数据");
        })
    })

    //修改侧边栏旅行家专栏数据
    app.get("/modify_traveller", function (req, res) {
        console.log(req.query);
        var sql = "update aside_traveller set imgUrl=?,title=?,content=? where id=?";
        mysql.query(sql, [req.query.imgUrl, req.query.title, req.query.content, req.query.id], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                res.send("修改成功!");
            }
        });
    });

    //插入侧边栏旅行家专栏数据
    app.get("/insert_traveller", function (req, res) {
        var sql = "insert into aside_traveller(imgUrl,title,content) value(?,?,?)";
        mysql.query(sql, [req.query.imgUrl, req.query.title, req.query.content], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                res.send(data.insertId + "");
            }
        })
    });

    //选择侧边栏马蜂窝旅行网站最新进展数据
    app.get("/select_news", function (req, res) {
        var sql = "select * from aside_news";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //删除侧边栏马蜂窝旅行网站最新进展单条数据
    app.get("/delete_news", function (req, res) {
        var sql = "delete from aside_news where id=?";
        mysql.query(sql, [req.query.id], function (error, data) {
            res.send("成功删除" + data.affectedRows + "条数据");
        })
    })

    //修改侧边栏马蜂窝旅行网站最新进展数据
    app.get("/modify_news", function (req, res) {
        // console.log(req.query);
        var sql = "update aside_news set date=?,title=? where id=?";
        mysql.query(sql, [req.query.date, req.query.title, req.query.id], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                res.send("修改成功!");
            }
        });
    });

    //插入侧边栏马蜂窝旅行网站最新进展数据
    app.get("/insert_news", function (req, res) {
        var sql = "insert into aside_news(date,title) value(?,?)";
        mysql.query(sql, [req.query.date, req.query.title], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                res.send(data.insertId + "");
            }
        })
    });

    //选择banner位数据
    app.get("/select_banner", function (req, res) {
        var sql = "select * from banner";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //删除banner位单条数据
    app.get("/delete_banner", function (req, res) {
        var sql = "delete from banner where id=?";
        mysql.query(sql, [req.query.id], function (error, data) {
            res.send("成功删除" + data.affectedRows + "条数据");
        })
    })

    //修改banner位数据
    app.get("/modify_banner", function (req, res) {
        // console.log(req.query);
        var sql = "update banner set imgUrl=?,imgTxt=?,imgPlace=?,imgNum=?,imgFrom=?,imgDate=? where id=?";
        mysql.query(sql, [req.query.imgUrl, req.query.imgTxt, req.query.imgPlace, req.query.imgNum, req.query.imgFrom, req.query.imgDate, req.query.id], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                res.send("修改成功!");
            }
        });
    });

    //插入banner位数据
    app.get("/insert_banner", function (req, res) {
        var sql = "insert into banner(imgUrl,imgTxt,imgPlace,imgNum,imgFrom,imgDate) value(?,?,?,?,?,?)";
        mysql.query(sql, [req.query.imgUrl, req.query.imgTxt, req.query.imgPlace, req.query.imgNum, req.query.imgFrom, req.query.imgDate], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                res.send(data.insertId + "");
            }
        })
    });

    //选择爆款热销商品数据
    app.get("/select_sales", function (req, res) {
        var sql = "select * from wrapper_sales";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //删除爆款热销商品单条数据
    app.get("/delete_sales", function (req, res) {
        var sql = "delete from wrapper_sales where id=?";
        mysql.query(sql, [req.query.id], function (error, data) {
            res.send("成功删除" + data.affectedRows + "条数据");
        })
    })

    //修改爆款热销商品数据
    app.get("/modify_sales", function (req, res) {
        // console.log(req.query);
        var sql = "update wrapper_sales set imgUrl=?,discount=?,price=?,time=?,content=? where id=?";
        mysql.query(sql, [req.query.imgUrl, req.query.discount, req.query.price, req.query.time, req.query.content, req.query.id], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                res.send("修改成功!");
            }
        });
    });

    //插入爆款热销商品数据
    app.get("/insert_sales", function (req, res) {
        var sql = "insert into wrapper_sales(imgUrl,discount,price,time,content) value(?,?,?,?,?)";
        mysql.query(sql, [req.query.imgUrl, req.query.discount, req.query.price, req.query.time, req.query.content], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                res.send(data.insertId + "");
            }
        })
    });

    //选择兴趣分类数据
    app.get("/select_interests", function (req, res) {
        var sql = "select * from interests";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //删除兴趣分类单条数据
    app.get("/delete_interests", function (req, res) {
        var sql = "delete from interests where id=?";
        mysql.query(sql, [req.query.id], function (error, data) {
            res.send("成功删除" + data.affectedRows + "条数据");
        })
    })

    //修改兴趣分类数据
    app.get("/modify_interests", function (req, res) {
        // console.log(req.query);
        var sql = "update interests set imgUrl=?,title=?,content=? where id=?";
        mysql.query(sql, [req.query.imgUrl, req.query.title, req.query.content, req.query.id], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                res.send("修改成功!");
            }
        });
    });

    //插入兴趣分类数据
    app.get("/insert_interests", function (req, res) {
        var sql = "insert into interests(imgUrl,title,content) value(?,?,?)";
        mysql.query(sql, [req.query.imgUrl, req.query.title, req.query.content], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                res.send(data.insertId + "");
            }
        })
    });

    //选择用户信息数据
    app.get("/select_user", function (req, res) {
        var sql = "select * from user";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //选择文章数据
    app.get("/select_note", function (req, res) {
        var sql = "select * from wrapper_note";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //删除文章单条数据
    app.get("/delete_note", function (req, res) {
        var sql = "delete from wrapper_note where id=?";
        mysql.query(sql, [req.query.id], function (error, data) {
            res.send("成功删除" + data.affectedRows + "条数据");
        })
    })

    //修改文章数据
    app.get("/modify_note", function (req, res) {
        // console.log(req.query);
        var sql = "update wrapper_note set place=?,classify=? where id=?";
        mysql.query(sql, [req.query.place, req.query.classify, req.query.id], function (e, data) {
            if (e) {
                res.send("服务器出错");
            } else {
                res.send("修改成功!");
            }
        });
    });

    //管理员登录后台管理页面
    app.get("/admin_login", function (req, res) {
        var sql = "select Name,Pwd from admin_user where (Name=? and Pwd=?)";
        mysql.query(sql, [req.query.name, req.query.pwd], function (error, data) {
            if (data.length) {
                res.send("登录成功")
            } else {
                res.send("用户名或密码错误")
            }
        })
    })

    //mdd当季推荐图片文字
    app.get("/seasons", function (req, res) {
        var sql = "select * from seasons";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });

    //mdd主题-全年适宜图片文字
    app.get("/themes", function (req, res) {
        var sql = "select * from themes";
        mysql.query(sql, function (error, data) {
            res.send(data);
        })
    });


}