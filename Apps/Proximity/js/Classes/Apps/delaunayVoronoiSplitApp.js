class DelaunayVoronoiSplitApp {
	// constants: global names of i/o fields 
	canvas = {
		delaunay: document.getElementById('canvasDel-delaunayVoronoiSplitApp'),
		voronoi: document.getElementById('canvasVor-delaunayVoronoiSplitApp')
	};

	infoField = document.getElementById('delaunayVoronoiSplitApp-points');
    errorDisplay = document.getElementById('delaunayVoronoiSplitApp-errors');
    edgeList = document.getElementById('delaunayVoronoiSplitApp-edges');

    // gui
	show = {
		box: document.getElementById("showBox-delaunayVoronoiSplitApp"),
		origin: document.getElementById("showOrigin-delaunayVoronoiSplitApp"),
		axes: document.getElementById("showAxes-delaunayVoronoiSplitApp"),
		grid: document.getElementById("showGrid-delaunayVoronoiSplitApp"),

		vertices: document.getElementById("showVertices-delaunayVoronoiSplitApp"),
		delaunay: document.getElementById("showDelaunay-delaunayVoronoiSplitApp"),

		voronoi: document.getElementById("showVoronoi-delaunayVoronoiSplitApp"),
		faces: document.getElementById("showFaces-delaunayVoronoiSplitApp")
	};
	
	buttons = {
		a: document.getElementById("buttonA-delaunayVoronoiSplitApp"),
		b: document.getElementById("buttonB-delaunayVoronoiSplitApp"),

		randomVertex: document.getElementById("buttonRandomVertex-delaunayVoronoiSplitApp"),
		generate: document.getElementById("buttonGenerate-delaunayVoronoiSplitApp"),

		reset: document.getElementById("buttonReset-delaunayVoronoiSplitApp")
	};

    generateParams = {
        vertices: document.getElementById("nVertices-delaunayVoronoiSplitApp")
    };
	
	// data
	dataC = null;
	dataW = null;

    // mouse
	locatorId = null;
	targetCanvas = null;
	
	// view
	graphics = null;

    constructor() {
        // init data
		let boxC = new Box(500,500);
		boxC.fromCanvas(this.canvas.delaunay);
		let rangeC = new Range(new MinMaxRange(0,500),new MinMaxRange(0,500));
		rangeC.fromCanvas(this.canvas.delaunay);
		let originC = new Origin(0,0);
		originC.fromCanvas(this.canvas.delaunay);
		let axesC = new Axes(100,-100);

		let graph = new DelaunayVoronoiGraph();

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

			graph: graph
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

        this.addVertex(200,350);
        this.addVertex(500,175);
        this.addVertex(425,400);
		
		// gui: set up actions
		this.setupShowEvents();
		this.setupButtonEvents();
		this.setupMouseEvents();

		// Init canvas / graphics
		let graphDel = initDualCanvasGraphics(this.canvas.delaunay);
		let graphVor = initDualCanvasGraphics(this.canvas.voronoi);
		this.graphics = {
			delaunay: graphDel,
			voronoi: graphVor
		};
		//this.scene();

		// Init/Update info field
		this.updateInfo();
    }
	
	// computations

	// view
	// graphics
	scene() {
        if (this.show.grid.checked) {
			this.dataC.range.drawGrid(this.graphics.delaunay, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
			this.dataC.range.drawGrid(this.graphics.voronoi, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		}
		
		if (this.show.axes.checked) {
			this.dataC.axes.draw(this.graphics.delaunay,this.dataC.origin);
			this.dataC.axes.draw(this.graphics.voronoi,this.dataC.origin);
		}

		if (this.show.origin.checked) {
			this.dataC.origin.draw(this.graphics.delaunay);
			this.dataC.origin.draw(this.graphics.voronoi);
		}

		if (this.show.faces.checked) {
			this.dataC.graph.drawVoronoiCellFaces(this.graphics.voronoi);
		}

        if (this.show.voronoi.checked) {
            this.dataC.graph.drawVoronoiCells(this.graphics.voronoi, THEMEBOLDGRAY, EDGETHICKNESS-2);
        }

        if (this.show.delaunay.checked) {
            this.dataC.graph.drawEdges(this.graphics.delaunay, EDGECOLOR, EDGETHICKNESS-2);
        }
		
		if (this.show.vertices.checked) {
			this.dataC.graph.drawVertices(this.graphics.delaunay);
			if (this.show.faces.checked) {
				this.dataC.graph.drawVertices(this.graphics.voronoi, true, "multi");
			} else {
				this.dataC.graph.drawVertices(this.graphics.voronoi);
			}
		}
		
		if (this.show.box.checked) {
			this.dataC.box.draw(this.graphics.delaunay);
			this.dataC.box.draw(this.graphics.voronoi);
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
		this.graphics.delaunay = initDualCanvasGraphics(this.canvas.delaunay);
		this.graphics.voronoi = initDualCanvasGraphics(this.canvas.voronoi);
		this.scene();
		this.updateInfo();
	}
	// with dataC/W recalculations
	computeAndRefresh() {
		this.graphics.delaunay = initDualCanvasGraphics(this.canvas.delaunay);
		this.graphics.voronoi = initDualCanvasGraphics(this.canvas.voronoi);
		this.dataC.box.fromCanvas(this.canvas.delaunay);
		this.dataC.origin.fromCanvas(this.canvas.delaunay);
		this.dataC.range.fromCanvas(this.canvas.delaunay);
		this.dataC.graph.snapToCanvas(this.canvas.delaunay);
        this.dataC.graph.updateDelaunayVoronoi(this.canvas.delaunay);
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas.delaunay);
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
		this.show.delaunay.addEventListener("change", () => this.refresh());
		this.show.voronoi.addEventListener("change", () => this.refresh());
		this.show.faces.addEventListener("change", () => this.refresh());
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

			this.computeAndRefresh();
		});
		
		this.buttons.b.addEventListener("click", () => {
            this.clearVertices();

            this.addVertex(80,340);
            this.addVertex(450,390);
            this.addVertex(225,520);
            this.addVertex(280,110);
            this.addVertex(500,120);
            this.addVertex(210,260);
            this.addVertex(580,190);

			this.computeAndRefresh();
		});

		
		this.buttons.randomVertex.addEventListener("click", () => {
            let pt = Utils.makeRandomPoint(this.canvas.delaunay);
			this.addVertex(pt.x, pt.y);
			this.computeAndRefresh();
		});
		
		this.buttons.generate.addEventListener("click", () => {
            const nPts = this.generateParams.vertices.value;
            const pts = Utils.makeRandomPoints(this.canvas.delaunay, nPts);

            this.clearVertices();
            for (let i = 0; i < nPts; i++) {
				this.addVertex(pts[i].x, pts[i].y);
            }

			this.computeAndRefresh();
		});


		this.buttons.reset.addEventListener("click", () => {
            this.clearVertices();

            this.addVertex(200,350);
            this.addVertex(500,175);
            this.addVertex(425,400);

			this.computeAndRefresh();
		});
	}
    // states
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.delaunay.addEventListener('mousedown', e => this.mouseDownEvent(e, "delaunay"));
		this.canvas.voronoi.addEventListener('mousedown', e => this.mouseDownEvent(e, "voronoi"));
		
		// MOUSE MOVE
		this.canvas.delaunay.addEventListener('mousemove', e => this.mouseMoveEvent(e, "delaunay"));
		this.canvas.voronoi.addEventListener('mousemove', e => this.mouseMoveEvent(e, "voronoi"));
		
		// MOUSE UP
		this.canvas.delaunay.addEventListener('mouseup', e => { this.locatorId = null; this.targetCanvas = null; });
		this.canvas.voronoi.addEventListener('mouseup', e => { this.locatorId = null; this.targetCanvas = null; });
	}
	// mouse events
	mouseDownEvent(e, canvasId) {
		this.targetCanvas = canvasId;
		
		let canvas = (canvasId == "delaunay") ? this.canvas.delaunay : this.canvas.voronoi;
		const canvasBounds = canvas.getBoundingClientRect();
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
			}
			// else, do nothing now - but check the mouse-move-event on the clicked-on point	
		} 
		else if (e.detail === 2) // it was a double click
		{
			// if on an existing point, delete the point, else ignore the double click
			// user cannot delete points if there are 3 or fewer points in the graph
			if (this.dataC.graph.nVertices >= 4) { 
				this.deleteVertex(this.locatorId);
				this.locatorId = null;
			}
		};

		// visualize the effect
		this.computeAndRefresh();
	}
	mouseMoveEvent(e, canvasId) {
		if (this.locatorId === null) return; 			// no specific point to move - ignore the dragging
		else if (this.targetCanvas != canvasId) return; // currently targeting the other canvas

		// else, update the coordinates of the dragged point; do not change the labels
		let canvas = (canvasId == "delaunay") ? this.canvas.delaunay : this.canvas.voronoi;
		const canvasBounds = canvas.getBoundingClientRect();
		const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
		
		this.dataC.graph.setVertex(this.locatorId,mx,my);
		
		// visualize the effect
		this.computeAndRefresh();
	}
}