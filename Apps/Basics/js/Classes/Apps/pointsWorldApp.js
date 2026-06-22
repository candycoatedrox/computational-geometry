class PointsWorldApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-pointsWorldApp');
	infoField = document.getElementById('pointsWorldApp-points');

    // gui
	show = {
		box: document.getElementById("showBox-pointsWorldApp"),
		origin: document.getElementById("showOrigin-pointsWorldApp"),
		axes: document.getElementById("showAxes-pointsWorldApp"),
		grid: document.getElementById("showGrid-pointsWorldApp"),
		points: document.getElementById("showPoints-pointsWorldApp")
	};
	
	buttons = {
		addTopLeft: document.getElementById("buttonAddTopLeft-pointsWorldApp"),
		addRandom: document.getElementById("buttonAddRandom-pointsWorldApp"),
		generate: document.getElementById("buttonRandom-pointsWorldApp"),
		reset: document.getElementById("buttonReset-pointsWorldApp")
	};

	nPtsSelect = document.getElementById("nGenerate-pointsWorldApp");
	
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
        let labels = [];

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,
			points: pointsC,
            labels: labels
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
		
		if (this.show.points.checked) { 
			this.dataC.points.draw(this.graphics, this.dataC.labels);
		}
	}

	// info
	updateInfo() {
		const rangeXMinMax = this.dataC.range.xRange;
		const rangeYMinMax = this.dataC.range.yRange;
		const rangeXC = new Point(rangeXMinMax.min, rangeXMinMax.max);
		const rangeYC = new Point(rangeYMinMax.min, rangeYMinMax.max);
		
		const refPtsC = this.dataC.box.pts.concat(this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis, rangeXC, rangeYC);
        const ptsC = refPtsC.concat(this.dataC.points);
		
		const boxPtsC = this.dataC.box.pts;
		const boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		
		const rangePtsW = ConvertPoints.canvasToWorldCoords([rangeXC,rangeYC], this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis)
		
		const refPtsW = boxPtsW.concat(this.dataW.origin, this.dataW.axes.xAxis, this.dataW.axes.yAxis, rangePtsW[0], rangePtsW[1]);
        const ptsW = refPtsW.concat(this.dataW.points);
		
		const refLabs = ['boxTopL','boxTopR','boxBotR','boxBotL','origin','xAxis', 'yAxis','rangeX', 'rangeY'];
        const labs = refLabs.concat(this.dataC.labels);

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
		this.dataC.points.snapToCanvas(this.canvas);
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
        this.dataW.points.setAll(ConvertPoints.canvasToWorldCoords(this.dataC.points, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis));

		this.scene();
		this.updateInfo();
	}

	createPoint(xC, yC) {
		const ptW = ConvertPoint.canvasToWorldCoords({x:xC, y:yC}, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataC.points.push(new Point(xC, yC));
		this.dataW.points.push(new Point(ptW.x, ptW.y));
	}
	clearPoints() {
		this.dataC.points.length = 0;
		this.dataW.points.length = 0;
	}
    updateLabels() {
        this.dataC.labels = Utils.stdRange1(this.dataC.points.length);
        this.dataC.labels = this.dataC.labels.map(n => { return 'p' + n; });
    }
	
	// set up gui
	// checkboxes
	setupShowEvents() {
		this.show.box.addEventListener("change", () => this.refresh());
		this.show.origin.addEventListener("change", () => this.refresh());
		this.show.axes.addEventListener("change", () => this.refresh());
		this.show.grid.addEventListener("change", () => this.refresh());
		this.show.points.addEventListener("change", () => this.refresh());
	}
	// buttons
	setupButtonEvents() {
		this.buttons.addTopLeft.addEventListener("click", () => {
			this.createPoint(0,0);
            this.updateLabels();
			this.computeAndRefresh();
		});
		
		this.buttons.addRandom.addEventListener("click", () => {
            let pt = Utils.makeRandomPoint(this.canvas);
			this.createPoint(pt.x, pt.y);
            this.updateLabels();
			this.computeAndRefresh();
		});
		
		this.buttons.generate.addEventListener("click", () => {
            const nPts = this.nPtsSelect.value;
            const pts = Utils.makeRandomPoints(this.canvas, nPts);

            this.clearPoints();
            for (let i = 0; i < nPts; i++) {
				this.createPoint(pts[i].x, pts[i].y);
            }

            this.updateLabels();
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
			this.clearPoints();
            this.updateLabels();
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
			this.dataC.points[this.locatorId].set(mx,my);
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', () => { this.locatorId = null; });
	}
}