// Draw Visibility in Polygon scene
function drawVisibilityInPolygonScene(canvas,points,visEdges){
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length === 0) return;
	
	drawFilledPolygon(ctx,points);
	drawVisibilityEdges(ctx, points,visEdges);
  	drawPolygonEdges(ctx, points);
	drawPoints(ctx, points);
	drawPointIds(ctx, points);
}