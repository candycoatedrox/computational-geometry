class EscribedCirclesApp {
    // constants: global names of i/o fields 
	canvas = document.getElementById('canvas-excirclesApp');
	infoField = document.getElementById('excirclesApp-points');

    // gui
	show = {
		box: document.getElementById("showBox-excirclesApp"),
		origin: document.getElementById("showOrigin-excirclesApp"),
		axes: document.getElementById("showAxes-excirclesApp"),
		grid: document.getElementById("showGrid-excirclesApp"),

		vertices: document.getElementById("showVertices-excirclesApp"),
        segments: document.getElementById("showSegments-excirclesApp"),

        extended: document.getElementById("showExtended-excirclesApp"),
        intBisectors: document.getElementById("showIntBisectors-excirclesApp"),
        extBisectors: document.getElementById("showExtBisectors-excirclesApp"),

        centerAB: document.getElementById("showCenterAB-excirclesApp"),
        circleAB: document.getElementById("showCircleAB-excirclesApp"),
        fillAB: document.getElementById("showFillAB-excirclesApp"),

        centerBC: document.getElementById("showCenterBC-excirclesApp"),
        circleBC: document.getElementById("showCircleBC-excirclesApp"),
        fillBC: document.getElementById("showFillBC-excirclesApp"),

        centerAC: document.getElementById("showCenterAC-excirclesApp"),
        circleAC: document.getElementById("showCircleAC-excirclesApp"),
        fillAC: document.getElementById("showFillAC-excirclesApp")
	};
	
	buttons = {
		random: document.getElementById("buttonRandom-excirclesApp"),
		reset: document.getElementById("buttonReset-excirclesApp"),
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
		
		let aC = new Point(350, 300);
        let bC = new Point(300, 260);
        let cC = new Point(375, 200);
		let triC = new Triangle(aC, bC, cC);

		let extAB = new Line(aC, bC);
		let extBC = new Line(bC, cC);
		let extAC = new Line(aC, cC);

		let incenterC = new Point(0,0);
		// interior and exterior angle bisectors are TEMPORARILY set to lines instead of segments until I can get segment.drawExtended() functioning properly...
		let bisectAC = new Line(aC, incenterC);
		let bisectBC = new Line(bC, incenterC);
		let bisectCC = new Line(cC, incenterC);

		let centerAC = new Point(0,0);
		let centerBC = new Point(0,0);
		let centerCC = new Point(0,0);

		let exBiA = new Line(centerBC, centerCC);
		let exBiB = new Line(centerAC, centerCC);
		let exBiC = new Line(centerAC, centerBC);

		this.dataC = {
            box: boxC,
			origin: originC,
            axes: axesC,
            range: rangeC,

			triangle: triC,

			extendedAB: extAB,
			extendedBC: extBC,
			extendedAC: extAC,

			incenter: incenterC,
			intBisectorA: bisectAC,
			intBisectorB: bisectBC,
			intBisectorC: bisectCC,
			extBisectorA: exBiA,
			extBisectorB: exBiB,
			extBisectorC: exBiC,

			centerA: centerAC,
			centerB: centerBC,
			centerC: centerCC,

			radiusA: 50,
			radiusB: 50,
			radiusC: 50
		};

		let boxPtsC = boxC.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
        
		let boxW = new Box(500,500);
		boxW.setPoints(boxPtsW);
		let rangeW = new Range(new MinMaxRange(0,1),new MinMaxRange(0,1)); 
		rangeW.set(boxPtsW[0].x,boxPtsW[1].x,boxPtsW[3].y,boxPtsW[0].y);		
		
		let originW = new Origin(0,0);
		let axesW = new Axes(1,1);
		
		let aW = new Point(0,0);
        let bW = new Point(0,0);
        let cW = new Point(0,0);
		let triW = new Triangle(aW, bW, cW);

		let centerAW = new Point(0,0);
		let centerBW = new Point(0,0);
		let centerCW = new Point(0,0);
		
		this.dataW = {
			box: boxW,
			origin: originW,
			axes: axesW,
			range: rangeW,

			triangle: triW,

			centerA: centerAW,
			centerB: centerBW,
			centerC: centerCW,

			radiusA: 50,
			radiusB: 50,
			radiusC: 50
		};
		
		// gui: set up actions
		this.setupShowEvents();
		this.setupButtonEvents();
		this.setupMouseEvents();

		// Init canvas / graphics
		this.graphics = initCanvasGraphics(this.canvas);

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

		if (this.show.fillAB.checked) {
			Draw.disk(this.graphics, this.dataC.centerC, this.dataC.radiusC, COLORS.setAlpha(THEMESCARLET));
		}

		if (this.show.fillBC.checked) {
			Draw.disk(this.graphics, this.dataC.centerA, this.dataC.radiusA, COLORS.setAlpha(THEMESCARLET));
		}

		if (this.show.fillAC.checked) {
			Draw.disk(this.graphics, this.dataC.centerB, this.dataC.radiusB, COLORS.setAlpha(THEMESCARLET));
		}

        if (this.show.circleAB.checked) {
            Draw.circle(this.graphics, this.dataC.centerC, this.dataC.radiusC, THEMESCARLET);
        }

        if (this.show.circleBC.checked) {
            Draw.circle(this.graphics, this.dataC.centerA, this.dataC.radiusA, THEMESCARLET);
        }

        if (this.show.circleAC.checked) {
            Draw.circle(this.graphics, this.dataC.centerB, this.dataC.radiusB, THEMESCARLET);
        }

		if (this.show.extended.checked) {
			this.dataC.extendedAB.draw(this.graphics, EDGECOLOR);
			this.dataC.extendedBC.draw(this.graphics, EDGECOLOR);
			this.dataC.extendedAC.draw(this.graphics, EDGECOLOR);
		}

		if (this.show.extBisectors.checked) {
			/*
            this.dataC.extBisectorA.drawExtended(this.graphics, 50, 50, THEMETEAL, LINETHICKNESS);
            this.dataC.extBisectorB.drawExtended(this.graphics, 50, 50, THEMETEAL, LINETHICKNESS);
            this.dataC.extBisectorC.drawExtended(this.graphics, 50, 50, THEMETEAL, LINETHICKNESS);
			*/

            this.dataC.extBisectorA.draw(this.graphics, THEMETEAL);
            this.dataC.extBisectorB.draw(this.graphics, THEMETEAL);
            this.dataC.extBisectorC.draw(this.graphics, THEMETEAL);
		}

        if (this.show.intBisectors.checked) {
			/*
			// what is wrong here. why is the larger number ONLY ever applying to the external line
            this.dataC.intBisectorA.drawExtended(this.graphics, 500, 50, THEMEPURPLE, LINETHICKNESS);
            this.dataC.intBisectorB.drawExtended(this.graphics, 500, 50, THEMEPURPLE, LINETHICKNESS);
            this.dataC.intBisectorC.drawExtended(this.graphics, 500, 50, THEMEPURPLE, LINETHICKNESS);
			*/
			
            this.dataC.intBisectorA.draw(this.graphics, THEMEPURPLE);
            this.dataC.intBisectorB.draw(this.graphics, THEMEPURPLE);
            this.dataC.intBisectorC.draw(this.graphics, THEMEPURPLE);
		}

		if (this.show.centerAB.checked) {
			this.dataC.centerC.draw(this.graphics, 'Ec', THEMESCARLET); // not sure how to do subscripts but this works? I guess?
		}

		if (this.show.centerBC.checked) {
			this.dataC.centerA.draw(this.graphics, 'Ea', THEMESCARLET);
		}

		if (this.show.centerAC.checked) {
			this.dataC.centerB.draw(this.graphics, 'Eb', THEMESCARLET);
		}

		if (this.show.segments.checked) {
			this.dataC.triangle.drawSegments(this.graphics);
		}
		
		if (this.show.vertices.checked) {
			this.dataC.triangle.drawVertices(this.graphics);
		}
	}

	// info
	updateInfo() {
		let ptsC = this.dataC.triangle.points.concat(this.dataC.centerA, this.dataC.radiusA, this.dataC.centerB, this.dataC.radiusB, this.dataC.centerC, this.dataC.radiusC);
		let ptsW = this.dataW.triangle.points.concat(this.dataW.centerA, this.dataW.radiusA, this.dataW.centerB, this.dataW.radiusB, this.dataW.centerC, this.dataW.radiusC);
		let labs = ["A","B","C","E<sub>a</sub>","r<sub>a</sub>","E<sub>b</sub>","r<sub>b</sub>","E<sub>c</sub>","r<sub>c</sub>"];
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

		// NOT UPDATED!!!

		this.graphics = initCanvasGraphics(this.canvas);
		this.dataC.box.fromCanvas(this.canvas);
		this.dataC.origin.fromCanvas(this.canvas);
		this.dataC.range.fromCanvas(this.canvas);
		this.dataC.triangle.snapToCanvas(this.canvas);
		this.dataC.extendedAB.fromCanvas(this.canvas);
		this.dataC.extendedBC.fromCanvas(this.canvas);
		this.dataC.extendedAC.fromCanvas(this.canvas);

		this.dataC.incenter.coords = this.dataC.triangle.incenter();

		let excenters = this.dataC.triangle.excenters();
		let exradii = this.dataC.triangle.exradii();
		this.dataC.centerA.coords = excenters.a;
		this.dataC.centerB.coords = excenters.b;
		this.dataC.centerC.coords = excenters.c;
		this.dataC.radiusA = exradii.a;
		this.dataC.radiusB = exradii.b;
		this.dataC.radiusC = exradii.c;

		this.dataC.intBisectorA.fromCanvas(this.canvas);
		this.dataC.intBisectorB.fromCanvas(this.canvas);
		this.dataC.intBisectorC.fromCanvas(this.canvas);
		this.dataC.extBisectorA.fromCanvas(this.canvas);
		this.dataC.extBisectorB.fromCanvas(this.canvas);
		this.dataC.extBisectorC.fromCanvas(this.canvas);
        
		let boxPtsC = this.dataC.box.pts;	
		let boxPtsW = ConvertPoints.canvasToWorldCoords(boxPtsC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.box.setPoints(boxPtsW);
		this.dataW.range.set(this.canvas);
	
		this.dataW.triangle.setPoints(ConvertPoints.canvasToWorldCoords(this.dataC.triangle.points, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis));
		
		this.dataW.centerA.coords = ConvertPoint.canvasToWorldCoords(this.dataC.centerA, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.centerB.coords = ConvertPoint.canvasToWorldCoords(this.dataC.centerB, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.centerC.coords = ConvertPoint.canvasToWorldCoords(this.dataC.centerC, this.dataC.origin, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.radiusA = ConvertLength.canvasToWorldLength(this.dataC.radiusA, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.radiusB = ConvertLength.canvasToWorldLength(this.dataC.radiusB, this.dataC.axes.xAxis, this.dataC.axes.yAxis);
		this.dataW.radiusC = ConvertLength.canvasToWorldLength(this.dataC.radiusC, this.dataC.axes.xAxis, this.dataC.axes.yAxis);

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

		this.show.vertices.addEventListener("change", () => this.refresh());
		this.show.segments.addEventListener("change", () => this.refresh());

		this.show.intBisectors.addEventListener("change", () => this.refresh());
		this.show.extended.addEventListener("change", () => this.refresh());
		this.show.extBisectors.addEventListener("change", () => this.refresh());

		this.show.centerAB.addEventListener("change", () => this.refresh());
		this.show.circleAB.addEventListener("change", () => this.refresh());
		this.show.fillAB.addEventListener("change", () => this.refresh());

		this.show.centerBC.addEventListener("change", () => this.refresh());
		this.show.circleBC.addEventListener("change", () => this.refresh());
		this.show.fillBC.addEventListener("change", () => this.refresh());

		this.show.centerAC.addEventListener("change", () => this.refresh());
		this.show.circleAC.addEventListener("change", () => this.refresh());
		this.show.fillAC.addEventListener("change", () => this.refresh());
	}
    // buttons
    setupButtonEvents() {
		this.buttons.random.addEventListener("click", () => {
			const pts = Utils.makeRandomPoints(this.canvas, 3);
			this.dataC.triangle.a.coords = pts[0];
			this.dataC.triangle.b.coords = pts[1];
			this.dataC.triangle.c.coords = pts[2];
			this.computeAndRefresh();
		});

		this.buttons.reset.addEventListener("click", () => {
			this.dataC.triangle.a.set(425, 475);
			this.dataC.triangle.b.set(200, 200);
			this.dataC.triangle.c.set(475, 75);
			this.computeAndRefresh();
		});
    }
	// mouse
	setupMouseEvents() {
		// MOUSE DOWN
		this.canvas.addEventListener('mousedown', e => {
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;

			let pts = this.dataC.triangle.points;

			// find id of existing nearby point
			this.locatorId = null;
			pts.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) this.locatorId = i; });
		});
		
		// MOUSE MOVE
		this.canvas.addEventListener('mousemove', e => {
			if (this.locatorId === null) return; 			// no specific point to move - ignore the dragging
			// else, update the coordinates of the dragged point; do not change the labels
			const canvasBounds = this.canvas.getBoundingClientRect();
			const mx = e.clientX-canvasBounds.left, my = e.clientY-canvasBounds.top;
            let pts = this.dataC.triangle.points;
			pts[this.locatorId].set(mx,my);
			// visualize the effect
			this.computeAndRefresh();
		});
		
		// MOUSE UP
		this.canvas.addEventListener('mouseup', () => { this.locatorId = null; });
	}
}