class PointInTriangleApp {
    // constants: global names of i/o fields 
	canvas = document.getElementById('canvas-pointInTriangleApp');
	infoField = document.getElementById('pointInTriangleApp-points');

    // gui
	show = {
		box: document.getElementById("showBox-pointInTriangleApp"),
		origin: document.getElementById("showOrigin-pointInTriangleApp"),
		axes: document.getElementById("showAxes-pointInTriangleApp"),
		grid: document.getElementById("showGrid-pointInTriangleApp"),
		vertices: document.getElementById("showVertices-pointInTriangleApp"),
        segments: document.getElementById("showSegments-pointInTriangleApp"),
        fill: document.getElementById("showFill-pointInTriangleApp"),
        point: document.getElementById("showPoint-pointInTriangleApp")
	};
	
	buttons = {
		inside: document.getElementById("buttonInside-pointInTriangleApp"),
		outside: document.getElementById("buttonOutside-pointInTriangleApp"),
		random: document.getElementById("buttonRandom-pointInTriangleApp"),
		reset: document.getElementById("buttonReset-pointInTriangleApp"),
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
		
		let aC = new Point(540, 275);
        let bC = new Point(400, 150);
        let cC = new Point(540, 75);
		let segABC = new Segment(aC, bC);
		let segBCC = new Segment(bC, cC);
        let segACC = new Segment(aC, cC);

        let ptC = new Point(200, 200);

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

			triangleA: aC,
            triangleB: bC,
            triangleC: cC,
            segmentAB: segABC,
            segmentBC: segBCC,
            segmentAC: segACC,

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
		
		let aW = new Point(0,0);
        let bW = new Point(0,0);
        let cW = new Point(0,0);
        let ptW = new Point(0,0);
		
		this.dataW = {
			box: boxW,
			origin: originW,
			axes: axesW,
			range: rangeW,

			triangleA: aW,
            triangleB: bW,
            triangleC: cW,

            point: ptW
		};
		
		// gui: set up actions
		this.setupShowEvents();
		this.setupButtonEvents();
		this.setupMouseEvents();

		// Init canvas / graphics
		this.graphics = initCanvasGraphics(this.canvas);
		//this.scene();
		// NOTE: If scene() is run here, it runs before the "load" event, meaning setColors() hasn't been called yet.
		// This appears to ONLY be a problem if scene() calls COLOR.setAlpha -- which Draw.triangleFilledOriented does -- at which point it draws everything before setAlpha is called in black, then throws an error and stops functioning completely?
		// Either way, the "load" event itself runs redrawActiveApp(), so scene() isn't necessary here in the first place.

		// Init/Update info field
		this.updateInfo();
    }
	
	// computations
	get pointInsideTriangle() {
		let signAB = Area2D.signedTriangleDoubleArea(this.dataC.point, this.dataC.triangleA, this.dataC.triangleB);
		let signBC = Area2D.signedTriangleDoubleArea(this.dataC.point, this.dataC.triangleB, this.dataC.triangleC);
		let signCA = Area2D.signedTriangleDoubleArea(this.dataC.point, this.dataC.triangleC, this.dataC.triangleA);
		
		if (signAB > 0) {
			return signBC > 0 && signCA > 0;
		} else if (signAB < 0) {
			return signBC < 0 && signCA < 0;
		} else {
			return false;
		}
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

        let triangleColor = this.pointInsideTriangle ? POSITIVECOLOR : NEGATIVECOLOR;

		if (this.show.fill.checked) {
			Draw.triangleFilled(this.graphics, this.dataC.triangleA, this.dataC.triangleB, this.dataC.triangleC, COLORS.setAlpha(triangleColor));
		}

		if (this.show.segments.checked) {
			this.dataC.segmentAB.draw(this.graphics, triangleColor);
			this.dataC.segmentBC.draw(this.graphics, triangleColor);
			this.dataC.segmentAC.draw(this.graphics, triangleColor);
		}
		
		if (this.show.vertices.checked) {
			this.dataC.triangleA.draw(this.graphics, "A", triangleColor);
			this.dataC.triangleB.draw(this.graphics, "B", triangleColor);
			this.dataC.triangleC.draw(this.graphics, "C", triangleColor);
		}

        if (this.show.point.checked) {
            this.dataC.point.draw(this.graphics, "P");
        }
	}

	// info
	updateInfo() {
		let ptsC = [this.dataC.triangleA, this.dataC.triangleB, this.dataC.triangleC, this.dataC.point];
		let ptsW = [this.dataW.triangleA, this.dataW.triangleB, this.dataW.triangleC, this.dataW.point];
		let labs = ["A","B","C","P"];
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
		this.dataC.triangleA.snapToCanvas(this.canvas);
		this.dataC.triangleB.snapToCanvas(this.canvas);
		this.dataC.triangleC.snapToCanvas(this.canvas);
        this.dataC.point.snapToCanvas(this.canvas);
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
	
		this.dataW.triangleA.coords = ConvertPoint.canvasToWorldCoords(this.dataC.triangleA, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.triangleB.coords = ConvertPoint.canvasToWorldCoords(this.dataC.triangleB, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.triangleC.coords = ConvertPoint.canvasToWorldCoords(this.dataC.triangleC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.point.coords = ConvertPoint.canvasToWorldCoords(this.dataC.point, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);

		this.scene();
		this.updateInfo();
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
			this.dataC.triangleA.set(250, 100);
			this.dataC.triangleB.set(400, 175);
			this.dataC.triangleC.set(150, 325);
			this.dataC.point.set(250, 200);
			this.computeAndRefresh();
		});
		
		this.buttons.outside.addEventListener("click", () => {
			this.dataC.triangleA.set(250, 100);
			this.dataC.triangleB.set(400, 175);
			this.dataC.triangleC.set(150, 325);
			this.dataC.point.set(125, 175);
			this.computeAndRefresh();
		});
		
		this.buttons.random.addEventListener("click", () => {
			const pts = Utils.makeRandomPoints(this.canvas, 4);
			this.dataC.triangleA.coords = pts[0];
			this.dataC.triangleB.coords = pts[1];
			this.dataC.triangleC.coords = pts[2];
			this.dataC.point.coords = pts[3];
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
			this.dataC.triangleA.set(540, 275);
			this.dataC.triangleB.set(400, 150);
			this.dataC.triangleC.set(540, 75);
            this.dataC.point.set(200, 200);
			this.computeAndRefresh();
		});
    }
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.addEventListener('mousedown', e => {
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;

			let pts = [this.dataC.triangleA, this.dataC.triangleB, this.dataC.triangleC, this.dataC.point];

			// find id of existing nearby point
			this.locatorId = null;
			pts.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) this.locatorId = i; });
		});
		
		// MOUSE MOVE
		this.canvas.addEventListener('mousemove', e => {
			if (this.locatorId === null) return; 			// no specific point to move - ignore the dragging
			// else, update the coordinates of the dragged point; do not change the labels
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
            let pts = [this.dataC.triangleA, this.dataC.triangleB, this.dataC.triangleC, this.dataC.point];
			pts[this.locatorId].set(mx,my);
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', () => { this.locatorId = null; });
	}
}