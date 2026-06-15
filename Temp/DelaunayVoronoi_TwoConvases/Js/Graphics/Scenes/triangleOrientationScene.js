
// Draw Triangle Orientation scene
function triangleOrientationScene(canvas,points) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length >= 3) {
	
	const threePts = points.slice(0,3);
	// console.log("threePts="+threePts);
	
	if ( leftTurn(threePts) ){ 
		drawFilledPolygon(ctx,points,LEFTTURNFILLCOLOR);
		drawOrientedPolyline(ctx, points, ARROWHEADLENGTH,LEFTTURNCOLOR);
	} else {
		drawFilledPolygon(ctx,points,RIGHTTURNFILLCOLOR);
		drawOrientedPolyline(ctx, points, ARROWHEADLENGTH,RIGHTTURNCOLOR);
	}
	};

	
	drawPoints(ctx, points);
	drawPointIds(ctx, points);
}

