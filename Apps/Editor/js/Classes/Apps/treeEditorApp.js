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
		test: document.getElementById("buttonTEST-treeEditorApp"),

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

		let tree = new Tree();

        let mouse = new Point(0,0);

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

			tree: tree,

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

        this.addVertex(300,60);
        this.addVertex(400,355);
        this.addVertex(455,165);
        this.addVertex(535,415);
        this.addVertex(170,100);
        this.addVertex(555,320);
        this.dataC.tree.addEdge(0,2);
        this.dataC.tree.addEdge(0,4);
        this.dataC.tree.addEdge(1,3);
        this.dataC.tree.addEdge(1,5);
        this.dataC.tree.addEdge(1,2);
        //this.dataC.tree.updateLabels();
		
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
            for (let i = 0; i < this.dataC.tree.nEdges; i++) {
                let color = (this.edgesToDelete[i]) ? deletedColor : EDGECOLOR;
                this.dataC.tree.drawEdge(this.graphics, i, color);
            }

            if (this.creatingEdge) {
                let color = (this.dataC.tree.intersectsAnyEdge(this.dataC.tree.vertices[this.locatorId], this.dataC.mouse)) ? NEGATIVECOLOR : THEMETEAL;
                Draw.edge(this.graphics, this.dataC.tree.vertices[this.locatorId], this.dataC.mouse, color);
            }
        }
		
		if (this.show.vertices.checked) {
            // maybe draw the highlighted point in a diff color while creating edge??
			this.dataC.tree.drawVertices(this.graphics);
		}
	}

	// info
	updateInfo() {
        // coordinates
        const ptsC = this.dataC.tree.vertices;
        const ptsW = this.dataW.vertices;
        const labs = this.dataC.tree.labels;

		const res = Utils.pointsCoordsCWLabsToTableString(ptsC, ptsW, labs);
		
		this.infoField.innerHTML = res;

        // edges & groups
        const eList = this.dataC.tree.edgesToListString;
        const gList = this.dataC.tree.groupsToListString;

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
		this.dataC.tree.snapToCanvas(this.canvas);
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
        this.dataW.vertices.setAll(ConvertPoints.canvasToWorldCoords(this.dataC.tree.vertices, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis));

		this.scene();
		this.updateInfo();
	}

    // manage vertices and edges
    // vertices
	addVertex(xC, yC, index = this.dataC.tree.nVertices) {
		const ptW = ConvertPoint.canvasToWorldCoords({x:xC, y:yC}, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
        this.dataC.tree.addVertex(xC,yC,index);
        this.dataW.vertices.splice(index, 0, new Point(ptW.x, ptW.y));
	}
	clearVertices() {
		this.dataC.tree.clearVertices();
		this.dataW.vertices.length = 0;
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
        
		this.buttons.test.addEventListener("click", () => {
            let visitCount = this.dataC.tree.depthFirstSearch(true, (i,vis,n,c) => {
                let v = this.dataC.tree.vertices[i];
                console.log("current vertex " + this.dataC.tree.labels[i] + ": (" + v.x + "," + v.y + ")");
                return c+1;
            }, 0);
            console.log(`visitCount = ${visitCount}`);
		});



		this.buttons.a.addEventListener("click", () => {
            this.clearVertices();

            this.addVertex(225,75);
            this.addVertex(200,350);
            this.addVertex(600,175);
            this.addVertex(425,400);
            this.addVertex(500,300);
            this.dataC.tree.addEdge(0,2);
            this.dataC.tree.addEdge(0,4);
            this.dataC.tree.addEdge(1,2);
            this.dataC.tree.addEdge(1,3);
            //this.dataC.tree.updateLabels();

			this.computeAndRefresh();
		});
		
		this.buttons.b.addEventListener("click", () => {
            this.clearVertices();

            this.addVertex(300,60);
            this.addVertex(400,355);
            this.addVertex(455,165);
            this.addVertex(535,415);
            this.addVertex(170,100);
            this.addVertex(555,320);
            this.addVertex(535,80);
            this.addVertex(620,85);
            this.dataC.tree.addEdge(0,2);
            this.dataC.tree.addEdge(0,4);
            this.dataC.tree.addEdge(1,3);
            this.dataC.tree.addEdge(1,5);
            this.dataC.tree.addEdge(1,2);
            this.dataC.tree.addEdge(6,7);
            this.dataC.tree.addEdge(2,6);
            //this.dataC.tree.updateLabels();

			this.computeAndRefresh();
		});

		
		this.buttons.randomVertex.addEventListener("click", () => {
            let pt = Utils.makeRandomPoint(this.canvas);
			this.addVertex(pt.x, pt.y);
            //this.dataC.tree.updateLabels();
			this.computeAndRefresh();
		});
		
		this.buttons.randomEdge.addEventListener("click", () => {
            if (this.dataC.tree.nEdges === this.dataC.tree.maxEdges) return; // cannot create any more edges

            let allEdges = this.dataC.tree.possibleEdges;
            let i = Math.floor(Utils.rand(0, allEdges.length));
            if (!this.dataC.tree.addEdge(allEdges[i][0], allEdges[i][1])) { // failed to create duplicate, crossing, or cycle
                Utils.displayErrorMessage("Failed to create edge due to a duplicate, crossing, or cycle.", this.errorDisplay);
            }

			this.computeAndRefresh();
		});
		
		this.buttons.generate.addEventListener("click", () => {
            const nPts = this.generateParams.vertices.value;
            const pts = Utils.makeRandomPoints(this.canvas, nPts);

            this.clearVertices();
            for (let i = 0; i < nPts; i++) {
				this.addVertex(pts[i].x, pts[i].y);
            }
            //this.dataC.tree.updateLabels();

            if (this.generateParams.edges.checked) {
                let nEdges = 0;
                if (nPts >= 2) {
                    nEdges = Math.floor(Utils.rand(0, this.dataC.tree.maxEdges + 1));
                }

                let allEdges = this.dataC.tree.possibleEdges;
                if (nEdges === this.dataC.tree.maxEdges) {
                    for (let i = 0; i < nEdges; i++) {
                        this.dataC.tree.addEdge(allEdges[i][0], allEdges[i][1]);
                    }
                } else {
                    // attempt to generate nEdges unique edges
                    for (let i = 0; i < nEdges; i++) {
                        let j = Math.floor(Utils.rand(0, allEdges.length));
                        this.dataC.tree.addEdge(allEdges[j][0], allEdges[j][1]);
                    }
                }
            }

			this.computeAndRefresh();
		});


		this.buttons.clearEdges.addEventListener("click", () => {
			this.dataC.tree.clearEdges();
			this.computeAndRefresh();
		});

		this.buttons.clear.addEventListener("click", () => {
			this.clearVertices();
            //this.dataC.tree.updateLabels();
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
            this.clearVertices();

            this.addVertex(300,60);
            this.addVertex(400,355);
            this.addVertex(455,165);
            this.addVertex(535,415);
            this.addVertex(170,100);
            this.addVertex(555,320);
            this.dataC.tree.addEdge(0,2);
            this.dataC.tree.addEdge(0,4);
            this.dataC.tree.addEdge(1,3);
            this.dataC.tree.addEdge(1,5);
            this.dataC.tree.addEdge(1,2);
            //this.dataC.tree.updateLabels();

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
			this.dataC.tree.vertices.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) this.locatorId = i; });

            if (this.editState == "vertex") {
                if (e.detail === 1) // it was a single click
                {
                    if (this.locatorId === null) // not near an existing point: insert a new point and label
                    {
                        this.locatorId = this.dataC.tree.nVertices;
                        this.addVertex(mx, my, this.locatorId);
                        //this.dataC.tree.updateLabels();
                    } else {
                        this.edgesToDelete = this.dataC.tree.edges.map(() => false); // create array with a value of false for each edge
                    }
                    // else, do nothing now - but check the mouse-move-event on the clicked-on point	
                } 
                else if (e.detail === 2) // it was a double click
                {
                    // if on an existing point, delete the point, else ignore the double click
                    if (this.dataC.tree.nVertices >= 1) { 
                        this.dataC.tree.deleteVertex(this.locatorId);
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
                        this.dataC.tree.edges.forEach((e,i) => { if (this.dataC.tree.edgeDistanceToPoint(i,m) < 14) this.locatorId = i; });

                        // if on an existing edge, delete the edge, else ignore the double click
                        if (this.locatorId !== null) {
                            this.dataC.tree.deleteEdge(this.locatorId);
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
                    this.dataC.tree.edges.forEach((e,i) => { if (this.dataC.tree.edgeDistanceToPoint(i,m) < 14) this.nearEdge = i; });
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
                this.dataC.tree.vertices[this.locatorId].set(mx,my);

                // mark edges for deletion if they cross
                this.edgesToDelete = this.dataC.tree.edges.map(() => false);
                for (let i = 0; i < this.dataC.tree.nEdges; i++) {
                    if (this.dataC.tree.edges[i].includes(this.locatorId)) {
                        let crossingEdges = this.dataC.tree.getEdgesIntersectingEdge(i);
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
                this.dataC.tree.vertices.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) headId = i; });

                if (headId !== null && headId !== this.locatorId) { // user has dragged the edge to a separate point
                    this.dataC.tree.addEdge(this.locatorId, headId); // attempt to create an edge between the points (does not allow duplicates or crossings)
                }
                // else, don't create an edge and cancel edge creation anyway

                this.creatingEdge = false;
                this.locatorId = null;

                // visualize the effect
                this.computeAndRefresh();
            } else {
                if (this.locatorId !== null) {
                    for (let i = this.dataC.tree.nEdges - 1; i >= 0; i--) { // start from end of list
                        if (this.edgesToDelete[i]) { // this edge is marked for deletion due to crossings
                            this.dataC.tree.deleteEdge(i);
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