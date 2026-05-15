class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
  
	print(message){
		console.log(message + "[" + JSON.stringify(this.x) + "," + JSON.stringify(this.y) +"]");
	}
	
	draw(ctx, color, size){
  	  ctx.beginPath(); 
	  ctx.fillStyle = color; 
  	  ctx.arc(this.x, this.y, size, 0, Math.PI*2);
  	  ctx.fill();
	}
	
	static fromToVector(a, b) {
		const dx = b.x - a.x;
		const dy = b.y - a.y;

		return new Point(dx, dy);
	}
  
	static distance(a, b) {
		const dx = a.x - b.x;
		const dy = a.y - b.y;

		return Math.hypot(dx, dy);
	}
  
	static distanceSq(a, b) {
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		return dx * dx + dy * dy;
	}
  
}

