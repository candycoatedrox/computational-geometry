class Vector extends Point{
	constructor(x, y) {
		super(x,y);
	}
	
	set(x, y) {
		this.x = x;
		this.y = y;
	}
  
	print(message){
		// console.log(message + "[" + JSON.stringify(this.x) + "," + JSON.stringify(this.y) +"]");
		console.log(message + JSON.stringify(this));
	}
	
	draw(ctx, color = ARROWCOLOR, width = ARROWTHICKNESS, headlen = HEADLENGTH){
		ctx.beginPath(); 
	
		var dx = this.x;
		var dy = this.y;
		var angle = Math.atan2(dy, dx);
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
	
		ctx.moveTo(0, 0);
		ctx.lineTo(dx, dy);
		
		// arrow head
		ctx.lineTo(dx - headlen * Math.cos(angle - Math.PI / 6), dy - headlen * Math.sin(angle - Math.PI / 6));
		ctx.moveTo(dx, dy);
		ctx.lineTo(dx - headlen * Math.cos(angle + Math.PI / 6), dy - headlen * Math.sin(angle + Math.PI / 6));
  
		ctx.stroke();
	}
	
	add(vec){
		return new Vector(this.x + vec.x, this.y + vec.y);
	}
	
	addTo(vec){
		super.x = super.x + vec.x;
		super.y = super.y + vec.y;
	}
	
	static fromPairPoints(a, b) {
		const dx = b.x - a.x;
		const dy = b.y - a.y;

		return new Vector(dx, dy);
	}
  
	vectorLength() {
		return Math.hypot(this.x, this.y);
	}
  
	vectorLengthSq() {
		const dx = this.x;
		const dy = this.y;
		return dx * dx + dy * dy;
	}
  
}

