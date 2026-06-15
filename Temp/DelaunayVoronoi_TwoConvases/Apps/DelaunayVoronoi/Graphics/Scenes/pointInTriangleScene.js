
// Draw Triangle Orientation scene
function pointInTriangleScene(canvas,points) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length >= 4) {
	
	const threePts = points.slice(0,3);
	const q = points[3];
	
	drawFilledPolygon(ctx,threePts,"lightgray");
	drawPoints(ctx, threePts,POINTSIZE, "lightgray");
	
	let res = pointInTriangleQ(threePts,q);
	
	if ( res ){ 
		// drawFilledPolygon(ctx,threePts,"red");
		drawPoint(ctx, q, POINTSIZE, "red");
	} else {
		// drawFilledPolygon(ctx,threePts,"green");
		drawPoint(ctx, q, POINTSIZE,"green");
	}
	};

	drawPointIds(ctx, points);
}

