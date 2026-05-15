class BoxApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-boxApp');
	infoField = document.getElementById('boxApp-points');
	// show = {
	// 	box: document.getElementById("showBox-boxApp")
	// };
	// buttons = {
	// 	box500: document.getElementById("buttonBox500-boxApp"),
	// 	reset: document.getElementById("buttonReset-boxApp")
	// };
	
	
	// constants: data
	boxC = new Box(500,500);
	
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
		this.boxC = new Box(500,500);
		this.boxC.fromCanvas(this.canvas);

		this.dataC = {
			box: this.boxC
		};
		// console.log("1. dataC.origin = " + JSON.stringify(this.dataC.origin));
		
		// this would need the originC
		// this.dataW = {
		// 	origin: this.originW
		// };
		
		// Show options
		this.show = {
			box: document.getElementById("showBox-boxApp")
		};
		this.setupShowEvents();
		
		// Buttons
		this.buttons = {
			box500: document.getElementById("buttonBox500-boxApp"),
			reset: document.getElementById("buttonReset-boxApp")
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
		if (this.show.box.checked ) { 
			this.dataC.box.draw(this.graphics);
		}
	}
	// info
	updateInfo(){
		const labs = ['boxTopLeft','boxTopRight','boxBotRight','boxBotLeft'];
		this.infoField.innerHTML = Utils.pointsLabelsToString(this.infoField, this.dataC.box.pts,labs);		
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
		this.dataC.box.fromCanvas(this.canvas);
		this.scene();
		this.updateInfo();
	}
	
	// set up gui
	// checkboxes
	setupShowEvents(){
		this.show.box.addEventListener("change", () => this.refresh());
	}
	// buttons
	setupButtonEvents(){
		this.buttons.box500.addEventListener("click", () => { 
				this.graphics = initCanvasGraphics(this.canvas);
				this.dataC.box.set(500,500);
				this.scene();
				this.updateInfo();
		});
				
		this.buttons.reset.addEventListener("click", () => {
				this.graphics = initCanvasGraphics(this.canvas);
				this.dataC.box.fromCanvas(this.canvas);
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