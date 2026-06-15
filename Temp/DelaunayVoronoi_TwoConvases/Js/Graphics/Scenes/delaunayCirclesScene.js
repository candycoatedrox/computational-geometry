// Delaunay Circles scene
function drawDelaunayCirclesScene(canvas,points,triangles,circles){
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
  	if (points.length === 0) return;
	
	drawDelaunayCircles(ctx, circles);
  	drawDelaunayEdges(ctx, points,triangles);
  	drawDelaunayPoints(ctx, points);
	drawPointIds(ctx, points);
}
