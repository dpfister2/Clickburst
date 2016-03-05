var express = require("express"),
	app = express(),
	server = require("http").Server(app),
	io = require("socket.io")(server)


server.listen(8000)
app.use(express.static(__dirname ));

io.sockets.on("connection", function (socket) {

	socket.emit("init", "Connected");	

	socket.on("clicked", function(data) {
		var x = data.client_x;
		var y = data.client_y;

		var random = Math.floor(Math.random()*5000);

		io.sockets.emit("randomNumbered", {x: x, y: y, random: random}); //returns values to all connected computers
	})
})
