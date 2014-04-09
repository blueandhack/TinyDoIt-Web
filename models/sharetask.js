var mongodb = require('./mongodb');

var Schema = mongodb.mongoose.Schema;

var ShareTaskSchema = new Schema({
    title: String,
    description: String,
    tags: [String],
    user_email: String,
    create_task_date: {type: Date, default: Date.now}
});


var ShareTask = mongodb.mongoose.model("ShareTask",ShareTaskSchema);

var ShareTaskDAO = function(){};

ShareTaskDAO.prototype.save = function (sharetask,callback) {
    var instance = new ShareTask(sharetask);
    instance.save(function(err, sharetask){
        callback(err,sharetask);
    });

};

ShareTaskDAO.prototype.editTaskById = function () {
};

ShareTaskDAO.prototype.updateTaskById = function () {
};

ShareTaskDAO.prototype.deleteTaskById = function () {
};

ShareTaskDAO.prototype.getAllShareTasks = function (callback) {
    ShareTask.find({},function(err,sharetasks){
        callback(err,sharetasks);
    });
};

ShareTaskDAO.prototype.getShareTaskById = function (Id,callback) {
    ShareTask.findOne({_id:Id},function(err,sharetask){
        callback(err, sharetask);
    });
};

module.exports = new ShareTaskDAO();