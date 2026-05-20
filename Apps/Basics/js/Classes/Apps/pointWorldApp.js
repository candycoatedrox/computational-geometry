class PointWorldApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-pointWorldApp');
	infoField = document.getElementById('pointWorldApp-points');

    // gui
	show = {
		box: document.getElementById("showBox-pointWorldApp"),
		origin: document.getElementById("showOrigin-pointWorldApp"),
		axes: document.getElementById("showAxes-pointWorldApp"),
		grid: document.getElementById("showGrid-pointWorldApp"),
		point: document.getElementById("showPoint-pointWorldApp")
	};
	
	buttons = {
		topLeft: document.getElementById("buttonTopLeft-pointWorldApp"),
		random: document.getElementById("buttonRandom-pointWorldApp"),
		reset: document.getElementById("buttonReset-pointWorldApp")
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

		let pointC = new Point(0,0);
		pointC.coords = originC.coords;
		pointC.addTo(50,-50);

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,
			point: pointC
		};

		let boxPtsC = boxC.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
        
		let boxW = new Box(500,500);
		boxW.setPoints(boxPtsW);
		let rangeW = new Range(new MinMaxRange(0,1),new MinMaxRange(0,1)); 
		rangeW.set(boxPtsW[0].x,boxPtsW[1].x,boxPtsW[3].y,boxPtsW[0].y);		
		
		let originW = new Origin(0,0);
		let axesW = new Axes(1,1);

        let pointCoordsW = ConvertPoint.canvasToWorldCoords(pointC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
        let pointW = new Point(pointCoordsW.x, pointCoordsW.y);
		
		this.dataW = {
			box: boxW,
			origin: originW,
			axes: axesW,
			range: rangeW,
            point: pointW
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
		
		if (this.show.point.checked) { 
			this.dataC.point.draw(this.graphics);
		}
	}

	// info
	updateInfo() {
		const rangeXMinMax = this.dataC.range.xRange;
		const rangeYMinMax = this.dataC.range.yRange;
		const rangeXC = new Point(rangeXMinMax.min, rangeXMinMax.max);
		const rangeYC = new Point(rangeYMinMax.min, rangeYMinMax.max);
		
		const ptsC = this.dataC.box.pts.concat(this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis, rangeXC, rangeYC, this.dataC.point);
		
		const boxPtsC = this.dataC.box.pts;
		const boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		
		const rangePtsW = ConvertPoints.canvasToWorldCoords([rangeXC,rangeYC], this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis)
		
		const ptsW = boxPtsW.concat(this.dataW.origin, this.dataW.axes.xAxis, this.dataW.axes.yAxis, rangePtsW[0], rangePtsW[1], this.dataW.point); 
		
		const labs = ['boxTopL','boxTopR','boxBotR','boxBotL','origin','xAxis', 'yAxis','rangeX', 'rangeY', 'point'];
        
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
		this.dataC.point.snapToCanvas(this.canvas);
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
        this.dataW.point.coords = ConvertPoint.canvasToWorldCoords(this.dataC.point, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);

		this.scene();
		this.updateInfo();
	}
	
	// set up gui
	// checkboxes
	setupShowEvents() {
		this.show.origin.addEventListener("change", () => this.refresh());
		this.show.point.addEventListener("change", () => this.refresh());
	}
	// buttons
	setupButtonEvents() {
		this.buttons.topLeft.addEventListener("click", () => {
			this.graphics = initCanvasGraphics(this.canvas);
			this.dataC.point.set(0,0);
			this.computeAndRefresh();
		});
		
		this.buttons.random.addEventListener("click", () => {
			this.graphics = initCanvasGraphics(this.canvas);
			this.dataC.point.coords = Utils.makeRandomPoint(this.canvas);
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
			this.graphics = initCanvasGraphics(this.canvas);
			this.dataC.point.coords = this.dataC.origin.coords;
			this.dataC.point.addTo(50,-50);
			this.computeAndRefresh();
		});
	}
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.addEventListener('mousedown', e => {
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
			this.dataC.point.set(mx,my); 

			this.graphics = initCanvasGraphics(this.canvas);
			this.computeAndRefresh();
			this.locatorId = 0;
		});
	
		// MOUSE MOVE	
		this.canvas.addEventListener('mousemove', e => {
			if (this.locatorId === null) return;
			const canvasBounds=this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
			this.dataC.point.set(mx,my);  

			this.graphics = initCanvasGraphics(this.canvas);
			this.computeAndRefresh();
		});
	
		// MOUSE UP	
		this.canvas.addEventListener('mouseup', () => { this.locatorId = null; });
	}
}