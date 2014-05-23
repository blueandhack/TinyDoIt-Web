var mongodb = require('./mongodb');

var Schema = mongodb.mongoose.Schema;

var ShareTaskSchema = new Schema({
    title: String,
    description: String,
    tags: [String],
    username: String,
    usernameLowerCase: String,
    create_task_date: {type: Date, default: Date.now}
});


var ShareTask = mongodb.mongoose.model("ShareTask", ShareTaskSchema);

var ShareTaskDAO = function () {
};

//存储共享任务
ShareTaskDAO.prototype.save = function (sharetask, callback) {
    var instance = new ShareTask(sharetask);
    instance.save(function (err, sharetask) {
        callback(err, sharetask);
    });

};

ShareTaskDAO.prototype.updateShareTaskById = function (Id, shareTask, callback) {
    ShareTask.update({_id: Id}, shareTask, function (err, shareTask) {
        callback(err, shareTask);
    });
};

ShareTaskDAO.prototype.deleteShareTaskById = function (Id, callback) {
    ShareTask.remove({_id: Id}, function (err) {
        callback(err);
    });
};

//获得共享任务总页数
ShareTaskDAO.prototype.getShareTasksSumPage = function (callback) {
    ShareTask.count({}, function (err, count) {
        var pageCount = Math.ceil(count / 10);
        callback(err, pageCount);
    });
};

//通过页数获得某一页面的共享任务
ShareTaskDAO.prototype.getShareTasksByPageCount = function (page, callback) {
    var start = (page - 1) * 10;
    ShareTask.find().skip(start).limit(10).exec(function (err, sharetasks) {
        callback(err, sharetasks);
    });

};

//获得所有的共享任务
ShareTaskDAO.prototype.getAllShareTasks = function (callback) {
    ShareTask.find({}, function (err, sharetasks) {
        callback(err, sharetasks);
    });
};

//通过ID获得共享任务
ShareTaskDAO.prototype.getShareTaskById = function (Id, callback) {
    ShareTask.findOne({_id: Id}, function (err, sharetask) {
        callback(err, sharetask);
    });
};

ShareTaskDAO.prototype.getShareTasksCount = function (callback) {
    ShareTask.find({}).count({}, function (err, count) {
        callback(err, count);
    });
};

module.exports = new ShareTaskDAO();