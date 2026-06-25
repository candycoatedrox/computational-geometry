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
        let cyclesLength = cycles.length;
        //console.log(cycles);

        cycles = Utils.withoutDuplicateGroupsOrRepeatElements(cycles);
        let cyclesTrimTime = Date.now();
        // now polygon subdivision is hitting lag spikes HERE (and less so in the adding faces stage) sometimes at around n = 10 (total ~25 pts), when cycles hits 40k-50k
        // lowest # of cycles I've seen call stack size exceeded at is 184k
        // 96k cycles didn't exceed call stack but did take 4 full seconds!

        // clear and add faces
        this.clearFaces();
        for (let i = 0; i < cycles.length; i++) {
            this.addFace(...cycles[i]);
        }
        let addFacesTime = Date.now();
        //console.log(this.faces);

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
Trim duplicate cycles: ${cyclesTrimTime - cyclesTime} (for ${cyclesLength} cycles)
Add faces: ${addFacesTime - cyclesTrimTime} (for ${cycles.length} faces)
Trim faces: ${trimTime - addFacesTime}
Sort faces: ${sortTime - trimTime}
Total: ${sortTime - startTime}`);
    }

}