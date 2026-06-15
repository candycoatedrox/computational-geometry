// Mouse Down

function setMouseDownListenerDelVor(canvas,delCanvas,vorCanvas,e){

	  const rect = canvas.getBoundingClientRect();
	  const x = e.clientX - rect.left;
	  const y = e.clientY - rect.top;

	  const idx = getClosest(points,x, y);
	  if (idx >= 0) {
	    dragging = idx;
	  } else {
	    points.push([x, y]);
		
		// update data
		[delaunay,voronoi,triangles] = computeDelaunayVoronoiData(points,[canvas.width,canvas.height]);	
	
		// draw scenes
	    drawDelaunayScene(delCanvas,points, triangles);
		drawVoronoiScene(vorCanvas,points, voronoi);

	  }
}

function setMouseDownListenerHam(canvas,delCanvas,vorCanvas,e){

	  const rect = canvas.getBoundingClientRect();
	  const x = e.clientX - rect.left;
	  const y = e.clientY - rect.top;

	  const idx = getClosest(points,x, y);
	  if (idx >= 0) {
	    dragging = idx;
	  } else {
	    points.push([x, y]);
		
		// update data
		[delaunay,voronoi,triangles] = computeDelaunayVoronoiData(points,[canvas.width,canvas.height]);	
		
		// draw scenes
	    drawDelaunayScene(delCanvas,points, triangles);
		drawVoronoiScene(vorCanvas,points, voronoi);

	  }
}

function setMouseDownListenerStar(canvas,delCanvas,vorCanvas,e){

	  const rect = canvas.getBoundingClientRect();
	  const x = e.clientX - rect.left;
	  const y = e.clientY - rect.top;

	  const idx = getClosest(nspoints,x, y);
	  if (idx >= 0) {
	    dragging = idx;
	  } else {
	    nspoints.push([x, y]);
		
		// update data
		[delaunay,voronoi,triangles] = computeDelaunayVoronoiData(points,[canvas.width,canvas.height]);	
		
		// draw scenes
	    drawDelaunayScene(delCanvas,points, triangles);
		drawVoronoiScene(vorCanvas,points, voronoi);

	  }
}

// Mouse Move
function setMouseMoveListenerDelVor(canvas,delCanvas,vorCanvas,e){
	
	if (dragging < 0) return;
	const rect = canvas.getBoundingClientRect();
	points[dragging] = [e.clientX - rect.left, e.clientY - rect.top];
	
	// update data
	[delaunay,voronoi,triangles] = computeDelaunayVoronoiData(points,[canvas.width,canvas.height]);	
	
	// draw scenes
    drawDelaunayScene(delCanvas,points, triangles);
	drawVoronoiScene(vorCanvas,points, voronoi);
}


// Mouse Up
function setMouseUpListener(){
	dragging = -1
}

// Add listeners to all canvases

function addMouseListenersToAllCanvases(canvasDel,canvasVor){
	
	canvasDel.addEventListener("mousedown", e => setMouseDownListenerDelVor(canvasDel,canvasDel,canvasVor,e));
	canvasDel.addEventListener("mousemove", e => setMouseMoveListenerDelVor(canvasDel,canvasDel,canvasVor,e));
	canvasDel.addEventListener("mouseup", e => setMouseUpListener());
	
	
	canvasVor.addEventListener("mousedown", e => setMouseDownListenerDelVor(canvasVor,canvasDel,canvasVor,e));
	canvasVor.addEventListener("mousemove", e => setMouseMoveListenerDelVor(canvasVor,canvasDel,canvasVor,e));
	canvasVor.addEventListener("mouseup", e => setMouseUpListener());

}