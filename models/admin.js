var mongodb = require('./mongodb');
var crypto = require('crypto');

var Schema = mongodb.mongoose.Schema;

var AdminSchema = new Schema({
    username: String,
    password: String,
    email: String,
    create: Date,
    head: String
});

var Admin = mongodb.mongoose.model("Admin", AdminSchema);

var AdminDAO = function () {
};

AdminDAO.prototype.save = function (user, callback) {
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


    var instance = new Admin(newUser);
    instance.save(function (err, user) {
        callback(err, user);
    });


};

//读取用户信息
AdminDAO.prototype.getUserByEmailAndUsername = function (email, username, callback) {
    Admin.find({$or: [
        {email: email},
        {username: username}
    ]}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改密码
AdminDAO.prototype.changePasswordByUsername = function (password, username, callback) {
    Admin.update({username: username},{password: password}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改邮箱
AdminDAO.prototype.changeEmailByUsername = function (email, username, callback) {
    Admin.update({username: username},{email: email}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改头像
AdminDAO.prototype.changeHeadByUsername = function (head, username, callback) {
    Admin.update({username: username},{head: head}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名删除用户
AdminDAO.prototype.deleteUserByUsername = function (username, callback) {
    Admin.remove({username: username}, function (err, user) {
        callback(err);
    });
};

AdminDAO.prototype.getUserByUsername = function (username, callback) {
    //正则表达式，不区分大小写搜索
    Admin.findOne({username: {$regex: username, $options: "i"}}, {username: 1, email: 1, create: 1, head: 1}, function (err, user) {
        callback(err, user);
    });
};

AdminDAO.prototype.getUserByEmail = function (email, callback) {
    Admin.findOne({email: email}, function (err, user) {
        callback(err, user);
    });
};

module.exports = new AdminDAO();
