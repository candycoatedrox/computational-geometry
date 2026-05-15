class MiniApp {
	// constants
	canvas = null; // actual canvas in the html file
	
	// data
	dataC = null; 	// data in canvas coordinates - for drawing and mouse interaction
	dataW = null;	// data in world coordinates - for calculations and I/O
	
	// gui
	show = null;
	buttons = null;
	locatorId = null;
	
	// view
	graphics = null;
	infoField = null;
	
	constructor (){
		
		// local calculations
		// init data
		this.origin = new Origin(0,0);
		this.origin.fromCanvas(this.canvas);
		
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
		// console.log("2. dataW.origin = " + JSON.stringify(this.dataW.origin));

		// temp for testing
		// this.origin = this.dataC.origin;
		
		// Show options
		this.show = {
			origin: document.getElementById("showOrigin-originApp")
		};
		this.setupShowEvents();
		
		// Buttons
		this.buttons = {
			// 
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

	scene() {
		// uses dataC and show
	}
	
	updateInfoField(){	
		// uses dataC, dataW	
	}
	
	// refresh (graphics and info) after mouse events, when no further computations are needed
	refresh(){
		// this.graphics.init(this.canvas);
		// this.scene();
		// this.updateInfoField();
	}
	
	// refresh (graphics and info) after mouse events, when further computations are needed
	computeAndRefresh(){
		// this.graphics = initCanvasGraphics(this.canvas);
		// this.dataC.init(this.canvas); // possible conversions dataC and dataW, etc.
		// this.scene();
		// this.updateInfoField();
	}
	
	setupShowCheckboxes(){
		// for each show checkbox:
		// this.show.origin.addEventListener("change", () => this.refresh());	
	}
	setupMouseEvents(){
		{
			//																						....... DOWN
			this.canvas.addEventListener('mousedown', e => {
				const canvasBounds = this.canvas.getBoundingClientRect();
				const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
				//
				// update points and data infered from them: add, delete, move points, edges etc.
				// basic example, set up origin: this.origin.set(mx,my);
				//
				this.refresh();
				this.locatorId = 0;
			});
		
			//																						....... MOVE	
			this.canvas.addEventListener('mousemove', e => {
				if (this.locatorId === null) return;
				const canvasBounds=this.canvas.getBoundingClientRect();
				const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
				//
				// update points and data infered from them: add, delete, move points, edges etc.
				// basic example, set up origin: this.origin.set(mx,my);
				//
				this.refresh();
			});
		
			//																						....... UP	
			this.canvas.addEventListener('mouseup', e => { 
				//
				// possible calculations etc.
				//
				this.locatorId = null; 
			});
		}
	}
		
}