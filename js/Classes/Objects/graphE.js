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
    setAllVertices(pts) {
		for (let i = 0; i < this.nVertices; i++) {
			this.vertices[i].coords = pts[i];
		}
    }
    deleteVertex(i) {
        // delete any connected edges, update edges with new indices
        for (let j = 0; j < this.nEdges; j++) {
            let e = this.edges[j];
            if (e.includes(i)) {
                this.deleteEdge(j); // delete the edge
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
    addNonCrossingEdge(i,j) {
        let tail = this.vertices[i];
        let head = this.vertices[j];
        if (this.intersectsAnyEdge(tail, head)) return false; // new edge would create a crossing
        return this.addEdge(i,j);
    }
    deleteEdge(i) {
        this.edges.splice(i,1);
    }
    clearEdges() {
        this.edges.length = 0;
    }

    getEdgeIndicesFromVertex(i) {
        let e = [];
        for (let j = 0; j < this.nEdges; j++) {
            if (this.edges[j].includes(i)) e.push(j);
        }
        return e;
    }
    getEdgesFromVertex(i) {
        return this.edges.filter(e => e.includes(i));
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

    getVerticesFromEdge(i) {
        const e = this.edges[i];
        const tailV = this.vertices[e[0]];
        const headV = this.vertices[e[1]];
        return {tail:tailV, head:headV};
    }
    edgeIncludesPoint(i,p) {
        let vertices = this.getVerticesFromEdge(i);
        return vertices.tail.equals(p) || vertices.head.equals(p);
    }
    edgeDistanceToPoint(i,p) {
        let vertices = this.getVerticesFromEdge(i);
        return Geometry1.pointLineDistance(p, vertices.tail, vertices.head);
    }

    edgeIsBetween(i,v1,v2) {
        return this.edges[i].includes(v1) && this.edges[i].includes(v2);
    }
    verticesAreConnected(i,j) {
        return this.edges.some((e,n) => this.edgeIsBetween(n,i,j));
    }

    // checks
    intersectsAnyEdge(p,q) {
        for (let i = 0; i < this.nEdges; i++) {
            let vertices = this.getVerticesFromEdge(i);
            if (!this.edgeIncludesPoint(i,p) && !this.edgeIncludesPoint(i,q) && Geometry1.lineSegIntersection(vertices.tail, vertices.head, p, q) !== null) {
                return true;
            }
        }
        return false;
    }
    getEdgesIntersectingEdge(i) {
        let indices = [];
        let vThis = this.getVerticesFromEdge(i);

        for (let j = 0; j < this.nEdges; j++) {
            if (j === i) continue;

            let vOther = this.getVerticesFromEdge(j);
            if (!this.edgeIncludesPoint(i,vOther.tail) && !this.edgeIncludesPoint(i,vOther.head) && Geometry1.lineSegIntersection(vOther.tail, vOther.head, vThis.tail, vThis.tail) !== null) {
                indices.push(j);
            }
        }
        return indices;
    }

    // draw
    drawVertices(ctx, labeled = true, color = POINTCOLOR, size = POINTSIZE) {
        if (color == "multi") {
            for (let i = 0; i < this.nVertices; i++) {
                let lab = labeled ? this.labels[i] : '';
                this.vertices[i].draw(ctx, lab, FACECOLORS[i % FACECOLORS.length]);
            }
        } else {
            let labs = labeled ? this.labels : [];
            this.vertices.draw(ctx, labs, color, size);
        }
    }
    drawEdge(ctx, i, color = EDGECOLOR, width = EDGETHICKNESS) {
        let vertices = this.getVerticesFromEdge(i);
        Draw.edge(ctx, vertices.tail, vertices.head, color, width);
    }
    drawEdges(ctx, color = EDGECOLOR, width = EDGETHICKNESS) {
        for (let i = 0; i < this.nEdges; i++) {
            this.drawEdge(ctx, i, color, width);
        }
    }
    draw(ctx, edgeColor = EDGECOLOR, vertexColor = POINTCOLOR, edgeWidth = EDGETHICKNESS, vertexSize = POINTSIZE) {
        this.drawEdges(ctx, edgeColor, edgeWidth);
        this.drawVertices(ctx, vertexColor, vertexSize);
    }

    // conversion
    adjacencyGraph() {
        let graph = new GraphA();
        graph.vertices.push(...this.vertices);

        let adjacencies = this.vertices.map(() => { return []; });
        for (let i = 0; i < this.nEdges; i++) {
            adjacencies[this.edges[i][0]].push(this.edges[i][1]);
            adjacencies[this.edges[i][1]].push(this.edges[i][0]);
        }
        graph.adjacencyLists = adjacencies;

        return graph;
    }

    // depth-first search
    // at each vertex, current = execute(i, current, ...params) is run
    // if returns = true, current is returned after being modified by all neighbors
    // else, current is passed to neighbors but not modified
    depthFirstSearch(returnsValue, execute, startValue, ...params) {
        return this.depthFirstSearchWithStart(0, returnsValue, execute, startValue, ...params);
    }
    depthFirstSearchWithStart(start, returnsValue, execute, startValue, ...params) {
        const graphA = this.adjacencyGraph();
        return graphA.depthFirstSearch(start, returnsValue, execute, startValue, ...params);
    }

    // path search
    // similar to DFS, but runs through every possible path through the group (starting from the given index)
    pathSearch(returnsValue, execute, startValue, ...params) {
        return this.depthFirstSearchWithStart(0, returnsValue, execute, startValue, ...params);
    }
    pathSearchWithStart(start, returnsValue, execute, startValue, ...params) {
        const graphA = this.adjacencyGraph();
        return graphA.pathSearch(start, returnsValue, execute, startValue, ...params);
    }

    // cycles
    getAllCycles() {
        // find all cycles using path search
        let cycles = [];
        let visited = this.vertices.map(() => false); // create array with a value of false for each vertex
        for (let i = 0; i < this.nVertices; i++) {
            if (!visited[i]) {
                let cyclesInGroup = [];
                this.pathSearchWithStart(i, false, (i, path, neighbors, c, cyclesInGroup, visited) => {
                    visited[i] = true;

                    for (let j = 0; j < neighbors.length; j++) {
                        let n = neighbors[j];
                        if (path.includes(n)) {
                            let c = path.slice(path.indexOf(n));
                            if (c.length >= 3 && !Utils.includesGroup(cyclesInGroup, c)) cyclesInGroup.push(c);
                        }
                    }
                }, null, cyclesInGroup, visited);
                console.log(`pushing ${cyclesInGroup.length} cycles to cycles...`);
                cycles.push(...cyclesInGroup);
            }
        }
        
        return cycles;
    }

}