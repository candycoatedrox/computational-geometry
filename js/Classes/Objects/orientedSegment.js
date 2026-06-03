class OrientedSegment extends Segment {
	constructor(p1, p2) {
		super(p1, p2);
	}
	
	draw(ctx, color = EDGECOLOR, width = EDGETHICKNESS){
  	  	super.drawVec(ctx, color, width);
	}
}