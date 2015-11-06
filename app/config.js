var mongoose = require ('mongoose');


mongoose.connect('mongodb://localhost/shortlydb');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', console.log('Connected Mongoose'));

module.exports = db;