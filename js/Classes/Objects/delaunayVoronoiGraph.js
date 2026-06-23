class DelaunayVoronoiGraph extends GraphE {

    voronoi = null;
    voronoiPoints = null;
    voronoiCells = [];
    voronoiEdges = [];
    
    constructor() {
        super();

        this.voronoiPoints = new Points();
    }

    // vertices
    clearVertices() {
        this.voronoiPoints.length = 0;
        this.voronoiCells.length = 0;
        this.voronoiEdges.length = 0;
        super.clearVertices();
    }

    // delaunay
    get delaunayPoints() {
        return this.vertices.map(p => [p.x, p.y]);
    }
    get delaunay() {
        return Delaunay.from(this.delaunayPoints);
    }
    triangles(delaunay = this.delaunay) {
        return delaunay.triangles;
    }

    updateDelaunay(delaunay = this.delaunay) {
        let triangles = this.triangles(delaunay);

        this.clearEdges();
        if (triangles.length >= 3) { // convert triangles to edges on graph
            for (let i = 0; i < triangles.length; i += 3) {
                let t1 = triangles[i], t2 = triangles[i+1], t3 = triangles[i+2];
                this.addEdge(t1, t2);
                this.addEdge(t2, t3);
                this.addEdge(t1, t3);
            }
        }
    }

    // voronoi
    getPointsFromCell(i) {
        return this.voronoiCells[i].map(j => this.voronoiPoints[j]);
    }
    getEdgesFromCell(i) {
        const c = this.voronoiCells[i];
        return c.map((p,i) => [p, c[(i+1) % c.length]]);
    }
    getEdgePointsFromCell(i) {
        const c = this.voronoiCells[i];
        return c.map((p,i) => [this.voronoiPoints[p], this.voronoiPoints[c[(i+1) % c.length]]]);
    }
    getPointsFromVoronoiEdge(i) {
        const e = this.voronoiEdges[i];
        const tailP = this.voronoiPoints[e[0]];
        const headP = this.voronoiPoints[e[1]];
        return [tailP, headP];
    }

    updateVoronoi(canvas, delaunay = this.delaunay) {
        const r = canvas.getBoundingClientRect();
        const w = r.width, h = r.height;
        this.voronoi = delaunay.voronoi([0,0,w,h]);

        this.voronoiPoints.length = 0;
        this.voronoiCells.length = 0;
        this.voronoiEdges.length = 0;

        for (let i = 0; i < this.nVertices; i++) {
            const rawPts = this.voronoi._clip(i);

            // get all points in cell
            const cell = [];
            for (let j = 0; j < rawPts.length; j += 2) {
                let p = {x:rawPts[j], y:rawPts[j+1]};

                let index = this.voronoiPoints.findIndex(q => q.equals(p));
                if (index === -1) { // not a duplicate
                    cell.push(this.voronoiPoints.length);
                    this.voronoiPoints.push(new Point(p.x, p.y));
                } else { // duplicate point
                    cell.push(index);
                }
            }
            this.voronoiCells.push(cell);

            // get all voronoi edges
            for (let j = 0; j < cell.length; j++) {
                let a = cell[j], b = cell[(j+1) % cell.length];

                let duplicate = false;
                for (let n = 0; n < this.voronoiEdges.length; n++) {
                    if (this.voronoiEdges[n].includes(a) && this.voronoiEdges[n].includes(b)) {
                        duplicate = true;
                        break;
                    }
                }

                if (!duplicate) this.voronoiEdges.push([a,b]);
            }
        }
    }

    updateDelaunayVoronoi(canvas) {
        let delaunay = this.delaunay;
        this.updateDelaunay(delaunay);
        this.updateVoronoi(canvas, delaunay);
    }

    // draw
    drawVoronoiCell(ctx, i, color = EDGECOLOR, width = EDGETHICKNESS) {
        let edges = this.getEdgePointsFromCell(i);
        for (let i = 0; i < edges.length; i++) {
            Draw.edge(ctx, edges[i][0], edges[i][1], color, width);
        }
    }
    drawVoronoiCells(ctx, color = EDGECOLOR, width = EDGETHICKNESS) {
        for (let i = 0; i < this.voronoiEdges.length; i++) {
            let points = this.getPointsFromVoronoiEdge(i);
            Draw.edge(ctx, points[0], points[1], color, width);
        }
    }
    drawVoronoi(ctx, edgeColor = EDGECOLOR, vertexColor = POINTCOLOR, edgeWidth = EDGETHICKNESS, vertexSize = POINTSIZE) {
        this.drawVoronoiCells(ctx, edgeColor, edgeWidth);
        this.drawVertices(ctx, vertexColor, vertexSize);
    }
    drawVoronoiCellFace(ctx, i, color = COLORS.setAlpha(FACECOLOR)) {
        Draw.face(ctx, this.voronoiPoints, this.voronoiCells[i], color);
    }
    drawVoronoiCellFaces(ctx, color = "multi") {
        for (let i = 0; i < this.nVertices; i++) {
            if (color == "multi") {
                this.drawVoronoiCellFace(ctx, i, COLORS.setAlpha(FACECOLORS[i % FACECOLORS.length], 0.3));
            } else {
                this.drawVoronoiCellFace(ctx, i, color);
            }
        }
    }

}