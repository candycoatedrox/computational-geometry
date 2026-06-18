class FaceGraph extends GraphE {
    faces = [];

    constructor() {
        super();
    }

    // getters
    get nFaces() {
        return this.faces.length;
    }
    facesToString(i) {
        return Utils.groupToString(this.faces[i], this.labels);
    }
    get facesToListString() {
        return Utils.groupsToListString(this.faces, this.labels);
    }

    get maxFaces() {
        let m = 0;
        let n = this.nVertices;
        for (let r = 3; r <= n; r++) {
            m += Combinations.nChooseR(n,r);
        }
        return m;
    }
    get possibleFaces() {
        return Combinations.allIndexCombinations(this.nVertices, 3);
    }

    // vertices
    deleteVertex(i) {
        // update faces with new indices, mark faces with vertex for splicing/deletion
        let connectedFaces = [];
        for (let j = 0; j < this.nFaces; j++) {
            let f = this.faces[j];
            for (let n = 0; n < f.length; n++) {
                if (f[n] === i) {
                    connectedFaces.push(j);
                    f[n] = -1;
                } else if (f[n] > i) {
                    f[n]--;
                }
            }
        }

        // remove vertex from any connected faces
        for (let j = 0; j < this.nFaces; j++) {
            if (connectedFaces.includes(j)) {
                let f = this.faces[j];

                let index = f.indexOf(-1);
                f.splice(index,1); // remove vertex from face
                //console.log(`spliced face: ${f}`);
                if (f.length < 3) { // fewer than 3 vertices left, delete face
                    this.deleteFace(j);
                    j--; // don't skip the next face!
                    continue;
                } else {
                    //console.log("more than 3 vertices left");
                    for (let n = 0; n < this.nFaces; n++) {
                        if (n !== j && this.faceIsBetween(j, ...this.faces[n])) { // face is now a duplicate
                            //console.log("deleting duplicate face...");
                            this.deleteFace(j);
                            j--; // don't skip the next face!
                            break;
                        }
                    }
                }
            }
        }

        super.deleteVertex(i);
    }
    clearVertices() {
        this.faces.length = 0;
        super.clearVertices();
    }

    // faces
    addFace(...indices) {
        let ind = Utils.withoutDuplicates(indices);
        if (ind.length < 3) {
            return false;
        } else {
            if (this.faceExistsBetween(...ind)) return false; // no duplicate faces

            this.faces.push(ind);
            return true;
        }
    }
    deleteFace(i) {
        this.faces.splice(i,1);
    }
    clearFaces() {
        this.faces.length = 0;
    }

    getFaceIndicesFromVertex(i) {
        let f = [];
        for (let j = 0; j < this.nFaces; j++) {
            if (this.faces[j].includes(i)) f.push(j);
        }
        return f;
    }
    getFacesFromVertex(i) {
        return this.faces.filter(f => f.includes(i));
    }
    getVerticesConnectedByFaceTo(i) {
        let v = [];
        for (let j = 0; j < this.nFaces; j++) {
            let f = this.faces[j];
            if (f.includes(i)) {
                for (let n = 0; n < f.length; n++) {
                    if (f[n] === i) continue;
                    if (!v.includes(f[n])) v.push(f[n]);
                }
            }
        }
        return v;
    }

    getVerticesFromFace(i) {
        return this.faces[i].map(j => this.vertices[j]);
    }
    getEdgesFromFace(i) {
        const f = this.faces[i];
        return f.map((p,i) => [p, f[(i+1) % f.length]]);
    }
    faceIncludesPoint(i,p) {
        let vertices = this.getVerticesFromFace(i);
        return vertices.some(v => v.equals(p));
    }
    faceIncludesEdge(i,e) {
        let edges = this.getEdgesFromFace(i);
        return edges.some(edge => edge.includes(e[0]) && edge.includes(e[1]));
    }
    faceContainsPoint(i,p) {
        let vertices = this.getVerticesFromFace(i);
        return Geometry1.pointInPolygon(p, vertices);
    }

    faceIncludesAll(i, ...indices) {
        return Utils.arrayIsSubsetOf(indices, this.faces[i]);
    }
    faceIsBetween(i, ...indices) {
        return Utils.arraysElementsAreSame(this.faces[i], indices);
    }
    faceExistsBetween(...indices) {
        return this.faces.some((f,i) => this.faceIsBetween(i, ...indices));
    }
    verticesAreConnectedByFace(i,j) {
        return this.faces.some(f => f.includes(i) && f.includes(j));
    }

    sharedEdgesBetweenFaces(i, j) {
        return this.getEdgesFromFace(i).filter(e => this.faceIncludesEdge(j,e));
    }
    edgesNotSharedWithOtherFace(i, j) {
        return this.getEdgesFromFace(i).filter(e => !this.faceIncludesEdge(j,e));
    }

    // check for sub/superfaces
    // note: this assumes face J is convex, and only checks if face I is FULLY INSIDE or FULLY OUTSIDE face J.
    // trying to get a proper isPolygonInsidePolygon function working while accounting for shared points was becoming a NIGHTMARE, and I don't need it to understand convex polygons to get planar graphs working...!
    faceIsSubfaceOf(i,j) {
        if (i === j) return false;
        
        const fi = this.faces[i], fj = this.faces[j], jVertices = this.getVerticesFromFace(j);
        if (Utils.arraysIntersection(fi,fj).length >= 2) {
            if (this.faceIsBetween(i, ...fj)) {
                return true;
            } else {
                for (let n = 0; n < fi.length; n++) {
                    //console.log(`face ${fj} geometrically contains point ${fi[n]}: ${Geometry1.pointInPolygon(this.vertices[fi[n]], jVertices)}`);
                    //if (fj.includes(fi[n])) console.log(`face ${fj} includes point ${fi[n]}!`);
                    if (!fj.includes(fi[n]) && !Geometry1.pointInPolygon(this.vertices[fi[n]], jVertices)) {
                        //console.log(`face ${fj} does not contain face ${fi}...`);
                        return false;
                    }
                }

                let nonShared = this.edgesNotSharedWithOtherFace(i,j);
                //console.log(nonShared);
                for (let n = 0; n < nonShared.length; n++) {
                    let a = this.vertices[nonShared[n][0]], b = this.vertices[nonShared[n][1]];
                    if (!Geometry1.pointInPolygon(Geometry1.midpoint(a,b), jVertices)) return false;
                }

                return true;
            }
        } else {
            return false;
        }
    }
    faceHasAnySubface(i) {
        for (let j = 0; j < this.nFaces; j++) {
            if (i !== j && this.faceIsSubfaceOf(j,i)) return true;
        }
        return false;
    }
    faceHasAnySuperface(i) {
        for (let j = 0; j < this.nFaces; j++) {
            if (i !== j && this.faceIsSubfaceOf(i,j)) return true;
        }
        return false;
    }

    // draw
    drawFace(ctx, i, color = COLORS.setAlpha(FACECOLOR)) {
        Draw.face(ctx, this.vertices, this.faces[i], color);
    }
    drawFaces(ctx, color = "multi") {
        for (let i = 0; i < this.nFaces; i++) {
            if (color == "multi") {
                this.drawFace(ctx, i, COLORS.setAlpha(FACECOLORS[i % FACECOLORS.length]));
            } else {
                this.drawFace(ctx, i, color);
            }
        }
    }
}