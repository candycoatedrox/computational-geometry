class CircumscribedCircleApp {
    // constants: global names of i/o fields 
	canvas = document.getElementById('canvas-circumcircleApp');
	infoField = document.getElementById('circumcircleApp-points');

    // gui
	show = {
		box: document.getElementById("showBox-circumcircleApp"),
		origin: document.getElementById("showOrigin-circumcircleApp"),
		axes: document.getElementById("showAxes-circumcircleApp"),
		grid: document.getElementById("showGrid-circumcircleApp"),

		vertices: document.getElementById("showVertices-circumcircleApp"),
        segments: document.getElementById("showSegments-circumcircleApp"),

        midpoints: document.getElementById("showMidpoints-circumcircleApp"),
        bisectors: document.getElementById("showBisectors-circumcircleApp"),

        center: document.getElementById("showCenter-circumcircleApp"),
        circle: document.getElementById("showCircle-circumcircleApp")
	};
	
	buttons = {
		random: document.getElementById("buttonRandom-circumcircleApp"),
		reset: document.getElementById("buttonReset-circumcircleApp"),
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
		
		let aC = new Point(425, 350);
        let bC = new Point(450, 100);
        let cC = new Point(575, 175);
		let triC = new Triangle(aC, bC, cC);

		let midABC = new Point(0,0);
		let midBCC = new Point(0,0);
		let midACC = new Point(0,0);
		let centerC = new Point(0,0);
		let bisectABC = new Segment(midABC, centerC);
		let bisectBCC = new Segment(midBCC, centerC);
		let bisectACC = new Segment(midACC, centerC);

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

			triangle: triC,
			midpointAB: midABC,
			midpointBC: midBCC,
			midpointAC: midACC,

			bisectorAB: bisectABC,
			bisectorBC: bisectBCC,
			bisectorAC: bisectACC,
			center: centerC,
			radius: 50
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
		let triW = new Triangle(aW, bW, cW);
		let centerW = new Point(0,0);
		
		this.dataW = {
			box: boxW,
			origin: originW,
			axes: axesW,
			range: rangeW,

			triangle: triW,
			center: centerW,
			radius: 50
		};
		
		// gui: set up actions
		this.setupShowEvents();
		this.setupButtonEvents();
		this.setupMouseEvents();

		// Init canvas / graphics
		this.graphics = initCanvasGraphics(this.canvas);

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

        if (this.show.bisectors.checked) {
            this.dataC.bisectorAB.drawExtended(this.graphics, 75, 0, THEMEPURPLE, LINETHICKNESS);
            this.dataC.bisectorBC.drawExtended(this.graphics, 75, 0, THEMEPURPLE, LINETHICKNESS);
            this.dataC.bisectorAC.drawExtended(this.graphics, 75, 0, THEMEPURPLE, LINETHICKNESS);
        }

		if (this.show.center.checked) {
			this.dataC.center.draw(this.graphics, '', THEMETEAL);
		}

        if (this.show.circle.checked) {
            Draw.circle(this.graphics, this.dataC.center, this.dataC.radius, THEMETEAL);
        }

		if (this.show.segments.checked) {
			this.dataC.triangle.drawSegments(this.graphics);
		}

		if (this.show.midpoints.checked) {
			this.dataC.midpointAB.draw(this.graphics, '', POINTCOLOR, POINTSIZE - 2);
			this.dataC.midpointBC.draw(this.graphics, '', POINTCOLOR, POINTSIZE - 2);
			this.dataC.midpointAC.draw(this.graphics, '', POINTCOLOR, POINTSIZE - 2);
		}
		
		if (this.show.vertices.checked) {
			this.dataC.triangle.drawVertices(this.graphics);
		}
	}

	// info
	updateInfo() {
		let ptsC = this.dataC.triangle.points.concat(this.dataC.center, this.dataC.radius);
		let ptsW = this.dataW.triangle.points.concat(this.dataW.center, this.dataW.radius);
		let labs = ["A","B","C","center","radius"];
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
		this.dataC.triangle.snapToCanvas(this.canvas);

		let midpoints = this.dataC.triangle.midpoints();
		this.dataC.midpointAB.coords = midpoints.AB;
		this.dataC.midpointBC.coords = midpoints.BC;
		this.dataC.midpointAC.coords = midpoints.AC;
		this.dataC.center.coords = this.dataC.triangle.circumcenter();
		this.dataC.radius = this.dataC.triangle.circumradius();

		// FIX: there is something up with the bisectors thru AC only in the reset position from Orientation??? (but if you rotate the points, it's ONLY an issue when the right side is AC or AB, *not* BC??)

		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
	
		this.dataW.triangle.setPoints(ConvertPoints.canvasToWorldCoords(this.dataC.triangle.points, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis));
		this.dataW.center.coords = ConvertPoint.canvasToWorldCoords(this.dataC.center, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.radius = ConvertLength.canvasToWorldLength(this.dataC.radius, this.dataC.axes.xAxis, this.dataC.axes.yAxis);

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

		this.show.midpoints.addEventListener("change", () => this.refresh());
		this.show.bisectors.addEventListener("change", () => this.refresh());

		this.show.center.addEventListener("change", () => this.refresh());
		this.show.circle.addEventListener("change", () => this.refresh());
	}
    // buttons
    setupButtonEvents() {
		this.buttons.random.addEventListener("click", () => {
			const pts = Utils.makeRandomPoints(this.canvas, 3);
			this.dataC.triangle.a.coords = pts[0];
			this.dataC.triangle.b.coords = pts[1];
			this.dataC.triangle.c.coords = pts[2];
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
			this.dataC.triangle.a.set(425, 350);
			this.dataC.triangle.b.set(450, 100);
			this.dataC.triangle.c.set(575, 175);
			this.computeAndRefresh();
		});
    }
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.addEventListener('mousedown', e => {
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;

			let pts = [this.dataC.triangle.a, this.dataC.triangle.b, this.dataC.triangle.c];

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
            let pts = [this.dataC.triangle.a, this.dataC.triangle.b, this.dataC.triangle.c];
			pts[this.locatorId].set(mx,my);
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', () => { this.locatorId = null; });
	}
}