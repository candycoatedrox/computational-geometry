class OrientedSegment {
	constructor(p1, p2) {
		this.tail = p1;
		this.head = p2;
	}
	
	draw(ctx, color = EDGECOLOR, width = EDGETHICKNESS){
  	  	Draw.arrow(ctx, this.tail, this.head, color, width);
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