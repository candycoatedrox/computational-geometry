function mouseMoveAction(locatorCanvas,twoCanvases){
	
	let [delCanvas,vorCanvas]=twoCanvases;
	
	// update data
	[delaunay,voronoi,triangles] = computeDelaunayVoronoiData(points,[locatorCanvas.width,locatorCanvas.height]);	
	
	// draw scenes
    drawDelaunayScene(delCanvas,points, triangles);
	drawVoronoiScene(vorCanvas,points, voronoi);
}