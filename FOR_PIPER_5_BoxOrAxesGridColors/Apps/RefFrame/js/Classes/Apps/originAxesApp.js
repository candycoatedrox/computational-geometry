class OriginAxesApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-originAxesApp');
	infoField = document.getElementById('originAxesApp-points');
	show = {
		origin: document.getElementById("showOrigin-originAxesApp"),
		axes: document.getElementById("showAxes-originAxesApp")
	};
	buttons = {
		reset: document.getElementById("buttonReset-originAxesApp"),
		topLeft: document.getElementById("buttonTopLeft-originAxesApp")
	};
	
	// originC = new Origin(0,0);
	// originW = new Origin(0,0);
	
	// data
	dataC = null;
	dataW = null;
	
	// gui
	locatorId = null;
	
	// view
	graphics = null;
	
	constructor (){
		// init data
		let originC = new Origin(0,0);
		originC.fromCanvas(this.canvas);
		let originW = new Origin(0,0);
		let axesC = new Axes(100,-100);
		let axesW = new Axes(1,1);

		this.dataC = {
			origin: originC,
			axes: axesC
		};
		this.dataW = {
			origin: originW,
			axes: axesW
		};
		
		// Show options
		this.setupShowEvents();
		
		// Buttons
		this.setupButtonEvents();

		// Mouse events
		// this.locatorId = null;
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
		// this.graphics = initCanvasGraphics(this.canvas);
		
		if (this.show.axes.checked ) { 
			this.dataC.axes.draw(this.graphics,this.dataC.origin, AXESCOLOR);
		}
		
		if (this.show.origin.checked ) {
			this.dataC.origin.draw(this.graphics);
		}
		

	}
	// info
	updateInfo(){
		const ptsC = [this.dataC.origin,this.dataC.axes.xAxis,this.dataC.axes.yAxis];
		const ptsW = [this.dataW.origin,this.dataW.axes.xAxis,this.dataW.axes.yAxis];
		const labs = ['origin','xAxis', 'yAxis'];
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
		this.dataC.origin.fromCanvas(this.canvas);
		this.scene();
		this.updateInfo();
	}
	
	// set up gui
	// checkboxes
	setupShowEvents(){
		this.show.origin.addEventListener("change", () => this.refresh());
		this.show.axes.addEventListener("change", () => this.refresh());
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