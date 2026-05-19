class Point {
	x = 0;
	y = 0;
	
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	
	set(x,y) {
		this.x = x;
		this.y = y;
	}
	
	set coords(c) {
		this.x = c.x;
		this.y = c.y;
	}
	
	get coords(){
		return {"x": x, "y": y};
	}
  
  	addTo(x,y){
  		this.x = this.x + x;
		this.y = this.y + y;
  	}
	
	print(message){
		console.log(message + "[" + JSON.stringify(this.x) + "," + JSON.stringify(this.y) +"]");
	}
	
	draw(ctx, color = POINTCOLOR, size = POINTSIZE){
  	  ctx.beginPath(); 
	  ctx.fillStyle = color; 
  	  ctx.arc(this.x, this.y, size, 0, Math.PI*2);
  	  ctx.fill();
	}
	
	translate(vec){
		this.x = this.x + vec.x;
		this.y = this.y + vec.y;
	}
	
	distanceTo(a) {
		const dx = a.x - this.x;
		const dy = a.y - this.y;

		return Math.hypot(dx, dy);
	}
  
	distanceSqTo(a) {
		const dx = this.x - a.x;
		const dy = this.y - a.y;
		return dx * dx + dy * dy;
	}
  
}

