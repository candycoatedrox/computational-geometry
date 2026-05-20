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
		addTopLeft: document.getElementById("buttonAddTopLeft-edgeApp"),
		addRandom: document.getElementById("buttonAddRandom-edgeApp"),
		generate: document.getElementById("buttonRandom-edgeApp"),
		reset: document.getElementById("buttonReset-edgeApp")
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

		let pointsC = new Points();

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,
			points: pointsC
		};

		let boxPtsC = boxC.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
        
		let boxW = new Box(500,500);
		boxW.setPoints(boxPtsW);
		let rangeW = new Range(new MinMaxRange(0,1),new MinMaxRange(0,1)); 
		rangeW.set(boxPtsW[0].x,boxPtsW[1].x,boxPtsW[3].y,boxPtsW[0].y);		
		
		let originW = new Origin(0,0);
		let axesW = new Axes(1,1);

        let pointsW = new Points();
		
		this.dataW = {
			box: boxW,
			origin: originW,
			axes: axesW,
			range: rangeW,
            points: pointsW
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
		
		if (this.show.points.checked) { 
			this.dataC.points.draw(this.graphics, this.dataC.labels);
		}
	}

	// info
	updateInfo() {
        
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
		this.dataC.points.snapToCanvas(this.canvas);
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
        this.dataW.points.setAll(ConvertPoints.canvasToWorldCoords(this.dataC.points, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis));

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
		this.show.edge.addEventListener("change", () => this.refresh());
	}
    // buttons
    setupButtonEvents() {

    }
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.addEventListener('mousedown', e => {
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
			
			// find id of existing nearby point
			this.locatorId = null;
			this.dataC.points.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) this.locatorId = i; });
						
			if (e.detail === 1) // it was a single click
			{
				if (this.locatorId === null) // not near an existing point: insert a new point and label
				{
					this.locatorId = this.dataC.points.length;
					this.createPoint(mx, my);
                    this.updateLabels();
				} 
				// else, do nothing now - but check the mouse-move-event on the clicked-on point	
			} 
			else if (e.detail === 2) // it was a double click
			{				
				// if on an existing point, delete the point, else ignore the double click
				if (this.dataC.points.length >= 1) { 
					this.dataC.points.splice(this.locatorId,1); 				// delete the point
					this.dataW.points.splice(this.locatorId,1);
                    this.updateLabels();	// relabel all points
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
			this.dataC.points[this.locatorId].coords = {x:mx,y:my};
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', () => { this.locatorId = null; });
	}

}