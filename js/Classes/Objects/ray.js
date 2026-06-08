class Ray extends OrientedSegment {
	constructor(p1, p2) {
		super(p1, p2);
		this.trueHead = new Point(p2.x, p2.y);
	}

	fromCanvas(canvas) {
		this.trueHead.coords = this.nearestEdgePoint(canvas, false);
	}
	
	draw(ctx, color = LINECOLOR, width = LINETHICKNESS) {
		//console.log("trueHead: " + JSON.stringify(this.trueHead))
  	  	Draw.arrow(ctx, this.tail, this.trueHead, color, width);
	}

	// can only extend tail
	drawExtended(ctx, extTail, color = EDGECOLOR, width = EDGETHICKNESS) {
		Draw.segment(ctx, this.pointExtendedByDistance(extTail), this.trueHead, color, width);
	}
}