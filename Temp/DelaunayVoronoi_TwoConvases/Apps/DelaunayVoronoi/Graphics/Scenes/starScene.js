// Draw Star scene
function drawStarScene(canvas,points,nspoints,voronoi,sourcePtId) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length === 0) return;
	
	
  	drawVoronoiEdges(ctx, voronoi);
	// drawHamiltonEdges(ctx, points,hamilton);
	drawSuPolygonEdges(ctx, points,nspoints);
	
  	drawSourcePoints(ctx, points);
	// drawPointIds(ctx, points);
	drawSourcePointIdLabs(ctx, points, sourcePtId);
	
	drawNonSourcePoints(ctx, nspoints);
	// drawNonSourcePointIdLabs(ctx, nspoints,nsPointLabs);
	drawNonSourcePointLabs(ctx, nspoints,nsPointLabs);
	
}