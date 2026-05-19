class BoxAxesGridApp {
	// constants: global names of i/o fields 
	canvas = document.getElementById('canvas-boxAxesGridApp');
	infoField = document.getElementById('boxAxesGridApp-points');
	
	// gui	
	show = {
		box: document.getElementById("showBox-boxAxesGridApp"),
		origin: document.getElementById("showOrigin-boxAxesGridApp"),
		axes: document.getElementById("showAxes-boxAxesGridApp"),
		grid: document.getElementById("showGrid-boxAxesGridApp")
	};
	
	buttons = {
		box500: document.getElementById("buttonBox500-boxAxesGridApp"),
		reset: document.getElementById("buttonReset-boxAxesGridApp")
	};
	
	
	// data
	dataC = null;
	dataW = null;
	
	// mouse
	locatorId = null;
	
	// view
	graphics = null;
	
	constructor (){
		// init data
		let boxC = new Box(500,500);
		boxC.fromCanvas(this.canvas);
		// console.log("boxC = "+ JSON.stringify(boxC));
		// alert("boxC = "+ JSON.stringify(boxC));
		
		let rangeC = new Range(new MinMaxRange(0,500),new MinMaxRange(0,500));
		rangeC.fromCanvas(this.canvas);
		let originC = new Origin(0,0);
		originC.fromCanvas(this.canvas);
		let axesC = new Axes(100,-100);

		this.dataC = {
			box: boxC,
			origin: originC,
			axes: axesC,
			range: rangeC
		};		
		
		let boxPtsC = boxC.pts;	
		// console.log("boxPtsC = "+ JSON.stringify(boxPtsC));
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		// console.log("boxPtsW = "+ JSON.stringify(boxPtsW));
		
		let boxW = new Box(500,500);
		boxW.setPoints(boxPtsW);
		// console.log("boxW = "+ JSON.stringify(boxW));
		
		// STUB - TODO and showin info
		let rangeW = new Range(new MinMaxRange(0,1),new MinMaxRange(0,1)); 
		rangeW.set(boxPtsW[0].x,boxPtsW[1].x,boxPtsW[3].y,boxPtsW[0].y);		
		
		let originW = new Origin(0,0);
		let axesW = new Axes(1,1);
		
		this.dataW = {
			box: boxW,
			origin: originW,
			axes: axesW,
			range: rangeW
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
	// ... none yet in this case of this miniapp - TODO: dataW recalculations for display in the info panel

	// view
	// graphics
	scene() {

		// console.log("... In boxAxesGridApp.scene: this.dataC.range =" + JSON.stringify(this.dataC.range));
		
		if (this.show.grid.checked ) {
			this.dataC.range.drawGrid(this.graphics, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		}
		
		if (this.show.box.checked ) { 
			this.dataC.box.draw(this.graphics);
		}
		
		if (this.show.axes.checked ) { 
			this.dataC.axes.draw(this.graphics,this.dataC.origin);
		}
		
		if (this.show.origin.checked ) { 
			this.dataC.origin.draw(this.graphics);
		}
	}
	// info
	// updateInfo(){
	// 	const ptsC = this.dataC.box.pts.concat(this.dataC.origin,this.dataC.axes.xAxis,this.dataC.axes.yAxis);
	// 	const ptsW = ConvertPoints.canvasToWorldCoords(ptsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis); // STUB
	// 	const labs = ['boxTopL','boxTopR','boxBotR','boxBotL','origin','xAxis', 'yAxis'];
	// 	const res = Utils.pointsCoordsCWLabsToTableString(ptsC, ptsW, labs);
	//
	// 	this.infoField.innerHTML = res;
	// }
	
	updateInfo(){
		const rangeXMinMax = this.dataC.range.xRange;
		const rangeYMinMax = this.dataC.range.yRange;
		const rangeXC = new Point(rangeXMinMax.min, rangeXMinMax.max);
		const rangeYC = new Point(rangeYMinMax.min, rangeYMinMax.max);
		console.log("rangeXC =" + JSON.stringify(rangeXC));
		console.log("rangeYC =" + JSON.stringify(rangeYC));
		
		const ptsC = this.dataC.box.pts.concat(this.dataC.origin,this.dataC.axes.xAxis,this.dataC.axes.yAxis, rangeXC,rangeYC);
		
		const boxPtsC = this.dataC.box.pts;
		// const boxPtsW = this.dataW.box.pts;
		const boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		
		const rangePtsW = ConvertPoints.canvasToWorldCoords([rangeXC,rangeYC], this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis)
		
		let ptsW = boxPtsW.concat(this.dataW.origin, this.dataW.axes.xAxis, this.dataW.axes.yAxis, rangePtsW[0], rangePtsW[1]); 
		
		const labs = ['boxTopL','boxTopR','boxBotR','boxBotL','origin','xAxis', 'yAxis','rangeX', 'rangeY'];
		
		console.log("ptsC =" + JSON.stringify(ptsC));
		console.log("ptsW =" + JSON.stringify(ptsW));
		console.log("labs =" + JSON.stringify(labs));
		
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
		this.dataC.box.fromCanvas(this.canvas);
		this.dataC.origin.fromCanvas(this.canvas);
		this.dataC.range.fromCanvas(this.canvas);
		// console.log("In computeAndRefresh. dataC.range = " + JSON.stringify(this.dataC.range));
		// alert("In computeAndRefresh. dataC.range = " + JSON.stringify(this.dataC.range));
		
		let boxPtsC = this.dataC.box.pts;	
		alert("boxPtsC = "+ JSON.stringify(boxPtsC));
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		alert("boxPtsW = "+ JSON.stringify(boxPtsW));
		
		// let boxW = new Box(500,500);
		this.dataW.box.setPoints(boxPtsW); // STUB
		this.dataW.range.set(boxPtsW[0].x,boxPtsW[1].x,boxPtsW[3].y,boxPtsW[0].y);
		
		alert("In computeAndRefresh. dataW.box = " + JSON.stringify(this.dataW.box));
		
		this.dataW.range.set(this.canvas);
		alert("In computeAndRefresh. dataW.range = " + JSON.stringify(this.dataW.range));

		this.scene();
		this.updateInfo();
	}
	
	// set up gui
	// checkboxes
	setupShowEvents(){
		this.show.box.addEventListener("change", () => this.refresh());
		this.show.origin.addEventListener("change", () => this.refresh());
		this.show.axes.addEventListener("change", () => this.refresh());
		this.show.grid.addEventListener("change", () => this.refresh());
	}
	// buttons
	setupButtonEvents(){
		this.buttons.box500.addEventListener("click", () => { 
				this.graphics = initCanvasGraphics(this.canvas);
				this.dataC.box.set(500,500);
				this.dataC.origin.set(250,250);
				this.scene();
				this.updateInfo();
		});
				
		this.buttons.reset.addEventListener("click", () => {
				this.graphics = initCanvasGraphics(this.canvas);
				this.dataC.box.fromCanvas(this.canvas);
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
				// TODO
				// Update range for new origin point
			});
		
			//																						....... MOVE	
			this.canvas.addEventListener('mousemove', e => {
				if (this.locatorId === null) return;
				const canvasBounds=this.canvas.getBoundingClientRect();
				const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
				this.dataC.origin.set(mx,my);  

				this.graphics = initCanvasGraphics(this.canvas);
				this.scene();
				// TODO
				// Update range for new origin point
				this.updateInfo();
			});
		
			//																						....... UP	
			this.canvas.addEventListener('mouseup', ()=>{ this.locatorId = null; });
	}
		
}