var mongodb = require('./mongodb');
var crypto = require('crypto');

var Schema = mongodb.mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    usernameLowerCase: String,
    password: String,
    email: String,
    checkEmail: {type: Boolean, default: false},
    checkEmailCode: {type: String, default: null},
    checkPassword: {type: Boolean, default: false},
    checkPasswordCode: {type: String, default: null},
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
        usernameLowerCase: user.username.toLowerCase(),
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
        {usernameLowerCase: username}
    ]}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改任意值
UserDAO.prototype.updateUserByUsername = function (data, username, callback) {
    User.update({usernameLowerCase: username}, data, function (err, user) {
        callback(err, user);
    });
};

//通过ID修改任意值
UserDAO.prototype.updateUserById = function (data, Id, callback) {
    User.update({_id: Id}, data, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改密码
UserDAO.prototype.changePasswordByUsername = function (password, username, callback) {
    User.update({usernameLowerCase: username}, {password: password}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改密码
UserDAO.prototype.changePasswordById = function (password, Id, callback) {
    User.update({_id: Id}, {password: password}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改邮箱
UserDAO.prototype.changeEmailByUsername = function (email, username, callback) {
    User.update({usernameLowerCase: username}, {email: email}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名修改头像
UserDAO.prototype.changeHeadByUsername = function (head, username, callback) {
    User.update({usernameLowerCase: username}, {head: head}, function (err, user) {
        callback(err, user);
    });
};

//通过用户名删除用户
UserDAO.prototype.deleteUserByUsername = function (username, callback) {
    User.remove({usernameLowerCase: username}, function (err, user) {
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
    User.findOne({usernameLowerCase: username}, {username: 1, email: 1, create: 1, head: 1, checkEmail: 1, checkEmailCode: 1, checkPasswordCode: 1, checkPassword: 1}, function (err, user) {
        callback(err, user);
    });
};

UserDAO.prototype.getUserByEmail = function (email, callback) {
    User.findOne({email: email}, function (err, user) {
        callback(err, user);
    });
};

UserDAO.prototype.getUserById = function (Id, callback) {
    User.findOne({_id: Id}, {username: 1, email: 1, create: 1, head: 1, checkEmail: 1, checkEmailCode: 1, checkPasswordCode: 1, checkPassword: 1}, function (err, user) {
        callback(err, user);
    });
};

UserDAO.prototype.getAllUsers = function (callback) {
    User.find({}).sort({create: 1}, {username: 1, email: 1, create: 1, head: 1}, function (err, user) {
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
    User.find({}).sort({create: -1}).skip(start).limit(10).exec(function (err, users) {
        callback(err, users);
    });
};

module.exports = new UserDAO();