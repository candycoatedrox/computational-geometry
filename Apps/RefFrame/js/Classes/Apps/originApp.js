class OriginApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-originApp');
	infoField = document.getElementById('originApp-points');
	// constants: data
	originW = new Origin(0,0);
	
	
	// data
	dataC = null;
	dataW = null;
	
	// gui
	show = null;
	buttons = null;
	locatorId = null;
	
	// view
	graphics = null;
	
	constructor (){
		// init data
		// this.origin = new Origin(0,0);
		// this.origin.fromCanvas(this.canvas);
		
		// this.originW = new Origin(0,0);
		
		this.originC = new Origin(0,0);
		this.originC.fromCanvas(this.canvas);

		this.dataC = {
			origin: this.originC
		};
		// console.log("1. dataC.origin = " + JSON.stringify(this.dataC.origin));
		
		this.dataW = {
			origin: this.originW
		};

		// Show options
		this.show = {
			origin: document.getElementById("showOrigin-originApp")
		};
		this.setupShowEvents();
		
		// Buttons
		this.buttons = {
			reset: document.getElementById("buttonReset-originApp"),
			topLeft: document.getElementById("buttonTopLeft-originApp")
		};
		this.setupButtonEvents();

		// Mouse events
		this.locatorId = null;
		this.setupMouseEvents();
		
		// Init canvas / graphics
		this.graphics = initCanvasGraphics(this.canvas);	
		this.scene();
		
		// Init/Update info field
		this.updateInfo();
	}
	
	// computations
	// ... none yet in this case of this miniapp - TODO: dataW recalculations for display in the info panel

	// view
	// graphics
	scene() {		
		if (this.show.origin.checked ) { 
			this.dataC.origin.draw(this.graphics);
		}
	}
	
	// info
	
	// plain
	// updateInfo(){
	// 	const allPts = [this.dataC.origin];		// canvas
	// 	const labs = ['origin'];
	// 	this.infoField.innerHTML = Utils.pointsLabelsToString(this.infoField, allPts,labs);
	// }
	
	// with the standard World coordinates for the origin
	updateInfo(){
		const ptsC = [this.dataC.origin];
		const ptsW = [this.dataW.origin];
		const labs = ['origin'];
		const res = Utils.pointsCoordsCWLabsToTableString(ptsC, ptsW, labs);
		
		this.infoField.innerHTML = res;	
	}
	
	// actions for gui, affecting the view
	// without dataC/W recalculation
	refresh(){
		this.graphics = initCanvasGraphics(this.canvas);	
		this.scene();
		this.updateInfo();
	}
	// with dataC/W recalculations
	computeAndRefresh(){
		this.graphics = initCanvasGraphics(this.canvas);	
		// this.dataC.origin.fromCanvas(this.canvas);
		this.scene();
		this.updateInfo();
	}
	
	// set up gui
	// checkboxes
	setupShowEvents(){
		this.show.origin.addEventListener("change", () => this.refresh());
	}
	// buttons
	setupButtonEvents(){
		this.buttons.topLeft.addEventListener("click", () => { 
				this.graphics = initCanvasGraphics(this.canvas);
				this.dataC.origin.set(0,0);
				this.scene();
				this.updateInfo();
		});
				
		this.buttons.reset.addEventListener("click", () => {
	   			this.graphics = initCanvasGraphics(this.canvas);
	   			this.dataC.origin.fromCanvas(this.canvas);
	   			this.scene();
	   			this.updateInfo();
		});
	}
	// mouse
	setupMouseEvents(){
			//																						....... DOWN
			this.canvas.addEventListener('mousedown', e => {
				const canvasBounds = this.canvas.getBoundingClientRect();
				const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
				this.dataC.origin.set(mx,my); 

				this.graphics = initCanvasGraphics(this.canvas);
				this.scene();
				this.updateInfo();
				this.locatorId = 0;
			});
		
			//																						....... MOVE	
			this.canvas.addEventListener('mousemove', e => {
				if (this.locatorId === null) return;
				const canvasBounds=this.canvas.getBoundingClientRect();
				const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
				this.dataC.origin.set(mx,my);  

				this.graphics = initCanvasGraphics(this.canvas);
				this.scene();
				this.updateInfo();
			});
		
			//																						....... UP	
			this.canvas.addEventListener('mouseup', ()=>{ this.locatorId = null; });
	}
		
}