// Draw Points scene
function pointsScene(canvas,points) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length === 0) return;
	
	drawPoints(ctx, points);
	drawPointIds(ctx, points);
}