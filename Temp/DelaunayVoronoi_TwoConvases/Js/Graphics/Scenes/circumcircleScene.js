
// Draw Triangle Orientation scene
function circumcirclecomputeCircumCircleScene(canvas,points,circle) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length >= 3) {
	
		const threePts = points.slice(0,3);
		// console.log("threePts="+threePts);
	
		if ( leftTurn(threePts) ){ 
			drawFilledPolygon(ctx,points,LEFTTURNFILLCOLOR);
		} else {
			drawFilledPolygon(ctx,points,RIGHTTURNFILLCOLOR);
		};
		
		drawCircle(ctx,circle);
		drawPoint(ctx,circle[0],6,"gray"); // center
	};

	
	drawPoints(ctx, points);
	drawPointIds(ctx, points);
}

