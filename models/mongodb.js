var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tinydoit');
exports.mongoose = mongoose;
