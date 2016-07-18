var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Set = require("collections/set");
var typingusers = new Set();
var allusers = new Set();

app.get('/', function(req,res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	var user = 'unknown';

	socket.on('chat message', function(msg){
		socket.broadcast.emit('chat message', msg);
	});
	socket.on('typing', function(u){
		typingusers.add(u);
		socket.broadcast.emit('typing', typingusers);
	});
	socket.on('nottyping', function(u){
		typingusers.delete(u);
		socket.broadcast.emit('nottyping', typingusers);
	});
	socket.on('user connected', function(u){
		user=u;
		allusers.add(u);
		socket.broadcast.emit('allusers', allusers);
		socket.broadcast.emit('chat message', 'user '+user+' joined');
	});
	socket.on('disconnect', function(){
		typingusers.delete(user);
		allusers.delete(user);
		socket.emit('nottyping', user);
		socket.broadcast.emit('allusers', allusers);
		socket.broadcast.emit('chat message', 'user '+user+' left');
	});
});

http.listen(3000,function(){
	console.log('listening on  *:3000');
});
