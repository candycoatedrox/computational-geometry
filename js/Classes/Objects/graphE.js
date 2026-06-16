class GraphE {

    vertices = null;
    edges = [];

    labels = [];

    constructor() {
        this.vertices = new Points();
    }

    // getters
    get nVertices() {
        return this.vertices.length;
    }
    get nEdges() {
        return this.edges.length;
    }
    edgeToString(i) {
        return Utils.groupToString(this.edges[i], this.labels);
    }
    get edgesToListString() {
        return Utils.groupsToListString(this.edges, this.labels);
    }
    
    get maxEdges() {
        return Combinations.nChoose2(this.nVertices);
    }
    get possibleEdges() {
        return Combinations.allIndexPairs(this.nVertices);
    }

    // vertices
    addVertex(x,y, index = this.nVertices) {
        if (index === this.nVertices) {
            this.vertices.push(new Point(x,y));
        } else {
            this.vertices.splice(index, 0, new Point(x,y));

            // shift all edges
            for (let i = 0; i < this.nEdges; i++) {
                let e = this.edges[j];
                if (e[0] >= index) e[0]++;
                if (e[1] >= index) e[1]++;
            }
        }
        
        this.updateLabels();
    }
    addVertexCoords(coords, index = this.nVertices) {
        this.addVertex(coords.x, coords.y, index);
    }
    setVertex(i,x,y) {
        this.vertices[i].set(x,y);
    }
    setVertexCoords(i, coords) {
        this.vertices[i].coords = coords;
    }
    deleteVertex(i) {
        // delete any connected edges, update edges with new indices
        for (let j = 0; j < this.nEdges; j++) {
            let e = this.edges[j];
            if (e.includes(i)) {
                this.edges.splice(j,1); // delete the edge
                j--; // don't skip the next edge!
            } else {
                if (e[0] > i) e[0]--;
                if (e[1] > i) e[1]--;
            }
        }

        this.vertices.splice(i,1); // delete the vertex
        this.updateLabels();
    }
    clearVertices() {
        this.vertices.length = 0;
        this.edges.length = 0;
        this.labels.length = 0;
    }

    snapToCanvas(canvas) {
        this.vertices.snapToCanvas(canvas);
    }

    // labels
    updateLabels() {
        this.labels = DEFAULTLABELS.slice(0, this.nVertices);
    }

    // edges
    addEdge(i,j) {
        if (i === j) {
            return false; // cannot add an edge between a vertex and itself
        } else {
            if (this.verticesAreConnected(i,j)) return false; // no duplicate edges

            this.edges.push([i,j]);
            return true;
        }
    }
    deleteEdge(i) {
        this.edges.splice(i,1);
    }
    clearEdges() {
        this.edges.length = 0;
    }

    edgeIsBetween(i,v1,v2) {
        return this.edges[i].includes(v1) && this.edges[i].includes(v2);
    }
    verticesAreConnected(i,j) {
        for (let n = 0; n < this.nEdges; n++) {
            if (this.edgeIsBetween(n,i,j)) return true;
        }
        return false;
    }

    // draw
    drawVertices(ctx, labeled = true, color = POINTCOLOR, size = POINTSIZE) {
        let labs = labeled ? this.labels : [];
        this.vertices.draw(ctx, labs, color, size);
    }
    drawEdges(ctx, color = EDGECOLOR, width = EDGETHICKNESS) {
        for (let i = 0; i < this.nEdges; i++) {
            Draw.segment(ctx, this.vertices[this.edges[i][0]], this.vertices[this.edges[i][1]], color, width);
        }
    }
    draw(ctx, edgeColor = EDGECOLOR, vertexColor = POINTCOLOR, edgeWidth = EDGETHICKNESS, vertexSize = POINTSIZE) {
        this.drawEdges(ctx, edgeColor, edgeWidth);
        this.drawVertices(ctx, vertexColor, vertexSize);
    }

    getEdgeIndicesFromVertex(i) {
        let e = [];
        for (let j = 0; j < this.nEdges; j++) {
            if (this.edges[j].includes(i)) e.push(j);
        }
        return e;
    }
    getEdgesFromVertex(i) {
        let e = [];
        for (let j = 0; j < this.nEdges; j++) {
            if (this.edges[j].includes(i)) e.push(this.edges[j]);
        }
        return e;
    }
    getVerticesConnectedTo(i) {
        let v = [];
        for (let j = 0; j < this.nEdges; j++) {
            if (this.edges[j][0] === i) {
                v.push(this.edges[j][1]);
            } else if (this.edges[j][1] === i) {
                v.push(this.edges[j][0]);
            }
        }
        return v;
    }

    // checks
    intersectsAnyEdge(p,q) {
        for (let i = 0; i < this.nEdges; i++) {
            let e = this.edges[i];
            if (!e.includes(p) && !e.includes(q) && Geometry1.lineSegIntersection(e.tail, e.head, p, q) !== null) {
                return true;
            }
        }
        return false;
    }
    getEdgesIntersectingEdge(i) {
        let indices = [];
        let thisEdge = this.edges[i];
        for (let j = 0; j < this.nEdges; j++) {
            if (j === i) continue;
            let e = this.edges[j];
            if (!e.includes(thisEdge.tail) && !e.includes(thisEdge.head) && Geometry1.lineSegIntersection(e.tail, e.head, thisEdge.tail, thisEdge.head) !== null) {
                indices.push(j);
            }
        }
        return indices;
    }

    // conversion
    adjacencyGraph() {
        let graph = new GraphA();
        graph.vertices.push(...this.vertices);

        let adjacencies = this.vertices.map(() => { return []; });
        for (let i = 0; i < this.nEdges; j++) {
            adjacencies[this.edges[i][0]].push(this.edges[i][1]);
            adjacencies[this.edges[i][1]].push(this.edges[i][0]);
        }
        graph.adjacencyLists = adjacencies;

        return graph;
    }

    // depth-first search
    depthFirstSearch(execute) {

    }

}