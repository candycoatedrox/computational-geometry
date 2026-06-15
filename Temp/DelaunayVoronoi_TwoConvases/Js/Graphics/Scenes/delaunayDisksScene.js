// Delaunay Disks scene
function drawDelaunayDisksScene(canvas,points,triangles,circles){
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
  	if (points.length === 0) return;
	
	drawDelaunayDisks(ctx, circles);
	drawDelaunayCircles(ctx, circles);
  	drawDelaunayEdges(ctx, points,triangles);
  	drawDelaunayPoints(ctx, points);
	drawPointIds(ctx, points);
}
