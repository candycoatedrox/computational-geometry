
// Draw Segment crossing scene
function allPointsOnOneSideOfSegmentScene(canvas,points) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawPoints(ctx, points,5,"lightgray");
	
	if (points.length < 2) { return;};
	
	const seg = points.slice(0,2);
	drawLineSegment(ctx,seg,"black",3);
	drawPoints(ctx, points,5,"lightgray");
	
  	if (points.length < 3) {
  		return;	
  	} else {
	
	let pts = points.slice(2);
	let allOnOneSide = allPointsOnOneSideOfSegmentQ(seg,pts);

	if ( allOnOneSide ){ 
		drawPoints(ctx, seg,5,"green");
		drawLineSegment(ctx,seg,"green",3);
		
		drawPoints(ctx,pts,POINTSIZE,"gray");
	} else {
		drawPoints(ctx, seg,5,"red");
		drawLineSegment(ctx,seg,"red",3);
		drawPoints(ctx,pts,POINTSIZE,"gray");
	};

	// drawPointIds(ctx, pts);
}
}

