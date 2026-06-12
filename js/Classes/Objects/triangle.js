class Triangle {
    labels = ["A","B","C"];

    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;

        this.ab = new Segment(this.a, this.b);
        this.bc = new Segment(this.b, this.c);
        this.ac = new Segment(this.a, this.c);
    }

    get points() {
        return [this.a, this.b, this.c];
    }

    get segments() {
        return [this.ab, this.bc, this.ac];
    }

    setPoints(pts) {
        this.a.coords = pts[0];
        this.b.coords = pts[1];
        this.c.coords = pts[2];
    }

    setA(x,y) {
        this.a.set(x,y);
    }

    setB(x,y) {
        this.b.set(x,y);
    }

    setC(x,y) {
        this.c.set(x,y);
    }

    snapToCanvas(canvas) {
        this.a.snapToCanvas(canvas);
        this.b.snapToCanvas(canvas);
        this.c.snapToCanvas(canvas);
    }

    drawVertices(ctx, labeled = true, color = POINTCOLOR, size = POINTSIZE) {
        let labs = labeled ? this.labels : ["","",""];
        this.a.draw(ctx, labs[0], color, size);
        this.b.draw(ctx, labs[1], color, size);
        this.c.draw(ctx, labs[2], color, size);
    }

    drawSegments(ctx, color = EDGECOLOR, width = EDGETHICKNESS) {
        this.ab.draw(ctx, color, width);
        this.bc.draw(ctx, color, width);
        this.ac.draw(ctx, color, width);
    }

    draw(ctx, segmentColor = EDGECOLOR, vertexColor = POINTCOLOR, segmentWidth = EDGETHICKNESS, vertexSize = POINTSIZE) {
        this.drawSegments(ctx, segmentColor, segmentWidth);
        this.drawVertices(ctx, vertexColor, vertexSize);
    }

    drawFill(ctx, color = COLORS.setAlpha(EDGECOLOR)) {
        Draw.triangleFilled(ctx, this.a, this.b, this.c, color);
    }

    sideLengths() {
        return Geometry1.triangleSideLengths(this.a, this.b, this.c);
    }

    // this fully breaks everything if I put it into Geometry1, inexplicably
    angles() {
        const A = Geometry1.smallestAngle(B,A,C);
        const B = Geometry1.smallestAngle(A,B,C);
        const C = Geometry1.smallestAngle(A,C,B);

        return {A:A, B:B, C:C};
    }

    area() {
        return Area2D.triangleArea(this.a, this.b, this.c);
    }

    signedArea() {
        return Area2D.signedTriangleArea(this.a, this.b, this.c);
    }

    signedDoubleArea() {
        return Area2D.signedDoubleTriangleArea(this.a, this.b, this.c);
    }

    semiperimeter() {
        return Geometry1.semiperimeter(this.a, this.b, this.c);
    }

    containsPoint(P) {
        return Geometry1.pointInTriangle(P, this.a, this.b, this.c);
    }

    midpoints() {
        const AB = this.ab.midpoint();
        const BC = this.bc.midpoint();
        const AC = this.ac.midpoint();

        return {AB:AB, BC:BC, AC:AC};
    }

    angleBisectors() {
        const A = Geometry1.angleBisector(this.a, this.b, this.c);
        const B = Geometry1.angleBisector(this.b, this.a, this.c);
        const C = Geometry1.angleBisector(this.c, this.b, this.a);

        return {A:A, B:B, C:C};
    }

    perpendicularBisectors() {
        const mid = this.midpoints();
        const cc = this.circumcenter();

        const AB = Geometry1.vectorBetween(mid.AB, cc);
        const BC = Geometry1.vectorBetween(mid.BC, cc);
        const AC = Geometry1.vectorBetween(mid.AC, cc);

        return {AB:AB, BC:BC, AC:AC};
    }

    incenter() {
        return Geometry1.incenter(this.a, this.b, this.c);
    }

    inradius() {
        return Geometry1.inradius(this.a, this.b, this.c);
    }

    circumcenter() {
        return Geometry1.circumcenter(this.a, this.b, this.c);
    }

    circumradius() {
        return Geometry1.circumradius(this.a, this.b, this.c);
    }

    excenters() {
        const a = Geometry1.excenter(this.a, this.b, this.c);
        const b = Geometry1.excenter(this.b, this.a, this.c);
        const c = Geometry1.excenter(this.c, this.b, this.a);

        return {a:a, b:b, c:c};
    }

    exradii() {
        const a = Geometry1.exradius(this.a, this.b, this.c);
        const b = Geometry1.exradius(this.b, this.a, this.c);
        const c = Geometry1.exradius(this.c, this.b, this.a);

        return {a:a, b:b, c:c};
    }
}