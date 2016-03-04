var c, ctx, last;
var particles = [];
var color = [
				"rgb(51,255,255)", 
				"rgb(102,255,102)", 
				"rgb(255,51,51)",
				"rgb(51,51,255)",
				"rgb(255,51,255)", 
				"rgb(255,255,255)"
			]

function canvasOnStart(){
	c = document.createElement("canvas");
	document.body.style.backgroundColor = "black";
	ctx = c.getContext("2d");
	c.height = window.innerHeight;
	c.width = window.innerWidth;
	document.body.appendChild(c);
	document.addEventListener("mousedown", onClick, false);
	last = Date.now();
	setInterval(loop, 17);
}

function onClick(event) {
	client_x = event.pageX;
	client_y = event.pageY;
	socket.emit("clicked", {client_x, client_y});
}

function Particle(x, y, randomX, randomY) {
	this.x = x;
	this.y = y;
	this.color = color[Math.abs(Math.floor(Math.cos(randomX/randomY)*(color.length)))];
	this.velocityX = randomX;
	this.velocityY = randomY;
	this.isAlive = true;
}

socket.on("randomNumbered", function(data) {
	var x = data.x;
	var y = data.y;
	var random = data.random;
	Math.seedrandom(random);
	for (var i = 0; i < 100; i++) {
		particles.push(new Particle(x, y, Math.random()-.5, Math.random()-.5));
	}
})

function update(deltaMs) {
	render();
	for (var i = 0; i < particles.length; i++) {

		particles[i].x += particles[i].velocityX*deltaMs;
		particles[i].y += particles[i].velocityY*deltaMs;
		particles[i].velocityY += .0001*deltaMs;
		if (particles[i].x < 0 ||
			particles[i].x > window.innerWidth ||
			particles[i].y > window.innerHeight) {
				particles[i].isAlive = false;
		}

		particles[i].x *= .99999;
		particles[i].y *= .99999;
	}

	particles = particles.filter(function(a) {return a.isAlive});
}

function render(){
	ctx.clearRect(0, 0, c.width, c.height);
	for (var i = 0; i < particles.length; i++) {
		ctx.beginPath();
		ctx.arc(particles[i].x, particles[i].y, 2, 0, Math.PI*2, false);
		ctx.fillStyle = particles[i].color;
		ctx.fill();
	}
}

function loop() {

	var now = Date.now();
	var deltaMs = (now - last);
	last = now;
	update(deltaMs)

}