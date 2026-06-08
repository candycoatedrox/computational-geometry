class Line extends Segment {
	constructor(p1, p2) {
		super(p1, p2);
		this.trueTail = new Point(p1.x, p1.y);
		this.trueHead = new Point(p2.x, p2.y);
	}

	fromCanvas(canvas) {
		this.trueHead.coords = this.nearestEdgePoint(canvas, false);
		this.trueTail.coords = this.nearestEdgePoint(canvas, true);
	}
	
	draw(ctx, color = LINECOLOR, width = LINETHICKNESS) {
		//console.log("trueHead: " + JSON.stringify(this.trueHead) + "; trueTail: " + JSON.stringify(this.trueTail))
  	  	Draw.segment(ctx, this.trueTail, this.trueHead, color, width);
	}

	// extending does nothing
	drawExtended(ctx, extTail, extHead, color = EDGECOLOR, width = EDGETHICKNESS) {
		this.draw(ctx, color, width);
	}
}