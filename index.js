var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	var user = 'unknown';
	socket.on('chat message', function(msg){
		socket.broadcast.emit('chat message', msg);
	});
	socket.on('user connected', function(u){
		user=u;
		socket.broadcast.emit('chat message', 'user '+user+' joined');
	});
	socket.on('disconnect', function(){
		socket.broadcast.emit('chat message', 'user '+user+' left');
	});
});

http.listen(3000,function(){
	console.log('listening on  *:3000');
});
