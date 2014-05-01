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
    var user = {
        username: user.username,
        password: user.password,
        email: user.email,
        head: head,
        create: date
    };


    var instance = new User(user);
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
    User.findOne({username: username}).update({password: password}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改邮箱
UserDAO.prototype.changeEmailByUsername = function (email, username, callback) {
    User.findOne({username: username}).update({email: email}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名删除用户
UserDAO.prototype.deleteUserByUsername = function (username, callback) {
    User.remove({username: username},function (err, user) {
        callback(err);
    });
};

UserDAO.prototype.getUserByUsername = function (username, callback) {
    User.findOne({username: username}, {username: 1, email: 1, create: 1, head: 1}, function (err, user) {
        callback(err, user);
    });
};

UserDAO.prototype.getUserByEmail = function (email, callback) {
    User.findOne({email: email}, function (err, user) {
        callback(err, user);
    });
};

module.exports = new UserDAO();