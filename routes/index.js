var crypto = require('crypto'),
    User = require('../models/user.js'),
    Task = require('../models/task.js'),
    ShareTask = require('../models/sharetask.js'),
    moment = require('moment');

module.exports = function (app) {
    //缺省页面
    app.get('/', function (req, res) {
        var userhead = null;
        if (req.session.user != null) {
            userhead = req.session.user.head;
        }
        res.render('index', {
            user: req.session.user,
            userhead: userhead
        });

    });
    //主页
    app.get('/index', function (req, res) {
        var userhead = null;
        if (req.session.user != null) {
            userhead = req.session.user.head;
        }
        res.render('index', {
            user: req.session.user,
            userhead: userhead
        });
    });
    //帮助页面
    app.get('/help', function (req, res) {
        var userhead = null;
        if (req.session.user != null) {
            userhead = req.session.user.head;
        }
        res.render('help', {
            user: req.session.user,
            userhead: userhead
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
        var email = req.body.email,
            confirm_email = req.body['confirm_email'],
            password = req.body.password,
            confirm_password = req.body['confirm_password'],
            hmd5 = crypto.createHash('md5'),
            email_MD5 = hmd5.update(email.toLowerCase()).digest('hex'),
            head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
        //检验用户两次输入的密码是否一致
        if (confirm_password != password) {
            return res.redirect('/register');//返回主册页
        }
        if (confirm_email != email) {
            return res.redirect('/register');//返回主册页
        }
        //生成密码的 md5 值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = {
            username: req.body.username,
            password: password,
            email: req.body.email,
            head: head
        };

        //检查邮箱是否已经存在
        User.getUserByEmailAndUsername(newUser.email, newUser.username, function (err, user) {
            if (user.length != 0) {
                req.session.error = 'user have';
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
    //登陆页面
    app.get('/signin', notAuthentication);
    app.get('/signin', function (req, res) {
        res.render('signin', {});
    });
    //提交登录
    app.post('/signin', notAuthentication);
    app.post('/signin', function (req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        //检查用户是否存在
        User.getUserByEmail(req.body.email, function (err, user) {
            if (!user) {
                return res.redirect('/signin');//用户不存在则跳转到登录页
            }
            //检查密码是否一致
            if (user.password != password) {
                return res.redirect('/signin');//密码错误则跳转到登录页
            }
            //用户名密码都匹配后，将用户信息存入 session
            //console.log(user);
            req.session.user = user._doc;
            res.redirect('/');//登陆成功后跳转到主页
        });
    });
    //登出
    app.get('/logout', authentication);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        res.redirect('/');
    });
    //分享圈页面
    app.get('/sharecircle', authentication);
    app.get('/sharecircle', function (req, res) {
        var userhead = null;
        if (req.session.user != null) {
            userhead = req.session.user.head;
        }
        res.render('sharecircle', {
            user: req.session.user,
            userhead: userhead
        });
    });
    //关于页面
    app.get('/about', function (req, res) {
        var userhead = null;
        if (req.session.user != null) {
            userhead = req.session.user.head;
        }
        res.render('about', {
            user: req.session.user,
            userhead: userhead
        });
    });
    //我的任务页面
    app.get('/my', authentication);
    app.get('/my', function (req, res) {
        var userhead = null;
        if (req.session.user != null) {
            userhead = req.session.user.head;
        }
        //console.log(moment().zone(8).format('L'));
        res.render('my', {
            user: req.session.user,
            userhead: req.session.user.head
        });
    });
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
            user_email: req.session.user.email
        };
        Task.save(newTask, function (err) {
            if (err) {
                return err;
            }
            res.send({"status": 1});
        });
    });

    //获得某一用户任务JSON
    app.get('/getTaskByuId', function (req, res) {
        var userID = req.session.user._id;
        Task.getTaskByuId(userID, function (err, tasks) {
            res.json(tasks);
        });
    });

    //获得某一ID的任务JSON
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

        var date = new Date();
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
    app.get('/deleteTaskById/:id', function (req, res) {
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
            user_email: req.body.user_email,
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
    //获得某一ID的分享任务JSON
    app.get('/getShareTaskById/:id', function (req, res) {
        ShareTask.getShareTaskById(req.params.id, function (err, sharetask) {
            res.json(sharetask);
        });
    });
    //获得所有分享任务JSON
    app.get('/getAllShareTasks', function (req, res) {
        var userID = req.session.user._id;
        ShareTask.getAllShareTasks(function (err, sharetasks) {
            res.json(sharetasks);
        });
    });
    //获得分享任务总页数JSON
    app.get('/getShareTasksSumPage', function (req, res) {
        ShareTask.getShareTasksSumPage(function (err, count) {
            //res.json(count);
            res.send({"count": count});
        });
    });
    //通过某个页数获得共享任务列表JSON
    app.get('/getShareTasksByPageCount/Page/:page', function (req, res) {
        ShareTask.getShareTasksByPageCount(req.params.page, function (err, shatetasks) {
            res.json(shatetasks);
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

    //404不存在页面
    app.use(function (req, res) {
        var userhead = null;
        if (req.session.user != null) {
            userhead = req.session.user.head;
        }
        res.status("404");
        res.render('404', {
            user: req.session.user,
            userhead: userhead
        });
    });
    //验证是否登录，没有权限不予通过
    function authentication(req, res, next) {
        if (!req.session.user) {
            req.session.error = '请先登陆';
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

};