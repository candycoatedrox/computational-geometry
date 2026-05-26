class Segment {
	constructor(p1, p2) {
		this.tail = p1;
		this.head = p2;
	}
	
	draw(ctx, color = EDGECOLOR, width = EDGETHICKNESS){
  	  	Draw.segment(ctx, this.tail, this.head, color, width);
	}
	
	drawVec(ctx, color = EDGECOLOR, width = EDGETHICKNESS){
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

	slope() {
		const dx = this.tail.x - this.head.x;
		const dy = this.tail.y - this.head.y;
		return dy/dx;
	}

	yIntercept() {
		return this.head.y - (this.slope() * this.head.x);
	}

	yInterceptPt() {
		return {"x":0, "y":this.yIntercept()};
	}

	xIntercept() {
		return this.head.x - (this.head.y / this.slope());
	}

	xInterceptPt() {
		return {"x":this.xIntercept(), "y":0};
	}

	solveForY(x) {
		// y = mx+b
		return (this.slope() * x) + this.yIntercept();
	}

	pointAtX(x) {
		return {"x":x, "y":this.solveForY(x)};
	}

	solveForX(y) {
		// x = (y-b)/m
		return (y - this.yIntercept()) / this.slope();
	}

	pointAtY(y) {
		return {"x":this.solveForX(y), "y":y};
	}

	nearestEdgePoint(canvas, fromTail) {
		const r = canvas.getBoundingClientRect();
		const w = r.width;
		const h = r.height;

		const start = (fromTail) ? this.head : this.tail;
		const end = (fromTail) ? this.tail : this.head;

		// if the line is perfectly horizontal
		if (start.x === end.x) {
			if (start.y === end.y) {
				return {x:start.x, y:start.y};
			} else if (end.y > start.y) {
				return {x:start.x, y:h};
			} else {
				return {x:start.x, y:0};
			}
		} else if (start.y === end.y) {
			if (end.x > start.x) {
				return {x:w, y:start.y};
			} else {
				return {x:0, y:start.y};
			}
		}

		const vertEdgePt = (end.x > start.x) ? this.pointAtX(w) : this.yInterceptPt();
		const horizEdgePt = (end.y > start.y) ? this.pointAtY(h) : this.xInterceptPt();
		if (end.distanceSqTo(vertEdgePt) <= end.distanceSqTo(horizEdgePt)) {
			return vertEdgePt;
		} else {
			return horizEdgePt;
		}
	}
  
}

