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
		return {"x": this.x, "y": this.y};
	}
  
  	addTo(x,y){
  		this.x = this.x + x;
		this.y = this.y + y;
  	}

	snapToCanvas(canvas) {
		// second version of this for world coordinates -- centers around origin instead of (0,0) in canvas coords
		const r = canvas.getBoundingClientRect();
		const w = r.width;
		const h = r.height;

		if (this.x >= w) {
			this.x = w-1;
		}
		if (this.y >= h) {
			this.y = h-1;
		}
	}
	
	print(message){
		console.log(message + "[" + JSON.stringify(this.x) + "," + JSON.stringify(this.y) +"]");
	}
	
	draw(ctx, label = '', color = POINTCOLOR, size = POINTSIZE){
		Draw.dot(ctx, this, size, color, label);
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

