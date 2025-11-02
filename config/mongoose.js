const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://raushan07851:m7j3BbgluIgN5VjI@cluster0.2sluirf.mongodb.net/codeial?retryWrites=true&w=majority');


const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;
