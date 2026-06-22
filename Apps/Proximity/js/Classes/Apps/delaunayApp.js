class DelaunayApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-delaunayApp');
	infoField = document.getElementById('delaunayApp-points');
    errorDisplay = document.getElementById('delaunayApp-errors');
    edgeList = document.getElementById('delaunayApp-edges');

    // gui
	show = {
		box: document.getElementById("showBox-delaunayApp"),
		origin: document.getElementById("showOrigin-delaunayApp"),
		axes: document.getElementById("showAxes-delaunayApp"),
		grid: document.getElementById("showGrid-delaunayApp"),

		vertices: document.getElementById("showVertices-delaunayApp"),
		edges: document.getElementById("showEdges-delaunayApp")
	};
	
	buttons = {
		a: document.getElementById("buttonA-delaunayApp"),
		b: document.getElementById("buttonB-delaunayApp"),

		randomVertex: document.getElementById("buttonRandomVertex-delaunayApp"),
		generate: document.getElementById("buttonGenerate-delaunayApp"),

		clear: document.getElementById("buttonClear-delaunayApp"),
		reset: document.getElementById("buttonReset-delaunayApp")
	};

    generateParams = {
        vertices: document.getElementById("nVertices-delaunayApp")
    };
	
	// data
	dataC = null;
	dataW = null;

    // mouse
	locatorId = null;
	
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
        this.addVertex(400,255);
        this.addVertex(55,175);
        this.dataC.graph.addEdge(0,1);
        this.dataC.graph.addEdge(0,2);
        this.dataC.graph.addEdge(0,4);
        this.dataC.graph.addEdge(0,5);
        this.dataC.graph.addEdge(1,3);
        this.dataC.graph.addEdge(1,4);
        this.dataC.graph.addEdge(2,3);
        //this.dataC.graph.updateLabels();
		
		// gui: set up actions
		this.setupShowEvents();
		this.setupButtonEvents();
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
            for (let i = 0; i < this.dataC.graph.nEdges; i++) {
                this.dataC.graph.drawEdge(this.graphics, i);
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

        // edges
        const eList = this.dataC.graph.edgesToListString;

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
            this.dataC.graph.addEdge(0,1);
            this.dataC.graph.addEdge(0,3);
            this.dataC.graph.addEdge(0,6);
            this.dataC.graph.addEdge(1,4);
            this.dataC.graph.addEdge(2,3);
            this.dataC.graph.addEdge(2,5);
            this.dataC.graph.addEdge(3,4);
            this.dataC.graph.addEdge(3,6);
            this.dataC.graph.addEdge(5,6);
            //this.dataC.graph.updateLabels();

			this.computeAndRefresh();
		});
		
		this.buttons.b.addEventListener("click", () => {
            this.clearVertices();

            this.addVertex(80,340);
            this.addVertex(450,390);
            this.addVertex(225,520);
            this.dataC.graph.addEdge(0,1);
            this.dataC.graph.addEdge(0,2);
            this.dataC.graph.addEdge(2,1);
            this.addVertex(280,110);
            this.addVertex(500,120);
            this.addVertex(210,260);
            this.addVertex(580,190);
            this.dataC.graph.addEdge(3,4);
            this.dataC.graph.addEdge(4,6);
            this.dataC.graph.addEdge(6,5);
            this.dataC.graph.addEdge(5,3);
            this.dataC.graph.addEdge(4,5);
            //this.dataC.graph.updateLabels();

			this.computeAndRefresh();
		});

		
		this.buttons.randomVertex.addEventListener("click", () => {
            let pt = Utils.makeRandomPoint(this.canvas);
			this.addVertex(pt.x, pt.y);
			this.computeAndRefresh();
		});
		
		this.buttons.generate.addEventListener("click", () => {
            const nPts = this.generateParams.vertices.value;
            const pts = Utils.makeRandomPoints(this.canvas, nPts);

            this.clearVertices();
            for (let i = 0; i < nPts; i++) {
				this.addVertex(pts[i].x, pts[i].y);
            }

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
            this.addVertex(400,255);
            this.addVertex(55,175);
            this.dataC.graph.addEdge(0,1);
            this.dataC.graph.addEdge(0,2);
            this.dataC.graph.addEdge(0,4);
            this.dataC.graph.addEdge(0,5);
            this.dataC.graph.addEdge(1,3);
            this.dataC.graph.addEdge(1,4);
            this.dataC.graph.addEdge(2,3);
            //this.dataC.graph.updateLabels();

			this.computeAndRefresh();
		});
	}
    // states
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.addEventListener('mousedown', e => {
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
			
			// find id of existing nearby point
			this.locatorId = null;
			this.dataC.graph.vertices.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) this.locatorId = i; });

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
				
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE MOVE
		this.canvas.addEventListener('mousemove', e => {
			if (this.locatorId === null) return; 			// no specific point to move - ignore the dragging
			// else, update the coordinates of the dragged point; do not change the labels
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
            
            this.dataC.graph.setVertex(this.locatorId,mx,my);
			
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', e => { this.locatorId = null; });
	}
}