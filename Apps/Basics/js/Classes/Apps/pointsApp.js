class PointsApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-pointsApp');
	infoField = document.getElementById('pointsApp-points');

    // gui
	show = {
		origin: document.getElementById("showOrigin-pointsApp"),
		points: document.getElementById("showPoints-pointsApp")
	};
	
	buttons = {
		addTopLeft: document.getElementById("buttonAddTopLeft-pointsApp"),
		addRandom: document.getElementById("buttonAddRandom-pointsApp"),
		fullRandom: document.getElementById("buttonRandom-pointsApp"),
		reset: document.getElementById("buttonReset-pointsApp")
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
		let pointsC = new Points();

		this.dataC = {
			origin: originC,
			points: pointsC
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
		
		if (this.show.points.checked) { 
			this.dataC.points.draw(this.graphics);
		}
	}

	// info
	updateInfo() {
        const ptsC = this.dataC.points;
        let ptsW = [];
        let labs = [];
        for (let i = 0; i < ptsC.length; i++) {
            ptsW.push('-');
            labs.push('point '+(i+1));
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

		this.dataC.origin.fromCanvas(this.canvas);
		this.dataC.points.snapToCanvas(this.canvas);

		this.scene();
		this.updateInfo();
	}
	
	// set up gui
	// checkboxes
	setupShowEvents() {
		this.show.origin.addEventListener("change", () => this.refresh());
		this.show.points.addEventListener("change", () => this.refresh());
	}
	// buttons
	setupButtonEvents() {
		this.buttons.addTopLeft.addEventListener("click", () => {
            this.graphics = initCanvasGraphics(this.canvas);
			this.dataC.points.push(new Point(0,0));
			this.scene();
			this.updateInfo();
		});
		
		this.buttons.addRandom.addEventListener("click", () => {
            this.graphics = initCanvasGraphics(this.canvas);
            let pt = Utils.makeRandomPoint(this.canvas);
            this.dataC.points.push(new Point(pt.x, pt.y));
			this.scene();
			this.updateInfo();
		});
		
		this.buttons.fullRandom.addEventListener("click", () => {
            this.graphics = initCanvasGraphics(this.canvas);
            
            const nPts = Math.floor(Utils.rand(1,6));
            const pts = Utils.makeRandomPoints(this.canvas, nPts);

            this.dataC.points.length = 0; // clear existing points
            for (let i = 0; i < nPts; i++) {
                this.dataC.points.push(new Point(pts[i].x, pts[i].y));
            }

			this.scene();
			this.updateInfo();
		});

		this.buttons.reset.addEventListener("click", () => {
            this.graphics = initCanvasGraphics(this.canvas);
			this.dataC.points.length = 0;
			this.scene();
			this.updateInfo();
		});
	}
	// mouse
	setupMouseEvents() {
		
	}
}