
// Draw Delaunay-Voronoiscene
function drawDelaunayVoronoiScene(canvas,data) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length === 0) return;
	
	let delaunay;
	let voronoi;
	let triangles;
	[delaunay,voronoi,triangles] = data;
	
  	drawVoronoiEdges(ctx, voronoi);
  	drawDelaunayEdges(ctx, points,triangles);
  	drawDelaunayPoints(ctx, points);
	drawPointIds(ctx, points);
}


// Draw Delaunay scene
function drawDelaunayScene(canvas,points,triangles) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length === 0) return;
	
  	drawDelaunayEdges(ctx, points,triangles);
  	drawDelaunayPoints(ctx, points);
	drawPointIds(ctx, points);
}

// Draw Voronoi scene
function drawVoronoiScene(canvas,points,voronoi) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length === 0) return;
	
  	drawVoronoiEdges(ctx, voronoi);
	drawDelaunayPoints(ctx, points);
	drawPointIds(ctx, points);
}


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
