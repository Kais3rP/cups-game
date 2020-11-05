const express = require('express');
const app = express();
const server = require('http').Server(app);

app.use('/public',express.static(__dirname + '/dist'));
app.use('/src',express.static(__dirname + '/dist'));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/dist/index.html');
});

server.listen(process.env.PORT || 5000,function(){//Heroku wants its own env PORT
    console.log('Listening on '+server.address().port);
});



