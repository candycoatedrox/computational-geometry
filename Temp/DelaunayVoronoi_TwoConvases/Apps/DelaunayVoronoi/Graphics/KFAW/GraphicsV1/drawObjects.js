// Draw project-specific objects


// DELAUNAY

function drawDelaunayPoints(ctx, points, size=DELPOINTSIZE, color=DELPOINTCOLOR) {
	drawPoints(ctx, points,size,color)
}

function drawDelaunayEdges(ctx, points,triangles,color=DELEDGECOLOR,thickness=DELEDGETHICKNESS) {
	if (points.length < 3) return;

	for (let i = 0; i < triangles.length; i += 3) {
	  	const p0 = points[triangles[i]];
	  	const p1 = points[triangles[i+1]];
	  	const p2 = points[triangles[i+2]];
	  	drawLineSegment(ctx, p0, p1,color,thickness);
	  	drawLineSegment(ctx, p1, p2,color,thickness);
	  	drawLineSegment(ctx, p2, p0,color,thickness);
	}
}

// VORONOI
function drawVoronoiEdges(ctx, voronoi, color=VOREDGECOLOR,thickness=VOREDGETHICKNESS) {

  	ctx.strokeStyle = color;
	ctx.lineWidth = thickness;
  	for (let i = 0; i < points.length; i++) {
    	const path = voronoi.renderCell(i);
    	const p = new Path2D(path);
    	ctx.stroke(p);
  	}

}

// HAMILTON
function drawHamiltonEdges(ctx, points, hamilton, color=HAMEDGECOLOR, thickness=HAMEDGETHICKNESS) {

	if (points.length < 3) return;

	for (let i = 0; i < hamilton.length -1; i += 1) {
	  	const p0 = points[hamilton[i]];
	  	const p1 = points[hamilton[i+1]];
	  	
	  	drawLineSegment(ctx, p0, p1,color,thickness);

	}
	
  	const p0 = points[hamilton[hamilton.length-1]];
  	const p1 = points[hamilton[0]];
  	
  	drawLineSegment(ctx, p0, p1,color,thickness);

}

// SU-POLYGON
function drawSuPolygonEdges(ctx, points,nspoints,color=SUEDGECOLOR,thickness=SUEDGETHICKNESS){
	if (points.length < 3) return;
	
	for (let i = 0; i < points.length -1; i += 1) {
	  	const p1 = points[i];
		const p2 = nspoints[i];
	  	const p3 = points[i+1];
	  	
	  	drawLineSegment(ctx, p1, p2,color,thickness);
		drawLineSegment(ctx, p2, p3,color,thickness);

	}
	
  	const p1 = points[points.length-1];
	const p2 = nspoints[points.length-1];
  	const p3 = points[0];
  	
  	drawLineSegment(ctx, p1, p2,color,thickness);
	drawLineSegment(ctx, p2, p3,color,thickness);
	
}

// SOURCE
function drawSourcePoints(ctx, points, size=SOURCEPOINTSIZE, color=SOURCEPOINTCOLOR) {
	drawPoints(ctx, points,size,color)
}

// NON-SOURCE
function drawNonSourcePoints(ctx, points, size=NONSOURCEPOINTSIZE, color=NONSOURCEPOINTCOLOR) {
	drawPoints(ctx, points,size,color)
}

function drawSourcePointIdLabs(ctx, points,id){
	// Set the font and color
	ctx.font = "12px sans-serif";
	ctx.fillStyle = "#000000"; // Black color
	
	var nr = 0;
  	for (const [x,y] of points) {
		nr++;
		// Draw the filled text
		ctx.fillText(String(id) + "." + String(nr), x-8, y+3); // Text, x-coord, y-coord
		
  	}
}

function drawNonSourcePointLabs(ctx, points,labs){
	// Set the font and color
	ctx.font = "12px sans-serif";
	ctx.fillStyle = "#000000"; // Black color
	
	var nr = 0;
  	for (const [x,y] of points) {
		nr++;
		// Draw the filled text
		ctx.fillText(String(labs[nr]), x-4, y+3); // Text, x-coord, y-coord
		
  	}
}