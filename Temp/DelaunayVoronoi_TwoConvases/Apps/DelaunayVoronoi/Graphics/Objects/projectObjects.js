// Draw project-specific objects


function drawVoronoiEdges(ctx, voronoi, color=VOREDGECOLOR) {

  	ctx.strokeStyle = color;
  	for (let i = 0; i < points.length; i++) {
    	const path = voronoi.renderCell(i);
    	const p = new Path2D(path);
    	ctx.stroke(p);
  	}

}

function drawDelaunayPoints(ctx, points, size=DELPOINTSIZE, color=DELPOINTCOLOR) {
	drawPoints(ctx, points,size,color)
}

function drawDelaunayEdges(ctx, points,triangles,color=DELEDGECOLOR) {
	if (points.length < 3) return;

	for (let i = 0; i < triangles.length; i += 3) {
	  	const p0 = points[triangles[i]];
	  	const p1 = points[triangles[i+1]];
	  	const p2 = points[triangles[i+2]];
	  	drawLineSegment(ctx, p0, p1,color);
	  	drawLineSegment(ctx, p1, p2,color);
	  	drawLineSegment(ctx, p2, p0,color);
	}
}