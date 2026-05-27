

function initPrepareComputeDrawUpdateAllCanvasesBasics() {
  setTimeout(() => {
	  
	  PrepareComputeDrawUpdate.orientation();
	  PrepareComputeDrawUpdate.intersection();
	  PrepareComputeDrawUpdate.pointInTriangle();
	  PrepareComputeDrawUpdate.pointedness();
	  PrepareComputeDrawUpdate.ccwAngle();
	  PrepareComputeDrawUpdate.circumCircle();
	}, 50);
}



// ─── PREPARE CANVASES ───────────────────────────────────────

const PrepareCanvas = {
	
	// ---------------------------------------------------------                  BASICS
	
	orientation() {
		
		const cv = setupCanvasInWrapById('canvas-orientation');
		Draw.clearCanvas(cv);
		// Draw.grid(cv);
		const ctx = cv.getContext('2d');
		
		// prepare initial points 
		let pts = THREEPOINTS;
		if (pts.length < 3) { pts = [{x:w*.25,y:h*.55},{x:w*.55,y:h*.28},{x:w*.55,y:h*.55}]; }
		
		return {"ctx":ctx, "pts": pts};
	},
	
	intersection(pts) {
		
		const cv = setupCanvasInWrapById('canvas-intersection');
		Draw.clearCanvas(cv);
		// Draw.grid(cv);
		const ctx = cv.getContext('2d');
		
		// prepare initial points 
		if (pts.length < 4) { 
		    pts = [
		      {x:w*.2,y:h*.3},{x:w*.65,y:h*.7},
		      {x:w*.2,y:h*.7},{x:w*.65,y:h*.3}
		    ];
		}  
		return {"ctx":ctx, "pts": pts};
	},
	
	pointInTriangle(pts) {
		
		const cv = setupCanvasInWrapById('canvas-pointInTriangle');
		Draw.clearCanvas(cv);
		// Draw.grid(cv);
		const ctx = cv.getContext('2d');
		
		// prepare initial points 
		if (pts.length < 4) { 
		    pts = [
		      {x:w*.2,y:h*.3},{x:w*.65,y:h*.7},
		      {x:w*.2,y:h*.7},{x:w*.65,y:h*.3}
		    ];
		}  
		return {"ctx":ctx, "pts": pts};
	},
	
	pointedness(pts) {
		
		const cv = setupCanvasInWrapById('canvas-pointedness');
		Draw.clearCanvas(cv);
		// Draw.grid(cv);
		const ctx = cv.getContext('2d');
		
		// prepare initial points 
		if (pts.length < 4) { 
		    pts = [
		      {x:w*.2,y:h*.3},{x:w*.65,y:h*.7},
		      {x:w*.2,y:h*.7},{x:w*.65,y:h*.3}
		    ];
		}  
		return {"ctx":ctx, "pts": pts};
	},
	
	ccwAngle(pts) {
		
		const cv = setupCanvasInWrapById('canvas-ccwAngle');
		Draw.clearCanvas(cv);
		// Draw.grid(cv);
		const ctx = cv.getContext('2d');
		
		// prepare initial points 
		if (pts.length < 3) { 
		    pts = [
				{x:w*.2,y:h*.3},{x:w*.65,y:h*.7},{x:w*.2,y:h*.7}
		    ];
		}  
		return {"ctx":ctx, "pts": pts};
	},
	
	circumCircle(pts) {
		
		// console.log("In PrepareCanvas.circumCircle, pts = " + JSON.stringify(pts));
		
		const cv = setupCanvasInWrapById('canvas-circumCircle');
		Draw.clearCanvas(cv);
		// Draw.grid(cv);
		const ctx = cv.getContext('2d');
		
		// prepare initial points 
		if (pts.length < 3) { 
		    pts = [
				{x:w*.2,y:h*.3},{x:w*.65,y:h*.7},{x:w*.2,y:h*.7}
		    ];
		}  
		return {"ctx":ctx, "pts": pts};
	}
}

// ─── PREPARE INFRASTRUCTURE FOR ALL CANVASES ───────────────────────────────────────
//     prepare, calculate, draw, update


const PrepareComputeDrawUpdate = {

	// ---------------------------------------------------------                  BASICS
	
	orientation() {
		const canvasInfo = PrepareCanvas.orientation();
		const ctx = canvasInfo.ctx;
		THREEPOINTS = canvasInfo.pts;

		// compute orientation sign
		const orientationSign = Compute.orientation(THREEPOINTS);
		const isLeftTurn = Compute.leftTurn(THREEPOINTS);
		// console.log("In canvases - orientation: THREEPOINTS = " + JSON.stringify(THREEPOINTS));
		// console.log("In canvases - orientation: orientationSign = " + orientationSign);
		// draw scene
		DrawScene.orientation(ctx,THREEPOINTS, isLeftTurn);

		// update info panel (right)
		ResultsAndInfoForPanel.orientation(orientationSign);
	},
	
	intersection(){
		
		const canvasInfo = PrepareCanvas.intersection(FOURPOINTS);
		const ctx = canvasInfo.ctx;
		FOURPOINTS = canvasInfo.pts;

		// compute orientation sign
		intersectionResult = Compute.intersection(FOURPOINTS);
		// {"intersectOrNot": intersectOrNot, "intersPoint": intersPoint};

	  	// draw scene
		DrawScene.intersection(ctx,FOURPOINTS,intersectionResult.intersectOrNot,intersectionResult.intersPoint );

		// update info panel (right)
		ResultsAndInfoForPanel.intersection(intersectionResult.intersectOrNot,intersectionResult.intersPoint);
	},
	
	pointInTriangle(){
		
		const canvasInfo = PrepareCanvas.pointInTriangle(POINTINTRIANGLE);
		const ctx = canvasInfo.ctx;
		POINTINTRIANGLE = canvasInfo.pts;
		// console.log("POINTINTRIANGLE = " + JSON.stringify(POINTINTRIANGLE));

		// compute pointInTriangle sign
		const isIn = Compute.pointInTriangle(POINTINTRIANGLE);
		// console.log("isIn = " + isIn);
		

	  	// draw scene
		DrawScene.pointInTriangle(ctx,POINTINTRIANGLE, isIn );

		// update info panel (right)
		ResultsAndInfoForPanel.pointInTriangle(isIn);
	},
	
	pointedness(){
		
		const canvasInfo = PrepareCanvas.pointedness(POINTEDNESS);
		const ctx = canvasInfo.ctx;
		POINTEDNESS = canvasInfo.pts;
		// console.log("POINTEDNESS = " + JSON.stringify(POINTEDNESS));

		// compute pointedness sign
		const isIn = Compute.pointedness(POINTEDNESS);
		// console.log("isIn = " + isIn);
		

	  	// draw scene
		DrawScene.pointedness(ctx,POINTEDNESS, isIn );

		// update info panel (right)
		ResultsAndInfoForPanel.pointedness(isIn);
	},
	
	ccwAngle(){
		
		const canvasInfo = PrepareCanvas.ccwAngle(CCWANGLEPOINTS);
		const ctx = canvasInfo.ctx;
		CCWANGLEPOINTS = canvasInfo.pts;
		// console.log("CCWANGLEPOINTS = " + JSON.stringify(CCWANGLEPOINTS));

		// compute pointedness sign
		CCWANGLE = Compute.ccwAngle(CCWANGLEPOINTS);
		// console.log("CCWANGLE = " + CCWANGLE);
		
		// compute orientation sign
		const orientationSign = Compute.orientation(CCWANGLEPOINTS);
		
	  	// draw scene
		DrawScene.ccwAngle(ctx,CCWANGLEPOINTS, orientationSign,CCWANGLE );

		// update info panel (right)
		// TODO STUB for now - commented out
		// ResultsAndInfoForPanel.ccwAngle(CCWANGLE);
	},
	
	circumCircle(){
		
		const canvasInfo = PrepareCanvas.circumCircle(THREEPOINTSCIRCUMCIRCLE);
		const ctx = canvasInfo.ctx;
		THREEPOINTSCIRCUMCIRCLE = canvasInfo.pts;
		// console.log("In PrepareComputeDrawUpdate.circumCircle, THREEPOINTSCIRCUMCIRCLE = " + JSON.stringify(THREEPOINTSCIRCUMCIRCLE));

		// compute circumCircle
		const cCircle = Compute.circumCircle(THREEPOINTSCIRCUMCIRCLE);
		// console.log("In PrepareComputeDrawUpdate.circumCircle, cCircle = " + JSON.stringify(cCircle));
		

	  	// draw scene
		DrawScene.circumCircle(ctx,THREEPOINTSCIRCUMCIRCLE, cCircle );

		// update info panel (right)
		ResultsAndInfoForPanel.circumCircle(cCircle);
	}


}

// ─── PREPARE INFRASTRUCTURE FOR ALL CANVASES ───────────────────────────────────────
//     prepare, calculate, draw, update


const PrepareCanvasDrawUpdate = {

	// ---------------------------------------------------------                  BASICS
	
	orientation() {
		const canvasInfo = PrepareCanvas.orientation();
		const ctx = canvasInfo.ctx;
		THREEPOINTS = canvasInfo.pts;

		// compute orientation sign
		const orientationSign = Compute.orientation(THREEPOINTS);
		const isLeftTurn = Compute.leftTurn(THREEPOINTS);
		// console.log("In canvases - orientation: THREEPOINTS = " + JSON.stringify(THREEPOINTS));
		// console.log("In canvases - orientation: orientationSign = " + orientationSign);
		// draw scene
		DrawScene.orientation(ctx,THREEPOINTS, isLeftTurn);

		// update info panel (right)
		ResultsAndInfoForPanel.orientation(orientationSign);
	},
	
	intersection(){
		
		const canvasInfo = PrepareCanvas.intersection(FOURPOINTS);
		const ctx = canvasInfo.ctx;
		FOURPOINTS = canvasInfo.pts;

		// compute orientation sign
		intersectionResult = Compute.intersection(FOURPOINTS);
		// {"intersectOrNot": intersectOrNot, "intersPoint": intersPoint};

	  	// draw scene
		DrawScene.intersection(ctx,FOURPOINTS,intersectionResult.intersectOrNot,intersectionResult.intersPoint );

		// update info panel (right)
		ResultsAndInfoForPanel.intersection(intersectionResult.intersectOrNot,intersectionResult.intersPoint);
	},
	
	pointInTriangle(){
		
		const canvasInfo = PrepareCanvas.pointInTriangle(POINTINTRIANGLE);
		const ctx = canvasInfo.ctx;
		POINTINTRIANGLE = canvasInfo.pts;
		// console.log("POINTINTRIANGLE = " + JSON.stringify(POINTINTRIANGLE));

		// compute pointInTriangle sign
		const isIn = Compute.pointInTriangle(POINTINTRIANGLE);
		// console.log("isIn = " + isIn);
		

	  	// draw scene
		DrawScene.pointInTriangle(ctx,POINTINTRIANGLE, isIn );

		// update info panel (right)
		ResultsAndInfoForPanel.pointInTriangle(isIn);
	},
	
	pointedness(){
		
		const canvasInfo = PrepareCanvas.pointedness(POINTEDNESS);
		const ctx = canvasInfo.ctx;
		POINTEDNESS = canvasInfo.pts;
		// console.log("POINTEDNESS = " + JSON.stringify(POINTEDNESS));

		// compute pointedness sign
		const isIn = Compute.pointedness(POINTEDNESS);
		// console.log("isIn = " + isIn);
		

	  	// draw scene
		DrawScene.pointedness(ctx,POINTEDNESS, isIn );

		// update info panel (right)
		ResultsAndInfoForPanel.pointedness(isIn);
	},
	
	ccwAngle(){
		
		const canvasInfo = PrepareCanvas.ccwAngle(CCWANGLEPOINTS);
		const ctx = canvasInfo.ctx;
		CCWANGLEPOINTS = canvasInfo.pts;
		// console.log("CCWANGLEPOINTS = " + JSON.stringify(CCWANGLEPOINTS));

		// compute pointedness sign
		CCWANGLE = Compute.ccwAngle(CCWANGLEPOINTS);
		// console.log("CCWANGLE = " + CCWANGLE);
		
		// compute orientation sign
		const orientationSign = Compute.orientation(CCWANGLEPOINTS);
		
	  	// draw scene
		DrawScene.ccwAngle(ctx,CCWANGLEPOINTS, orientationSign,CCWANGLE );

		// update info panel (right)
		// TODO STUB for now - commented out
		// ResultsAndInfoForPanel.ccwAngle(CCWANGLE);
	},
	
	circumCircle(){
		
		const canvasInfo = PrepareCanvas.circumCircle(THREEPOINTSCIRCUMCIRCLE);
		const ctx = canvasInfo.ctx;
		THREEPOINTSCIRCUMCIRCLE = canvasInfo.pts;
		// console.log("In PrepareComputeDrawUpdate.circumCircle, THREEPOINTSCIRCUMCIRCLE = " + JSON.stringify(THREEPOINTSCIRCUMCIRCLE));

		// compute circumCircle
		const cCircle = Compute.circumCircle(THREEPOINTSCIRCUMCIRCLE);
		// console.log("In PrepareComputeDrawUpdate.circumCircle, cCircle = " + JSON.stringify(cCircle));
		

	  	// draw scene
		DrawScene.circumCircle(ctx,THREEPOINTSCIRCUMCIRCLE, cCircle );

		// update info panel (right)
		ResultsAndInfoForPanel.circumCircle(cCircle);
	}

}
