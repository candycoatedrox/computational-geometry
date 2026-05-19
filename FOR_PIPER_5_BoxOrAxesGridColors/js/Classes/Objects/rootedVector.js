class RootedVector {
	constructor(pt, vec) {
		this.root = structuredClone(pt);
		this.vec = structuredClone(vec);
	}
	
	setRoot(pt) {
		this.root = pt;
	}
	
	setVec(vec) {
		this.vec = vec;
	}
  
	print(message){
		console.log(message + " " + JSON.stringify(this));
	}
	
	draw(ctx, color = ARROWCOLOR, width = ARROWTHICKNESS, headlen = HEADLENGTH){
		ctx.beginPath(); 
	
		var dx = this.vec.x;
		var dy = this.vec.y;
		var angle = Math.atan2(dy, dx);
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		
		ctx.moveTo(root.x, root.y);
		var tox = this.root.x + this.vec.x;
		var toy = this.root.y + this.vec.y;
		ctx.lineTo(tox, toy);
		
		// arrow head - TO CHECK CORRECTNESS!!!
		ctx.lineTo(dx - headlen * Math.cos(angle - Math.PI / 6), dy - headlen * Math.sin(angle - Math.PI / 6));
		ctx.moveTo(dx, dy);
		ctx.lineTo(dx - headlen * Math.cos(angle + Math.PI / 6), dy - headlen * Math.sin(angle + Math.PI / 6));
  
		ctx.stroke();
	}
	
	add(vec){
		this.vec = this.vec.add(vec);
	}
	
	static fromPairPoints(a, b) {
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		this.root = a;
		this.vec = new Vector(dx, dy);
	}
  
	vectorLength() {
		return this.vec.vectorLength();
	}
  
	vectorLengthSq() {
		return this.vec.vectorLengthSq();
	}
  
}

