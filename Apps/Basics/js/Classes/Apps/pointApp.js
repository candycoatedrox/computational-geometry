class PointApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-pointApp');
	infoField = document.getElementById('pointApp-points');

    // gui
	show = {
		origin: document.getElementById("showOrigin-pointApp"),
		point: document.getElementById("showPoint-pointApp")
	};
	
	buttons = {
		topLeft: document.getElementById("buttonTopLeft-pointApp"),
		random: document.getElementById("buttonRandom-pointApp"),
		reset: document.getElementById("buttonReset-pointApp")
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
		let originC = new Origin(0,0);
		originC.fromCanvas(this.canvas);
		let pointC = new Point(0,0);
		pointC.coords = originC.coords;
		pointC.addTo(50,-50);

		this.dataC = {
			origin: originC,
			point: pointC
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
		if (this.show.origin.checked) { 
			this.dataC.origin.draw(this.graphics);
		}
		
		if (this.show.point.checked) { 
			this.dataC.point.draw(this.graphics);
		}
	}

	// info
	updateInfo() {
		const ptsC = [this.dataC.point];
		const ptsW = ['-'];
		const labs = ['point'];
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

		this.dataC.origin.fromCanvas(this.canvas);
		this.dataC.point.snapToCanvas(this.canvas);

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
			this.scene();
			this.updateInfo();
		});
		
		this.buttons.random.addEventListener("click", () => {
			this.graphics = initCanvasGraphics(this.canvas);
			this.dataC.point.coords = Utils.makeRandomPoint(this.canvas);
			this.scene();
			this.updateInfo();
		});

		this.buttons.reset.addEventListener("click", () => {
			this.graphics = initCanvasGraphics(this.canvas);
			this.dataC.point.coords = this.dataC.origin.coords;
			this.dataC.point.addTo(50,-50);
			this.scene();
			this.updateInfo();
		});
	}
	// mouse
	setupMouseEvents() {

	}
}