var io = require('socket.io')({
	transports: ['websocket'],
});
var util = require('util');

io.attach(4567);
players = {};

io.on('connection', function (socket) {

	socket.on('login', function (data) {
		try {
			console.log('receive data:\n', data);
			players[socket.id] = data.playerName;
			console.log(util.format('Player %s Logined ! with uuid %s', data.playerName, socket.id));

			var ret = {
				playerName: data.playerName,
				success: true,
				uuid: socket.id
			};
			// ret['playerName'] = data['playerName'];
			// ret['success'] = true
			// ret['uuid'] = socket.id

			socket.emit('login', ret);
		}
		catch (error) {
			console.log('exception in conect event');
			console.log(error);
		}
	});
});
