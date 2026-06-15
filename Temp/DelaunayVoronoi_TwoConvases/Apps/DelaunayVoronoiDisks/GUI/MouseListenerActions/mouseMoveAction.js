function mouseMoveAction(locatorCanvas,twoCanvases){
	
	let [delCanvas,vorCanvas]=twoCanvases;
	
	// update data
	[delaunay,voronoi,triangles] = computeDelaunayVoronoiData(points,[locatorCanvas.width,locatorCanvas.height]);	
	circles=computeCircumCircles(points,triangles);
	
	// draw scenes
    // drawDelaunayScene(delCanvas,points, triangles);
	drawDelaunayDisksScene(canvasDel,points,triangles,circles);
	// drawVoronoiScene(vorCanvas,points, voronoi);
	drawVoronoiDisksScene(canvasVor,points,voronoi,circles);
}