class Segment {
	constructor(p1, p2) {
		this.tail = p1;
		this.head = p2;
	}

	getVector() {
		let dx = this.head.x - this.tail.x;
		let dy = this.head.y - this.tail.y;
		return new Vector(dx, dy);
	}
	
	draw(ctx, color = EDGECOLOR, width = EDGETHICKNESS){
  	  	Draw.segment(ctx, this.tail, this.head, color, width);
	}

	drawExtended(ctx, extTail, extHead = extTail, color = EDGECOLOR, width = EDGETHICKNESS) {
  	  	Draw.segment(ctx, this.pointExtendedByDistance(extTail), this.pointExtendedByDistance(extHead, false), color, width);
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

	midpoint() {
		return Geometry1.midpoint(this.tail, this.head);
	}

	// this only sort of works, figure out why?
	pointExtendedByDistance(d, fromTail = true) {
		const end = fromTail ? this.tail : this.head;

		if (d === 0) {
			return {
				x:end.x,
				y:end.y
			};
		}

		const xAxis = {x:1, y:0};
		const angle = Geometry1.ccwAngleBetweenVectors(this.getVector(), xAxis);
		const extCoords = Geometry1.vectorCoordinates(d, angle);

		return {
			x:end.x - extCoords.x,
			y:end.y - extCoords.y
		};
	}

	nearestEdgePoint(canvas, fromTail = true) {
		// update this so it works even if the given point is OUTSIDE the canvas
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

