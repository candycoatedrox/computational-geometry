class LineSegIntersectionApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-lineSegIntersectApp');
	infoField = document.getElementById('lineSegIntersectApp-points');

    // gui
	show = {
		box: document.getElementById("showBox-lineSegIntersectApp"),
		origin: document.getElementById("showOrigin-lineSegIntersectApp"),
		axes: document.getElementById("showAxes-lineSegIntersectApp"),
		grid: document.getElementById("showGrid-lineSegIntersectApp"),
		points: document.getElementById("showPoints-lineSegIntersectApp"),
        segments: document.getElementById("showSegments-lineSegIntersectApp"),
        intersection: document.getElementById("showIntersect-lineSegIntersectApp")
	};
	
	buttons = {
		intersection: document.getElementById("buttonIntersect-lineSegIntersectApp"),
		separate: document.getElementById("buttonSeparate-lineSegIntersectApp"),
		random: document.getElementById("buttonRandom-lineSegIntersectApp"),
		reset: document.getElementById("buttonReset-lineSegIntersectApp"),
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
		
        // find a nice set of points that intersect via trial and error to set them to initially
		let aC = new Point(125, 240);
        let bC = new Point(375, 400);
        let cC = new Point(100, 360);
        let dC = new Point(550, 250);
		let segABC = new Segment(aC, bC);
		let segCDC = new Segment(cC, dC);

        let intersectionC = new Point(0,0);
        let segIntersect = Geometry1.lineSegIntersection(aC, bC, cC, dC);
        intersectionC.coords = segIntersect.X;

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

			pointA: aC,
            pointB: bC,
            pointC: cC,
            pointD: dC,
            segmentAB: segABC,
            segmentCD: segCDC,
            intersection: intersectionC
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
        let dW = new Point(0,0);
        let intersectionW = new Point(0,0);
		
		this.dataW = {
			box: boxW,
			origin: originW,
			axes: axesW,
			range: rangeW,

			pointA: aW,
            pointB: bW,
            pointC: cW,
            pointD: dW,
            intersection: intersectionW
		};
		
		// gui: set up actions
		this.setupShowEvents();
		this.setupButtonEvents();
		this.setupMouseEvents();

		// Init canvas / graphics
		this.graphics = initCanvasGraphics(this.canvas);
		this.scene();

		// Init/Update info field
		this.updateInfo();
    }
	
	// computations
    get intersects() {
        return !(this.dataC.intersection.x === -10 && this.dataC.intersection.y === -10);
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

        let segColor = this.intersects ? POSITIVECOLOR : NEGATIVECOLOR;

		if (this.show.segments.checked) {
			this.dataC.segmentAB.draw(this.graphics, segColor);
			this.dataC.segmentCD.draw(this.graphics, segColor);
		}
		
		if (this.show.points.checked) {
			this.dataC.pointA.draw(this.graphics, "A", segColor);
			this.dataC.pointB.draw(this.graphics, "B", segColor);
			this.dataC.pointC.draw(this.graphics, "C", segColor);
			this.dataC.pointD.draw(this.graphics, "D", segColor);
		}

        if (this.show.intersection.checked && this.intersects) {
			this.dataC.intersection.draw(this.graphics, "X", INTERSECTIONCOLOR);
        }
	}

	// info
	updateInfo() {
		let ptsC = [this.dataC.pointA, this.dataC.pointB, this.dataC.pointC, this.dataC.pointD];
		let ptsW = [this.dataW.pointA, this.dataW.pointB, this.dataW.pointC, this.dataW.pointD];
		let labs = ["A","B","C","D"];
		if (this.intersects) {
			ptsC.push(this.dataC.intersection);
			ptsW.push(this.dataW.intersection);
			labs.push("intersection");
		}
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
		this.dataC.pointA.snapToCanvas(this.canvas);
		this.dataC.pointB.snapToCanvas(this.canvas);
		this.dataC.pointC.snapToCanvas(this.canvas);
		this.dataC.pointD.snapToCanvas(this.canvas);

        const segIntersect = Geometry1.lineSegIntersection(this.dataC.pointA, this.dataC.pointB, this.dataC.pointC, this.dataC.pointD);
        if (segIntersect === null) {
            this.dataC.intersection.set(-10,-10);
        } else {
            this.dataC.intersection.coords = segIntersect.X;
        }
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
	
		this.dataW.pointA.coords = ConvertPoint.canvasToWorldCoords(this.dataC.pointA, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.pointB.coords = ConvertPoint.canvasToWorldCoords(this.dataC.pointB, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.pointC.coords = ConvertPoint.canvasToWorldCoords(this.dataC.pointC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.pointD.coords = ConvertPoint.canvasToWorldCoords(this.dataC.pointD, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.intersection.coords = ConvertPoint.canvasToWorldCoords(this.dataC.intersection, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);

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
		this.show.points.addEventListener("change", () => this.refresh());
		this.show.segments.addEventListener("change", () => this.refresh());
		this.show.intersection.addEventListener("change", () => this.refresh());
	}
    // buttons
    setupButtonEvents() {
		this.buttons.intersection.addEventListener("click", () => {
			this.dataC.pointA.set(525, 100);
        	this.dataC.pointB.set(450, 275);
        	this.dataC.pointC.set(375, 200);
        	this.dataC.pointD.set(575, 150);
			this.computeAndRefresh();
		});
		
		this.buttons.separate.addEventListener("click", () => {
			this.dataC.pointA.set(350, 125);
        	this.dataC.pointB.set(450, 350);
        	this.dataC.pointC.set(425, 175);
        	this.dataC.pointD.set(550, 225);
			this.computeAndRefresh();
		});
		
		this.buttons.random.addEventListener("click", () => {
			const pts = Utils.makeRandomPoints(this.canvas, 4);
			this.dataC.pointA.coords = pts[0];
			this.dataC.pointB.coords = pts[1];
			this.dataC.pointC.coords = pts[2];
			this.dataC.pointD.coords = pts[3];
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
			this.dataC.pointA.set(125, 240);
        	this.dataC.pointB.set(375, 400);
        	this.dataC.pointC.set(100, 360);
        	this.dataC.pointD.set(550, 250);
			this.computeAndRefresh();
		});
    }
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.addEventListener('mousedown', e => {
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;

			let pts = [this.dataC.pointA, this.dataC.pointB, this.dataC.pointC, this.dataC.pointD];

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
			let pts = [this.dataC.pointA, this.dataC.pointB, this.dataC.pointC, this.dataC.pointD];
			pts[this.locatorId].set(mx,my);
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', () => { this.locatorId = null; });
	}
}