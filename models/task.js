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

TaskDAO.prototype.updateTaskById = function (Id, task, callback) {
    Task.update({_id: Id}, task, function (err, task) {
        callback(err, task);
    });
};

TaskDAO.prototype.deleteTaskById = function (Id, callback) {
    Task.remove({_id:Id},function(err){
        callback(err);
    });
};

TaskDAO.prototype.getTaskById = function (Id, callback) {
    Task.findOne({_id: Id}, function (err, task) {
        callback(err, task);
    });
};

TaskDAO.prototype.getTaskByuId = function (uID, callback) {
    Task.find({uID: uID}, function (err, tasks) {
        callback(err, tasks);
    });
};

Task.getTaskByBoxAnduID = function () {

};

module.exports = new TaskDAO();