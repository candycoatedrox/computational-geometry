
// ─── DRAW OBJECTS ──────────────────────────────────────────

const Draw = {
	
	clearCanvas(cv){
		const ctx = cv.getContext('2d');
		const w = cv.width, h = cv.height;
		ctx.clearRect(0,0,w,h); 
	},
	
	// arrow(ctx, A, B, color = ARROWCOLOR, width = ARROWTHICKNESS, headlen = HEADLENGTH) {
	arrow(ctx, A, B, color, width = ARROWTHICKNESS, headlen = HEADLENGTH) {

		// console.log("In Draw.arrow: A = "+JSON.stringify(A));
		// console.log("In Draw.arrow: B = "+JSON.stringify(B));

		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		
		const fromx = A.x, fromy = A.y;
		const tox = B.x, toy = B.y;

		ctx.beginPath();

		// var headlen = 10; // length of head in pixels
		var dx = tox - fromx;
		var dy = toy - fromy;
		var angle = Math.atan2(dy, dx);


		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);

		// arrow head
		ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));

		ctx.stroke();
	},
	
	axes(ctx, origin, xAxis, yAxis, color = AXESCOLOR, width = AXISTHICKNESS, headlen = HEADLENGTH){
	// axes(ctx, origin, xAxis, yAxis, color, width = AXISTHICKNESS, headlen = HEADLENGTH){
		const xA = {x: origin.x + xAxis.x, y: origin.y + xAxis.y};		
		const yA = {x: origin.x + yAxis.x, y: origin.y + yAxis.y};
		Draw.arrow(ctx, origin, xA, color, width, headlen);
		Draw.arrow(ctx, origin, yA, color, width, headlen);
	},
	
	axesC(ctx, origin, xAxis, yAxis){
		const xA = {x: origin.x + xAxis.x, y: origin.y + xAxis.y};		
		const yA = {x: origin.x + yAxis.x, y: origin.y + yAxis.y};
		Draw.arrow(ctx, origin, xA, XAXISCOLOR);
		// Draw.arrow(ctx, origin, xA);
		Draw.arrow(ctx, origin, yA, YAXISCOLOR);
		// Draw.arrow(ctx, origin, yA);
	},
	
	box(ctx, bx, color = BOXCOLOR, width = BOXTHICKNESS){
		// const bx = Utils.rangeToBox(range);
		// console.log("In Draw.box: bx =" + JSON.stringify(bx));
		Draw.edges(ctx, bx.pts, bx.edges, color, width);
	},
	
	circle(ctx, p, r, color = COLORS.white) {
	  ctx.beginPath(); 
	  ctx.setLineDash([]);
	  ctx.strokeStyle = color; 
	  ctx.arc(p.x, p.y, r, 0, Math.PI*2);
	  ctx.stroke();
	},
	
	disk(ctx, p, r, color = COLORS.white, label='') {
	  ctx.beginPath(); 
	  ctx.arc(p.x, p.y, r, 0, Math.PI*2);
	  ctx.fillStyle = color; 
	  ctx.fill();
	  if (label) {
	    ctx.fillStyle = color; 
		ctx.font = 'bold 13px Syne, sans-serif';
	    ctx.fillText(label, p.x + r + 5, p.y - r - 2);
	  }
	},
	
	dot(ctx, p, r, color, label='', labelColor=POINTLABELCOLOR) {
		ctx.fillStyle = color; 
		ctx.beginPath(); 
		ctx.arc(p.x, p.y, r, 0, Math.PI*2);
		ctx.fill();
		if (label) {
			ctx.fillStyle = labelColor; 
			ctx.font = 'bold 13px Syne, sans-serif';
			ctx.fillText(label, p.x + r + 5, p.y - r - 2);
		}
	},
	
	dots(ctx, pts, r, color, labels=[], labelColor=POINTLABELCOLOR) {
		for (i = 0; i< pts.length; i++){
			if (i < labels.length){
				Draw.dot(ctx,pts[i], r, color, labels[i],labelColor);
			} else
			{
				Draw.dot(ctx,pts[i], r, color, '',labelColor);
			}
			
		}
	},
	
	edge(ctx, A, B, color = EDGECOLOR, width = EDGETHICKNESS){
	    ctx.strokeStyle = color; 
		ctx.lineWidth = width; 
	    ctx.beginPath(); 
		ctx.moveTo(A.x,A.y); 
		ctx.lineTo(B.x,B.y);
		ctx.stroke();
	},
	
	edges(ctx, pts, edges, color = EDGECOLOR, width = EDGETHICKNESS){
	    
		for (let i = 0; i < edges.length; i++){
			const [a, b] = edges[i];
			Draw.edge(ctx, pts[a], pts[b], color, width);
		}
	},
	
	edgeDotted(ctx, A, B, color = DOTTEDEDGECOLOR, width = DOTTEDEDGETHICKNESS, dotted = EDGEDOTTED){
	    ctx.beginPath(); 
		ctx.moveTo(A.x,A.y); 
		ctx.lineTo(B.x,B.y);
	    ctx.strokeStyle = color; 
		ctx.setLineDash(dotted); // 2px dots, 4px gaps
		ctx.lineWidth = width; 
		ctx.stroke();
		ctx.setLineDash([]);
	},
	
	face(ctx, pts, face, color = FACECOLOR){
	    ctx.beginPath(); 
		const n = face.length;
		ctx.fillStyle = color;
		// ctx.lineWidth = 3;
		
		for (let i = 0; i< n; i++){
			var k = face[i];
			var crtX = pts[k].x;
			var crtY = pts[k].y;
			
			ctx.lineTo(crtX,crtY);
		}
		ctx.closePath();
		// ctx.stroke();
	    ctx.fill();
		
	},
	
	faces(ctx, pts, faces, color = FACECOLOR){
	    
		for (let i = 0; i < faces.length; i++){
			let face = faces[i];
			Draw.face(ctx, pts, face, color);
		}
		
	},
	
	grid(ctx, origin, xAxis, yAxis, range) {
		
		ctx.strokeStyle = GRIDCOLOR;		
		ctx.lineWidth = GRIDTHICKNESS;
		
		for (let i = origin.x ; i < range.xRange.xMax; i += xAxis.x) { 
			ctx.beginPath(); 
			ctx.moveTo(i, range.yRange.yMin);
			ctx.lineTo(i, range.yRange.yMax);
			ctx.stroke(); 
		}
		
		for (let i = origin.x ; i > range.xRange.xMin; i -= xAxis.x) { 
			ctx.beginPath(); 
			ctx.moveTo(i, range.yRange.yMin);
			ctx.lineTo(i, range.yRange.yMax);
			ctx.stroke(); 
		}
		
		for (let i = origin.y ; i < range.yRange.yMax; i += yAxis.y) { 
			ctx.beginPath(); 
			ctx.moveTo(range.xRange.xMin, i);
			ctx.lineTo(range.xRange.xMax, i);
			ctx.stroke(); 
		}
		
		for (let i = origin.y ; i > range.yRange.yMin; i -= yAxis.y) { 
			ctx.beginPath(); 
			ctx.moveTo(range.xRange.xMin, i);
			ctx.lineTo(range.xRange.xMax, i);
			ctx.stroke(); 
		}
	},
	
	lineExtended(ctx, A, B, color = LINECOLOR, width = LINETHICKNESS){
	    const dx = B.x - A.x, dy = B.y - A.y;
	    const len = Math.sqrt(dx*dx+dy*dy) || 1;
	
	    ctx.beginPath();
	    ctx.moveTo(A.x - dx/len*400, A.y - dy/len*400);
	    ctx.lineTo(B.x + dx/len*400, B.y + dy/len*400);
		ctx.strokeStyle = color; 
		ctx.lineWidth = width; 
		ctx.setLineDash([4,4]);
	    ctx.stroke(); 
		ctx.setLineDash([3,3]);
	},
	
	sector(ctx, p, r, angleStart, angleEnd, color = COLORS.white, label='') {
  	  ctx.beginPath(); 
  	  ctx.setLineDash([]);
  	  ctx.strokeStyle = color; 
  	  ctx.arc(p.x, p.y, r, angleStart, angleEnd);
  	  ctx.stroke();
	  if (label) {
	    ctx.fillStyle = color; 
		ctx.font = 'bold 13px Syne, sans-serif';
	    ctx.fillText(label, p.x + r + 5, p.y - r - 2);
	  }
	},	
	
	// currently, same as edge
	segment(ctx, A, B, color = EDGECOLOR, width = EDGETHICKNESS){
	    ctx.beginPath(); 
		ctx.moveTo(A.x,A.y); 
		ctx.lineTo(B.x,B.y);
	    ctx.strokeStyle = color; 
		ctx.lineWidth = width; 
		ctx.stroke();
	},
	
	triangleFilled(ctx, A, B, C, color){
	    ctx.beginPath(); 
		ctx.moveTo(A.x,A.y); 
		ctx.lineTo(B.x,B.y); 
		ctx.lineTo(C.x,C.y); 
		ctx.closePath();
		ctx.fillStyle = color;
	    ctx.fill();
	},
	
	triangleFilledOriented(ctx, A, B, C, orientation){
	    ctx.beginPath(); 
		ctx.moveTo(A.x,A.y); 
		ctx.lineTo(B.x,B.y); 
		ctx.lineTo(C.x,C.y); 
		ctx.closePath();
		ctx.fillStyle = orientation === -1 ? COLORS.leftTurn : orientation === 1 ? COLORS.rightTurn : COLORS.white;
	    ctx.fill();
	}
	
	// sectorFilled(ctx, p, r, angleStart, angleEnd, color = COLORS.white, label='') {
	//   ctx.beginPath();
	//   if (angleEnd - angleStart < Math.PI){
	//   		ctx.arc(p.x, p.y, r, angleStart, angleEnd);
	// 		triangleFilled(ctx,A,B,C, color);
	//   }
	//   ctx.arc(p.x, p.y, r, angleStart, angleEnd);
	//   ctx.fillStyle = color;
	//   ctx.fill();
	//
	//   if (label) {
	//     ctx.fillStyle = color;
	// 	ctx.font = 'bold 13px Syne, sans-serif';
	//     ctx.fillText(label, p.x + r + 5, p.y - r - 2);
	//   }
	// },
	
	
	// triangleFilledLeftRight(ctx, A, B, C, isLeftTurn){
	//     ctx.beginPath();
	// 	ctx.moveTo(A.x,A.y);
	// 	ctx.lineTo(B.x,B.y);
	// 	ctx.lineTo(C.x,C.y);
	// 	ctx.closePath();
	// 	ctx.fillStyle = isLeftTurn ? COLORS.leftTurn :  COLORS.rightTurn ;
	//     ctx.fill();
	// },
	
}