var mongodb = require('./mongodb');
var moment = require('moment');

var Schema = mongodb.mongoose.Schema;

var TaskSchema = new Schema({
    check_task: {type: Boolean, default: false},
    title: String,
    description: String,
    start_date: Date,
    tags: [String],
    box: Number,
    priority: Number,
    uID: String,
    user_email: String,
    create_task_date: {type: Date, default: moment().zone(8).format()}

});

var Task = mongodb.mongoose.model("Task", TaskSchema);

var TaskDAO = function () {
};

TaskDAO.prototype.save = function (task, callback) {
    var instance = new Task(task);
    instance.save(function (err, task) {
        callback(err, task);
    });

};

TaskDAO.editTaskById = function () {
};

//通过ID修改任务
TaskDAO.prototype.updateTaskById = function (Id, task, callback) {
    Task.update({_id: Id}, task, function (err, task) {
        callback(err, task);
    });
};

//通过ID删除任务
TaskDAO.prototype.deleteTaskById = function (Id, callback) {
    Task.remove({_id: Id}, function (err) {
        callback(err);
    });
};

//通过ID获得任务
TaskDAO.prototype.getTaskById = function (Id, callback) {
    Task.findOne({_id: Id}, function (err, task) {
        callback(err, task);
    });
};

//通过用户ID获得该用户的所有任务
TaskDAO.prototype.getTaskByuId = function (uID, callback) {
    Task.find({uID: uID}, function (err, tasks) {
        callback(err, tasks);
    });
};

//通过今天日期获得今日任务总页数
TaskDAO.prototype.getTasksPageByToday = function (date, uID, callback) {
    var today = moment(date, "YYYY-MM-DD");
    Task.find({"start_date": today, "uID": uID, "check_task": false}).count({}, function (err, count) {
        var pageCount = Math.ceil(count / 10);
        callback(err, pageCount);
    });
};

//通过今天日期获得今日任务
TaskDAO.prototype.getTasksByToday = function (date, page, uID, callback) {
    var today = moment(date, "YYYY-MM-DD"),
        start = (page - 1) * 10;
    Task.find({"start_date": today, "uID": uID, "check_task": false}).skip(start).limit(10).exec(function (err, tasks) {
        callback(err, tasks);
    });
};

//通过今天日期获得以前任务总页数
TaskDAO.prototype.getTasksPageByMiss = function (date, uID, callback) {
    var today = moment(date, "YYYY-MM-DD");
    Task.find({"start_date": {$lt: today}, "uID": uID, "check_task": false}).count({}, function (err, count) {
        var pageCount = Math.ceil(count / 10);
        callback(err, pageCount);
    });
};
//通过今天日期获得以前任务
TaskDAO.prototype.getTasksByMiss = function (date, page, uID, callback) {
    var today = moment(date, "YYYY-MM-DD"),
        start = (page - 1) * 10;
    Task.find({"start_date": {$lt: today}, "uID": uID, "check_task": false}).skip(start).limit(10).exec(function (err, tasks) {
        callback(err, tasks);
    });
};

//通过今天日期获得未来任务总页数
TaskDAO.prototype.getTasksPageByTomorrow = function (date, uID, callback) {
    var today = moment(date, "YYYY-MM-DD");
    Task.find({"start_date": {$gt: today}, "uID": uID, "check_task": false}).count({}, function (err, count) {
        var pageCount = Math.ceil(count / 10);
        callback(err, pageCount);
    });
};
//通过今天日期获得未来任务
TaskDAO.prototype.getTasksByTomorrow = function (date, page, uID, callback) {
    var today = moment(date, "YYYY-MM-DD"),
        start = (page - 1) * 10;
    Task.find({"start_date": {$gt: today}, "uID": uID, "check_task": false}).skip(start).limit(10).exec(function (err, tasks) {
        callback(err, tasks);
    });
};

//获取已完成任务总页数
TaskDAO.prototype.getTasksPageByDone = function (uID, callback) {
    Task.find({"check_task": true, "uID": uID}).count({}, function (err, count) {
        var pageCount = Math.ceil(count / 10);
        callback(err, pageCount);
    });
};
//获取已完成任务
TaskDAO.prototype.getTasksByDone = function (page, uID, callback) {
    var start = (page - 1) * 10;
    Task.find({"check_task": true, "uID": uID}).skip(start).limit(10).exec(function (err, tasks) {
        callback(err, tasks);
    });
};

module.exports = new TaskDAO();