class EdgeApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-edgeApp');
	infoField = document.getElementById('edgeApp-points');

    // gui
	show = {
		box: document.getElementById("showBox-edgeApp"),
		origin: document.getElementById("showOrigin-edgeApp"),
		axes: document.getElementById("showAxes-edgeApp"),
		grid: document.getElementById("showGrid-edgeApp"),
		points: document.getElementById("showPoints-edgeApp"),
        edge: document.getElementById("showEdge-edgeApp")
	};
	
	buttons = {
		randomHead: document.getElementById("buttonHead-edgeApp"),
		randomTail: document.getElementById("buttonTail-edgeApp"),
		fullRandom: document.getElementById("buttonRandom-edgeApp"),
		reset: document.getElementById("buttonReset-edgeApp"),
	};

	types = {
		segment: document.getElementById("typeSegment-edgeApp"),
		oriented: document.getElementById("typeOriented-edgeApp"),
		ray: document.getElementById("typeRay-edgeApp"),
		line: document.getElementById("typeLine-edgeApp"),
	};

	edgeType = "segment";
	
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
		
		let ptsActive = 0;
		let headC = new Point(0,0);
		let tailC = new Point(0,0);
		let segmentC = new Segment(tailC, headC);
		let orientedC = new OrientedSegment(tailC, headC);
		let rayC = new Ray(tailC, headC);
		let lineC = new Line(tailC, headC);

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

			ptsActive: ptsActive,
			head: headC,
			tail: tailC,
			segment: segmentC,
			oriented: orientedC,
			ray: rayC,
			line: lineC
		};

		let boxPtsC = boxC.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
        
		let boxW = new Box(500,500);
		boxW.setPoints(boxPtsW);
		let rangeW = new Range(new MinMaxRange(0,1),new MinMaxRange(0,1)); 
		rangeW.set(boxPtsW[0].x,boxPtsW[1].x,boxPtsW[3].y,boxPtsW[0].y);		
		
		let originW = new Origin(0,0);
		let axesW = new Axes(1,1);

        let headW = new Point(0,0);
		let tailW = new Point(0,0);
		let segmentW = new Segment(tailW, headW);
		let orientedW = new OrientedSegment(tailW, headW);
		let rayW = new Ray(tailW, headW);
		let lineW = new Line(tailW, headW);
		
		this.dataW = {
			box: boxW,
			origin: originW,
			axes: axesW,
			range: rangeW,

			head: headW,
			tail: tailW,
			segment: segmentW,
			oriented: orientedW,
			ray: rayW,
			line: lineW
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

		if (this.show.edge.checked && this.dataC.ptsActive === 2) {
			switch (this.edgeType) {
				case "segment":
					this.dataC.segment.draw(this.graphics);
					break;
				case "oriented":
					this.dataC.oriented.draw(this.graphics);
					break;
				case "ray":
					this.dataC.ray.draw(this.graphics);
					break;
				case "line":
					this.dataC.line.draw(this.graphics);
					break;
			}
		}
		
		if (this.show.points.checked) {
			if (this.dataC.ptsActive >= 1) this.dataC.head.draw(this.graphics, "head");
			if (this.dataC.ptsActive === 2) this.dataC.tail.draw(this.graphics, "tail");
		}
	}

	// info
	updateInfo() {

		/*
		let debugPtsW = "ptsW:";
		for (let i = 0; i < ptsW.length; i++) {
			debugPtsW += " " + JSON.stringify(ptsW[i]);
		}
		console.log(debugPtsW);*/

		let ptsC = [this.dataC.box.pts[2]];
		let ptsW = [this.dataW.box.pts[2]];
		let labs = ["boxEdge"];
		if (this.dataC.ptsActive >= 1) {
			ptsC.push(this.dataC.head);
			ptsW.push(this.dataW.head);
			labs.push("head");
		}
		if (this.dataC.ptsActive === 2) {
			ptsC.push(this.dataC.tail);
			ptsW.push(this.dataW.tail);
			labs.push("tail");

			switch (this.edgeType) {
				case "line":
					ptsC.push(this.dataC.line.trueTail);
					ptsW.push(this.dataW.line.trueTail);
					labs.push("trueTail");
				case "ray":
					ptsC.push(this.dataC.ray.trueHead);
					ptsW.push(this.dataW.ray.trueHead);
					labs.push("trueHead");
			}
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
		this.dataC.head.snapToCanvas(this.canvas);
		this.dataC.tail.snapToCanvas(this.canvas);
		this.dataC.ray.fromCanvas(this.canvas);
		this.dataC.line.fromCanvas(this.canvas);
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
	
		this.dataW.head.coords = ConvertPoint.canvasToWorldCoords(this.dataC.head, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.tail.coords = ConvertPoint.canvasToWorldCoords(this.dataC.tail, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);

		this.dataW.ray.trueHead.coords = ConvertPoint.canvasToWorldCoords(this.dataC.ray.trueHead, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.line.trueHead.coords = ConvertPoint.canvasToWorldCoords(this.dataC.line.trueHead, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.line.trueTail.coords = ConvertPoint.canvasToWorldCoords(this.dataC.line.trueTail, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);

		this.scene();
		this.updateInfo();
	}

	createPoint(xC, yC) {
		const ptW = ConvertPoint.canvasToWorldCoords({x:xC, y:yC}, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);

		if (this.dataC.ptsActive === 0) {
			this.dataC.ptsActive++;
			this.dataC.head.set(xC, yC);
			this.dataW.head.coords = ptW;
		} else if (this.dataC.ptsActive === 1) {
			this.dataC.ptsActive++;
			this.dataC.tail.set(xC, yC);
			this.dataW.tail.coords = ptW;
		}
	}
	
	// set up gui
	// checkboxes
	setupShowEvents() {
		this.show.box.addEventListener("change", () => this.refresh());
		this.show.origin.addEventListener("change", () => this.refresh());
		this.show.axes.addEventListener("change", () => this.refresh());
		this.show.grid.addEventListener("change", () => this.refresh());
		this.show.points.addEventListener("change", () => this.refresh());
		this.show.edge.addEventListener("change", () => this.refresh());
	}
    // buttons
    setupButtonEvents() {
		this.types.segment.addEventListener("input", () => {
			this.edgeType = "segment";
			this.computeAndRefresh();
		});

		this.types.oriented.addEventListener("input", () => {
			this.edgeType = "oriented";
			this.computeAndRefresh();
		});

		this.types.ray.addEventListener("input", () => {
			this.edgeType = "ray";
			this.computeAndRefresh();
		});

		this.types.line.addEventListener("input", () => {
			this.edgeType = "line";
			this.computeAndRefresh();
		});

		
		this.buttons.randomHead.addEventListener("click", () => {
			if (this.dataC.ptsActive === 0) {
				this.dataC.ptsActive = 1;
			}
			this.dataC.head.coords = Utils.makeRandomPoint(this.canvas);
			this.computeAndRefresh();
		});
		
		this.buttons.randomTail.addEventListener("click", () => {
			if (this.dataC.ptsActive === 0) {
				this.dataC.head.coords = this.dataC.origin;
			}
			this.dataC.ptsActive = 2;
			this.dataC.tail.coords = Utils.makeRandomPoint(this.canvas);
			this.computeAndRefresh();
		});
		
		this.buttons.fullRandom.addEventListener("click", () => {
			this.dataC.ptsActive = 2;
			const pts = Utils.makeRandomPoints(this.canvas, 2);
			this.dataC.head.coords = pts[0];
			this.dataC.tail.coords = pts[1];
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
			this.dataC.ptsActive = 0;
			this.computeAndRefresh();
		});
    }
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.addEventListener('mousedown', e => {
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;

			let activePts = [];
			if (this.dataC.ptsActive >= 1) activePts.push(this.dataC.head);
			if (this.dataC.ptsActive === 2) activePts.push(this.dataC.tail);
			
			// TODO: only allow up to 2 points!!!


			// find id of existing nearby point
			this.locatorId = null;
			activePts.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) this.locatorId = i; });
						
			if (e.detail === 1) // it was a single click
			{
				if (this.locatorId === null && activePts.length < 2) // not near an existing point: insert a new point and label
				{
					this.locatorId = activePts.length;
					this.createPoint(mx, my);
				} 
				// else, do nothing now - but check the mouse-move-event on the clicked-on point	
			} 
			else if (e.detail === 2) // it was a double click
			{				
				// if on an existing point, delete the point, else ignore the double click
				if (activePts.length >= 1) {
					if (this.locatorId === 0 && activePts.length === 2) { // delete head
						this.dataC.head.coords = this.dataC.tail;
					}
					
					this.dataC.ptsActive--;
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
			switch (this.locatorId) {
				case 0:
					this.dataC.head.set(mx,my);
					break;
				case 1:
					this.dataC.tail.set(mx,my);
			}
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', () => { this.locatorId = null; });
	}

}