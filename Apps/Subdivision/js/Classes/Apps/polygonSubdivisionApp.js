class PolygonSubdivisionApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-polygonSubdivisionApp');
	infoField = document.getElementById('polygonSubdivisionApp-points');
    errorDisplay = document.getElementById('polygonSubdivisionApp-errors');
    edgeList = document.getElementById('polygonSubdivisionApp-edges');
    faceList = document.getElementById('polygonSubdivisionApp-faces');

    // gui
	show = {
		box: document.getElementById("showBox-polygonSubdivisionApp"),
		origin: document.getElementById("showOrigin-polygonSubdivisionApp"),
		axes: document.getElementById("showAxes-polygonSubdivisionApp"),
		grid: document.getElementById("showGrid-polygonSubdivisionApp"),

		polygon: document.getElementById("showPolygon-polygonSubdivisionApp"),
		intersections: document.getElementById("showIntersections-polygonSubdivisionApp"),

		edges: document.getElementById("showEdges-polygonSubdivisionApp"),
		faces: document.getElementById("showFaces-polygonSubdivisionApp"),
        
		test: document.getElementById("showTEST-polygonSubdivisionApp")
	};
	
	buttons = {
		a: document.getElementById("buttonA-polygonSubdivisionApp"),
		b: document.getElementById("buttonB-polygonSubdivisionApp"),

		randomVertex: document.getElementById("buttonRandomVertex-polygonSubdivisionApp"),
		generate: document.getElementById("buttonGenerate-polygonSubdivisionApp"),

		clear: document.getElementById("buttonClear-polygonSubdivisionApp"),
		reset: document.getElementById("buttonReset-polygonSubdivisionApp")
	};

    generateParams = {
        vertices: document.getElementById("nVertices-polygonSubdivisionApp")
    };

    colors = {
        single: document.getElementById("colorSingle-polygonSubdivisionApp"),
        multi: document.getElementById("colorMulti-polygonSubdivisionApp")
    };

    colorMode = "multi";
	
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

        let polyC = new Polygon();
		let graph = new PolygonSubdivision();

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

            polygon: polyC,
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

        this.addVertex(225,75);
        this.addVertex(200,350);
        this.addVertex(600,175);
        this.addVertex(425,400);
        this.updateGraph();
		
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
            this.dataC.graph.drawEdges(this.graphics);
        }
		
		if (this.show.intersections.checked) {
			this.dataC.graph.drawIntersections(this.graphics);
		}
		
		if (this.show.polygon.checked) {
			this.dataC.graph.drawPolygonVertices(this.graphics);
		}

        if (this.show.test.checked) {
            this.dataC.polygon.drawVertices(this.graphics, false, THEMEAMBER);
        }
	}

	// info
	updateInfo() {
        // coordinates
        const ptsC = this.dataC.graph.vertices;
        const ptsW = this.dataW.vertices;
        const labs = this.dataC.graph.labels;
        console.log(ptsC);
        console.log(ptsW);

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
		this.dataC.polygon.snapToCanvas(this.canvas);
		this.updateGraph();
        
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
	addVertex(xC, yC, index = this.dataC.polygon.length) {
		const ptW = ConvertPoint.canvasToWorldCoords({x:xC, y:yC}, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
        this.dataC.polygon.splice(index, 0, new Point(xC,yC));
        this.dataW.vertices.splice(index, 0, new Point(ptW.x, ptW.y));
	}
    deleteVertex(i) {
        this.dataC.polygon.splice(i,1);
        this.dataW.vertices.splice(i,1);
    }
	clearVertices() {
        this.dataC.polygon.length = 0;
		this.dataC.graph.clearVertices();
		this.dataW.vertices.length = 0;
	}
    // graph
    updateGraph() {
        this.dataC.graph.fromPolygon(this.dataC.polygon);

        // update intersections in world coordinates
        this.dataW.vertices.length = this.dataC.graph.nPolygon;
        for (let i = this.dataC.graph.nPolygon; i < this.dataC.graph.nVertices; i++) {
            let intersection = this.dataC.graph.vertices[i];
            const ptW = ConvertPoint.canvasToWorldCoords(intersection, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
            this.dataW.vertices.push(new Point(ptW.x, ptW.y));
        }
    }
	
	// set up gui
	// checkboxes
	setupShowEvents() {
		this.show.box.addEventListener("change", () => this.refresh());
		this.show.origin.addEventListener("change", () => this.refresh());
		this.show.axes.addEventListener("change", () => this.refresh());
		this.show.grid.addEventListener("change", () => this.refresh());
		this.show.polygon.addEventListener("change", () => this.refresh());
		this.show.intersections.addEventListener("change", () => this.refresh());
		this.show.edges.addEventListener("change", () => this.refresh());
		this.show.faces.addEventListener("change", () => this.refresh());

		this.show.test.addEventListener("change", () => this.refresh());
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
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
            this.clearVertices();

            this.addVertex(225,75);
            this.addVertex(200,350);
            this.addVertex(600,175);
            this.addVertex(425,400);

			this.computeAndRefresh();
		});
	}
    // states
    setupStateEvents() {
        // face colors
		this.colors.multi.addEventListener("input", () => {
			this.colorMode = "multi";
			this.refresh();
		});

		this.colors.single.addEventListener("input", () => {
			this.colorMode = "single";
			this.refresh();
		});
    }
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.addEventListener('mousedown', e => {
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
			
			// find id of existing nearby point
			this.locatorId = null;
			this.dataC.polygon.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) this.locatorId = i; });

            if (e.detail === 1) // it was a single click
            {
                if (this.locatorId === null) // not near an existing point: insert a new point and label
                {
                    this.locatorId = this.dataC.polygon.length;
                    this.addVertex(mx, my, this.locatorId);
                }
                // else, do nothing now - but check the mouse-move-event on the clicked-on point	
            } 
            else if (e.detail === 2) // it was a double click
            {
                // if on an existing point, delete the point, else ignore the double click
                if (this.dataC.polygon >= 1) { 
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
            this.dataC.polygon[this.locatorId].set(mx,my);
			
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', e => { this.locatorId = null; });
	}
}