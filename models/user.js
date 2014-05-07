var mongodb = require('./mongodb');
var crypto = require('crypto');

var Schema = mongodb.mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    create: Date,
    head: String
});

var User = mongodb.mongoose.model("User", UserSchema);

var UserDAO = function () {
};

UserDAO.prototype.save = function (user, callback) {
    var md5 = crypto.createHash('md5'),
        email_MD5 = md5.update(user.email.toLowerCase()).digest('hex'),
        head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
    var date = new Date();
    //要存入数据库的用户信息文档
    var newUser = {
        username: user.username,
        password: user.password,
        email: user.email,
        head: head,
        create: date
    };


    var instance = new User(newUser);
    instance.save(function (err, user) {
        callback(err, user);
    });


};

//读取用户信息
UserDAO.prototype.getUserByEmailAndUsername = function (email, username, callback) {
    User.find({$or: [
        {email: email},
        {username: username}
    ]}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改密码
UserDAO.prototype.changePasswordByUsername = function (password, username, callback) {
    User.update({username: username},{password: password}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改密码
UserDAO.prototype.changePasswordById = function (password, Id, callback) {
    User.update({_id: Id},{password: password}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改邮箱
UserDAO.prototype.changeEmailByUsername = function (email, username, callback) {
    User.update({username: username},{email: email}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改头像
UserDAO.prototype.changeHeadByUsername = function (head, username, callback) {
    User.update({username: username},{head: head}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名删除用户
UserDAO.prototype.deleteUserByUsername = function (username, callback) {
    User.remove({username: username}, function (err, user) {
        callback(err);
    });
};
//通过ID删除用户
UserDAO.prototype.deleteUserById = function (Id, callback) {
    User.remove({_id: Id}, function (err, user) {
        callback(err);
    });
};

UserDAO.prototype.getUserByUsername = function (username, callback) {
    //正则表达式，不区分大小写搜索
    User.findOne({username: {$regex: username, $options: "i"}}, {username: 1, email: 1, create: 1, head: 1}, function (err, user) {
        callback(err, user);
    });
};

UserDAO.prototype.getUserByEmail = function (email, callback) {
    User.findOne({email: email}, function (err, user) {
        callback(err, user);
    });
};

UserDAO.prototype.getUserById = function (Id, callback) {
    User.findOne({_id: Id},{username: 1, email: 1, create: 1, head: 1}, function (err, user) {
        callback(err, user);
    });
};

UserDAO.prototype.getAllUsers = function (callback) {
    User.find({}, {username: 1, email: 1, create: 1, head: 1},function (err, user) {
        callback(err, user);
    });
};

UserDAO.prototype.getUsersCount = function (callback) {
    User.find({}).count({}, function (err, count) {
        callback(err, count);
    });
};

//获得用户总页数
UserDAO.prototype.getUsersPage = function (callback) {
    User.find({}).count({}, function (err, count) {
        var pageCount = Math.ceil(count / 10);
        callback(err, pageCount);
    });
};
//通过页数获取用户
UserDAO.prototype.getUsersByPage = function (page, callback) {
    var start = (page - 1) * 10;
    User.find({}).skip(start).limit(10).exec(function (err, users) {
        callback(err, users);
    });
};

module.exports = new UserDAO();