class CircumscribedCircleApp {
    // constants: global names of i/o fields 
	canvas = document.getElementById('canvas-circumscribedCircleApp');
	infoField = document.getElementById('circumscribedCircleApp-points');

    // gui
	show = {
		box: document.getElementById("showBox-circumscribedCircleApp"),
		origin: document.getElementById("showOrigin-circumscribedCircleApp"),
		axes: document.getElementById("showAxes-circumscribedCircleApp"),
		grid: document.getElementById("showGrid-circumscribedCircleApp"),
		vertices: document.getElementById("showVertices-circumscribedCircleApp"),
        segments: document.getElementById("showSegments-circumscribedCircleApp"),
        midpoints: document.getElementById("showMidpoints-circumscribedCircleApp"),
        bisectors: document.getElementById("showBisectors-circumscribedCircleApp"),
        center: document.getElementById("showCenter-circumscribedCircleApp"),
        circle: document.getElementById("showCircle-circumscribedCircleApp")
	};
	
	buttons = {
		random: document.getElementById("buttonRandom-circumscribedCircleApp"),
		reset: document.getElementById("buttonReset-circumscribedCircleApp"),
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
		let segABC = new Segment(aC, bC);
		let segBCC = new Segment(bC, cC);
        let segACC = new Segment(aC, cC);

		let midABC = new Point(0,0);
		let midBCC = new Point(0,0);
		let midACC = new Point(0,0);
		let bisectABC = new Segment(new Point(0,0), new Point(0,0));
		let bisectBCC = new Segment(new Point(0,0), new Point(0,0));
		let bisectACC = new Segment(new Point(0,0), new Point(0,0));
		let centerC = new Point(0,0);

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
		let centerW = new Point(0,0);
		
		this.dataW = {
			box: boxW,
			origin: originW,
			axes: axesW,
			range: rangeW,

			triangleA: aW,
            triangleB: bW,
            triangleC: cW,

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
            this.dataC.bisectorAB.draw(this.graphics, THEMEPURPLE, EDGETHICKNESS-1);
            this.dataC.bisectorBC.draw(this.graphics, THEMEPURPLE, EDGETHICKNESS-1);
            this.dataC.bisectorAC.draw(this.graphics, THEMEPURPLE, EDGETHICKNESS-1);
        }

		if (this.show.center.checked) {
			this.dataC.center.draw(this.graphics, '', THEMETEAL);
		}

        if (this.show.circle.checked) {
            Draw.circle(this.graphics, this.dataC.center, this.dataC.radius, THEMETEAL);
        }

		if (this.show.segments.checked) {
			this.dataC.segmentAB.draw(this.graphics);
			this.dataC.segmentBC.draw(this.graphics);
			this.dataC.segmentAC.draw(this.graphics);
		}

		if (this.show.midpoints.checked) {
			this.dataC.midpointAB.draw(this.graphics, '', POINTCOLOR, POINTSIZE - 2);
			this.dataC.midpointBC.draw(this.graphics, '', POINTCOLOR, POINTSIZE - 2);
			this.dataC.midpointAC.draw(this.graphics, '', POINTCOLOR, POINTSIZE - 2);
		}
		
		if (this.show.vertices.checked) {
			this.dataC.triangleA.draw(this.graphics, "A");
			this.dataC.triangleB.draw(this.graphics, "B");
			this.dataC.triangleC.draw(this.graphics, "C");
		}
	}

	// info
	updateInfo() {
		let ptsC = [this.dataC.triangleA, this.dataC.triangleB, this.dataC.triangleC, this.dataC.center, this.dataC.radius];
		let ptsW = [this.dataW.triangleA, this.dataW.triangleB, this.dataW.triangleC, this.dataW.center, this.dataW.radius];
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
		this.dataC.triangleA.snapToCanvas(this.canvas);
		this.dataC.triangleB.snapToCanvas(this.canvas);
		this.dataC.triangleC.snapToCanvas(this.canvas);

		this.dataC.midpointAB.coords = this.dataC.segmentAB.midpoint();
		this.dataC.midpointBC.coords = this.dataC.segmentBC.midpoint();
		this.dataC.midpointAC.coords = this.dataC.segmentAC.midpoint();
		this.dataC.center.coords = Geometry1.circumcenter(this.dataC.triangleA, this.dataC.triangleB, this.dataC.triangleC);
		this.dataC.radius = Geometry1.circumradius(this.dataC.triangleA, this.dataC.triangleB, this.dataC.triangleC);

		this.dataC.bisectorAB.tail.coords = this.dataC.midpointAB.coords;
		this.dataC.bisectorAB.head.coords = this.dataC.center.coords;
		let angleBisectAB = Geometry1.ccwAngleBetweenVectors(this.dataC.bisectorAB.getVector(), this.dataC.axes.xAxis);
		let extCoordsAB = Geometry1.vectorCoordinates(75, angleBisectAB);
		this.dataC.bisectorAB.tail.addTo(extCoordsAB.x * -1, extCoordsAB.y * -1); // extend tail by 50 distance in canvas coordinates

		this.dataC.bisectorBC.tail.coords = this.dataC.midpointBC.coords;
		this.dataC.bisectorBC.head.coords = this.dataC.center.coords;
		let angleBisectBC = Geometry1.ccwAngleBetweenVectors(this.dataC.bisectorBC.getVector(), this.dataC.axes.xAxis);
		let extCoordsBC = Geometry1.vectorCoordinates(75, angleBisectBC);
		this.dataC.bisectorBC.tail.addTo(extCoordsBC.x * -1, extCoordsBC.y * -1); // extend tail by 50 distance in canvas coordinates

		this.dataC.bisectorAC.tail.coords = this.dataC.midpointAC.coords;
		this.dataC.bisectorAC.head.coords = this.dataC.center.coords;
		let angleBisectAC = Geometry1.ccwAngleBetweenVectors(this.dataC.bisectorAC.getVector(), this.dataC.axes.xAxis);
		let extCoordsAC = Geometry1.vectorCoordinates(75, angleBisectAC);
		this.dataC.bisectorAC.tail.addTo(extCoordsAC.x * -1, extCoordsAC.y * -1); // extend tail by 50 distance in canvas coordinates

		// FIX: there is something up with the bisectors thru AC only in the reset position from Orientation??? (but if you rotate the points, it's ONLY an issue when the right side is AC or AB, *not* BC??)

		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
	
		this.dataW.triangleA.coords = ConvertPoint.canvasToWorldCoords(this.dataC.triangleA, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.triangleB.coords = ConvertPoint.canvasToWorldCoords(this.dataC.triangleB, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.triangleC.coords = ConvertPoint.canvasToWorldCoords(this.dataC.triangleC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
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
			this.dataC.triangleA.coords = pts[0];
			this.dataC.triangleB.coords = pts[1];
			this.dataC.triangleC.coords = pts[2];
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
			this.dataC.triangleA.set(425, 350);
			this.dataC.triangleB.set(450, 100);
			this.dataC.triangleC.set(575, 175);
			this.computeAndRefresh();
		});
    }
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.addEventListener('mousedown', e => {
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;

			let pts = [this.dataC.triangleA, this.dataC.triangleB, this.dataC.triangleC];

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
            let pts = [this.dataC.triangleA, this.dataC.triangleB, this.dataC.triangleC];
			pts[this.locatorId].set(mx,my);
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', () => { this.locatorId = null; });
	}
}