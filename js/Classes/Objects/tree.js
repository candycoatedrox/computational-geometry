class Tree extends GraphE {

    constructor() {
        super();
    }

    // getters
    get groups() {
        let g = [];
        let visited = this.vertices.map(() => false); // create array with a value of false for each vertex
        for (let i = 0; i < this.nVertices; i++) {
            if (!visited[i]) {
                let group = [];
                this.depthFirstSearchWithStart(i, (i,c, group, visited) => {
                    visited[i] = true;
                    group.push(i);
                }, false, group, visited);
                g.push(group);
            }
        }

        return g;
    }
    groupOfVertex(i) {
        let group = [];
        this.depthFirstSearchWithStart(i, (i,c,g) => {
            g.push(i);
        }, false, group);
        return group;
    }
    get nGroups() {
        return this.groups.length;
    }
    get groupsToListString() {
        return Utils.groupsToListString(this.groups, this.labels);
    }
    
    get maxEdges() {
        return this.nVertices - 1;
    }

    // edges
    addEdge(i,j) {
        if (this.verticesAreInSameGroup(i,j)) {
            return false; // new edge would create a cycle or duplicate
        }

        let tail = this.vertices[i];
        let head = this.vertices[j];
        if (this.intersectsAnyEdge(tail, head)) return false; // new edge would create a crossing

        return super.addEdge(i,j);
    }

    // groups
    getVerticesFromGroupOf(i) {
        let group = this.groupOfVertex(i);
        return group.map(i => { return this.vertices[i]; });
    }
    groupIncludesPoint(i,p) {
        let vertices = this.getVerticesFromGroupOf(i);
        for (let j = 0; j < vertices.length; j++) {
            if (vertices[j].equals(p)) return true;
        }
        return false;
    }

    verticesAreInSameGroup(a,b) {
        return this.depthFirstSearchWithStart(a, (i,c,target) => {
            if (c) { // already found target
                return true;
            } else {
                if (i === target) { // target found!
                    return true;
                } else {
                    return false;
                }
            }
        }, false, b);
    }


}