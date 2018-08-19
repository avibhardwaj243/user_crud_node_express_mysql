const User = require('../models/index.model');

//Simple version, without validation or sanitation
exports.index = function(req, res){
   //res.send('Greetings from the Index index controller!');
   // render to views/index.ejs template file
   res.render('index', {title: 'My Node.js Application'})
}
