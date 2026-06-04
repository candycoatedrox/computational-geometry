class InscribedCircleApp {
    // constants: global names of i/o fields 
	canvas = document.getElementById('canvas-inscribedCircleApp');
	infoField = document.getElementById('inscribedCircleApp-points');

    // gui
	show = {
		box: document.getElementById("showBox-inscribedCircleApp"),
		origin: document.getElementById("showOrigin-inscribedCircleApp"),
		axes: document.getElementById("showAxes-inscribedCircleApp"),
		grid: document.getElementById("showGrid-inscribedCircleApp"),
		vertices: document.getElementById("showVertices-inscribedCircleApp"),
        segments: document.getElementById("showSegments-inscribedCircleApp"),
        bisectors: document.getElementById("showBisectors-inscribedCircleApp"),
        center: document.getElementById("showCenter-inscribedCircleApp"),
        circle: document.getElementById("showCircle-inscribedCircleApp")
	};
	
	buttons = {
		random: document.getElementById("buttonRandom-inscribedCircleApp"),
		reset: document.getElementById("buttonReset-inscribedCircleApp"),
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
		
		let aC = new Point(425, 475);
        let bC = new Point(200, 200);
        let cC = new Point(475, 75);
		let segABC = new Segment(aC, bC);
		let segBCC = new Segment(bC, cC);
        let segACC = new Segment(aC, cC);

		let bisectAC = new Segment(aC, new Point(0,0));
		let bisectBC = new Segment(bC, new Point(0,0));
		let bisectCC = new Segment(cC, new Point(0,0));
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

			bisectorA: bisectAC,
			bisectorB: bisectBC,
			bisectorC: bisectCC,
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
            this.dataC.bisectorA.draw(this.graphics, THEMEPURPLE, EDGETHICKNESS-1);
            this.dataC.bisectorB.draw(this.graphics, THEMEPURPLE, EDGETHICKNESS-1);
            this.dataC.bisectorC.draw(this.graphics, THEMEPURPLE, EDGETHICKNESS-1);
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

		// this is the most efficient method I could think of...
		let bisectAVec = Geometry1.angleBisector(this.dataC.triangleA, this.dataC.triangleB, this.dataC.triangleC);
		bisectAVec.multiplyBy(1/1000); // otherwise we end up with MASSIVE vectors...
		this.dataC.bisectorA.head.coords = this.dataC.bisectorA.tail.coords;
		this.dataC.bisectorA.head.addToVec(bisectAVec);
		this.dataC.bisectorA.head.coords = this.dataC.bisectorA.nearestEdgePoint(this.canvas, false);

		let bisectBVec = Geometry1.angleBisector(this.dataC.triangleB, this.dataC.triangleA, this.dataC.triangleC);
		bisectBVec.multiplyBy(1/1000); // otherwise we end up with MASSIVE vectors...
		this.dataC.bisectorB.head.coords = this.dataC.bisectorB.tail.coords;
		this.dataC.bisectorB.head.addToVec(bisectBVec);
		this.dataC.bisectorB.head.coords = this.dataC.bisectorB.nearestEdgePoint(this.canvas, false);

		let bisectIntersect = Geometry1.lineSegIntersection(this.dataC.triangleA, this.dataC.bisectorA.head, this.dataC.triangleB, this.dataC.bisectorB.head);
		this.dataC.center.coords = bisectIntersect.X;
		this.dataC.bisectorA.head.coords = bisectIntersect.X;
		this.dataC.bisectorB.head.coords = bisectIntersect.X;
		this.dataC.bisectorC.head.coords = bisectIntersect.X;

		this.dataC.radius = Geometry1.inradius(this.dataC.triangleA, this.dataC.triangleB, this.dataC.triangleC);
        
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
			this.dataC.triangleA.set(425, 475);
			this.dataC.triangleB.set(200, 200);
			this.dataC.triangleC.set(475, 75);
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