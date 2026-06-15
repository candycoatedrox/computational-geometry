// Arrow scene
function arrowScene(canvas,points) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length < 2) return;
	
	drawArrow(ctx,points.slice(0,3));
	drawPoints(ctx, points);
	drawPointIds(ctx, points);
}
