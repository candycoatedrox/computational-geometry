class PlanarGraphEditorApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-planarGraphEditorApp');
	infoField = document.getElementById('planarGraphEditorApp-points');
    errorDisplay = document.getElementById('planarGraphEditorApp-errors');
    edgeList = document.getElementById('planarGraphEditorApp-edges');
    faceList = document.getElementById('planarGraphEditorApp-faces');

    // gui
	show = {
		box: document.getElementById("showBox-planarGraphEditorApp"),
		origin: document.getElementById("showOrigin-planarGraphEditorApp"),
		axes: document.getElementById("showAxes-planarGraphEditorApp"),
		grid: document.getElementById("showGrid-planarGraphEditorApp"),

		vertices: document.getElementById("showVertices-planarGraphEditorApp"),
		edges: document.getElementById("showEdges-planarGraphEditorApp"),
		faces: document.getElementById("showFaces-planarGraphEditorApp")
	};
	
	buttons = {
		a: document.getElementById("buttonA-planarGraphEditorApp"),
		b: document.getElementById("buttonB-planarGraphEditorApp"),

		randomVertex: document.getElementById("buttonRandomVertex-planarGraphEditorApp"),
		randomEdge: document.getElementById("buttonRandomEdge-planarGraphEditorApp"),
		generate: document.getElementById("buttonGenerate-planarGraphEditorApp"),

		clearEdges: document.getElementById("buttonClearEdges-treeEditorApp"),
		clear: document.getElementById("buttonClear-planarGraphEditorApp"),
		reset: document.getElementById("buttonReset-planarGraphEditorApp")
	};

    generateParams = {
        vertices: document.getElementById("nVertices-planarGraphEditorApp"),
		edges: document.getElementById("genEdges-planarGraphEditorApp")
    };

	modes = {
		vertex: document.getElementById("modeVertex-planarGraphEditorApp"),
		edge: document.getElementById("modeEdge-planarGraphEditorApp"),
		view: document.getElementById("modeView-planarGraphEditorApp")
	};

	editState = "vertex";
	
	// data
	dataC = null;
	dataW = null;

    // mouse
	locatorId = null;
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

		let graph = new PlanarGraph();

        let mouse = new Point(0,0);

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

			graph: graph,

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

        this.addVertex(225,75);
        this.addVertex(200,350);
        this.addVertex(600,175);
        this.addVertex(425,400);
        this.addVertex(500,300);
        this.dataC.graph.addNonCrossingEdge(0,2);
        this.dataC.graph.addNonCrossingEdge(0,4);
        this.dataC.graph.addNonCrossingEdge(1,3);
        //this.dataC.graph.updateLabels();
		
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

        if (this.show.faces.checked) {
            if (this.colorMode == "multi") {
                this.dataC.graph.drawFaces(this.graphics);
            } else {
                this.dataC.graph.drawFaces(this.graphics, COLORS.setAlpha(THEMEPURPLE));
            }
        }

        if (this.show.edges.checked) {
            let deletedColor = COLORS.setAlpha(NEGATIVECOLOR);
            for (let i = 0; i < this.dataC.graph.nEdges; i++) {
                let color = (this.edgesToDelete[i]) ? deletedColor : EDGECOLOR;
                this.dataC.graph.drawEdge(this.graphics, i, color);
            }

            if (this.creatingEdge) {
                let color = (this.dataC.graph.intersectsAnyEdge(this.dataC.graph.vertices[this.locatorId], this.dataC.mouse)) ? NEGATIVECOLOR : THEMETEAL;
                Draw.edge(this.graphics, this.dataC.graph.vertices[this.locatorId], this.dataC.mouse, color);
            }
        }
		
		if (this.show.vertices.checked) {
            // maybe draw the highlighted point in a diff color while creating edge??
			this.dataC.graph.drawVertices(this.graphics);
		}
	}

	// info
	updateInfo() {
        // coordinates
        const ptsC = this.dataC.graph.vertices;
        const ptsW = this.dataW.vertices;
        const labs = this.dataC.graph.labels;

		const res = Utils.pointsCoordsCWLabsToTableString(ptsC, ptsW, labs);
		
		this.infoField.innerHTML = res;

        // edges & faces
        const eList = this.dataC.graph.edgesToListString;
        const fList = this.dataC.graph.facesToListString;

        this.edgeList.innerHTML = eList;
        this.faceList.innerHTML = fList;
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
		this.dataC.graph.snapToCanvas(this.canvas);
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
        this.dataW.vertices.setAll(ConvertPoints.canvasToWorldCoords(this.dataC.graph.vertices, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis));

		this.scene();
		this.updateInfo();
	}

    // manage vertices and edges
    // vertices
	addVertex(xC, yC, index = this.dataC.graph.nVertices) {
		const ptW = ConvertPoint.canvasToWorldCoords({x:xC, y:yC}, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
        this.dataC.graph.addVertex(xC,yC,index);
        this.dataW.vertices.splice(index, 0, new Point(ptW.x, ptW.y));
	}
    deleteVertex(i) {
        this.dataC.graph.deleteVertex(i);
        this.dataW.vertices.splice(i,1); 				// delete the point
    }
	clearVertices() {
		this.dataC.graph.clearVertices();
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
		this.buttons.a.addEventListener("click", () => {
            this.clearVertices();

            this.addVertex(300,380);
            this.addVertex(250,275);
            this.addVertex(340,600);
            this.addVertex(90,580);
            this.addVertex(50,225);
            this.addVertex(550,475);
            this.addVertex(340,510);
            this.dataC.graph.addNonCrossingEdge(0,3);
            this.dataC.graph.addNonCrossingEdge(4,3);
            this.dataC.graph.addNonCrossingEdge(2,3);
            this.dataC.graph.addNonCrossingEdge(2,5);
            //this.dataC.graph.updateLabels();

			this.computeAndRefresh();
		});
		
		this.buttons.b.addEventListener("click", () => {
            this.clearVertices();

            this.addVertex(80,290);
            this.addVertex(450,340);
            this.addVertex(580,140);
            this.addVertex(210,210);
            this.dataC.graph.addNonCrossingEdge(0,1);
            //this.dataC.graph.updateLabels();

			this.computeAndRefresh();
		});

		
		this.buttons.randomVertex.addEventListener("click", () => {
            let pt = Utils.makeRandomPoint(this.canvas);
			this.addVertex(pt.x, pt.y);
            //this.dataC.graph.updateLabels();
			this.computeAndRefresh();
		});
		
		this.buttons.randomEdge.addEventListener("click", () => {
            if (this.dataC.graph.nEdges === this.dataC.graph.maxEdges) return; // cannot create any more edges

            let allEdges = this.dataC.graph.possibleEdges;
            let i = Math.floor(Utils.rand(0, allEdges.length));
            if (!this.dataC.graph.addNonCrossingEdge(allEdges[i][0], allEdges[i][1])) { // failed to create duplicate or crossing
                Utils.displayErrorMessage("Failed to create edge due to a duplicate or crossing.", this.errorDisplay);
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
            //this.dataC.graph.updateLabels();

            if (this.generateParams.edges.checked && nPts >= 2) {
                let nEdges = Math.floor(Utils.rand(0, this.dataC.graph.maxEdges + 1));
                let allEdges = this.dataC.graph.possibleEdges;
                if (nEdges === this.dataC.graph.maxEdges) {
                    for (let i = 0; i < nEdges; i++) {
                        this.dataC.graph.addNonCrossingEdge(allEdges[i][0], allEdges[i][1]);
                    }
                } else {
                    // attempt to generate nEdges unique edges
                    for (let i = 0; i < nEdges; i++) {
                        let j = Math.floor(Utils.rand(0, allEdges.length));
                        this.dataC.graph.addNonCrossingEdge(allEdges[j][0], allEdges[j][1]);
                    }
                }
            }

			this.computeAndRefresh();
		});


		this.buttons.clearEdges.addEventListener("click", () => {
			this.dataC.graph.clearEdges();
			this.computeAndRefresh();
		});

		this.buttons.clear.addEventListener("click", () => {
			this.clearVertices();
            //this.dataC.graph.updateLabels();
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
            this.clearVertices();

            this.addVertex(225,75);
            this.addVertex(200,350);
            this.addVertex(600,175);
            this.addVertex(425,400);
            this.addVertex(500,300);
            this.dataC.graph.addNonCrossingEdge(0,2);
            this.dataC.graph.addNonCrossingEdge(0,4);
            this.dataC.graph.addNonCrossingEdge(1,2);
            this.dataC.graph.addNonCrossingEdge(1,3);
            //this.dataC.graph.updateLabels();

			this.computeAndRefresh();
		});
	}
    // states
    setupStateEvents() {
		this.modes.vertex.addEventListener("input", () => {
			this.editState = "vertex";
			this.refresh();
		});

		this.modes.edge.addEventListener("input", () => {
			this.editState = "edge";
			this.refresh();
		});

		this.modes.view.addEventListener("input", () => {
			this.editState = "view";
			this.refresh();
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
			this.dataC.graph.vertices.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) this.locatorId = i; });

            if (this.editState == "vertex") {
                if (e.detail === 1) // it was a single click
                {
                    if (this.locatorId === null) // not near an existing point: insert a new point and label
                    {
                        this.locatorId = this.dataC.graph.nVertices;
                        this.addVertex(mx, my, this.locatorId);
                        //this.dataC.graph.updateLabels();
                    } else {
                        this.edgesToDelete = this.dataC.graph.edges.map(() => false); // create array with a value of false for each edge
                    }
                    // else, do nothing now - but check the mouse-move-event on the clicked-on point	
                } 
                else if (e.detail === 2) // it was a double click
                {				
                    // if on an existing point, delete the point, else ignore the double click
                    if (this.dataC.graph.nVertices >= 1) { 
                        this.deleteVertex(this.locatorId);
                        this.locatorId = null;
                    }
                };
            } else { // edge
                if (this.locatorId !== null) { // found a nearby point
                    if (e.detail === 1) { // it was a single click
                        this.creatingEdge = true; // start dragging to create edge
                        this.dataC.mouse.set(mx,my);
                    }
                    // else, do nothing - can't delete vertices in this state
                } else { // no nearby point
                    if (e.detail === 2) { // it was a double click
                        // check if near edge
                        const m = {x:mx, y:my};
                        this.dataC.graph.edges.forEach((e,i) => { if (this.dataC.graph.edgeDistanceToPoint(i,m) < 14) this.locatorId = i; });

                        // if on an existing edge, delete the edge, else ignore the double click
                        if (this.locatorId !== null) {
                            this.dataC.graph.deleteEdge(this.locatorId); // delete the edge
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
			if (this.locatorId === null) return; 			// no specific point to move - ignore the dragging
			// else, update the coordinates of the dragged point; do not change the labels
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
            
            if (this.creatingEdge) {
                this.dataC.mouse.set(mx,my);
            } else {
                this.dataC.graph.setVertex(this.locatorId,mx,my);

                // mark edges for deletion if they cross
                this.edgesToDelete = this.dataC.graph.edges.map(() => false);
                for (let i = 0; i < this.dataC.graph.nEdges; i++) {
                    if (this.dataC.graph.edges[i].includes(this.locatorId)) {
                        let crossingEdges = this.dataC.graph.getEdgesIntersectingEdge(i);
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
                this.dataC.graph.vertices.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) headId = i; });

                if (headId !== null && headId !== this.locatorId) { // user has dragged the edge to a separate point
                    this.dataC.graph.addNonCrossingEdge(this.locatorId, headId); // attempt to create an edge between the points (does not allow duplicates or crossings)
                }
                // else, don't create an edge and cancel edge creation anyway

                this.creatingEdge = false;
                this.locatorId = null;

                // visualize the effect
                this.computeAndRefresh();
            } else {
                if (this.locatorId !== null) {
                    for (let i = this.dataC.graph.nEdges - 1; i >= 0; i--) { // start from end of list
                        if (this.edgesToDelete[i]) { // this edge is marked for deletion due to crossings
                            this.dataC.graph.deleteEdge(i); // delete the edge
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