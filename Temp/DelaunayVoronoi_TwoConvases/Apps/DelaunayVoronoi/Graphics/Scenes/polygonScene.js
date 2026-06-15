// Polygon scene
function polygonScene(canvas,points) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	// if (points.length < 2) return;
	
	drawFilledPolygon(ctx,points);
	drawClosedPolyline(ctx,points);
	drawPoints(ctx, points);
	drawPointIds(ctx, points);
}
