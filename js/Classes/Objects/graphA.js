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
    depthFirstSearch(start, returnsValue, execute, startValue, ...params) {
        let visited = this.vertices.map(() => false); // create array with a value of false for each vertex
        return this.depthFirstSearchRec(start, visited, returnsValue, execute, startValue, ...params);
    }
    depthFirstSearchRec(i, visited, returnsValue, execute, currentValue, ...params) {
        if (visited[i]) {
            return currentValue;
        } else {
            visited[i] = true;
            let neighbors = this.getVerticesConnectedTo(i);
            let current = execute(i, visited, neighbors, currentValue, ...params);
            for (let j = 0; j < neighbors.length; j++) {
                if (!visited[neighbors[j]]) {
                    if (returnsValue) {
                        current = this.depthFirstSearchRec(neighbors[j], visited, returnsValue, execute, current, ...params);
                    } else {
                        this.depthFirstSearchRec(neighbors[j], visited, returnsValue, execute, current, ...params);
                    }
                }
            }

            if (returnsValue) {
                return current;
            } else {
                return;
            }
        }

        // runs execute(i, visited, neighbors, current, ...params)
    }

    // path search
    // similar to DFS, but runs through every possible path through the group (starting from the given index)
    pathSearch(start, returnsValue, execute, startValue, ...params) {
        let path = [];
        return this.pathSearchRec(start, path, returnsValue, execute, startValue, ...params);
    }
    pathSearchRec(i, prevPath, returnsValue, execute, currentValue, ...params) {
        if (prevPath.includes(i)) {
            return currentValue;
        } else {
            const path = prevPath.concat(i);
            let neighbors = this.getVerticesConnectedTo(i);
            let current = execute(i, path, neighbors, currentValue, ...params);
            for (let j = 0; j < neighbors.length; j++) {
                if (!path.includes(neighbors[j])) {
                    if (returnsValue) {
                        current = this.pathSearchRec(neighbors[j], path, returnsValue, execute, current, ...params);
                    } else {
                        this.pathSearchRec(neighbors[j], path, returnsValue, execute, current, ...params);
                    }
                }
            }

            if (returnsValue) {
                return current;
            } else {
                return;
            }
        }

        // runs execute(i, path, neighbors, current, ...params)
    }

}