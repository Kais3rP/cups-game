const express = require('express');
const app = express();
const server = require('http').Server(app);

app.use('/public',express.static(__dirname + '/dist'));
app.use('/src',express.static(__dirname + '/dist'));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/dist/index.html');
});

server.listen(5000,function(){ // Listens to port 5000
    console.log('Listening on '+server.address().port);
});