class PlanarGeomGraphQuad extends PlanarGraphQuad {

    // edges
    addNonCrossingEdge(i,j) {
        let tail = this.vertices[i];
        let head = this.vertices[j];
        if (this.intersectsAnyEdge(tail, head)) return false; // new edge would create a crossing
        return super.addEdge(i,j);
    }

}