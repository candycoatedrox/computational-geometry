class PlanarGraphQuad extends FaceGraph {

    quadEdge = null;

    constructor() {
        super();

        this.quadEdge = new GraphQ(this);
        this.faces = this.quadEdge.faces;
    }

    // default states
    initTriangle() { // TESTING ONLY
        // assumes 3 vertices have already been created
        this.edges.push([0,1]);
        this.edges.push([1,2]);
        this.edges.push([2,0]);

        this.quadEdge.faces.push([0,1,2]);
        this.quadEdge.edges.push(new QuadEdge(1, 0, 1, -1, 0, 4, 2, 2, 4));
        this.quadEdge.edges.push(new QuadEdge(0, 1, 0, 0, -1, 3, 5, 5, 3));
        this.quadEdge.edges.push(new QuadEdge(3, 1, 2, -1, 0, 0, 4, 4, 0));
        this.quadEdge.edges.push(new QuadEdge(2, 2, 1, 0, -1, 5, 1, 1, 5));
        this.quadEdge.edges.push(new QuadEdge(5, 2, 0, -1, 0, 2, 0, 0, 2));
        this.quadEdge.edges.push(new QuadEdge(4, 0, 2, 0, -1, 1, 3, 3, 1));
    }
    initDiamond() { // TESTING ONLY
        // assumes 4 vertices have already been created
        this.edges.push([0,1]);
        this.edges.push([1,2]);
        this.edges.push([2,0]);
        this.edges.push([0,3]);
        this.edges.push([3,2]);

        this.quadEdge.faces.push([0,1,2]);
        this.quadEdge.faces.push([2,0,3]);
        this.quadEdge.edges.push(new QuadEdge(1, 0, 1, -1, 0, 7, 2, 2, 4));
        this.quadEdge.edges.push(new QuadEdge(0, 1, 0, 0, -1, 3, 6, 5, 3));
        this.quadEdge.edges.push(new QuadEdge(3, 1, 2, -1, 0, 0, 4, 9, 0));
        this.quadEdge.edges.push(new QuadEdge(2, 2, 1, 0, -1, 5, 1, 1, 8));
        this.quadEdge.edges.push(new QuadEdge(5, 2, 0, 1, 0, 8, 0, 6, 2));
        this.quadEdge.edges.push(new QuadEdge(4, 0, 2, 0, 1, 1, 9, 3, 7));
        this.quadEdge.edges.push(new QuadEdge(7, 0, 3, 0, -1, 4, 8, 8, 1));
        this.quadEdge.edges.push(new QuadEdge(6, 3, 0, -1, 0, 9, 5, 0, 9));
        this.quadEdge.edges.push(new QuadEdge(9, 3, 2, 0, -1, 6, 3, 4, 6));
        this.quadEdge.edges.push(new QuadEdge(8, 2, 3, -1, 0, 2, 7, 7, 5));
    }

    // getters
    quadEdgeInfo(i) {
        return this.quadEdge.quadEdgePairInfo(i*2, this.labels);
    }

    // vertices
    addVertex(x,y, index = this.nVertices) {
        let v = super.addVertex(x,y, index);
        this.quadEdge.addVertex(v, index);
        return v;
    }
    addVertexCoords(coords, index = this.nVertices) {
        return this.addVertex(coords.x, coords.y, index);
    }
    deleteVertex(i) {
        super.deleteVertex(i);
        this.quadEdge.deleteVertex(i);
    }
    splitEdgeWithVertex(x,y, e, index = this.nVertices) {
        let v = this.addVertex(x,y, index);

        let edge = this.edges[e];
        let tail = edge[1];
        this.edges.splice(e+1, 0, [index, tail]);
        edge[1] = index;

        this.quadEdge.splitEdgeWithVertex(v, e*2, index);
        return v;
    }
    splitEdgeWithVertexCoords(coords, e, index = this.nVertices) {
        return this.splitEdgeWithVertex(coords.x, coords.y, e, index);
    }
    deleteVertexAsSplit(i) {
        // TODO: only possible if number of connections is even
        
        // let GraphQ handle this one, then copy its work, i think lol

        const neighbors = this.getNeighboringVertices(i);
        const degree = neighbors.length;
        if (degree < 2) { // can't be unsplit, but can be deleted normally very easily
            this.deleteVertex(i);
            return true;
        } else if (degree !== 2) { // not exactly 2 connections; can't be unsplit
            return false;
        } else {
            if (this.verticesAreConnected(neighbors[0], neighbors[1])) return false; // unsplit would create a duplicate edge

            const combineEdges = this.quadEdge.deleteVertexAsSplit(i, neighbors);

            if (combineEdges === null) return false; // cannot be unsplit (failed a check in GraphQ)

            for (let j = 0; j < combineEdges.length; j++) {
                let data = combineEdges[j];
                let e1 = data[0], e2 = data[1], v1 = data[2], v2 = data[3];
                this.edges[e1] = [v1,v2];
                this.edges.splice(e2,1); // delete extra edge

                // delete any connected edges, update edges with new indices
                for (let n = 0; n < this.nEdges; n++) {
                    let e = this.edges[n];
                    if (e.includes(i)) {
                        this.deleteEdge(n); // delete the edge
                        n--; // don't skip the next edge!
                    } else {
                        if (e[0] > i) e[0]--;
                        if (e[1] > i) e[1]--;
                    }
                }
            }

            this.vertices.splice(i,1); // delete the vertex
            this.updateLabels();

            return true;
        }
    }
    clearVertices() {
        super.clearVertices();
        this.quadEdge.clearVertices();
    }

    // note that the index for a given edge in GraphQ will be doubled due to twins

    // edges
    addEdge(i,j) {
        if (!super.addEdge(i,j)) return false; // new edge would create a duplicate
        this.quadEdge.addEdge(i,j);
        return true;
    }
    addNonCrossingEdge(i,j) {
        return this.addEdge(i,j);
    }
    deleteEdge(i) {
        this.edges.splice(i,1);
        this.quadEdge.deleteEdge(i*2);
    }
    clearEdges() {
        super.clearEdges();
        this.quadEdge.clearEdges();
    }

    // faces
    faceOrientation(i) {
        return this.quadEdge.faceOrientation(i);
    }
    faceIsClockwise(i) {
        return this.quadEdge.faceIsClockwise(i);
    }
    adjacentFacesToFace(i) {
        return this.quadEdge.adjacentFacesToFace(i);
    }
    adjacentTrueFacesToFace(i) {
        return this.quadEdge.adjacentTrueFacesToFace(i);
    }

}