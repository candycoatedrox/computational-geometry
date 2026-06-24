class Polygon extends Points {

    labels = [];
    edges = [];

    selfIntersections = null;
    selfIntersectionLabels = [];

    constructor (n = 0) {
        super(n);
        this.selfIntersections = new Points();
    }

    // getters
    get nSides() {
        return this.edges.length;
    }
    get nSelfIntersections() {
        return this.selfIntersections.length;
    }
    get selfIntersects() {
        return this.nSelfIntersections !== 0;
    }
    get edgePoints() {
        return this.edges.map(e => [this[e[0]], this[e[1]]]);
    }

    // update data
    updateLabels() {
        this.labels = Utils.stdRange1(this.length);
        this.labels = this.labels.map(n => { return 'p' + n; });
        
        this.selfIntersectionLabels = Utils.stdRange1(this.nSelfIntersections);
        this.selfIntersectionLabels = this.selfIntersectionLabels.map(n => { return 'i' + n; });
    }
    updateEdges() {
        this.edges.length = 0;
        if (this.length === 2) {
            this.edges.push([0,1]);
        } else if (this.length >= 3) {
            this.edges = this.map((p,i) => [i, (i+1) % this.length]);
        }
    }
    updateSelfIntersections() {
        this.selfIntersections.length = 0;
        for (let i = 0; i < this.edges.length; i++) {
            for (let j = i+2; j < this.edges.length; j++) {
                // exclude edge pairs that share one or more vertices
                if (this.edges[i].includes(this.edges[j][0]) || this.edges[i].includes(this.edges[j][1])) continue;

                let intersect = Geometry1.lineSegIntersection(this[this.edges[i][0]], this[this.edges[i][1]], this[this.edges[j][0]], this[this.edges[j][1]]);

                if (intersect !== null) {
                    let intersectCoords = intersect.X;
                    this.selfIntersections.push(new Point(intersectCoords.x, intersectCoords.y));
                    console.log("intersection " + JSON.stringify(intersectCoords));
                }
            }
        }
    }
    updateData() {
        this.updateEdges();
        this.updateSelfIntersections();
        this.updateLabels();
    }

    // comparisons
    includesEdge(a, b) {
        return this.edgePoints.some(e => e.isBetween(a,b));
    }
	isBetween(...pts) {
		if (pts.length !== this.length) return false;
        return Utils.arraysElementsAreSame(this, pts);
	}

    // draw
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
    drawIntersections(ctx, labeled = true, color = POINTCOLOR, size = POINTSIZE) {
        let labs = labeled ? this.selfIntersectionLabels : [];
        this.selfIntersections.draw(ctx, labs, color, size);
    }

    // geometry
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

    // perimeter & area
    perimeter() {
        return Geometry1.polygonPerimeter(this, this.edges);
    }
    area() {
        return Geometry1.polygonArea(this);
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
        return (this.edgePoints.map(e => Geometry1.midpoint(e[0], e[1])));
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

    // conversion
    polygonSubdivision() {

    }

}