//=================================   HAMILTON
// Draw Hamilton scene
function drawHamiltonScene(canvas,points,triangles,hamilton) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length === 0) return;
	
  	drawDelaunayEdges(ctx, points,triangles);
	drawHamiltonEdges(ctx, points,hamilton);
  	drawDelaunayPoints(ctx, points);
	drawPointIds(ctx, points);
}
