class SelfIntersectionApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-selfIntersectionApp');
	infoField = document.getElementById('selfIntersectionApp-points');

    // gui
	show = {
		box: document.getElementById("showBox-selfIntersectionApp"),
		origin: document.getElementById("showOrigin-selfIntersectionApp"),
		axes: document.getElementById("showAxes-selfIntersectionApp"),
		grid: document.getElementById("showGrid-selfIntersectionApp"),
		vertices: document.getElementById("showVertices-selfIntersectionApp"),
		segments: document.getElementById("showSegments-selfIntersectionApp"),
		fill: document.getElementById("showFill-selfIntersectionApp"),
        intersections: document.getElementById("showIntersections-selfIntersectionApp")
	};
	
	buttons = {
		intersecting: document.getElementById("buttonIntersect-selfIntersectionApp"),
		separate: document.getElementById("buttonSeparate-selfIntersectionApp"),
		addRandom: document.getElementById("buttonAddRandom-selfIntersectionApp"),
		generate: document.getElementById("buttonRandom-selfIntersectionApp"),
		clear: document.getElementById("buttonClear-selfIntersectionApp"),
		reset: document.getElementById("buttonReset-selfIntersectionApp")
	};

	nPtsSelect = document.getElementById("nVertices-selfIntersectionApp");
	
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
        let labels = [];
        let edges = [];

        let intersectC = new Points();
        let intersectLabs = [];

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

			polygon: polyC,
            intersections: intersectC,
            intersectLabels: intersectLabs
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
        let intersectW = new Points();
		
		this.dataW = {
			box: boxW,
			origin: originW,
			axes: axesW,
			range: rangeW,

            polygon: polyW,
            intersections: intersectW
		};

        this.createVertex(225,75);
        this.createVertex(200,350);
        this.createVertex(600,175);
        this.createVertex(425,400);
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
    get selfIntersects() {
        return (this.dataC.intersections.length !== 0);
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

        let polyColor = (this.selfIntersects) ? NEGATIVECOLOR : POSITIVECOLOR;

        if (this.show.fill.checked) {
			this.dataC.polygon.drawFill(this.graphics, COLORS.setAlpha(polyColor));
        }

        if (this.show.segments.checked) {
            this.dataC.polygon.drawSegments(this.graphics, polyColor);
        }
		
		if (this.show.vertices.checked) { 
			this.dataC.polygon.drawVertices(this.graphics);
		}

        if (this.show.intersections.checked) {
			this.dataC.intersections.draw(this.graphics, this.dataC.intersectLabels, THEMETEAL, POINTSIZE-2);
        }
	}

	// info
	updateInfo() {
        const ptsC = this.dataC.polygon.concat(this.dataC.intersections);
        const ptsW = this.dataW.polygon.concat(this.dataW.intersections);
        const labs = this.dataC.polygon.labels.concat(this.dataC.intersectLabels);

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

        // find intersections
		let intersects = this.dataC.polygon.selfIntersections();
        this.dataC.intersections.length = 0;
        this.dataW.intersections.length = 0;
		for (let i = 0; i < intersects.length; i++) {
			let ptW = ConvertPoint.canvasToWorldCoords(intersects[i], this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
			this.dataC.intersections.push(new Point(intersects[i].x, intersects[i].y))
			this.dataW.intersections.push(new Point(ptW.x, ptW.y));
		}

        this.dataC.intersectLabels = Utils.stdRange1(this.dataC.intersections.length);
        this.dataC.intersectLabels = this.dataC.intersectLabels.map(n => { return 'i' + n; });
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
        this.dataW.polygon.setAll(ConvertPoints.canvasToWorldCoords(this.dataC.polygon, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis));

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
		this.show.intersections.addEventListener("change", () => this.refresh());
	}
	// buttons
	setupButtonEvents() {
		this.buttons.intersecting.addEventListener("click", () => {
            this.clearVertices();
            this.createVertex(110,330);
            this.createVertex(220,400);
            this.createVertex(225,225);
            this.createVertex(410,130);
            this.createVertex(230,80);
            this.createVertex(400,380);
            this.dataC.polygon.updateLabels();
			this.computeAndRefresh();
		});
		
		this.buttons.separate.addEventListener("click", () => {
            this.clearVertices();
            this.createVertex(180,350);
            this.createVertex(160,190);
            this.createVertex(300,120);
            this.createVertex(440,230);
            this.createVertex(350,390);
            this.dataC.polygon.updateLabels();
			this.computeAndRefresh();
		});
		
		this.buttons.addRandom.addEventListener("click", () => {
            let pt = Utils.makeRandomPoint(this.canvas);
			this.createVertex(pt.x, pt.y);
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

		this.buttons.clear.addEventListener("click", () => {
			this.clearVertices();
            this.dataC.polygon.updateLabels();
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
            this.clearVertices();
            this.createVertex(225,75);
            this.createVertex(200,350);
            this.createVertex(600,175);
            this.createVertex(425,400);
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
			
			// find id of existing nearby point
			this.locatorId = null;
			this.dataC.polygon.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) this.locatorId = i; });
						
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
				if (this.dataC.polygon.length >= 1) { 
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
			this.dataC.polygon[this.locatorId].set(mx,my);
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', () => { this.locatorId = null; });
	}
}