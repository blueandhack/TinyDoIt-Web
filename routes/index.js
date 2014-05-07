var crypto = require('crypto'),
    User = require('../models/user.js'),
    Task = require('../models/task.js'),
    ShareTask = require('../models/sharetask.js'),
    Admin = require('../models/admin.js'),
    moment = require('moment'),
    fs = require('fs');

module.exports = function (app) {
    var configPath,
        checkConfig = 1;
    /*
     各种页面路由
     */
    //缺省页面
    app.get('/', function (req, res) {
        var userHead = null;
        if (req.session.user != null) {
            userHead = req.session.user.head;
        }
        res.render('index', {
            user: req.session.user,
            userHead: userHead
        });

    });
    //主页
    app.get('/index', function (req, res) {
        var userHead = null;
        if (req.session.user != null) {
            userHead = req.session.user.head;
        }
        res.render('index', {
            user: req.session.user,
            userHead: userHead
        });
    });
    //帮助页面
    app.get('/help', function (req, res) {
        var userHead = null;
        if (req.session.user != null) {
            userHead = req.session.user.head;
        }
        res.render('help', {
            user: req.session.user,
            userHead: userHead
        });
    });
    //注册页面
    app.get('/register', notAuthentication);
    app.get('/register', function (req, res) {
        res.render('register', {
            user: req.session.user
        });
    });
    //提交注册
    app.post('/register', notAuthentication);
    app.post('/register', function (req, res) {
        var email = req.body.email.toLowerCase(),
            username = req.body.username,
            confirm_email = req.body['confirm_email'].toLowerCase(),
            password = req.body.password,
            confirm_password = req.body['confirm_password'],
            hmd5 = crypto.createHash('md5'),
            email_MD5 = hmd5.update(email.toLowerCase()).digest('hex'),
            head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
        //检验用户两次输入的密码是否一致
        if (confirm_password != password) {
            req.session.error = '两次密码输入不一致';
            return res.redirect('/register');//返回主册页
        }
        if (confirm_email != email) {
            req.session.error = '两次邮箱输入不一致';
            return res.redirect('/register');//返回主册页
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5');
        password = md5.update(req.body.password).digest('hex');
        var newUser = {
            username: username,
            password: password,
            email: email,
            head: head
        };

        //检查邮箱与用户名是否已经存在
        User.getUserByEmail(newUser.email, function (err, user) {
            if (user != null) {
                req.session.error = '此邮箱已存在';
                return res.redirect('/register');
            }
            User.getUserByUsername(newUser.username, function (err, user) {
                if (user != null) {
                    req.session.error = '此用户已存在';
                    return res.redirect('/register');
                }
                User.save(newUser, function (err) {
                    User.getUserByEmail(newUser.email, function (err, user) {
                        req.session.user = user._doc;
                        res.redirect('/');
                    });
                });

            });
        });
    });
    //登陆页面
    app.get('/signin', notAuthentication);
    app.get('/signin', function (req, res) {
        res.render('signin', {});
    });
    //提交登录
    app.post('/signin', notAuthentication);
    app.post('/signin', function (req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex'),
            email = req.body.email.toLowerCase();
        console.log(email);
        //检查用户是否存在
        User.getUserByEmail(email, function (err, user) {
            console.log(user.email);
            if (!user) {
                req.session.error = '此用户不存在';
                return res.redirect('/signin');//用户不存在则跳转到登录页
            }
            //检查密码是否一致
            if (user.password != password) {
                req.session.error = '用户名或密码不正确';
                return res.redirect('/signin');//密码错误则跳转到登录页
            }
            //用户名密码都匹配后，将用户信息存入 session
            //console.log(user);
            req.session.user = user._doc;
            res.redirect('/');//登陆成功后跳转到主页
        });
    });
    //获取用户信息
    app.get('/getUserByUsername', function (req, res) {
        User.getUserByUsername(req.session.user.username, function (err, user) {
            res.json(user);
        });
    });
    //分享圈页面
    app.get('/sharecircle', authentication);
    app.get('/sharecircle', function (req, res) {
        var userHead = null;
        if (req.session.user != null) {
            userHead = req.session.user.head;
        }
        res.render('sharecircle', {
            user: req.session.user,
            userHead: userHead
        });
    });
    //关于页面
    app.get('/about', function (req, res) {
        var userHead = null;
        if (req.session.user != null) {
            userHead = req.session.user.head;
        }
        res.render('about', {
            user: req.session.user,
            userHead: userHead
        });
    });
    //我的任务页面
    app.get('/my', authentication);
    app.get('/my', function (req, res) {
        var userHead = null;
        if (req.session.user != null) {
            userHead = req.session.user.head;
        }
        //console.log(moment().zone(8).format('L'));
        res.render('my', {
            user: req.session.user,
            userHead: req.session.user.head
        });
    });
    //设置页面
    app.get('/settings', authentication);
    app.get('/settings', function (req, res) {
        var userHead = null;
        if (req.session.user != null) {
            userHead = req.session.user.head;
        }
        res.render('settings', {
            user: req.session.user,
            userHead: req.session.user.head
        });
    });

    //管理员设置界面
    app.get('/admin/config', function (req, res) {
        fs.exists('config.json', function (exists) {
            if (exists) {
                checkConfig = 1;
                console.log("文件已存在");
            }
            else {
                checkConfig = 0;
                console.log("文件不存在");
            }
            if (checkConfig == 0) {
                console.log("文件不存在");
                res.render('config');
            } else {
                console.log("文件已存在");
                return res.redirect("/");
            }
        });

    });
    app.post('/admin/config', function (req, res) {
        var path = req.body['path'],
            email = req.body.email.toLowerCase(),
            username = req.body.username,
            confirm_email = req.body['confirm_email'].toLowerCase(),
            password = req.body.password,
            confirm_password = req.body['confirm_password'],
            hmd5 = crypto.createHash('md5'),
            email_MD5 = hmd5.update(email).digest('hex'),
            head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5');
        password = md5.update(req.body.password).digest('hex');
        var newAdmin = {
            username: username,
            password: password,
            email: email,
            head: head
        };
        Admin.getUserByEmail(newAdmin.email, function (err, admin) {
            if (admin != null) {
                req.session.error = '此邮箱已存在';
                return res.redirect('/admin/config');
            }
            Admin.getUserByUsername(newAdmin.username, function (err, admin) {
                if (admin != null) {
                    req.session.error = '此用户已存在';
                    return res.redirect('/admin/config');
                }
                Admin.save(newAdmin, function (err) {
                    var config = {
                        path: path
                    };
                    var jsonPath = JSON.stringify(config);
                    fs.writeFile('config.json', jsonPath, function (err) {
                        if (err) throw err;
                        console.log('has finished');
                    });
                    Admin.getUserByEmail(newAdmin.email, function (err, admin) {
                        req.session.admin = admin._doc;
                        res.redirect(path + '/dashboard');//登陆成功后跳转到主页
                    });
                });
            });
        });
    });

    //匹配超级管理员路径
    app.get('/:x', function (req, res, next) {
        fs.exists('config.json', function (exists) {
            if (exists) {
                fs.readFile('config.json', function (err, data) {
                    if (err) throw err;
                    var jsonObj = JSON.parse(data);
                    configPath = jsonObj.path;
                    console.log(configPath);
                    var path = req.params.x;
                    if (path == configPath) {
                        if (req.session.admin) {
                            res.redirect('/' + configPath + '/dashboard');
                        } else {
                            res.redirect('/' + configPath + '/login');
                        }
                    } else {
                        next();
                    }
                });
            } else {
                next();
            }
        });

    });

    //超级管理员登陆界面
    app.get('/:x/login', function (req, res, next) {
        fs.exists('config.json', function (exists) {
            if (exists) {
                fs.readFile('config.json', function (err, data) {
                    if (err) throw err;
                    var jsonObj = JSON.parse(data);
                    configPath = jsonObj.path;
                    console.log(configPath);
                    var path = req.params.x;
                    if (path == configPath) {
                        if (!req.session.admin) {
                            res.render('login');
                        } else {
                            res.redirect('/' + configPath + '/dashboard');
                        }
                    } else {
                        next();
                    }
                });
            } else {
                next();
            }
        });

    });
    app.post('/:x/login', function (req, res, next) {
        fs.readFile('config.json', function (err, data) {
            if (err) throw err;
            var jsonObj = JSON.parse(data);
            configPath = jsonObj.path;
            console.log(configPath);
            var path = req.params.x;
            if (path == configPath) {
                var md5 = crypto.createHash('md5'),
                    password = md5.update(req.body.password).digest('hex'),
                    email = req.body.email.toLowerCase();
                console.log(email);
                //检查用户是否存在
                Admin.getUserByEmail(email, function (err, user) {
                    console.log(user.email);
                    if (!user) {
                        req.session.error = '此用户不存在';
                        return res.redirect('/' + configPath + '/login');//用户不存在则跳转到登录页
                    }
                    //检查密码是否一致
                    if (user.password != password) {
                        req.session.error = '用户名或密码不正确';
                        return res.redirect('/' + configPath + '/login');//密码错误则跳转到登录页
                    }
                    //用户名密码都匹配后，将用户信息存入 session
                    //console.log(user);
                    req.session.admin = user._doc;
                    res.redirect('/' + configPath + '/dashboard');//登陆成功后跳转到主页
                });
            } else {
                next();
            }

        });
    });

    //管理员控制面板
    app.get('/:x/dashboard', function (req, res, next) {
        fs.exists('config.json', function (exists) {
            if (exists) {
                fs.readFile('config.json', function (err, data) {
                    var userHead = null;
                    if (req.session.admin != null) {
                        userHead = req.session.admin.head;
                    }
                    if (err) throw err;
                    var jsonObj = JSON.parse(data);
                    configPath = jsonObj.path;
                    console.log(configPath);
                    var path = req.params.x;
                    if (path == configPath) {
                        if (req.session.admin) {
                            res.render('dashboard', {
                                user: req.session.admin,
                                userHead: userHead
                            });
                        }
                        else {
                            res.redirect('/' + configPath + '/login');
                        }
                    } else {
                        next();
                    }
                });
            } else {
                next();
            }
        });
    });

    //分享任务管理界面
    app.get('/:x/sharetasks', function (req, res, next) {
        fs.exists('config.json', function (exists) {
            if (exists) {
                fs.readFile('config.json', function (err, data) {
                    var userHead = null;
                    if (req.session.admin != null) {
                        userHead = req.session.admin.head;
                    }
                    if (err) throw err;
                    var jsonObj = JSON.parse(data);
                    configPath = jsonObj.path;
                    console.log(configPath);
                    var path = req.params.x;
                    if (path == configPath) {
                        if (req.session.admin) {
                            res.render('sharetasks', {
                                user: req.session.admin,
                                userHead: userHead
                            });
                        }
                        else {
                            res.redirect('/' + configPath + '/login');
                        }
                    } else {
                        next();
                    }
                });
            } else {
                next();
            }
        });
    });

    //用户管理界面
    app.get('/:x/users', function (req, res, next) {
        fs.exists('config.json', function (exists) {
            if (exists) {
                fs.readFile('config.json', function (err, data) {
                    var userHead = null;
                    if (req.session.admin != null) {
                        userHead = req.session.admin.head;
                    }
                    if (err) throw err;
                    var jsonObj = JSON.parse(data);
                    configPath = jsonObj.path;
                    console.log(configPath);
                    var path = req.params.x;
                    if (path == configPath) {
                        if (req.session.admin) {
                            res.render('users', {
                                user: req.session.admin,
                                userHead: userHead
                            });
                        }
                        else {
                            res.redirect('/' + configPath + '/login');
                        }
                    } else {
                        next();
                    }
                });
            } else {
                next();
            }
        });
    });

    //登出
    app.get('/signout', authentication);
    app.get('/signout', function (req, res) {
        req.session.user = null;
        res.redirect('/');
    });
    //管理员登出
    app.get('/:x/logout', function (req, res, next) {
        fs.exists('config.json', function (exists) {
            if (exists) {
                fs.readFile('config.json', function (err, data) {
                    if (err) throw err;
                    var jsonObj = JSON.parse(data);
                    configPath = jsonObj.path;
                    console.log(configPath);
                    var path = req.params.x;
                    if (path == configPath) {
                        if (req.session.admin) {
                            req.session.admin = null;
                            req.session.save();
                            res.redirect('');
                        } else {
                            res.redirect('/' + configPath + '/login');
                        }
                    } else {
                        next();
                    }
                });
            } else {
                next();
            }
        });
    });

    //404不存在页面
    app.use(function (req, res) {
        var userHead = null;
        if (req.session.user != null) {
            userHead = req.session.user.head;
        }
        res.status("404");
        res.render('404', {
            user: req.session.user,
            userHead: userHead
        });
    });
    //通过用户ID更改密码
    app.post('/changePasswordById/:id', function (req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        console.log(password);
        console.log(req.params.id);
        User.changePasswordById(password, req.params.id, function (err, user) {
            if (err) {
                req.session.error = '密码未能修改成功请重试';
                res.send({"status": 0});
                return err;
            }
            res.send({"status": 1});
        });
    });

    /*
     设置页面各项功能
     */
    //提交更改密码
    app.post('/changePassword', function (req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        User.changePasswordByUsername(password, req.session.user.username, function (err) {
            if (err) {
                req.session.error = '密码未能修改成功请重试';
                res.send({"status": 0});
                return err;
            }
            res.send({"status": 1});
        });
    });
    //提交更改邮箱
    app.post('/changeEmail', function (req, res) {
        var email = req.body.email.toLowerCase();
        //将email转换为小写并查找
        User.getUserByEmail(email, function (err, user) {
            if (user != null) {
                req.session.error = '此邮箱已存在，请重新输入';
                res.send({"status": 2});
                return err;
            }
            //将email转换为小写并更改
            User.changeEmailByUsername(email, req.session.user.username, function (err) {
                if (err) {
                    req.session.error = '邮箱未能修改成功请重试';
                    res.send({"status": 0});
                    return err;
                }
                var email = req.body.email,
                    hmd5 = crypto.createHash('md5'),
                    email_MD5 = hmd5.update(email.toLowerCase()).digest('hex'),
                    head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
                User.changeHeadByUsername(head, req.session.user.username, function (err) {
                    return err;
                });
                //重新刷新session
                User.getUserByEmail(email.toLowerCase(), function (err, user) {
                    req.session.user = user._doc;
                    req.session.save();
                });
                res.send({"status": 1});
            });
        });

    });
    //提交删除账户
    app.post('/deleteAccount', function (req, res) {
        User.deleteUserByUsername(req.session.user.username, function (err) {
            if (err) {
                req.session.error = '删除账户出现错误，请重试';
                res.send({"status": 0});
                return err;
            }
            res.send({"status": 1});
        });
    });
    //通过某一用户删除此用户所有任务
    app.post('/deleteTasksByUsername', function (req, res) {
        Task.deleteTasksByUsername(req.session.user.username, function (err) {
            if (err) {
                req.session.error = '清空账户所有内容出现错误，请重试';
                res.send({"status": 0});
                return err;
            }
            res.send({"status": 1});
        });
    });


    /*
     我的任务页面各项功能
     */
    //提交添加任务
    app.post('/addTask', function (req, res) {
        var tags = new Array(3);
        tags[0] = req.body.tag_one;
        tags[1] = req.body.tag_two;
        tags[2] = req.body.tag_three;

        var date = new Date();
        //Start Date
        var start_date = req.body.start_date;
        start_date = moment(start_date, "YYYY-MM-DD");

        var newTask = {
            check_task: false,
            title: req.body.title,
            description: req.body.description,
            start_date: start_date,
            tags: tags,
            box: req.body.box,
            priority: req.body.priority,
            uID: req.session.user._id,
            username: req.session.user.username
        };
        Task.save(newTask, function (err) {
            if (err) {
                return err;
            }
            res.send({"status": 1});
        });
    });
    //获得某一用户任务
    app.get('/getTaskByuId', function (req, res) {
        var userID = req.session.user._id;
        Task.getTaskByuId(userID, function (err, tasks) {
            res.json(tasks);
        });
    });
    //获得某一ID的任务
    app.get('/getTaskById/:id', function (req, res) {
        Task.getTaskById(req.params.id, function (err, task) {
            res.json(task);
        });
    });
    //提交更新某一ID的任务
    app.post('/updateTaskById/:id', function (req, res) {
        var tags = new Array(3);
        tags[0] = req.body.tag_one;
        tags[1] = req.body.tag_two;
        tags[2] = req.body.tag_three;
        //Start Date
        var start_date = req.body.start_date;
        start_date = moment(start_date, "YYYY-MM-DD");
        var changeTask = {
            title: req.body.title,
            description: req.body.description,
            start_date: start_date,
            tags: tags,
            box: req.body.box,
            priority: req.body.priority
        };
        Task.updateTaskById(req.params.id, changeTask, function (err) {
            if (err) {
                return err;
            }
            res.send({"status": 1});
        });
    });
    //提交完成某一ID的任务
    app.post('/doneTaskById/:id', function (req, res) {
        var changeTask = {
            check_task: true
        };
        Task.updateTaskById(req.params.id, changeTask, function (err) {
            if (err) {
                return err;
            }
            res.send({"status": 1});
        });
    });
    //提交删除某一ID的任务
    app.post('/deleteTaskById/:id', function (req, res) {
        Task.deleteTaskById(req.params.id, function (err) {
            if (err) {
                return err;
            }
            res.send({"status": 1});
        });
    });
    //提交添加分享任务
    app.post('/addShareTask', function (req, res) {
        var tags = new Array(3);
        tags[0] = req.body.tag_one;
        tags[1] = req.body.tag_two;
        tags[2] = req.body.tag_three;
        var newShareTask = {
            username: req.body.username,
            title: req.body.title,
            description: req.body.description,
            tags: tags
        };
        ShareTask.save(newShareTask, function (err) {
            if (err) {
                return err;
            }
            res.send({"status": 1});
        });
    });

    //通过某个日期获得今天任务页数
    app.get('/getTasksByToday/Date/:date/SumPage', function (req, res) {
        Task.getTasksPageByToday(req.params.date, req.session.user._id, function (err, count) {
            res.send({"count": count});
        });
    });
    //通过某个日期获得今天任务JSON
    app.get('/getTasksByToday/Date/:date/Page/:page', function (req, res) {
        Task.getTasksByToday(req.params.date, req.params.page, req.session.user._id, function (err, tasks) {
            res.json(tasks);
        });
    });


    //通过某个日期获得以前任务页数
    app.get('/getTasksByMiss/Date/:date/SumPage', function (req, res) {
        Task.getTasksPageByMiss(req.params.date, req.session.user._id, function (err, count) {
            res.send({"count": count});
        });
    });
    //通过某个日期获得以前任务JSON
    app.get('/getTasksByMiss/Date/:date/Page/:page', function (req, res) {
        Task.getTasksByMiss(req.params.date, req.params.page, req.session.user._id, function (err, tasks) {
            res.json(tasks);
        });
    });


    //通过某个日期获得未来任务页数
    app.get('/getTasksByTomorrow/Date/:date/SumPage', function (req, res) {
        Task.getTasksPageByTomorrow(req.params.date, req.session.user._id, function (err, count) {
            res.send({"count": count});
        });
    });
    //通过某个日期获得未来任务JSON
    app.get('/getTasksByTomorrow/Date/:date/Page/:page', function (req, res) {
        Task.getTasksByTomorrow(req.params.date, req.params.page, req.session.user._id, function (err, tasks) {
            res.json(tasks);
        });
    });

    //获得已完成的任务页数
    app.get('/getTasksPageByDone/SumPage', function (req, res) {
        Task.getTasksPageByDone(req.session.user._id, function (err, count) {
            res.send({"count": count});
        });
    });
    //获得已完成的任务JSON
    app.get('/getTasksByDone/Page/:page', function (req, res) {
        Task.getTasksByDone(req.params.page, req.session.user._id, function (err, tasks) {
            res.json(tasks);
        });
    });

    /*
     分享任务页面各项功能
     */
    //更改分享任务
    app.post('/changeShareTaskById/:id', function (req, res) {
        var tags = new Array(3);
        tags[0] = req.body.tag_one;
        tags[1] = req.body.tag_two;
        tags[2] = req.body.tag_three;
        var shareTask = {
            username: req.body.username,
            title: req.body.title,
            description: req.body.description,
            tags: tags
        };
        ShareTask.updateShareTaskById(req.params.id, shareTask, function (err) {
            if (err) {
                return err;
            }
            res.send({"status": 1});
        });
    });
    //删除某一ID的分享任务
    app.post('/deleteShareTaskById/:id', function (req, res) {
        ShareTask.deleteShareTaskById(req.params.id, function (err) {
            if (err) {
                return err;
            }
            res.send({"status": 1});
        });
    });
    //获得某一ID的分享任务
    app.get('/getShareTaskById/:id', function (req, res) {
        ShareTask.getShareTaskById(req.params.id, function (err, sharetask) {
            res.json(sharetask);
        });
    });
    //获得所有分享任务
    app.get('/getAllShareTasks', function (req, res) {
        var userID = req.session.user._id;
        ShareTask.getAllShareTasks(function (err, sharetasks) {
            res.json(sharetasks);
        });
    });
    //获得分享任务总页数
    app.get('/getShareTasksSumPage', function (req, res) {
        ShareTask.getShareTasksSumPage(function (err, count) {
            //res.json(count);
            res.send({"count": count});
        });
    });
    //通过某个页数获得共享任务列表
    app.get('/getShareTasksByPageCount/Page/:page', function (req, res) {
        ShareTask.getShareTasksByPageCount(req.params.page, function (err, shatetasks) {
            res.json(shatetasks);
        });
    });

    /*
     管理员控制面板各项功能
     */
    app.get('/getAllUsers', function (req, res) {
        User.getAllUsers(function (err, users) {
            res.json(users);
        });
    });
    app.get('/getUsersPage/SumPage', function (req, res) {
        User.getUsersPage(function (err, count) {
            res.send({"count": count});
        });
    });
    app.get('/getUsersByPage/Page/:page', function (req, res) {
        User.getUsersByPage(req.params.page, function (err, users) {
            res.json(users);
        });
    });
    app.post('/deleteAccountById/:id', function (req, res) {
        User.deleteUserById(req.params.id, function (err) {
            if (err) {
                req.session.error = '删除账户出现错误，请重试';
                res.send({"status": 0});
                return err;
            }
            res.send({"status": 1});
        });
    });
    app.get('/getUserById/:id', function (req, res) {
        User.getUserById(req.params.id, function (err, user) {
            res.json(user);
        });
    });
    app.get('/getUsersCount', function (req, res) {
        User.getUsersCount(function (err, count) {
            res.send({"count": count});
        });
    });
    app.get('/getShareTasksCount', function (req, res) {
        ShareTask.getShareTasksCount(function (err, count) {
            res.send({"count": count});
        });
    });
    app.get('/getTasksCount', function (req, res) {
        Task.getTasksCount(function (err, count) {
            res.send({"count": count});
        });
    });

    //提交更改管理员的邮箱
    app.post('/changeAdminEmail', function (req, res) {
        var email = req.body.email.toLowerCase();
        //将email转换为小写并查找
        Admin.getUserByEmail(email, function (err, admin) {
            if (admin != null) {
                req.session.error = '此邮箱已存在，请重新输入';
                res.send({"status": 2});
                return err;
            }
            //将email转换为小写并更改
            Admin.changeEmailByUsername(email, req.session.admin.username, function (err) {
                if (err) {
                    req.session.error = '邮箱未能修改成功请重试';
                    res.send({"status": 0});
                    return err;
                }
                var email = req.body.email,
                    hmd5 = crypto.createHash('md5'),
                    email_MD5 = hmd5.update(email.toLowerCase()).digest('hex'),
                    head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
                Admin.changeHeadByUsername(head, req.session.admin.username, function (err) {
                    return err;
                });
                //重新刷新session
                Admin.getUserByEmail(email.toLowerCase(), function (err, admin) {
                    req.session.admin = admin._doc;
                    req.session.save();
                });
                res.send({"status": 1});
            });
        });

    });
    //提交更改管理员密码
    app.post('/changeAdminPassword', function (req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        Admin.changePasswordByUsername(password, req.session.admin.username, function (err) {
            if (err) {
                req.session.error = '密码未能修改成功请重试';
                res.send({"status": 0});
                return err;
            }
            res.send({"status": 1});
        });
    });

    //提交删除管理员账户
    app.post('/deleteAdminAccount', function (req, res) {
        Admin.deleteUserByUsername(req.session.admin.username, function (err) {
            if (err) {
                req.session.error = '删除账户出现错误，请重试';
                res.send({"status": 0});
                return err;
            }
            fs.unlink('config.json', function (err) {
                if (err) {
                    throw err;
                }
                req.session.admin = null;
                req.session.save();
                res.send({"status": 1});
            });
        });
    });

    app.post('/deleteTaskByuID/:id', function (req, res) {
        Task.deleteTaskByuID(req.params.id, function (err) {
            if (err) {
                return err;
            }
            res.send({"status": 1});
        });
    });

    /*
     登录验证
     */
    //验证是否登录，没有权限不予通过
    function authentication(req, res, next) {
        if (!req.session.user) {
            req.session.error = '请您先登陆';
            return res.redirect('/signin');
        }
        next();
    }

    //验证是否登录，有权限允许通过
    function notAuthentication(req, res, next) {
        if (req.session.user) {
            req.session.error = '已登陆';
            return res.redirect('/my');
        }
        next();
    }

    //判断是否存在settings配置文件
    function existConfig(req, res, next) {
        fs.exists('config.json', function (exists) {
            if (exists) {
                checkConfig = 1;
                console.log("文件已存在");
            }
            else {
                checkConfig = 0;
                console.log("文件不存在");
            }
        });
        next();
    }

    function readConfig(req, res, next) {
        fs.readFile('config.json', function (err, data) {
            if (err) throw err;
            var jsonObj = JSON.parse(data);
            configPath = jsonObj.path;
        });
        next();
    }

};