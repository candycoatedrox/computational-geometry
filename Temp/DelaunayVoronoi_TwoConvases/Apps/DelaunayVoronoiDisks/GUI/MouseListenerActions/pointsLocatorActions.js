// Mouse Down

function setMouseDownListenerVor(locatorCanvas,displayCanvas,e){

	  const rect = locatorCanvas.getBoundingClientRect();
	  const x = e.clientX - rect.left;
	  const y = e.clientY - rect.top;

	  const idx = getClosest(points,x, y);
	  if (idx >= 0) {
	    dragging = idx;
	  } else {
	    points.push([x, y]);
		
		// update data
		// visEdges = computeVisibEdges(points);
		// UPDATE VIEW
		pointsScene(displayCanvas,points);

	  }
}


// Mouse Move
function setMouseMoveListenerVor(locatorCanvas,displayCanvas,e){
	
	if (dragging < 0) return;
	const rect = locatorCanvas.getBoundingClientRect();
	points[dragging] = [e.clientX - rect.left, e.clientY - rect.top];
	
	// update data
	// visEdges = computeVisibEdges(points);
	// UPDATE VIEW
	pointsScene(displayCanvas,points);
}


// Mouse Up
function setMouseUpListener(){
	dragging = -1
}

// Add listeners to all locatorCanvases

function addMouseListenersToAllCanvases(locatorCanvas,displayCanvas){
	
	displayCanvas.addEventListener("mousedown", e => setMouseDownListenerVor(locatorCanvas,displayCanvas,e));
	displayCanvas.addEventListener("mousemove", e => setMouseMoveListenerVor(locatorCanvas,displayCanvas,e));
	displayCanvas.addEventListener("mouseup", e => setMouseUpListener());

}