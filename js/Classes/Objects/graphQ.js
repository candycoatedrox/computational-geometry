class GraphQ {

    vertices = null;
    edges = []; // contains QuadEdges
    faces = []; // index -1 is the outer face

    constructor() {
        this.vertices = new Points();
    }

    // GraphQ should *only* be updated from PlanarGraphQuad -- so assume all vertices & edges are valid there

    // getters
    get nVertices() {
        return this.vertices.length;
    }
    get nEdges() {
        return this.edges.length;
    }
    edgeToString(i, labs) {
        return Utils.groupToString(this.edges[i], labs);
    }
    quadEdgePairInfo(i, labs) {
        let thisHeader = `Edge ${i}: ${this.edgeToString(i, labs)}`;
        let thisInfo = this.quadEdgeInfoToString(i, labs);
        let thisHeader = `Edge ${i+1}: ${this.edgeToString(i+1, labs)}`;
        let twinInfo = this.quadEdgeInfoToString(i+1, labs);

        let info = {headerA: thisHeader, headerB: twinHeader, infoA: thisInfo, infoB: twinInfo};
        return info;
    }
    quadEdgeInfoToString(i, labs) {
        const edge = this.edges[i];
        let str = "<ul>";
        str += `<li>Twin: ${edge.twin} ${this.edgeToString(edge.twin, labs)}</li>`;
        str += `<li>Head: ${labs[edge.head]}</li>`;
        str += `<li>Tail: ${labs[edge.tail]}</li>`;
        str += `<li>Left: ${edge.left} ${this.faceToString(edge.left, labs)}</li>`;
        str += `<li>Right: ${edge.right} ${this.faceToString(edge.right, labs)}</li>`;
        str += `<li>Head Edge: ${edge.headEdge} ${this.edgeToString(edge.headEdge, labs)}</li>`;
        str += `<li>Tail Edge: ${edge.tailEdge} ${this.edgeToString(edge.tailEdge, labs)}</li>`;
        str += `<li>Left Edge: ${edge.leftEdge} ${this.edgeToString(edge.leftEdge, labs)}</li>`;
        str += `<li>Right Edge: ${edge.rightEdge} ${this.edgeToString(edge.rightEdge, labs)}</li>`;
        str += "</ul>";
        return str;
    }
    get nFaces() {
        return this.faces.length;
    }
    faceToString(i, labs) {
        return Utils.groupToString(this.faces[i], labs);
    }

    // vertices
    addVertex(v, index = this.nVertices) {
        if (index === this.nVertices) {
            this.vertices.push(v);
        } else {
            this.vertices.splice(index, 0, v);

            // shift all edges & faces
            for (let i = 0; i < this.nEdges; i++) {
                this.edges[i].shiftIndicesForInsertVertex(index);
            }
            for (let i = 0; i < this.nFaces; i++) {
                let f = this.faces[i];
                for (let j = 0; j < f.length; f++) {
                    if (f[j] >= index) f[j]++;
                }
            }
        }
    }
    deleteVertex(i) {
        // delete any connected edges, update edges with new indices
        for (let j = 0; j < this.nEdges; j += 2) { // only need to check the first edge of each pair of twins
            let e = this.edges[j];
            if (e.includes(i)) {
                this.deleteEdge(j); // delete the edge and its twin
                j -= 2; // don't skip the next edge pair!
            } else {
                e.shiftIndicesForDeleteVertex(i);
                this.edges[e.twin].shiftIndicesForDeleteVertex(i);
            }
        }

        // TODO: handle faces



        this.vertices.splice(i,1); // delete the vertex
    }
    splitEdgeWithVertex(v,e, index = this.nVertices) {
        const t = this.edges[e].twin
        if (t < i) {
            this.splitEdgeWithVertex(t);
        } else { // index is the first in a pair
            this.addVertex(v, index);

            const edge = this.edges[e];
            const twin = this.edges[t];

            // update edges with new edge indices
            for (let i = 0; i < this.nEdges; i++) {
                this.edges[i].shiftIndicesForInsertEdgePair(e+2);
            }
            
            // create edges for second half of split
            this.edges.splice(e+2, 0, new QuadEdge(e+3, index, edge.tail, edge.left, edge.right, e, edge.tailEdge, edge.leftEdge, e));
            this.edges.splice(e+3, 0, new QuadEdge(e+2, edge.tail, index, edge.right, edge.left, twin.headEdge, t, twin.leftEdge, t));

            // connect first half of split to new vertex
            edge.tail = index;
            twin.head = index;

            // adjust vertex edges of neighboring edges
            const oldTailEdge = this.getTailEdgeOf(e);
            const oldTwinHeadEdge = this.getHeadEdgeOf(t);
            oldTailEdge.headEdge = e+2;
            oldTwinHeadEdge.tailEdge = e+3;

            // adjust face edges of neighboring edges
            const tailEdge1 = this.getTailEdgeOf(e+2);
            if (tailEdge1.leftEdge == e) {
                tailEdge1.leftEdge = e+2;
            } else if (tailEdge1.rightEdge == e) {
                tailEdge1.rightEdge = e+2;
            }
            
            const headEdge2 = this.getHeadEdgeOf(e+3);
            if (headEdge2.leftEdge == t) {
                headEdge2.leftEdge = e+3;
            } else if (headEdge2.rightEdge == t) {
                headEdge2.rightEdge = e+3;
            }
            
            // adjust vertex and face edges of original edges
            edge.tailEdge = e+2;
            edge.leftEdge = e+2;
            twin.headEdge = e+3;
            twin.rightEdge = e+3;

            // add new vertex to faces
            const head = edge.head;
            const tail = edge.tail;

            const faceA = edge.left;
            for (let i = 0; i < this.faces[faceA].length; i++) {
                if (this.faces[faceA][i] === head || this.faces[faceA][i] === tail) {
                    this.faces[faceA].splice(i+1, 0, index);
                }
            }

            const faceB = edge.right;
            for (let i = 0; i < this.faces[faceB].length; i++) {
                if (this.faces[faceB][i] === head || this.faces[faceB][i] === tail) {
                    this.faces[faceB].splice(i+1, 0, index);
                }
            }
        }

    }
    deleteVertexAsSplit(i) {
        // TODO: only possible if number of connections is even
        // any edges that are connected to deleted vertex should be combined by rotating around vertex (see notes)
        
        // return pairs of edge indices (divided by 2, converted for PlanarGraphQuad) that should be combined

        // TODO: handle faces


    }
    clearVertices() {
        this.vertices.length = 0;
        this.clearEdges();
    }

    // edges
    addEdge(i,j) {
        // needs to handle: split faces, new faces
        // for split faces: figure out whether THIS new edge (i>j) or twin is in line with the orientation of the face as is
        // oh god for split faces the orientation of one of the new faces needs to be swapped AAAAA
        
        // TODO: determine left + right faces, next edges


        
        // these are placeholders
        let left = 1;
        let right = 1;
        let headEdge = 1;
        let tailEdge = 1;
        let leftEdge = 1;
        let rightEdge = 1;


        

        this.edges.push(new QuadEdge(this.nEdges+1, i,j, left, right, headEdge, tailEdge, leftEdge, rightEdge))
        this.edges.push(new QuadEdge(this.nEdges-1, j,i, left, right, headEdge, tailEdge, leftEdge, rightEdge))

        // TODO: update faces




        return true;
    }
    deleteEdge(i) {
        const t = this.edges[i].twin
        if (t < i) {
            this.deleteEdge(t)
        } else {
            // should delete both this edge and its twin (i+1)

            
        }
    }
    clearEdges() {
        this.edges.length = 0;
        this.faces.length = 0;
    }

    getTwinEdgeOf(i) {
        const e = this.edges[i];
        return this.edges[e.twin];
    }
    getHeadVertexOf(i) {
        const e = this.edges[i];
        return this.vertices[e.head];
    }
    getTailVertexOf(i) {
        const e = this.edges[i];
        return this.vertices[e.tail];
    }
    getLeftFaceOf(i) {
        const e = this.edges[i];
        return this.faces[e.left];
    }
    getRightFaceOf(i) {
        const e = this.edges[i];
        return this.faces[e.right];
    }
    getHeadEdgeOf(i) {
        const e = this.edges[i];
        return this.edges[e.headEdge];
    }
    getTailEdgeOf(i) {
        const e = this.edges[i];
        return this.edges[e.tailEdge];
    }
    getLeftEdgeOf(i) {
        const e = this.edges[i];
        return this.edges[e.leftEdge];
    }
    getRightEdgeOf(i) {
        const e = this.edges[i];
        return this.edges[e.rightEdge];
    }

    // faces
    addFace(...indices) {
        this.faces.push(indices);
    }
    deleteFace(i) {
        this.faces.splice(i,1);
    }

    verticesAreConnected(i,j) {
        return this.edges.some((e,n) => edge.isBetween(i,j));
    }

}