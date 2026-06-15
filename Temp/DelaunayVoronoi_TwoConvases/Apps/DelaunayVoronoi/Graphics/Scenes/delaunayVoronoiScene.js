
function drawDelaunayVoronoiScene(canvas,data) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length === 0) return;

	[delaunay,voronoi,triangles] = data;
	
  	drawVoronoiEdges(ctx, canvas, voronoi);
  	drawDelaunayEdges(ctx, points,triangles);
  	drawDelaunayPoints(ctx, points);
	drawPointIds(ctx, points);
}
