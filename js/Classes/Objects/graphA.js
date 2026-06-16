class GraphA {

    vertices = null;
    adjacencyLists = null;

    constructor() {
        this.vertices = new Points();
        this.adjacencyLists = [];
    }

    // getters
    get nVertices() {
        return this.vertices.length;
    }

    verticesAreConnected(i,j) {
        return this.adjacencyLists[i].includes(j);
    }

    // draw
    drawVertices(ctx, labeled = true, color = POINTCOLOR, size = POINTSIZE) {
        let labs = labeled ? this.labels : [];
        vertices.draw(ctx, labs, color, size);
    }
    drawEdges(ctx, color = EDGECOLOR, width = EDGETHICKNESS) {
        // NOT UPDATED!!!
        
    }
    draw(ctx, edgeColor = EDGECOLOR, vertexColor = POINTCOLOR, edgeWidth = EDGETHICKNESS, vertexSize = POINTSIZE) {
        this.drawEdges(ctx, edgeColor, edgeWidth);
        this.drawVertices(ctx, vertexColor, vertexSize);
    }

    getEdgesFromVertex(i) {
        let e = [];
        for (let j = 0; j < this.adjacencyLists[i].length; j++) {
            e.push([i, this.adjacencyLists[i][j]]);
        }
        return e;
    }
    getVerticesConnectedTo(i) {
        return this.adjacencyLists[i];
    }

    // conversion
    edgeGraph() {
        let graph = new GraphE();
        graph.vertices.push(...this.vertices);

        for (let i = 0; i < this.nVertices; i++) {
            let e = this.getVerticesConnectedTo(i);
            for (let j = 0; j < e.length; j++) {
                graph.addEdge(i,e[j]);
            }
        }

        return graph;
    }

    // depth-first search
    depthFirstSearch(start, execute, startValue, ...params) {
        let visited = this.vertices.map(() => false); // create array with a value of false for each vertex
        return this.depthFirstSearchRec(start, visited, execute, startValue, ...params);
    }

    depthFirstSearchRec(i, visited, execute, currentValue, ...params) {
        if (visited[i]) {
            return currentValue;
        } else {
            visited[i] = true;

            let current = execute(i, currentValue, ...params);
            let neighbors = this.getVerticesConnectedTo(i);
            for (let j = 0; j < neighbors.length; j++) {
                if (!visited[neighbors[j]]) {
                    current = this.depthFirstSearchRec(neighbors[j], visited, execute, current, ...params);
                }
            }
            return current;
        }

        // run execute(vertex, i, current, ...params)
    }

}