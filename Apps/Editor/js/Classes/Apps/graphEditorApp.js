class GraphEditorApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-graphEditorApp');
	infoField = document.getElementById('graphEditorApp-points');
    edgeList = document.getElementById('graphEditorApp-edges');

    // gui
	show = {
		box: document.getElementById("showBox-graphEditorApp"),
		origin: document.getElementById("showOrigin-graphEditorApp"),
		axes: document.getElementById("showAxes-graphEditorApp"),
		grid: document.getElementById("showGrid-graphEditorApp"),

		vertices: document.getElementById("showVertices-graphEditorApp"),
		edges: document.getElementById("showEdges-graphEditorApp")
	};
	
	buttons = {
		a: document.getElementById("buttonA-graphEditorApp"),
		b: document.getElementById("buttonB-graphEditorApp"),

		randomVertex: document.getElementById("buttonRandomVertex-graphEditorApp"),
		randomEdge: document.getElementById("buttonRandomEdge-graphEditorApp"),
		generate: document.getElementById("buttonGenerate-graphEditorApp"),

		clear: document.getElementById("buttonClear-graphEditorApp"),
		reset: document.getElementById("buttonReset-graphEditorApp")
	};

    generateParams = {
        vertices: document.getElementById("nVertices-graphEditorApp"),
		edges: document.getElementById("genEdges-graphEditorApp")
    };

	modes = {
		vertex: document.getElementById("modeVertex-graphEditorApp"),
		edge: document.getElementById("modeEdge-graphEditorApp"),
		view: document.getElementById("modeView-graphEditorApp")
	};

	editState = "vertex";
	
	// data
	dataC = null;
	dataW = null;

    // mouse
	locatorId = null;
    creatingEdge = false;
	
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
        let labels = [];
        let edges = [];

        let mouse = new Point(0,0);

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

			vertices: vertC,
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
		
		if (this.show.origin.checked) {
			this.dataC.origin.draw(this.graphics);
		}

        if (this.show.edges.checked) {
            for (let i = 0; i < this.dataC.edges.length; i++) {
                this.dataC.edges[i].draw(this.graphics);
            }

            if (this.creatingEdge) {
                Draw.edge(this.graphics, this.dataC.vertices[this.locatorId], this.dataC.mouse, THEMETEAL);
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

        // edges
        const edges = this.edgeIndices;

        const eList = Utils.edgesOrFacesToListString(edges, labs);

        this.edgeList.innerHTML = eList;
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
	}
    deleteVertex(index) {
        // delete any connected edges
        let v = this.dataC.vertices[index];
        for (let i = 0; i < this.dataC.edges.length; i++) {
            if (this.dataC.edges[i].includes(v)) {
                this.dataC.edges.splice(i,1);
                i--; // don't skip the next edge!
            }
        }

        this.dataC.vertices.splice(index,1); 				// delete the point
        this.dataW.vertices.splice(index,1);
        this.updateVertexLabels();	// relabel all points
    }
	clearVertices() {
		this.dataC.vertices.length = 0;
		this.dataW.vertices.length = 0;
        this.dataC.edges.length = 0;
	}
    updateVertexLabels() {
        this.dataC.labels = Utils.stdRange1(this.dataC.vertices.length);
        this.dataC.labels = this.dataC.labels.map(n => { return 'p' + n; });
    }
    // edges
    createEdge(i, j) {
        if (i === j) {
            return false;
        } else {
            // no duplicate edges
            for (let n = 0; n < this.dataC.edges.length; n++) {
                if (this.dataC.edges[n].isBetween(this.dataC.vertices[i], this.dataC.vertices[j])) return false;
            }

            this.dataC.edges.push(new Segment(this.dataC.vertices[i], this.dataC.vertices[j]));
            return true;
        }
    }
    clearEdges() {
        this.dataC.edges.length = 0;
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

            this.createVertex(300,380);
            this.createVertex(250,275);
            this.createVertex(340,600);
            this.createVertex(90,580);
            this.createVertex(50,225);
            this.createVertex(550,475);
            this.createVertex(340,510);
            this.createEdge(0,3);
            this.createEdge(4,3);
            this.createEdge(4,2);
            this.createEdge(4,6);
            this.createEdge(2,3);
            this.createEdge(2,5);
            this.updateVertexLabels();

			this.computeAndRefresh();
		});
		
		this.buttons.b.addEventListener("click", () => {
            this.clearVertices();

            this.createVertex(80,290);
            this.createVertex(450,340);
            this.createVertex(580,140);
            this.createVertex(210,210);
            this.createEdge(0,1);
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
            let validEdge = false;
            while (!validEdge) {
                let i = Math.floor(Utils.rand(0, allEdges.length));
                if (this.createEdge(allEdges[i][0], allEdges[i][1])) validEdge = true; // successfully created new non-duplicate edge
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
                    // generate nEdges unique edges
                    for (let i = 0; i < nEdges; i++) {
                        let j = Math.floor(Utils.rand(0, allEdges.length));
                        if (!this.createEdge(allEdges[j][0], allEdges[j][1])) i--; // failed to create duplicate edge
                    }
                }
            }

			this.computeAndRefresh();
		});


		this.buttons.clear.addEventListener("click", () => {
			this.clearVertices();
            this.updateVertexLabels();
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
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
			this.dataC.vertices.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) this.locatorId = i; });

            if (this.editState == "vertex") {
                if (e.detail === 1) // it was a single click
                {
                    if (this.locatorId === null) // not near an existing point: insert a new point and label
                    {
                        this.locatorId = this.dataC.vertices.length;
                        this.createVertex(mx, my, this.locatorId);
                        this.updateVertexLabels();
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
                            this.dataC.edges.splice(this.locatorId, 1); // delete the edge
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
                this.dataC.vertices[this.locatorId].set(mx,my);
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
                    this.createEdge(this.locatorId, headId); // attempt to create an edge between the points (does not allow duplicates)
                }
                // else, don't create an edge and cancel edge creation anyway

                this.creatingEdge = false;
                this.locatorId = null;

                // visualize the effect
                this.computeAndRefresh();
            } else {
                this.locatorId = null;
            }
        });
	}
}