class Segment {
	constructor(p1, p2) {
		this.tail = p1;
		this.head = p2;
	}
  
	print(message){
		console.log(message + "[" + JSON.stringify(this.x) + "," + JSON.stringify(this.y) +"]");
	}
	
	drawSeg(ctx, color = EDGECOLOR, width = EDGETHICKNESS){
  	  Draw.segment(ctx, this.tail, this.head, color, width);
	}
	
	drawVec(ctx, color = EDGECOLOR, size = EDGESIZE){
  	  Draw.arrow(ctx, this.tail, this.head);
	}
	
	length() {
		const dx = this.head.x - this.tail.x;
		const dy = this.head.y - this.tail.y;

		return Math.hypot(dx, dy);
	}
  
	sqLength() {
		const dx = this.head.x - this.tail.x;
		const dy = this.head.y - this.tail.y;
		return dx * dx + dy * dy;
	}
  
}

