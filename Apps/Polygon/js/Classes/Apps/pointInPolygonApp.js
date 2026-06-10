class PointInPolygonApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-pointInPolygonApp');
	infoField = document.getElementById('pointInPolygonApp-points');

    // gui
	show = {
		box: document.getElementById("showBox-pointInPolygonApp"),
		origin: document.getElementById("showOrigin-pointInPolygonApp"),
		axes: document.getElementById("showAxes-pointInPolygonApp"),
		grid: document.getElementById("showGrid-pointInPolygonApp"),
		vertices: document.getElementById("showVertices-pointInPolygonApp"),
		segments: document.getElementById("showSegments-pointInPolygonApp"),
		fill: document.getElementById("showFill-pointInPolygonApp"),
        point: document.getElementById("showPoint-pointInPolygonApp")
	};
	
	buttons = {
		inside: document.getElementById("buttonInside-pointInPolygonApp"),
		outside: document.getElementById("buttonOutside-pointInPolygonApp"),
		generate: document.getElementById("buttonRandom-pointInPolygonApp"),
		reset: document.getElementById("buttonReset-pointInPolygonApp")
	};

	nPtsSelect = document.getElementById("nVertices-pointInPolygonApp");
	
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
        let ptC = new Point(260,230);

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

			polygon: polyC,
            point: ptC
		};

		let boxPtsC = boxC.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
        
		let boxW = new Box(500,500);
		boxW.setPoints(boxPtsW);
		let rangeW = new Range(new MinMaxRange(0,1),new MinMaxRange(0,1)); 
		rangeW.set(boxPtsW[0].x,boxPtsW[1].x,boxPtsW[3].y,boxPtsW[0].y);		
		
		let originW = new Origin(0,0);
		let axesW = new Axes(1,1);

        let polyW = new Polygon();
        let ptW = new Point(0,0);
		
		this.dataW = {
			box: boxW,
			origin: originW,
			axes: axesW,
			range: rangeW,

            polygon: polyW,
            point: ptW
		};

        this.createVertex(180,350);
        this.createVertex(160,190);
        this.createVertex(300,120);
        this.createVertex(440,230);
        this.createVertex(350,390);
        this.dataC.polygon.updateLabels();
		
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
    get pointInsidePolygon() {
        return this.dataC.polygon.pointIsInside(this.dataC.point);
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

        let polyColor = (this.pointInsidePolygon) ? POSITIVECOLOR : NEGATIVECOLOR;

        if (this.show.fill.checked) {
			this.dataC.polygon.drawFill(this.graphics, COLORS.setAlpha(polyColor));
        }

        if (this.show.segments.checked) {
            this.dataC.polygon.drawSegments(this.graphics, polyColor);
        }
		
		if (this.show.vertices.checked) { 
			this.dataC.polygon.drawVertices(this.graphics);
		}

        if (this.show.point.checked) {
			this.dataC.point.draw(this.graphics, "P");
        }
	}

	// info
	updateInfo() {
        const ptsC = this.dataC.polygon.concat(this.dataC.point);
        const ptsW = this.dataW.polygon.concat(this.dataW.point);
        const labs = this.dataC.polygon.labels.concat("P");

		const res = Utils.pointsCoordsCWLabsToTableString(ptsC, ptsW, labs);
		
		this.infoField.innerHTML = res;
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
        this.dataC.point.snapToCanvas(this.canvas);
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
        this.dataW.polygon.setAll(ConvertPoints.canvasToWorldCoords(this.dataC.polygon, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis));
        this.dataW.point.coords = ConvertPoint.canvasToWorldCoords(this.dataC.point, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);

		this.scene();
		this.updateInfo();
	}

	createVertex(xC, yC, index = this.dataC.polygon.length) {
		const ptW = ConvertPoint.canvasToWorldCoords({x:xC, y:yC}, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
        this.dataC.polygon.splice(index, 0, new Point(xC,yC));
        this.dataW.polygon.splice(index, 0, new Point(ptW.x, ptW.y));
        this.dataC.polygon.updateEdges();
	}
	clearVertices() {
		this.dataC.polygon.length = 0;
		this.dataW.polygon.length = 0;
        this.dataC.polygon.updateEdges();
	}
	
	// set up gui
	// checkboxes
	setupShowEvents() {
		this.show.box.addEventListener("change", () => this.refresh());
		this.show.origin.addEventListener("change", () => this.refresh());
		this.show.axes.addEventListener("change", () => this.refresh());
		this.show.grid.addEventListener("change", () => this.refresh());
		this.show.vertices.addEventListener("change", () => this.refresh());
		this.show.segments.addEventListener("change", () => this.refresh());
		this.show.fill.addEventListener("change", () => this.refresh());
		this.show.point.addEventListener("change", () => this.refresh());
	}
	// buttons
	setupButtonEvents() {
		this.buttons.inside.addEventListener("click", () => {
            this.clearVertices();
            this.createVertex(60,315);
            this.createVertex(210,370);
            this.createVertex(80,40);
            this.createVertex(400,230);
            this.createVertex(450,60);
            this.createVertex(90,170);
            this.dataC.point.set(360,120);
            this.dataC.polygon.updateLabels();
			this.computeAndRefresh();
		});
		
		this.buttons.outside.addEventListener("click", () => {
            this.clearVertices();
            this.createVertex(450,340);
            this.createVertex(350,350);
            this.createVertex(220,520);
            this.createVertex(560,430);
            this.dataC.point.set(430,240);
            this.dataC.polygon.updateLabels();
			this.computeAndRefresh();
		});
		
		this.buttons.generate.addEventListener("click", () => {
            const nPts = this.nPtsSelect.value;
            const pts = Utils.makeRandomPoints(this.canvas, nPts);

            this.clearVertices();
            for (let i = 0; i < nPts; i++) {
				this.createVertex(pts[i].x, pts[i].y);
            }

            this.dataC.polygon.updateLabels();
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
            this.clearVertices();
            this.createVertex(180,350);
            this.createVertex(160,190);
            this.createVertex(300,120);
            this.createVertex(440,230);
            this.createVertex(350,390);
            this.dataC.point.set(260,230);
            this.dataC.polygon.updateLabels();
			this.computeAndRefresh();
		});
	}
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.addEventListener('mousedown', e => {
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;

            const pts = this.dataC.polygon.concat(this.dataC.point);
			
			// find id of existing nearby point
			this.locatorId = null;
			pts.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) this.locatorId = i; });
						
			if (e.detail === 1) // it was a single click
			{
				if (this.locatorId === null) // not near an existing point: insert a new point and label
				{
                    if (this.dataC.polygon.length <= 1) { // insert at end
                        this.locatorId = this.dataC.polygon.length;
                    } else { // insert between nearest edge
                        let e = Geometry1.nearestEdgeByMidpoint({x:mx, y:my}, this.dataC.polygon, this.dataC.polygon.edges);
                        if (e[0] === this.dataC.polygon.length - 1 && e[1] === 0) {
                            this.locatorId = this.dataC.polygon.length;
                        } else {
                            this.locatorId = e[0] + 1;
                        }
                    }
					
					this.createVertex(mx, my, this.locatorId);
                    this.dataC.polygon.updateLabels();
				} 
				// else, do nothing now - but check the mouse-move-event on the clicked-on point	
			} 
			else if (e.detail === 2) // it was a double click
			{				
				// if on an existing point, delete the point, else ignore the double click
                // user cannot delete points if there are 3 or fewer points in the polygon
				if (this.dataC.polygon.length >= 4 && this.locatorId !== this.dataC.polygon.length) { 
					this.dataC.polygon.splice(this.locatorId,1); 				// delete the point
					this.dataW.polygon.splice(this.locatorId,1);
                    this.dataC.polygon.updateLabels();	// relabel all points
                    this.dataC.polygon.updateEdges();
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
            if (this.locatorId === this.dataC.polygon.length) {
                this.dataC.point.set(mx,my);
            } else {
                this.dataC.polygon[this.locatorId].set(mx,my);
            }
			
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', () => { this.locatorId = null; });
	}
}