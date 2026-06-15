// Draw Orientation Test scene
function drawOrientationTestScene(canvas,points) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length >= 3) {
	
	// const [p0,p1,p2]=points.slice(0,3);
	const threePts = points.slice(0,3);
	console.log("threePts="+threePts);
	
	if ( leftTurn(threePts) ){ 
		// drawFilledPolygon(ctx,points,"green");
		drawOrientedPolygonalLine(ctx, points,COLOR="green");
	} else {
		// drawFilledPolygon(ctx,points,"red");
		drawOrientedPolygonalLine(ctx, points,COLOR="red");
	}
	};

  	// drawOrientedPolygonalLine(ctx, points);
	
	// drawPoints(ctx, points);
	// drawPointIds(ctx, points);
}