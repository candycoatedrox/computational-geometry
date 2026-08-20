class PlanarGraphQuad extends FaceGraph {

    quadEdge = null;

    constructor() {
        super();

        this.quadEdge = new GraphQ();
    }

    initDefaultGraphState() { // TESTING ONLY
        // assumes 3 vertices have already been created
        this.edges.push([0,1]);
        this.edges.push([1,2]);
        this.edges.push([2,0]);
        this.faces.push([0,1,2]);

        this.quadEdge.faces.push([0,1,2]);
        this.quadEdge.edges.push(new QuadEdge(1, 0, 1, -1, 0, 4, 2, 2, 4));
        this.quadEdge.edges.push(new QuadEdge(0, 1, 0, 0, -1, 3, 5, 5, 3));
        this.quadEdge.edges.push(new QuadEdge(3, 1, 2, -1, 0, 0, 4, 4, 0));
        this.quadEdge.edges.push(new QuadEdge(2, 2, 1, 0, -1, 5, 1, 1, 5));
        this.quadEdge.edges.push(new QuadEdge(5, 2, 0, -1, 0, 2, 0, 0, 2));
        this.quadEdge.edges.push(new QuadEdge(4, 0, 2, 0, -1, 1, 3, 3, 1));
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

        this.quadEdge.splitEdgeWithVertex(v,e*2, index);
        this.updateFaces();
        return v;
    }
    splitEdgeWithVertexCoords(coords, e, index = this.nVertices) {
        return this.splitEdgeWithVertex(coords.x, coords.y, e, index);
    }
    deleteVertexAsSplit(i) {
        // TODO: only possible if number of connections is even
        // any edges that are connected to deleted vertex should be combined by rotating around vertex (see notes)
        
        // let GraphQ handle this one, then copy its work, i think lol

        let nConnections = this.getEdgesFromVertex(i).length;
        if (nConnections < 2) { // can't be unsplit, but can be deleted normally very easily
            this.deleteVertex(i);
            return true;
        } else if (nConnections % 2 === 1) { // odd number of connections; can't be unsplit
            return false;
        } else {
            combineEdges = this.quadEdge.deleteVertexAsSplit(i);

            // TODO
            // ...




            this.updateFaces();
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

        this.updateFaces();
        return true;
    }
    addNonCrossingEdge(i,j) {
        let tail = this.vertices[i];
        let head = this.vertices[j];
        if (this.intersectsAnyEdge(tail, head)) return false; // new edge would create a crossing
        return this.addEdge(i,j);
    }
    deleteEdge(i) {
        this.edges.splice(i,1);
        this.quadEdge.deleteEdge(i*2);
        this.updateFaces();
    }
    clearEdges() {
        super.clearEdges();
        this.quadEdge.clearEdges();
    }

    // faces
    updateFaces() {
        this.faces = this.quadEdge.faces;
    }

}