var io = require('socket.io')({
	transports: ['websocket'],
});
var util = require('util')

io.attach(4567);
players = {};
player_require = 3

io.on('connection', function (socket) {

	socket.on('login', function (data) {
		try {
			console.log("receive data:\n", data);

			players[socket.id] = {
				"playerName": data["playerName"],
				"ready": false
			}

			console.log(util.format("Player %s Logined ! with uuid %s", data["playerName"], socket.id));

			ret = {
				"playerName": data["playerName"],
				"success": true,
				"uuid": socket.id
			}
			socket.emit("login", ret);
		}
		catch (error) {
			console.log("exception in conect event");
			console.log(error);
		}
	})

	socket.on("ready", function () {
		try {
			console.log("receive ready from" ,  socket.id)
			players[socket.id]["ready"] = true;

			var counter = 0
			for (var k in players) {
				if (players[k]["ready"] == true)
					counter++;
			}
			if (counter == player_require) {
				socket.broadcast.emit("enterGame");
				socket.emit("enterGame");
			}
		}
		catch (error) {
			console.log("exception in ready event");
			console.log(error)
		}
	})

	socket.on("waiting" , function(){
		var wait_info = {
			"players":undefined
		};
		
		var player_list = []
		for (var k in players) {
			player_list.push({
				"uuid":k,
				"playerName":players[k]["playerName"],
				"ready":players[k]["ready"]
			})
		}
		wait_info["players"] = player_list
	
		socket.emit("waiting", wait_info);
	})
})
