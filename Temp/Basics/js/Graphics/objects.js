
// ─── DRAW OBJECTS ──────────────────────────────────────────

const Draw = {
	
	clearCanvas(cv){
		const ctx = cv.getContext('2d');
		const w = cv.width, h = cv.height;
		ctx.clearRect(0,0,w,h); 
	},
	
	arrow(ctx, A, B, color = ARROWCOLOR, width = ARROWWIDTH, headlen = HEADLENGTH) {
	
		const fromx = A.x, fromy = A.y;
		const tox = B.x, toy = B.y;
	
		ctx.beginPath(); 
	
		// var headlen = 10; // length of head in pixels
		var dx = tox - fromx;
		var dy = toy - fromy;
		var angle = Math.atan2(dy, dx);
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
	
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		
		// arrow head
		ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
		ctx.moveTo(tox, toy);
		ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  
		ctx.stroke();
	},
	
	dot(ctx, p, r, color, label='') {
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
	
	disk(ctx, p, r, color = COLOR.white, label='') {
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
	
	edge(ctx, A, B, color = EDGECOLOR, width = EDGEWIDTH){
	    ctx.beginPath(); 
		ctx.moveTo(A.x,A.y); 
		ctx.lineTo(B.x,B.y);
	    ctx.strokeStyle = color; 
		ctx.lineWidth = width; 
		ctx.stroke();
	},
	
	edges(ctx, pts, edges, color = EDGECOLOR, width = EDGEWIDTH){
	    
		for (let i = 0; i < edges.length; i++){
			const [a, b] = edges[i];
			Draw.edge(ctx, pts[a], pts[b], color, width);
		}
	},
	
	edgeDotted(ctx, A, B, color = EDGECOLOR, width = EDGEWIDTH, dotted = EDGEDOTTED){
	    ctx.beginPath(); 
		ctx.moveTo(A.x,A.y); 
		ctx.lineTo(B.x,B.y);
	    ctx.strokeStyle = color; 
		ctx.setLineDash(dotted); // 2px dots, 4px gaps
		ctx.lineWidth = width; 
		ctx.stroke();
	},
	
	lineExtended(ctx, A, B, color = LINECOLOR, width = LINEWIDTH){
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
	
	triangleFilledOriented(ctx, A, B, C, orientation){
	    ctx.beginPath(); 
		ctx.moveTo(A.x,A.y); 
		ctx.lineTo(B.x,B.y); 
		ctx.lineTo(C.x,C.y); 
		ctx.closePath();
		ctx.fillStyle = orientation === 1 ? COLORS.leftTurn : orientation === -1 ? COLORS.rightTurn : COLORS.white;
	    ctx.fill();
	},
	
	triangleFilledLeftRight(ctx, A, B, C, isLeftTurn){
	    ctx.beginPath(); 
		ctx.moveTo(A.x,A.y); 
		ctx.lineTo(B.x,B.y); 
		ctx.lineTo(C.x,C.y); 
		ctx.closePath();
		ctx.fillStyle = isLeftTurn ? COLORS.leftTurn :  COLORS.rightTurn ;
	    ctx.fill();
	},
	
	triangleFilled(ctx, A, B, C, color){
	    ctx.beginPath(); 
		ctx.moveTo(A.x,A.y); 
		ctx.lineTo(B.x,B.y); 
		ctx.lineTo(C.x,C.y); 
		ctx.closePath();
		ctx.fillStyle = color;
	    ctx.fill();
	}
	
}