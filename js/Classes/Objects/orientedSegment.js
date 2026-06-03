class OrientedSegment extends Segment {
	constructor(p1, p2) {
		super(p1, p2);
	}

	getVector() {
		let dx = this.head.x - this.tail.x;
		let dy = this.head.y - this.tail.y;
		return new Vector(dx, dy);
	}
	
	draw(ctx, color = EDGECOLOR, width = EDGETHICKNESS){
  	  	super.drawVec(ctx, color, width);
	}
}