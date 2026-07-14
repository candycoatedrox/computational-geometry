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

}