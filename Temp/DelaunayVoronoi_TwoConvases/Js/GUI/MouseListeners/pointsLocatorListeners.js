// Mouse Down

function setMouseDownListener(locatorCanvas,displayCanvases,e){

	  const rect = locatorCanvas.getBoundingClientRect();
	  const x = e.clientX - rect.left;
	  const y = e.clientY - rect.top;

	  const idx = getClosest(points,x, y);
	  if (idx >= 0) {
	    dragging = idx;
	  } else {
		dragging=points.length;
	    points.push([x, y]);
			
		mouseDownAction(locatorCanvas,displayCanvases)

	  }
}


// Mouse Move
function setMouseMoveListener(locatorCanvas,displayCanvases,e){
	
	if (dragging < 0) return;
	const rect = locatorCanvas.getBoundingClientRect();
	points[dragging] = [e.clientX - rect.left, e.clientY - rect.top];
	
	mouseMoveAction(locatorCanvas,displayCanvases)
}


// Mouse Up
function setMouseUpListener(){
	dragging = -1
}

// Add listeners to one, two locatorCanvases

function addMouseListenersToOneCanvas(locatorCanvas,displayCanvas){
	
	displayCanvas.addEventListener("mousedown", e => setMouseDownListener(locatorCanvas,displayCanvas,e));
	displayCanvas.addEventListener("mousemove", e => setMouseMoveListener(locatorCanvas,displayCanvas,e));
	displayCanvas.addEventListener("mouseup", e => setMouseUpListener());

}

function addMouseListenersToTwoCanvases(displayCanvases){
	
	let [displayCanvas1,displayCanvas2] = displayCanvases;
	
	displayCanvas1.addEventListener("mousedown", e => setMouseDownListener(displayCanvas1,displayCanvases,e));
	displayCanvas1.addEventListener("mousemove", e => setMouseMoveListener(displayCanvas1,displayCanvases,e));
	displayCanvas1.addEventListener("mouseup", e => setMouseUpListener());
	
	displayCanvas2.addEventListener("mousedown", e => setMouseDownListener(displayCanvas2,displayCanvases,e));
	displayCanvas2.addEventListener("mousemove", e => setMouseMoveListener(displayCanvas2,displayCanvases,e));
	displayCanvas2.addEventListener("mouseup", e => setMouseUpListener());

}

// Add listeners to all locatorCanvases - STUB 
function addMouseListenersToAllCanvases(locatorCanvas,displayCanvas){
	
	displayCanvas.addEventListener("mousedown", e => setMouseDownListener(locatorCanvas,displayCanvas,e));
	displayCanvas.addEventListener("mousemove", e => setMouseMoveListener(locatorCanvas,displayCanvas,e));
	displayCanvas.addEventListener("mouseup", e => setMouseUpListener());

}