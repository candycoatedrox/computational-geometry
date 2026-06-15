
// Draw Segment crossing scene
function segmentCrossingScene(canvas,points) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length >= 4) {
	
	const fourPts = points.slice(0,4);
	// console.log("fourPts="+fourPts);
	
	const seg1 = fourPts.slice(0,2);
	const seg2 = fourPts.slice(2,4);
	
	let twoSegs = [seg1,seg2];
	
	let cross = twoSegmentsIntersect(seg1,seg2);
	// alert("cross = " + cross);
	
	let notCross = twoSegmentsNotIntersect(seg1,seg2);
	// alert("notCross = " + notCross);
	
	if ( twoSegmentsNotIntersect(seg1,seg2) ){ 
		drawLineSegments(ctx,twoSegs,NOTCROSSCOLOR,CROSSTHICKNESS);
	} else {
		drawLineSegments(ctx,twoSegs,CROSSCOLOR,CROSSTHICKNESS);
	}
	};

	
	drawPoints(ctx, points);
	drawPointIds(ctx, points);
}

