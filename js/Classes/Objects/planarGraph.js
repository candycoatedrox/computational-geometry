class PlanarGraph extends FaceGraph {

    constructor() {
        super();
    }

    // edges
    addEdge(i,j, updateFaces = true) {
        if (!super.addEdge(i,j)) return false; // new edge would create a duplicate

        if (updateFaces) this.updateFaces();
        return true;
    }
    addNonCrossingEdge(i,j, updateFaces = true) {
        if (!super.addNonCrossingEdge(i,j)) return false; // new edge would create a duplicate or crossing

        if (updateFaces) this.updateFaces();
        return true;
    }
    deleteEdge(i) {
        super.deleteEdge(i);
        this.updateFaces();
    }
    clearEdges() {
        super.clearEdges();
        this.clearFaces();
    }

    // faces
    updateFaces() {
        let startTime = Date.now();

        // find all cycles using path search
        let cycles = this.getAllCycles();
        let cyclesTime = Date.now();
        console.log(cycles);

        // getAllCycles is now the problem again. hitting lag spikes around n = 10 (total ~25 pts), find cycles time = 1384ms for 2858 cycles
        // add faces & trim faces handle 4468 cycles just fine (2ms and 32ms respectively), don't need to worry about those (find cycles = 2812ms with n = 11 and 26 total points)

        // clear and add faces
        this.clearFaces();
        for (let i = 0; i < cycles.length; i++) {
            this.faces.push(Utils.withoutDuplicates(cycles[i])); // manually add faces, without having to check for duplicates *again* in addFace
        }
        let addFacesTime = Date.now();
        let untrimmedFaces = this.nFaces;
        console.log(this.faces);

        // cut out duplicates and superfaces
        for (let i = 0; i < this.nFaces; i++) {
            if (this.faceHasAnySubface(i)) {
                //console.log(`deleting face ${i} (${this.faces[i]})`);
                this.deleteFace(i);
                i--; // don't skip the next face!
            }
        }
        let trimTime = Date.now();

        // sort faces
        this.faces = Utils.sortGroups(this.faces);
        let sortTime = Date.now();

        console.log(`--- updateFaces(): Time taken by task ---
Find cycles: ${cyclesTime - startTime}
Add faces: ${addFacesTime - cyclesTime} (for ${cycles.length} cycles)
Trim faces: ${trimTime - addFacesTime} (for ${untrimmedFaces} faces)
Sort faces: ${sortTime - trimTime}
Total: ${sortTime - startTime}`);
    }

    // conversion
    quadEdge() {
        // returns quad-edge representation of this graph!!
        let quadEdge = new GraphQ(this);
        
        // copy vertices and faces
        quadEdge.vertices = this.vertices;
        quadEdge.faces = this.faces;

        // create edges
        for (let i = 0; i < this.nEdges; i++) {
            let edge = this.edges[i];
            quadEdge.edges.push(new QuadEdge(i*2 + 1, edge[0], edge[1], -1, -1, -1, -1, -1, -1)); // create edge
            quadEdge.edges.push(new QuadEdge(i*2, edge[1], edge[0], -1, -1, -1, -1, -1, -1)); // create twin
        }

        // find faces for each edge
        let orientStartFaceFound = false;
        let orientStartFace = 0;
        let startFaceIsLeft = true;
        let facesByEdge = this.edges.map(() => []);
        for (let i = 0; i < this.nFaces; i++) {
            let face = quadEdge.faces[i];

            for (let j = 0; j < face.length; j++) {
                let v1 = face[j];
                let v2 = (j === face.length - 1) ? face[0] : face[j+1];
                let e = this.getEdgeBetween(v1,v2);
                facesByEdge[e].push(i);
            }

            if (!orientStartFaceFound) {
                if (face.length === 3) {
                    orientStartFaceFound = true;
                    orientStartFace = i;
                    startFaceIsLeft = !Orientation.leftTurn(this.vertices[face[0]], this.vertices[face[1]], this.vertices[face[2]]);
                    console.log("orient start face: " + i + "; is left: " + startFaceIsLeft);
                }
            }
        }

        let visitedFaces = this.faces.map(() => false);
        let outerEdges = [];
        this.quadEdgeOrientFacesRec(quadEdge, orientStartFace, startFaceIsLeft, null, outerEdges, visitedFaces, facesByEdge);

        // orient outer edge so it's all going in the same direction
        let outerEdgesOriented = [outerEdges[0]];
        let nextHead = outerEdges[0][1];
        outerEdges.splice(0,1);
        let nOuterEdges = outerEdges.length;
        for (let i = 0; i < nOuterEdges; i++) {
            console.log(outerEdges);
            console.log(nextHead);
            let n = outerEdges.findIndex(e => e.includes(nextHead));
            let edge = outerEdges[n];
            let tail = (edge[0] === nextHead) ? edge[1] : edge[0];

            outerEdgesOriented.push([nextHead, tail]);
            outerEdges.splice(n,1);

            nextHead = tail;
        }

        // handle leftEdge/rightEdge of outer edges
        let outerIsReversed;
        let edgeIndex;
        let nextEdgeIndex = quadEdge.getEdgeBetweenVertices(outerEdgesOriented[0][0], outerEdgesOriented[0][1]);
        for (let i = 0; i < outerEdgesOriented.length; i++) {
            edgeIndex = nextEdgeIndex;
            nextEdgeIndex = (i === outerEdgesOriented.length - 1) ? quadEdge.getEdgeBetweenVertices(outerEdgesOriented[0][0], outerEdgesOriented[0][1]) : quadEdge.getEdgeBetweenVertices(outerEdgesOriented[i+1][0], outerEdgesOriented[i+1][1]);

            const edge = quadEdge.edges[edgeIndex], nextEdge = quadEdge.edges[nextEdgeIndex];
            const twin = quadEdge.edges[edge.twin], nextTwin = quadEdge.edges[nextEdge.twin];

            if (edge.left === -1) {
                if (outerIsReversed == null) outerIsReversed = false;
                if (!outerIsReversed) {
                    edge.leftEdge = nextEdgeIndex;
                    twin.rightEdge = nextEdge.twin;
                } else {
                    nextEdge.leftEdge = edgeIndex;
                    nextTwin.rightEdge = edge.twin;
                }
            } else {
                if (outerIsReversed == null) outerIsReversed = true;
                if (!outerIsReversed) {
                    edge.rightEdge = nextEdgeIndex;
                    twin.leftEdge = nextEdge.twin;
                } else {
                    nextEdge.rightEdge = edgeIndex;
                    nextTwin.leftEdge = edge.twin;
                }
            }
        }



        // TODO: headEdge/tailEdge





        // Figure out edges...
        // based off faces?

        // copy verify orientation function first?

        // figure out left/right edge before left/right face?





        return quadEdge;
    }
    quadEdgeOrientFacesRec(quadEdge, i, faceIsLeft, adjacentEdge, outerEdges, visited, facesByEdge) {
        if (i === -1 | visited[i]) {
            return;
        } else {
            visited[i] = true;

            let face = quadEdge.faces[i];

            let startFaceIndex = 0;
            let edgeIndex;
            let nextEdgeIndex;
            if (adjacentEdge == null) {
                startFaceIndex = 0;
                nextEdgeIndex = quadEdge.getEdgeBetweenVertices(face[0], face[1]);
            } else {
                nextEdgeIndex = adjacentEdge;

                let edge = quadEdge.edges[adjacentEdge];
                startFaceIndex = face.indexOf(edge.head);
                let nextFaceIndex = face.indexOf(edge.tail);
                if (startFaceIndex == nextFaceIndex + 1 || (nextFaceIndex == face.length-1 && startFaceIndex == 0)) { // reverse face orientation
                    Utils.reverseArray(quadEdge.faces[i]);
                    face = quadEdge.faces[i];
                    startFaceIndex = face.indexOf(edge.head);
                }
            }

            for (let j = 0; j < face.length; j++) {
                edgeIndex = nextEdgeIndex;

                const edge = quadEdge.edges[edgeIndex];
                const twin = quadEdge.edges[edge.twin];

                let tailFaceIndex = startFaceIndex+j+1;
                let nextFaceIndex = tailFaceIndex+1;
                if (tailFaceIndex >= face.length) tailFaceIndex -= face.length;
                if (nextFaceIndex >= face.length) nextFaceIndex -= face.length;
                
                nextEdgeIndex = quadEdge.getEdgeBetweenVertices(face[tailFaceIndex], face[nextFaceIndex]);
                const nextEdge = quadEdge.edges[nextEdgeIndex];
                const nextTwin = quadEdge.edges[nextEdge.twin];

                if (faceIsLeft) {
                    edge.left = i;
                    edge.leftEdge = nextEdgeIndex;
                    twin.right = i;
                    twin.rightEdge = nextEdge.twin;
                } else {
                    edge.right = i;
                    nextEdge.rightEdge = edgeIndex;
                    twin.left = i;
                    nextTwin.leftEdge = edge.twin;
                }

                const adjFaces = facesByEdge[Math.floor(edgeIndex/2)];
                if (adjFaces.length == 2) {
                    let nextFace = (adjFaces[0] === i) ? adjFaces[1] : adjFaces[0];
                    this.quadEdgeOrientFacesRec(quadEdge, nextFace, !faceIsLeft, edgeIndex, outerEdges, visited, facesByEdge);
                } else {
                    let h = edge.head, t = edge.tail;
                    if (!outerEdges.some(e => { e.includes(h) && e.includes(t); })) { // outerEdges does not already contain this edge
                        outerEdges.push([h,t]);
                    }
                }
            }
        }
    }

}