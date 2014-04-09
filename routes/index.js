var crypto = require('crypto'),
    User = require('../models/user.js'),
    Task = require('../models/task.js'),
    ShareTask = require('../models/sharetask.js'),
    moment = require('moment');

module.exports = function (app) {
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
    app.get('/register', notAuthentication);
    app.get('/register', function (req, res) {
        res.render('register', {
            user: req.session.user
        });
    });
    app.post('/register', notAuthentication);
    app.post('/register', function (req, res) {
        var email = req.body.email,
            password = req.body.password,
            re_password = req.body['re-password'],
            hmd5 = crypto.createHash('md5'),
            email_MD5 = hmd5.update(email.toLowerCase()).digest('hex'),
            head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
        //检验用户两次输入的密码是否一致
        if (re_password != password) {
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

    app.get('/signin', notAuthentication);
    app.get('/signin', function (req, res) {
        res.render('signin', {});
    });
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
            console.log(user);
            req.session.user = user._doc;
            res.redirect('/');//登陆成功后跳转到主页
        });
    });

    app.get('/logout', authentication);
    app.get('/logout', function (req, res) {
        req.session.user = null;
        res.redirect('/');
    });

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

    app.get('/my', authentication);
    app.get('/my', function (req, res) {
        var userhead = null;
        if (req.session.user != null) {
            userhead = req.session.user.head;
        }
        console.log(moment().zone(8).format('L'));
        res.render('my', {
            user: req.session.user,
            userhead: req.session.user.head
        });
    });

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

    app.get('/getTaskByuId', function (req, res) {
        var userID = req.session.user._id;
        Task.getTaskByuId(userID, function (err, tasks) {
            res.json(tasks);
        });
    });

    app.get('/getTaskById/:id', function (req, res) {
        Task.getTaskById(req.params.id, function (err, task) {
            res.json(task);
        });
    });

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

    app.get('/deleteTaskById/:id', function (req, res) {
        Task.deleteTaskById(req.params.id, function (err) {
            if (err) {
                return err;
            }
            res.send({"status": 1});
        });
    });

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

    app.get('/getShareTaskById/:id', function (req, res) {
        ShareTask.getShareTaskById(req.params.id, function (err, sharetask) {
            res.json(sharetask);
        });
    });

    app.get('/getAllShareTasks', function (req, res) {
        var userID = req.session.user._id;
        ShareTask.getAllShareTasks(function (err, sharetasks) {
            res.json(sharetasks);
        });
    });

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

    function authentication(req, res, next) {
        if (!req.session.user) {
            req.session.error = '请先登陆';
            return res.redirect('/signin');
        }
        next();
    }

    function notAuthentication(req, res, next) {
        if (req.session.user) {
            req.session.error = '已登陆';
            return res.redirect('/my');
        }
        next();
    }

};