// Voronoi Circles scene
function drawVoronoiCirclesScene(canvas,points,voronoi,circles){
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
  	if (points.length === 0) return;
	
	drawDelaunayCircles(ctx, circles);
  	drawVoronoiEdges(ctx, voronoi);
  	drawDelaunayPoints(ctx, points);
	drawPointIds(ctx, points);
}
