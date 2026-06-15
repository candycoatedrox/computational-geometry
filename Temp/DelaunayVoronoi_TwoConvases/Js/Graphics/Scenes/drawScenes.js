

// Draw Polygon scene
function drawPolygonScene(canvas,points) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length === 0) return;
	
	drawFilledPolygon(ctx,points);
  	drawPolygonEdges(ctx, points);
	drawPoints(ctx, points);
	drawPointIds(ctx, points);
}

// Draw Orientation Test scene
function drawOrientationTestScene(canvas,points) {
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length >= 3) {
	
	// const [p0,p1,p2]=points.slice(0,3);
	const threePts = points.slice(0,3);
	console.log("threePts="+threePts);
	
	if ( leftTurn(threePts) ){ 
		// drawFilledPolygon(ctx,points,"green");
		drawOrientedPolygonalLine(ctx, points,COLOR="green");
	} else {
		// drawFilledPolygon(ctx,points,"red");
		drawOrientedPolygonalLine(ctx, points,COLOR="red");
	}
	};

  	// drawOrientedPolygonalLine(ctx, points);
	
	// drawPoints(ctx, points);
	// drawPointIds(ctx, points);
}


// Draw Visibility in Polygon scene
function drawVisibilityInPolygonScene(canvas,points,visEdges){
  	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);

  	if (points.length === 0) return;
	
	drawFilledPolygon(ctx,points);
	drawVisibilityEdges(ctx, points,visEdges);
  	drawPolygonEdges(ctx, points);
	drawPoints(ctx, points);
	drawPointIds(ctx, points);
}

// Draw Delaunay-Voronoi scene
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
