class TreeEditorApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-treeEditorApp');
	infoField = document.getElementById('treeEditorApp-points');
    errorDisplay = document.getElementById('treeEditorApp-errors');
    edgeList = document.getElementById('treeEditorApp-edges');
    groupList = document.getElementById('treeEditorApp-groups');

    // gui
	show = {
		box: document.getElementById("showBox-treeEditorApp"),
		origin: document.getElementById("showOrigin-treeEditorApp"),
		axes: document.getElementById("showAxes-treeEditorApp"),
		grid: document.getElementById("showGrid-treeEditorApp"),

		vertices: document.getElementById("showVertices-treeEditorApp"),
		edges: document.getElementById("showEdges-treeEditorApp")
	};
	
	buttons = {
		a: document.getElementById("buttonA-treeEditorApp"),
		b: document.getElementById("buttonB-treeEditorApp"),

		randomVertex: document.getElementById("buttonRandomVertex-treeEditorApp"),
		randomEdge: document.getElementById("buttonRandomEdge-treeEditorApp"),
		generate: document.getElementById("buttonGenerate-treeEditorApp"),

		clearEdges: document.getElementById("buttonClearEdges-treeEditorApp"),
		clear: document.getElementById("buttonClear-treeEditorApp"),
		reset: document.getElementById("buttonReset-treeEditorApp")
	};

    generateParams = {
        vertices: document.getElementById("nVertices-treeEditorApp"),
		edges: document.getElementById("genEdges-treeEditorApp")
    };

	modes = {
		vertex: document.getElementById("modeVertex-treeEditorApp"),
		edge: document.getElementById("modeEdge-treeEditorApp"),
		view: document.getElementById("modeView-treeEditorApp")
	};

	editState = "vertex";
	
	// data
	dataC = null;
	dataW = null;

    // mouse
	locatorId = null;
    nearEdge = null;
    creatingEdge = false;
    edgesToDelete = [];
	
	// view
	graphics = null;

    constructor() {
        // init data
		let boxC = new Box(500,500);
		boxC.fromCanvas(this.canvas);
		let rangeC = new Range(new MinMaxRange(0,500),new MinMaxRange(0,500));
		rangeC.fromCanvas(this.canvas);
		let originC = new Origin(0,0);
		originC.fromCanvas(this.canvas);
		let axesC = new Axes(100,-100);

		let vertC = new Points();
        let vertGroups = [];
        let labels = [];
        let edges = [];

        let mouse = new Point(0,0);

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

			vertices: vertC,
            groups: vertGroups,
            labels: labels,
            edges: edges,

            mouse: mouse
		};

		let boxPtsC = boxC.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
        
		let boxW = new Box(500,500);
		boxW.setPoints(boxPtsW);
		let rangeW = new Range(new MinMaxRange(0,1),new MinMaxRange(0,1)); 
		rangeW.set(boxPtsW[0].x,boxPtsW[1].x,boxPtsW[3].y,boxPtsW[0].y);		
		
		let originW = new Origin(0,0);
		let axesW = new Axes(1,1);

        let vertW = new Points();
		
		this.dataW = {
			box: boxW,
			origin: originW,
			axes: axesW,
			range: rangeW,

            vertices: vertW
		};

        this.createVertex(300,60);
        this.createVertex(400,355);
        this.createVertex(455,165);
        this.createVertex(535,415);
        this.createVertex(170,100);
        this.createVertex(555,320);
        this.createEdge(0,2);
        this.createEdge(0,4);
        this.createEdge(1,3);
        this.createEdge(1,5);
        this.createEdge(1,2);
        this.updateVertexLabels();
		
		// gui: set up actions
		this.setupShowEvents();
		this.setupButtonEvents();
        this.setupStateEvents();
		this.setupMouseEvents();

		// Init canvas / graphics
		this.graphics = initCanvasGraphics(this.canvas);
		//this.scene();

		// Init/Update info field
		this.updateInfo();
    }
	
	// computations
    // edges
    get edgeIndices() {
        let indices = [];
        for (let i = 0; i < this.dataC.edges.length; i++) {
            let e = [];
            e.push(this.dataC.vertices.indexOf(this.dataC.edges[i].tail));
            e.push(this.dataC.vertices.indexOf(this.dataC.edges[i].head));
            indices.push(e);
        }
        return indices;
    }
    get maxEdges() {
        return Combinations.nChoose2(this.dataC.vertices.length);
    }
    get possibleEdges() {
        return Combinations.allIndexPairs(this.dataC.vertices.length);
    }

	// view
	// graphics
	scene() {
        if (this.show.grid.checked) {
			this.dataC.range.drawGrid(this.graphics, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		}
		
		if (this.show.box.checked) {
			this.dataC.box.draw(this.graphics);
		}
		
		if (this.show.axes.checked) {
			this.dataC.axes.draw(this.graphics,this.dataC.origin);
		}

		if (this.show.origin.checked) {
			this.dataC.origin.draw(this.graphics);
		}

        if (this.show.edges.checked) {
            let deletedColor = COLORS.setAlpha(NEGATIVECOLOR);
            for (let i = 0; i < this.dataC.edges.length; i++) {
                let color = EDGECOLOR;
                if (this.nearEdge === i) {
                    if (this.edgeCanBeDeleted(i)) color = deletedColor;
                } else if (this.edgesToDelete[i]) {
                    color = deletedColor;
                }

                this.dataC.edges[i].draw(this.graphics, color);
            }

            if (this.creatingEdge) {
                let color = (this.intersectsAnyEdge(this.dataC.vertices[this.locatorId], this.dataC.mouse)) ? NEGATIVECOLOR : THEMETEAL;
                Draw.edge(this.graphics, this.dataC.vertices[this.locatorId], this.dataC.mouse, color);
            }
        }
		
		if (this.show.vertices.checked) {
            // maybe draw the highlighted point in a diff color while creating edge??
			this.dataC.vertices.draw(this.graphics, this.dataC.labels);
		}
	}

	// info
	updateInfo() {
        // coordinates
        const ptsC = this.dataC.vertices;
        const ptsW = this.dataW.vertices;
        const labs = this.dataC.labels;

		const res = Utils.pointsCoordsCWLabsToTableString(ptsC, ptsW, labs);
		
		this.infoField.innerHTML = res;

        // edges & groups
        const edges = this.edgeIndices;
        const groups = this.dataC.groups;

        const eList = Utils.groupsToListString(edges, labs);
        console.log(`groups = ${Utils.nestedArrayToString(groups)}
labs = ${labs}`);
        const gList = Utils.nestedGroupsToListString(groups, labs);

        this.edgeList.innerHTML = eList;
        this.groupList.innerHTML = gList;
	}
	
	// actions for gui, affecting the view
	// without dataC/W recalculation
	refresh() {
		this.graphics = initCanvasGraphics(this.canvas);
		this.scene();
		this.updateInfo();
	}
	// with dataC/W recalculations
	computeAndRefresh() {
		this.graphics = initCanvasGraphics(this.canvas);
		this.dataC.box.fromCanvas(this.canvas);
		this.dataC.origin.fromCanvas(this.canvas);
		this.dataC.range.fromCanvas(this.canvas);
		this.dataC.vertices.snapToCanvas(this.canvas);
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
        this.dataW.vertices.setAll(ConvertPoints.canvasToWorldCoords(this.dataC.vertices, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis));

		this.scene();
		this.updateInfo();
	}

    // manage vertices and edges
    // vertices
	createVertex(xC, yC, index = this.dataC.vertices.length) {
		const ptW = ConvertPoint.canvasToWorldCoords({x:xC, y:yC}, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
        this.dataC.vertices.splice(index, 0, new Point(xC,yC));
        this.dataW.vertices.splice(index, 0, new Point(ptW.x, ptW.y));
        this.dataC.groups.push(index);
	}
    deleteVertex(index) {
        // delete any connected edges
        let v = this.dataC.vertices[index];
        let clearedEdges = false;
        for (let i = 0; i < this.dataC.edges.length; i++) {
            if (this.dataC.edges[i].includes(v)) {
                if (this.edgeCanBeDeleted(i)) {
                    this.deleteEdge(i);
                    i--; // don't skip the next edge!
                } else {
                    // unfortunately we just have to delete all edges at this point or we can't delete the vertex
                    clearedEdges = true;
                    this.clearEdges();
                    Utils.displayErrorMessage("Deleted all edges in order to delete the vertex.", this.errorDisplay);
                }
            }
        }

        this.dataC.vertices.splice(index,1); 				// delete the point
        this.dataW.vertices.splice(index,1);
        this.updateVertexLabels();	// relabel all points

        // update groups
        if (clearedEdges) {
            this.dataC.groups = Utils.stdRange(this.dataC.vertices.length);
        } else {
            let gIndex = this.dataC.groups.indexOf(index);
            if (gIndex !== -1) this.dataC.groups.splice(gIndex, 1); // delete the point from groups

            // update group indices accordingly if the vertex was not last in the list
            if (index < this.dataC.vertices.length) {
                this.updateGroupIndicesForDeletion(index, this.dataC.groups);
            }
        }
    }
    updateGroupIndicesForDeletion(deletedIndex, group) {
        for (let i = 0; i < group.length; i++) {
            if (typeof group[i] === "number") { // base case
                if (group[i] > deletedIndex) group[i]--;
            } else { // subgroup
                this.updateGroupIndicesForDeletion(deletedIndex, group[i]);
            }
        }
    }
	clearVertices() {
		this.dataC.vertices.length = 0;
		this.dataW.vertices.length = 0;
        this.dataC.edges.length = 0;
        this.dataC.groups.length = 0;
	}
    updateVertexLabels() {
        this.dataC.labels = Utils.stdRange1(this.dataC.vertices.length);
        this.dataC.labels = this.dataC.labels.map(n => { return 'p' + n; });
    }
    getIndexOfVertex(v) {
        return this.dataC.vertices.indexOf(v);
    }
    getVertexByPath(...indices) {
        let parent = this.dataC.groups;
        for (let i = 0; i < indices.length; i++) {
            parent = parent[indices[i]];
        }
        return parent;
    }
    setGroupByPath(newValue, ...indices) {
        let parent = this.dataC.groups;
        for (let i = 0; i < indices.length - 1; i++) {
            parent = parent[indices[i]];
        }

        let finalIndex = indices[indices.length - 1];
        parent[finalIndex] = newValue;
    }
    groupIndexOfVertex(i) {
        return this.groupIndexOfVertexRec(i, this.dataC.groups);
    }
    groupIndexOfVertexRec(i, parentGroup) {
        if (!Array.isArray(parentGroup)) {
            return [-1]; // vertex is not here
        } else if (parentGroup.includes(i)) {
            let j = parentGroup.indexOf(i);
            return [j];
        } else {
            for (let j = 0; j < parentGroup.length; j++) {
                let path = this.groupIndexOfVertexRec(i, parentGroup[j]);
                if (!path.includes(-1)) {
                    path.splice(0, 0, j);
                    return path;
                }
            }
            
            return [-1]; // vertex is not in this group
        }
    }
    highestGroupIndexOfVertex(i) {
        return this.groupIndexOfVertex(i)[0];
    }
    verticesPartOfSameGroup(i, j) {
        return this.highestGroupIndexOfVertex(i) === this.highestGroupIndexOfVertex(j);
    }
    deepestSharedGroupIndex(i, j) {
        let iGroup = this.groupIndexOfVertex(i);
        let jGroup = this.groupIndexOfVertex(j);
        if (iGroup[0] !== jGroup[0]) { // vertices do not share a group
            return [-1];
        } else {
            let g = [];
            for (let n = 0; n < iGroup.length; n++) {
                if (iGroup[n] === jGroup[n]) {
                    g.push(iGroup[n]);
                } else {
                    return g;
                }
            }
        }
    }
    // edges
    createEdge(i, j) {
        if (i === j) {
            return false;
        } else {
            let tail = this.dataC.vertices[i];
            let head = this.dataC.vertices[j];
            if (this.intersectsAnyEdge(tail, head)) return false; // new edge would create a crossing
            
            let tailGroup = this.highestGroupIndexOfVertex(i);
            let headGroup = this.highestGroupIndexOfVertex(j);
            if (tailGroup === headGroup) return false; // new edge would create a cycle or duplicate

            this.dataC.edges.push(new Segment(tail, head));
            // combine groups
            if (tailGroup < headGroup) {
                let newGroup = [this.dataC.groups[tailGroup], this.dataC.groups[headGroup]];
                console.log(`newGroup = ${Utils.nestedArrayToString(newGroup)}`);
                this.dataC.groups.splice(tailGroup, 1, newGroup);
                this.dataC.groups.splice(headGroup, 1);
            } else {
                let newGroup = [this.dataC.groups[headGroup], this.dataC.groups[tailGroup]];
                console.log(`newGroup = ${Utils.nestedArrayToString(newGroup)}`);
                this.dataC.groups.splice(headGroup, 1, newGroup);
                this.dataC.groups.splice(tailGroup, 1);
            }
            return true;
        }
    }
    deleteEdge(i) {
        const eIndices = this.getIndicesOfEdge(i);
        const v1 = eIndices[0];
        const v2 = eIndices[1];
        
        const v1Path = this.groupIndexOfVertex(v1);
        const v2Path = this.groupIndexOfVertex(v2);
        const sharedPath = this.deepestSharedGroupIndex(v1, v2);
        const sharedGroup = this.getVertexByPath(...sharedPath);
        const highestSharedIndex = sharedPath[0];

        if (sharedPath.length === 1) {
            console.log("shared index is only highest");
            // just disconnect the halves of the group
            let subA = this.dataC.groups[highestSharedIndex][0];
            let subB = this.dataC.groups[highestSharedIndex][1];
            this.dataC.groups.splice(highestSharedIndex, 1, subA, subB);
            this.dataC.edges.splice(i,1); // delete the edge
        } else {
            console.log("shared index is more than highest");
            const v1Connections = this.getVerticesConnectedTo(v1);
            const v2Connections = this.getVerticesConnectedTo(v2);
            
            // whether either vertex will be "orphaned" once the edge is deleted
            let v1Orphaned = v1Connections.length === 1;
            let v2Orphaned = v2Connections.length === 1;
            if (v1Orphaned || v2Orphaned) {
                // replace shared group with non-orphaned component, removing orphaned vertex entirely
                let orphanedFinalIndex = (v1Orphaned) ? v1Path[v1Path.length - 1] : v2Path[v2Path.length - 1];
                let nonOrphanedGroup = (orphanedFinalIndex === 0) ? sharedGroup[1] : sharedGroup[0];
                this.setGroupByPath(nonOrphanedGroup, ...sharedPath);

                // insert orphaned vertex into dataC.groups, after highest shared group
                if (v1Orphaned) {
                    console.log("v1 is orphaned");
                    this.dataC.groups.splice(highestSharedIndex + 1, 0, v1);
                } else {
                    console.log("v2 is orphaned");
                    this.dataC.groups.splice(highestSharedIndex + 1, 0, v2);
                }

                this.dataC.edges.splice(i,1); // delete the edge
            } else {
                console.log("no orphan");
                Utils.displayErrorMessage("Only the most recently added edge and edges connected to leaves can be deleted.", this.errorDisplay);
            }
        }
    }
    clearEdges() {
        this.dataC.edges.length = 0;
        this.dataC.groups = Utils.stdRange(this.dataC.vertices.length);
    }
    getIndicesOfEdge(i) {
        let e = this.dataC.edges[i];
        return [this.getIndexOfVertex(e.tail), this.getIndexOfVertex(e.head)];
    }
    getEdgesFromVertex(i) {
        let v = this.dataC.vertices[i];
        let e = [];
        for (let j = 0; j < this.dataC.edges.length; j++) {
            if (this.dataC.edges[j].includes(v)) {
                e.push(this.dataC.edges[j]);
            }
        }
        return e;
    }
    getVerticesConnectedTo(i) {
        let v = this.dataC.vertices[i];
        let connected = [];
        for (let j = 0; j < this.dataC.edges.length; j++) {
            let e = this.dataC.edges[j];
            if (e.tail === v) {
                connected.push(this.getIndexOfVertex(e.head));
            } else if (e.head === v) {
                connected.push(this.getIndexOfVertex(e.tail));
            }
        }
        return connected;
    }
    verticesAreConnected(i, j) {
        let v1 = this.dataC.vertices[i];
        let v2 = this.dataC.vertices[j];
        for (let n = 0; n < this.dataC.edges.length; n++) {
            if (this.dataC.edges[n].isBetween(v1, v2)) return true;
        }
        return false;
    }
    edgeCanBeDeleted(i) {
        const eIndices = this.getIndicesOfEdge(i);
        const v1 = eIndices[0];
        const v2 = eIndices[1];

        const sharedPath = this.deepestSharedGroupIndex(v1, v2);
        if (sharedPath.length === 1) return true; // most recently added edge
        
        const v1Connections = this.getVerticesConnectedTo(v1);
        const v2Connections = this.getVerticesConnectedTo(v2);
        if (v1Connections.length === 1 || v2Connections.length === 1) return true; // edge is connected to a leaf

        return false;
    }
    intersectsAnyEdge(p, q) {
        for (let i = 0; i < this.dataC.edges.length; i++) {
            let e = this.dataC.edges[i];
            if (!e.includes(p) && !e.includes(q) && Geometry1.lineSegIntersection(e.tail, e.head, p, q) !== null) {
                return true;
            }
        }
        return false;
    }
    getEdgesIntersectingEdge(i) {
        let indices = [];
        let thisEdge = this.dataC.edges[i];
        for (let j = 0; j < this.dataC.edges.length; j++) {
            if (j === i) continue;
            let e = this.dataC.edges[j];
            if (!e.includes(thisEdge.tail) && !e.includes(thisEdge.head) && Geometry1.lineSegIntersection(e.tail, e.head, thisEdge.tail, thisEdge.head) !== null) {
                indices.push(j);
            }
        }
        return indices;
    }
    resetGroups() {
        this.dataC.groups = Utils.stdRange1(this.dataC.vertices.length);
    }
	
	// set up gui
	// checkboxes
	setupShowEvents() {
		this.show.box.addEventListener("change", () => this.refresh());
		this.show.origin.addEventListener("change", () => this.refresh());
		this.show.axes.addEventListener("change", () => this.refresh());
		this.show.grid.addEventListener("change", () => this.refresh());
		this.show.vertices.addEventListener("change", () => this.refresh());
		this.show.edges.addEventListener("change", () => this.refresh());
	}
	// buttons
	setupButtonEvents() {
		this.buttons.a.addEventListener("click", () => {
            this.clearVertices();

            this.createVertex(225,75);
            this.createVertex(200,350);
            this.createVertex(600,175);
            this.createVertex(425,400);
            this.createVertex(500,300);
            this.createEdge(0,2);
            this.createEdge(0,4);
            this.createEdge(1,2);
            this.createEdge(1,3);
            this.updateVertexLabels();

			this.computeAndRefresh();
		});
		
		this.buttons.b.addEventListener("click", () => {
            this.clearVertices();

            this.createVertex(300,60);
            this.createVertex(400,355);
            this.createVertex(455,165);
            this.createVertex(535,415);
            this.createVertex(170,100);
            this.createVertex(555,320);
            this.createVertex(535,80);
            this.createVertex(620,85);
            this.createEdge(0,2);
            this.createEdge(0,4);
            this.createEdge(1,3);
            this.createEdge(1,5);
            this.createEdge(1,2);
            this.createEdge(6,7);
            this.createEdge(2,6);
            this.updateVertexLabels();

			this.computeAndRefresh();
		});

		
		this.buttons.randomVertex.addEventListener("click", () => {
            let pt = Utils.makeRandomPoint(this.canvas);
			this.createVertex(pt.x, pt.y);
            this.updateVertexLabels();
			this.computeAndRefresh();
		});
		
		this.buttons.randomEdge.addEventListener("click", () => {
            if (this.dataC.edges.length === this.maxEdges) return; // cannot create any more edges

            let allEdges = this.possibleEdges;
            let i = Math.floor(Utils.rand(0, allEdges.length));
            if (!this.createEdge(allEdges[i][0], allEdges[i][1])) { // failed to create duplicate, crossing, or cycle
                Utils.displayErrorMessage("Failed to create edge due to a duplicate, crossing, or cycle.", this.errorDisplay);
            }

			this.computeAndRefresh();
		});
		
		this.buttons.generate.addEventListener("click", () => {
            const nPts = this.generateParams.vertices.value;
            const pts = Utils.makeRandomPoints(this.canvas, nPts);

            this.clearVertices();
            for (let i = 0; i < nPts; i++) {
				this.createVertex(pts[i].x, pts[i].y);
            }
            this.updateVertexLabels();

            if (this.generateParams.edges.checked) {
                let nEdges = 0;
                if (nPts >= 2) {
                    nEdges = Math.floor(Utils.rand(0, this.maxEdges + 1));
                }

                let allEdges = this.possibleEdges;
                if (nEdges === this.maxEdges) {
                    for (let i = 0; i < nEdges; i++) {
                        this.createEdge(allEdges[i][0], allEdges[i][1]);
                    }
                } else {
                    // attempt to generate nEdges unique edges
                    for (let i = 0; i < nEdges; i++) {
                        let j = Math.floor(Utils.rand(0, allEdges.length));
                        this.createEdge(allEdges[j][0], allEdges[j][1]);
                    }
                }
            }

			this.computeAndRefresh();
		});


		this.buttons.clearEdges.addEventListener("click", () => {
			this.clearEdges();
			this.computeAndRefresh();
		});

		this.buttons.clear.addEventListener("click", () => {
			this.clearVertices();
            this.updateVertexLabels();
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
            this.clearVertices();

            this.createVertex(300,60);
            this.createVertex(400,355);
            this.createVertex(455,165);
            this.createVertex(535,415);
            this.createVertex(170,100);
            this.createVertex(555,320);
            this.createEdge(0,2);
            this.createEdge(0,4);
            this.createEdge(1,3);
            this.createEdge(1,5);
            this.createEdge(1,2);
            this.updateVertexLabels();

			this.computeAndRefresh();
		});
	}
    // states
    setupStateEvents() {
		this.modes.vertex.addEventListener("input", () => {
            this.nearEdge = null;
			this.editState = "vertex";
		});

		this.modes.edge.addEventListener("input", () => {
            this.nearEdge = null;
			this.editState = "edge";
		});

		this.modes.view.addEventListener("input", () => {
            this.nearEdge = null;
			this.editState = "view";
		});
    }
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.addEventListener('mousedown', e => {
            if (this.editState == "view") return;

			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
			
			// find id of existing nearby point
			this.locatorId = null;
			this.dataC.vertices.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) this.locatorId = i; });

            if (this.editState == "vertex") {
                if (e.detail === 1) // it was a single click
                {
                    if (this.locatorId === null) // not near an existing point: insert a new point and label
                    {
                        this.locatorId = this.dataC.vertices.length;
                        this.createVertex(mx, my, this.locatorId);
                        this.updateVertexLabels();
                    } else {
                        this.edgesToDelete = this.dataC.edges.map(() => false); // create array with false value for each edge
                    }
                    // else, do nothing now - but check the mouse-move-event on the clicked-on point	
                } 
                else if (e.detail === 2) // it was a double click
                {				
                    // if on an existing point, delete the point, else ignore the double click
                    if (this.dataC.vertices.length >= 1) { 
                        this.deleteVertex(this.locatorId);
                        this.locatorId = null;
                    }
                };
            } else { // edge
                if (this.locatorId !== null) { // found a nearby point
                    if (e.detail === 1) { // it was a single click
                        this.creatingEdge = true; // start dragging to create edge
                        this.nearEdge = null;
                        this.dataC.mouse.set(mx,my);
                    }
                    // else, do nothing - can't delete vertices in this state
                } else { // no nearby point
                    if (e.detail === 2) { // it was a double click
                        // check if near edge
                        const m = {x:mx, y:my};
                        this.dataC.edges.forEach((s,i) => { if (s.distanceToPoint(m) < 14) this.locatorId = i; });

                        // if on an existing edge, delete the edge, else ignore the double click
                        if (this.locatorId !== null) {
                            this.deleteEdge(this.locatorId);
                            this.locatorId = null;
                        }
                    }
                }
            }
				
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE MOVE
		this.canvas.addEventListener('mousemove', e => {
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;

			if (this.locatorId === null) {
                if (this.editState == "edge") {
                    // check if near edge
                    this.nearEdge = null;
                    const m = {x:mx, y:my};
                    this.dataC.edges.forEach((s,i) => { if (s.distanceToPoint(m) < 14) this.nearEdge = i; });
                    this.refresh();
                }
                return; 			// no specific point to move - ignore the dragging
            }

			// else, update the coordinates of the dragged point; do not change the labels
            
            if (this.creatingEdge) {
                this.dataC.mouse.set(mx,my);

                // NOT UPDATED!!!
                // if near point that would create a cycle set a variable to draw red

            } else {
                this.dataC.vertices[this.locatorId].set(mx,my);

                // mark edges for deletion if they cross
                this.edgesToDelete = this.dataC.edges.map(() => false);
                for (let i = 0; i < this.dataC.edges.length; i++) {
                    if (this.dataC.edges[i].includes(this.dataC.vertices[this.locatorId])) {
                        let crossingEdges = this.getEdgesIntersectingEdge(i);
                        if (crossingEdges.length !== 0) {
                            this.edgesToDelete[i] = true;
                            for (let j = 0; j < crossingEdges.length; j++) {
                                this.edgesToDelete[crossingEdges[j]] = true;
                            }
                        }
                    }
                }
            }
			
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', e => {
            if (this.creatingEdge) {
                // check if near point, finish edge
                const canvasBounds = this.canvas.getBoundingClientRect();
                const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;

                let headId = null;
                this.dataC.vertices.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) headId = i; });

                if (headId !== null && headId !== this.locatorId) { // user has dragged the edge to a separate point
                    this.createEdge(this.locatorId, headId); // attempt to create an edge between the points (does not allow duplicates or crossings)
                }
                // else, don't create an edge and cancel edge creation anyway

                this.creatingEdge = false;
                this.locatorId = null;

                // visualize the effect
                this.computeAndRefresh();
            } else {
                if (this.locatorId !== null) {
                    for (let i = this.dataC.edges.length - 1; i >= 0; i--) { // start from end of list
                        if (this.edgesToDelete[i]) { // this edge is marked for deletion due to crossings
                            this.deleteEdge(i);
                        }
                    }
                    this.edgesToDelete = [];
                    this.locatorId = null;

                    // visualize the effect
                    this.computeAndRefresh();
                }                
            }
        });
	}
}