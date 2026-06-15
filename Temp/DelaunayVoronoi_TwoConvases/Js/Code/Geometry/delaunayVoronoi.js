
function computeDelaunayVoronoiData(points,[width,height]) {

	const delaunay = Delaunay.from(points);
	const voronoi = delaunay.voronoi([0,0,width,height]);
	const triangles = delaunay.triangles;
	
	return [delaunay,voronoi,triangles];
	
}