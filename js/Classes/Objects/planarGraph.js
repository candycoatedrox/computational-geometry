class PlanarGraph extends FaceGraph {

    constructor() {
        super();
    }

    // edges
    addEdge(i,j) {
        let tail = this.vertices[i];
        let head = this.vertices[j];
        if (this.intersectsAnyEdge(tail, head)) return false; // new edge would create a crossing

        if (!super.addEdge(i,j)) return false; // new edge would create a duplicate

        this.updateFaces();

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
        // find all cycles using path search
        let cycles = this.getAllCycles();
        console.log(cycles);

        // clear and add faces
        this.clearFaces();
        for (let i = 0; i < cycles.length; i++) { // TEMP!! testing cycle detection
            this.addFace(...cycles[i]);
        }
        console.log(this.faces);

        // cut out duplicates and superfaces
        for (let i = 0; i < this.nFaces; i++) {
            if (this.faceHasAnySubface(i)) {
                console.log(`deleting face ${i} (${this.faces[i]})`);
                this.deleteFace(i);
                i--; // don't skip the next face!
            }
        }
    }

    // cycles
    getAllCycles() {
        // find all cycles using path search
        let cycles = [];
        let visited = this.vertices.map(() => false); // create array with a value of false for each vertex
        for (let i = 0; i < this.nVertices; i++) {
            if (!visited[i]) {
                let cyclesInGroup = [];
                this.pathSearchWithStart(i, false, (i, path, neighbors, c, cyclesInGroup, visited) => {
                    visited[i] = true;

                    for (let j = 0; j < neighbors.length; j++) {
                        let n = neighbors[j];
                        if (path.includes(n)) {
                            let c = path.slice(path.indexOf(n));
                            if (c.length >= 3) {
                                console.log(`face found from indices ${i} to ${n}!
path = ${path}
cycle = ${c}`);
                                cyclesInGroup.push(c);
                            }
                        }
                    }
                }, null, cyclesInGroup, visited);
                cycles.push(...cyclesInGroup);
            }
        }
        
        return cycles;
    }

}