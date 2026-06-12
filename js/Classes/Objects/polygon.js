class Polygon extends Points {

    constructor (n = 0) {
        super(n);

        this.labels = [];
        this.edges = [];
    }

    get nSides() {
        return this.edges.length;
    }

    get edgePoints() {
        let e = [];
        for (let i = 0; i < this.edges.length; i++) {
            e.push([this[this.edges[i][0]], this[this.edges[i][1]]]);
        }

        return e;
    }

    includesEdge(a, b) {
        for (let e in this.edgePoints) {
            if (e.isBetween(a, b)) return true;
        }
        return false;
    }

	isBetween(...pts) {
		if (pts.length !== this.length) return false;
        for (let i = 0; i < pts.length; i++) {
            if (!this.includes(pts[i])) return false;
        }
        return true;
	}

    updateLabels() {
        this.labels = Utils.stdRange1(this.length);
        this.labels = this.labels.map(n => { return 'p' + n; });
    }

    updateEdges() {
        this.edges.length = 0;
        if (this.length === 2) {
            this.edges.push([0,1]);
        } else if (this.length >= 3) {
            for (let i = 0; i < this.length; i++) {
                let j = (i !== this.length - 1) ? i+1 : 0;
                this.edges.push([i,j]);
            }
        }
    }

    drawVertices(ctx, labeled = true, color = POINTCOLOR, size = POINTSIZE) {
        let labs = labeled ? this.labels : [];
        super.draw(ctx, labs, color, size);
    }

    drawSegments(ctx, color = EDGECOLOR, width = EDGETHICKNESS) {
        for (let i = 0; i < this.nSides; i++) {
            Draw.segment(ctx, this[this.edges[i][0]], this[this.edges[i][1]], color, width);
        }
    }

    draw(ctx, segmentColor = EDGECOLOR, vertexColor = POINTCOLOR, segmentWidth = EDGETHICKNESS, vertexSize = POINTSIZE) {
        this.drawSegments(ctx, segmentColor, segmentWidth);
        this.drawVertices(ctx, vertexColor, vertexSize);
    }

    drawFill(ctx, color = COLORS.setAlpha(EDGECOLOR)) {
        if (this.length >= 3) {
            let face = Utils.stdRange(this.length);
            Draw.face(ctx, this, face, color);
        }
    }

    sideLengths() {
        return Geometry1.polygonSideLengths(this, this.edges);
    }

    angles() {
        if (this.length <= 2) return null;

        let indices = Utils.stdRange(this.length);
        indices.splice(0, 0, this.length - 1);
        indices.push(0);

        let angles = [];
        for (let i = 1; i <= this.length; i++) {
            angles.push(Geometry1.smallestAngle(this[indices[i-1]], this[indices[i]], this[indices[i+1]]));
        }

        return angles;
    }

    area() {
        return Math.abs(this.signedArea());
    }

    signedArea() {
        return Geometry1.signedArea(this);
    }

    containsPoint(P) {
        return Geometry1.pointInPolygon(P, this);
    }

    containsSegment(A, B) {
        return Geometry1.isSegmentInsidePolygon(this, A, B);
    }

    midpoints() {
        let mp = [];
        for (let i = 0; i < this.edges.length; i++) {
            mp.push(Geometry1.midpoint(this.edges[i][0], this.edges[i][1]));
        }

        return mp;
    }

    angleBisectors() {
        if (this.length <= 2) return null;

        let indices = Utils.stdRange(this.length);
        indices.splice(0, 0, this.length - 1);
        indices.push(0);

        let bisectors = [];
        for (let i = 1; i <= this.length; i++) {
            bisectors.push(Geometry1.angleBisector(this[indices[i-1]], this[indices[i]], this[indices[i+1]]));
        }

        return bisectors;
    }

    perpendicularBisectors() {
        // ??
    }

    selfIntersects() {
        return this.selfIntersections().length !== 0;
    }

    selfIntersections() {
        let intersections = [];
        for (let i = 0; i < this.edges.length; i++) {
            for (let j = i+2; j < this.edges.length; j++) {
                // exclude edge pairs that share one or more vertices
                if (this.edges[i].includes(this.edges[j][0]) || this.edges[i].includes(this.edges[j][1])) continue;

                let intersect = Geometry1.lineSegIntersection(this[this.edges[i][0]], this[this.edges[i][1]], this[this.edges[j][0]], this[this.edges[j][1]]);

                if (intersect !== null) {
                    let intersectCoords = intersect.X;
                    intersections.push(intersectCoords);
                    console.log("intersection " + JSON.stringify(intersectCoords));
                }
            }
        }

        return intersections;
    }

    selfIntersectionLabels() {
        let intersectLabs = Utils.stdRange1(this.dataC.intersections.length);
        intersectLabs = intersectLabs.map(n => { return 'i' + n; });
    }

}