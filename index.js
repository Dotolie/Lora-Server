var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 3000 );
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use('/', require('./routes/home') );
app.use('/sensing', require('./routes/sensing') );


var server = app.listen( app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

// var listen = require('socket.io');
// var io = listen(server);
// io.on("connection", function(socket) {
   
//     console.log('---connect---'+socket.id);
 
// });


