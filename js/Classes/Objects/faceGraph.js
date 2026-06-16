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
        // remove vertex from any connected faces
        facesLoop: for (let j = 0; j < this.nFaces; j++) {
            let f = this.faces[j];
            if (f.includes(i)) {
                let index = this.faces[j].indexOf(i);
                f.splice(index,1); // remove vertex from face
                if (f.length < 3) { // fewer than 3 vertices left, delete face
                    this.deleteFace(j);
                    j--; // don't skip the next face!
                    continue facesLoop;
                } else {
                    console.log("more than 3 vertices left");
                    for (let n = 0; n < this.nFaces; n++) {
                        if (n !== j && this.faceIsBetween(j, ...this.faces[n])) { // face is now a duplicate
                            this.deleteFace(j);
                            j--; // don't skip the next face!
                            continue facesLoop;
                        }
                    }
                }
            }

            // face is not deleted; update with new indices
            for (let n = 0; n < f.length; n++) {
                if (f[n] > i) f[n]--;
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
        let f = [];
        for (let j = 0; j < this.nFaces; j++) {
            if (this.faces[j].includes(i)) f.push(this.faces[j]);
        }
        return f;
    }
    getVerticesConnectedByFace(i) {
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
        const f = this.faces[i];
        let v = [];
        for (let j = 0; j < f.length; j++) {
            v.push(this.vertices[f[j]]);
        }
        return v;
    }
    getEdgesFromFace(i) {
        const f = this.faces[i];
        let e = [];
        for (let a = 0; a < f.length; a++) {
            let b = (a !== f.length - 1) ? a+1 : 0;
            e.push([f[a],f[b]]);
        }
        return e;
    }
    faceIncludesPoint(i,p) {
        let vertices = this.getVerticesFromFace(i);
        for (let j = 0; j < vertices.length; j++) {
            if (vertices[j] === p) return true;
        }
        return false;
    }
    faceIncludesEdge(i,e) {
        let edges = this.getEdgesFromFace(i);
        for (let j = 0; j < edges.length; j++) {
            if (edges[j].includes(e[0]) && edges[j].includes(e[1])) return true;
        }
        return false;
    }
    faceContainsPoint(i,p) {
        let vertices = this.getVerticesFromFace(i);
        return Geometry1.pointInPolygon(p, vertices);
    }

    faceIsBetween(i, ...indices) {
        let ind = Utils.withoutDuplicates(indices);
        let f = this.faces[i];
        if (ind.length !== f.length) return false;
        for (let i = 0; i < ind.length; i++) {
            if (!f.includes(ind[i])) return false;
        }
        return true;
    }
    faceExistsBetween(...indices) {
        for (let i = 0; i < this.nFaces; i++) {
            if (this.faceIsBetween(i, ...indices)) return true;
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