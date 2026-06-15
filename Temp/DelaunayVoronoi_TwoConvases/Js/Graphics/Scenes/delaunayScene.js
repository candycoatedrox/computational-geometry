// // Draw Delaunay scene
// function drawDelaunayScene(canvas,points,triangles) {
//   	const ctx = canvas.getContext("2d");
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//   	if (points.length === 0) return;
//
//   	drawDelaunayEdges(ctx, points,triangles);
//   	drawDelaunayPoints(ctx, points);
// 	drawPointIds(ctx, points);
// }

//=================================   DELAUNAY 
// Draw Delaunay scene
function drawDelaunayScene(canvas,points,triangles) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length === 0) return;
	
  	drawDelaunayEdges(ctx, points,triangles);
  	drawDelaunayPoints(ctx, points);
	drawPointIds(ctx, points);
}
