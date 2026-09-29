class GraphQ {

    standardGraph = null;

    vertices = null;
    edges = []; // contains QuadEdges
    faces = []; // index -1 is the outer face

    // should I store the outer face as a list of vertices as well?

    constructor(standardGraph) {
        this.standardGraph = standardGraph;
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
        const edge = this.edges[i];
        return `[${labs[edge.head]}, ${labs[edge.tail]}]`;
    }
    edgesToListString(labs) {
		let str = "<ul>";
		for (let i = 0; i < this.nEdges; i++) {
			str += `<li>${this.edgeToString(i, labs)}</li>`;
		}
		str += "</ul>";
		return str;
    }
    quadEdgePairInfo(i, labs) {
        let thisHeader = `Edge ${i}: ${this.edgeToString(i, labs)}`;
        let thisInfo = this.quadEdgeInfoToString(i, labs);
        let twinHeader = `Edge ${i+1}: ${this.edgeToString(i+1, labs)}`;
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
        if (i == -1) {
            return "[OUTER]";
        } else {
            return Utils.groupToString(this.faces[i], labs);
        }
    }
    facesToListString(labs) {
        //return Utils.groupsToListString(this.faces, labs);
		let str = "<ul>";
		for (let i = -1; i < this.nFaces; i++) {
			str += `<li>${this.faceToString(i, labs)}</li>`;
		}
		str += "</ul>";
		return str;
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
                console.log(`twin: ${e.twin}`);
                this.edges[e.twin].shiftIndicesForDeleteVertex(i);
            }
        }

        // TODO: handle faces



        this.vertices.splice(i,1); // delete the vertex
    }
    splitEdgeWithVertex(v,e, index = this.nVertices) {
        const t = this.edges[e].twin
        if (t < e) {
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
            
            const faceB = edge.right;
            if (faceB !== -1) {
                for (let i = 0; i < this.faces[faceB].length; i++) {
                    if (this.faces[faceB][i] === head || this.faces[faceB][i] === tail) {
                        this.faces[faceB].splice(i+1, 0, index);
                        break;
                    }
                }
            }

            const faceA = edge.left;
            if (faceA !== -1) {
                for (let i = 0; i < this.faces[faceA].length; i++) {
                    if (this.faces[faceA][i] === head || this.faces[faceA][i] === tail) {
                        this.faces[faceA].splice(i+1, 0, index);
                        break;
                    }
                }
            }
        }

    }
    deleteVertexAsSplit(i, connectedVertices) {
        // TODO: only possible if number of connections is even
        // any edges that are connected to deleted vertex should be combined by rotating around vertex (see notes)

        // only passed into this function if # of connected edges = 2

        // get edges in order
        let edgesInOrder = this.connectedEdgesInOrder(i, connectedVertices[0], connectedVertices[1]);
        const v1 = edgesInOrder.v1, v2 = edgesInOrder.v2, e1 = edgesInOrder.e1, e2 = edgesInOrder.e2, t1 = edgesInOrder.t1, t2 = edgesInOrder.t2;
        const edge1 = this.edges[e1], edge2 = this.edges[e2], twin1 = this.edges[t1], twin2 = this.edges[t2];

        /*
        // check if vertex can be deleted (beyond checks done in PlanarGraphQuad)
        let oppositeFace = null;
        if (edge1.left === -1) {
            if (edge1.right !== -1) oppositeFace = edge1.right;
        } else if (edge1.right === -1) {
            oppositeFace = edge1.left;
        }
        if (oppositeFace !== null) { // vertex is on outer face
            if (!this.standardGraph.faceContainsMidpoint(oppositeFace, v1, v2)) return null; // can't easily unsplit
        }
        */

        // adjust head, tail, and respective edges of remaining edge
        console.log(edge1.tail);
        edge1.tail = edge2.tail;
        console.log(edge1.tail);
        edge1.tailEdge = edge2.tailEdge;
        twin1.head = twin2.head;
        twin1.headEdge = twin2.headEdge;

        // adjust vertex edges of neighboring edges
        const trueTailEdge = this.getTailEdgeOf(e2), trueHeadEdge = this.getHeadEdgeOf(t2);
        trueTailEdge.headEdge = e1;
        trueHeadEdge.tailEdge = t1;

        // adjust face edges of neighboring edges; remove deleted vertex from faces
        const leftFace = edge1.left, rightFace = edge1.right;

        if (leftFace !== -1) {
            // adjust face edges
            let oppositeLeft = this.edges[edge2.leftEdge];
            let left = this.edges[oppositeLeft.twin];
            left.rightEdge = twin2.rightEdge;

            let oppositeRight = this.edges[twin2.rightEdge];
            let right = this.edges[oppositeRight.twin];
            right.leftEdge = edge2.leftEdge;

            // remove deleted vertex from face
            let index = this.faces[leftFace].indexOf(i);
            this.faces[leftFace].splice(index, 1);
        }

        if (rightFace !== -1) {
            // adjust face edges
            let oppositeLeft = this.edges[twin2.leftEdge];
            let left = this.edges[oppositeLeft.twin];
            left.rightEdge = edge2.rightEdge;

            let oppositeRight = this.edges[edge2.rightEdge];
            let right = this.edges[oppositeRight.twin];
            right.leftEdge = twin2.leftEdge;

            // remove deleted vertex from face
            let index = this.faces[rightFace].indexOf(i);
            this.faces[rightFace].splice(index, 1);
        }

        // delete edges
        let smallerEdge = (e2 < t2) ? e2 : t2;
        console.log(`smallerEdge = ${smallerEdge}`);
        this.edges.splice(smallerEdge, 2);

        for (let j = 0; j < this.nEdges; j += 2) {
            let e = this.edges[j];
            e.shiftIndicesForDeleteEdgePair(smallerEdge);
            this.edges[e.twin].shiftIndicesForDeleteEdgePair(smallerEdge);
        }
        console.log(this.edges);

        // delete vertex
        this.deleteVertex(i);

        // return pairs of edge indices (divided by 2, converted for PlanarGraphQuad) that should be combined, as well as the 2 vertices to create an edge between
        return [[Math.floor(e1/2), Math.floor(e2/2), v1, v2]];
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


        

        this.edges.push(new QuadEdge(this.nEdges+1, i,j, left, right, headEdge, tailEdge, leftEdge, rightEdge));
        this.edges.push(new QuadEdge(this.nEdges-1, j,i, left, right, headEdge, tailEdge, leftEdge, rightEdge));

        // TODO: update faces




        return true;
    }
    deleteEdge(i) {
        const t = this.edges[i].twin
        if (t < i) {
            this.deleteEdge(t);
        } else {
            // should delete both this edge and its twin (i+1)

            
        }
    }
    clearEdges() {
        this.edges.length = 0;
        this.faces.length = 0;
    }

    getIncidentEdgeIndices(i) {
        let e = [];
        for (let j = 0; j < this.nEdges; j++) {
            if (this.edges[j].includes(i)) e.push(j);
        }
        return e;
    }
    getIncidentEdges(i) {
        return this.edges.filter(e => e.includes(i));
    }
    getNeighboringVertices(i) {
        let v = [];
        for (let j = 0; j < this.nEdges; j++) {
            let edge = this.edges[j];
            if (edge.head === i) {
                v.push(edge.tail);
            } else if (edge.tail === i) {
                v.push(edge.head);
            }
        }
        return v;
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
    verifyFaceOrientation() {
        if (this.nFaces > 1) {
            let visited = this.faces.map(() => false);
            this.verifyFaceOrientationRec(0, null, visited);
        }
    }
    verifyFaceOrientationRec(i, adjacentEdge, visited) {
        if (i === -1 || visited[i]) {
            return;
        } else {
            visited[i] = true;

            const edges = this.getEdgesOfFace(i);

            if (adjacentEdge != null) {
                const adjEdgeVertices = adjacentEdge.vertices;
                const v1 = adjEdgeVertices[0], v2 = adjEdgeVertices[1];
                let face = this.faces[i];

                let flipOrientation = false;
                for (let j = 0; j < face.length; j++) {
                    let next = (j === face.length - 1) ? 0 : j+1;
                    if (face[j] === v1 && face[next] === v2) {
                        flipOrientation = true;
                        break;
                    } else if (face[j] === v2 && face[next] === v1) {
                        break;
                    }
                }

                if (flipOrientation) {
                    Utils.reverseArray(this.faces[i]);
                    adjacentEdge = this.edges[adjacentEdge.twin];
                }
            }

            for (let j = 0; j < edges.length; j++) {
                let edge = this.edges[edges[j]];
                let adjFace = (edge.left === i) ? edge.right : edge.left;

                this.verifyFaceOrientationRec(adjFace, edge, visited);
            }
        }
    }

    getFirstEdgeOfFace(i) {
        return this.getEdgeBetweenVertices(this.faces[i][0], this.faces[i][1]);
    }
    getEdgesOfFace(i) {
        const firstEdge = this.getFirstEdgeOfFace(i); // index
        const isClockwise = this.edges[firstEdge].right === i

        let edges = [];
        let e = firstEdge;
        for (let j = 0; j < this.faces[i].length; j++) {
            edges.push(e);
            e = (isClockwise) ? this.edges[e].rightEdge : this.edges[e].leftEdge;
        }

        return edges;
    }
    faceOrientation(i) {
        const firstEdge = this.getFirstEdgeOfFace(i);

        if (firstEdge === null) return 0; // no edge found? invalid face

        if (this.edges[firstEdge].right === i) {
            return 1; // clockwise
        } else {
            return -1; // counter-clockwise
        }
    }
    faceIsClockwise(i) {
        return this.faceOrientation(i) === 1;
    }
    adjacentFacesToFace(i) {
        const isCW = this.faceIsClockwise(i);

        let currentEdge = this.getFirstEdgeOfFace(i);
        let adjacentFaces = [];
        for (let j = 0; j < this.faces[i].length; j++) {
            const edge = this.edges[currentEdge];
            let adjFace = isCW ? edge.left : edge.right;
            if (!adjacentFaces.includes(adjFace)) adjacentFaces.push(adjFace);

            currentEdge = isCW ? edge.rightEdge : edge.leftEdge;
        }
        
        return adjacentFaces;
    }
    adjacentTrueFacesToFace(i) {
        const isCW = this.faceIsClockwise(i);

        let currentEdge = this.getFirstEdgeOfFace(i);
        let adjacentFaces = [];
        for (let j = 0; j < this.faces[i].length; j++) {
            const edge = this.edges[currentEdge];
            let adjFace = isCW ? edge.left : edge.right;
            if (adjFace !== -1 && !adjacentFaces.includes(adjFace)) adjacentFaces.push(adjFace);

            currentEdge = isCW ? edge.rightEdge : edge.leftEdge;
        }
        
        return adjacentFaces;
    }

    verticesAreConnected(i,j) {
        return this.edges.some((e,n) => edge.isBetween(i,j));
    }
    getFirstEdgeBetweenVertices(i,j) {
        for (let n = 0; n < this.nEdges; n++) {
            if (this.edges[n].includes(i) && this.edges[n].includes(j)) return n;
        }

        return null;
    }
    getEdgeBetweenVertices(i,j) {
        for (let n = 0; n < this.nEdges; n++) {
            if (this.edges[n].head === i && this.edges[n].tail === j) return n;
        }

        return null;
    }

    connectedEdgesInOrder(center, i, j) {
        let edgeIndexA = this.getFirstEdgeBetweenVertices(center, i), edgeIndexB = this.getFirstEdgeBetweenVertices(center, j);
        let edgeA = this.edges[edgeIndexA];

        let vertex1, vertex2, edge1, edge2, twin2;
        if (edgeA.tail = center) {
            vertex1 = i, vertex2 = j, edge1 = edgeIndexA;
            if (edgeA.tailEdge = edgeIndexB) {
                edge2 = edgeIndexB, twin2 = edgeIndexB + 1;
            } else {
                edge2 = edgeIndexB + 1, twin2 = edgeIndexB;
            }
        } else {
            vertex1 = j, vertex2 = i, edge1 = edgeIndexB;
            if (edgeA.headEdge = edgeIndexB) {
                edge2 = edgeIndexA, twin2 = edgeIndexA + 1;
            } else {
                edge2 = edgeIndexA + 1, twin2 = edgeIndexA;
            }
        }

        return { v1: vertex1, v2: vertex2, e1: edge1, e2: edge2, t1: edge1+1, t2: twin2 };
    }

}