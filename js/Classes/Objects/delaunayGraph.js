class DelaunayGraph extends GraphE {
    
    constructor() {
        super();
    }

    get delaunayPoints() {
        return this.vertices.map(p => [p.x, p.y]);
    }
    get triangles() {
        let delaunay = Delaunay.from(this.delaunayPoints);
        return delaunay.triangles;
    }

    updateDelaunay() {
        let triangles = this.triangles;

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

}