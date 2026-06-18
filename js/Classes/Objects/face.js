class Face extends Points {

    constructor(...pts) {
        super();
        pts.forEach(p => this.push(p));
    }

    draw(ctx, color = COLORS.setAlpha(FACECOLOR)) {
        if (this.length >= 3) {
            let f = Utils.stdRange(this.length);
            Draw.face(ctx, this, f, color);
        }
    }

    // getters
    get edges() {
        return this.map((p,i) => [i, (i+1) % this.length]);
    }
    get edgePoints() {
        return this.map((p,i) => [p, p[(i+1) % this.length]]);
    }

    // area
    area() {
        return Geometry1.polygonArea(this);
    }
    signedArea() {
        return Geometry1.signedArea(this);
    }

    // comparisons
    includesEdge(a,b) {
        return this.edgePoints.some(e => e.isBetween(a,b));
    }
	isBetween(...pts) {
		if (pts.length !== this.length) return false;
        return Utils.arraysElementsAreSame(this, pts);
	}

    // contains
    containsPoint(P) {
        return Geometry1.pointInPolygon(P, this);
    }
    containsSegment(A, B) {
        return Geometry1.isSegmentInsidePolygon(this, A, B);
    }

    printable() {
        let s = "";
        for (let i = 0; i < this.length; i++) {
            if (i !== 0) s += ",";
            s += JSON.stringify(this[i]);
        }
        return s;
    }

}