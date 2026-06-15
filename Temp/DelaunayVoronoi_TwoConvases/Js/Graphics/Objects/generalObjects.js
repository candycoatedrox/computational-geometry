
// ======   Draw general objects

// POINTS
function drawPoints(ctx, points, size=POINTSIZE, color=POINTCOLOR) {
  	ctx.fillStyle = color;
  	for (const [x,y] of points) {
    	ctx.beginPath();
    	ctx.arc(x, y, size, 0, 2*Math.PI);
    	ctx.fill();
  	}
}

// POINT IDS and LABS
function drawPointIds(ctx, points) {
	// Set the font and color
	ctx.font = "12px sans-serif";
	ctx.fillStyle = "#000000"; // Black color
	
	var nr = 0;
  	for (const [x,y] of points) {
		nr++;
		// Draw the filled text
		ctx.fillText(nr.toString(), x-4, y+3); // Text, x-coord, y-coord
		
  	}
}

function drawPointLabs(ctx, points, labs) {
	// Set the font and color
	ctx.font = "12px sans-serif";
	ctx.fillStyle = "#000000"; // Black color
	
	var nr = 0;
  	for (const [x,y] of points) {
		nr++;
		// Draw the filled text
		ctx.fillText(labs[nr].toString(), x-4, y+3); // Text, x-coord, y-coord
		
  	}
}

// CIRCLE and CIRCLES
function drawCircle(ctx, circle, color=CIRCLECOLOR,thickness=CIRCLETHICKNESS) {
	const [[x,y],radius] = circle;

	ctx.strokeStyle = color;
	ctx.lineWidth = thickness;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2*Math.PI);
	ctx.stroke(); 
}

function drawCircles(ctx, circles, color=CIRCLECOLOR,thickness=CIRCLETHICKNESS) {

	ctx.strokeStyle = color;
	ctx.lineWidth = thickness;
	
  	for (const [[x,y],radius] of circles) {
		ctx.beginPath();
    	ctx.arc(x, y, radius, 0, 2*Math.PI);
		ctx.stroke(); 
  	}
}

// DISK and DISKS
function drawDisk(ctx, circle, color=DISKCOLOR,thickness=CIRCLETHICKNESS) {
	const [[x,y],radius] = circle;

	// ctx.fillStyle = color;
	ctx.fillStyle = "red";
	
	ctx.strokeStyle = color;
	ctx.lineWidth = thickness;
	
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2*Math.PI);
	ctx.fill();
	ctx.stroke(); 
}

function drawDisks(ctx, circles, color=CIRCLECOLOR, thickness=CIRCLETHICKNESS) {

	ctx.strokeStyle = color;
	ctx.lineWidth = thickness;
	
  	for (const [[x,y],radius] of circles) {
		ctx.beginPath();
    	ctx.arc(x, y, radius, 0, 2*Math.PI);
		ctx.stroke(); 
		ctx.fillStyle = color;
		ctx.fill();
  	}
}


// POINT IDS and LABS
function drawPointIds(ctx, points) {
	// Set the font and color
	ctx.font = "12px sans-serif";
	ctx.fillStyle = "#000000"; // Black color
	
	var nr = 0;
  	for (const [x,y] of points) {
		nr++;
		// Draw the filled text
		ctx.fillText(nr.toString(), x-4, y+3); // Text, x-coord, y-coord
		
  	}
}

function drawPointLabs(ctx, points, labs) {
	// Set the font and color
	ctx.font = "12px sans-serif";
	ctx.fillStyle = "#000000"; // Black color
	
	var nr = 0;
  	for (const [x,y] of points) {
		nr++;
		// Draw the filled text
		ctx.fillText(labs[nr].toString(), x-4, y+3); // Text, x-coord, y-coord
		
  	}
}

// LINE SEGMENTS (edges)
function drawLineSegment(ctx, pt1, pt2, color=EDGECOLOR, thickness=EDGETHICKNESS) {
	ctx.strokeStyle = color;
	ctx.lineWidth = thickness;
	ctx.beginPath();
  	ctx.moveTo(pt1[0], pt1[1]);
  	ctx.lineTo(pt2[0], pt2[1]);
  	ctx.closePath();
  	ctx.stroke();
}


// ARROWS
function drawArrow(ctx, fromx, fromy, tox, toy, headlen = 30) {
    const angle = Math.atan2(toy - fromy, tox - fromx);

    // Draw the main line
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    // Draw the arrowhead
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}
