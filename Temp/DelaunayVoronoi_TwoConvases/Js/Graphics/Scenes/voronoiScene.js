// // Draw Voronoi scene
// function drawVoronoiScene(canvas,points,voronoi) {
//   	const ctx = canvas.getContext("2d");
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//   	if (points.length === 0) return;
//
//   	drawVoronoiEdges(ctx, voronoi);
// 	drawDelaunayPoints(ctx, points);
// 	drawPointIds(ctx, points);
// }

//=================================   VORONOI
// Draw Voronoi scene
function drawVoronoiScene(canvas,points,voronoi) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length === 0) return;
	
  	drawVoronoiEdges(ctx, voronoi);
	drawDelaunayPoints(ctx, points);
	drawPointIds(ctx, points);
}
