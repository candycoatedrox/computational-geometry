

// ─── DRAW SCENES ──────────────────────────────────────────

const DrawScene = {
	
	orientation(ctx,threePoints, isLeftTurn) {
  
		const [A, B, C] = threePoints;
		Draw.triangleFilledLeftRight(ctx, A, B, C, isLeftTurn);

		// Line AB extended
		// Draw.lineExtended(ctx, A, B);
  
		// Edges or arrows
		// Draw.edge(ctx, A, B);
		Draw.arrow(ctx, A, B);
		Draw.arrow(ctx, B, C);
 
		// Points A, B and C
		Draw.dot(ctx, A, 7, COLORS.purple, 'A');
		Draw.dot(ctx, B, 7, COLORS.teal, 'B');
		Draw.dot(ctx, C, 7, COLORS.amber, 'C');
  
	},
	
	intersection(ctx,fourPoints, intersectOrNot, intersPoint) {
  
		const [A, B, C, D] = fourPoints;
		// Draw.triangleFilledOriented(ctx, A, B, C, orientationSign);

		// Line AB extended
		// Draw.lineExtended(ctx, A, B);
  
		// Edges or arrows
		// Draw.edge(ctx, A, B);
		Draw.edge(ctx, A, B, COLORS.purple);
		Draw.edge(ctx, C, D, COLORS.teal);
 
		// Points A, B and C
		Draw.dot(ctx, A, 7, COLORS.purple, 'A');
		Draw.dot(ctx, B, 7, COLORS.purple, 'B');
		Draw.dot(ctx, C, 7, COLORS.teal, 'C');
		Draw.dot(ctx, D, 7, COLORS.teal, 'D');
		
		if (intersectOrNot && intersPoint) {
			Draw.dot(ctx,intersPoint,10,COLORS.highlight,'');
			Draw.dot(ctx,intersPoint,5,COLORS.amber,'✕');
		}
  
	},
	
	pointInTriangle(ctx,fourPoints, isIn) {
  
		const [A, B, C, D] = fourPoints;
		Draw.triangleFilledOriented(ctx, B, C, D, isIn);

		// Line AB extended
		// Draw.lineExtended(ctx, A, B);
  
		// Edges or arrows
		// Draw.edge(ctx, A, B);
		if (isIn) {
			Draw.triangleFilled(ctx, B, C, D, COLORS.in);
			Draw.edge(ctx, B, C, COLORS.in);
			Draw.edge(ctx, C, D, COLORS.in);
			Draw.edge(ctx, D, B, COLORS.in);
			Draw.dot(ctx, A, 7, COLORS.white, 'A');
			Draw.dot(ctx, B, 7, COLORS.in, 'B');
			Draw.dot(ctx, C, 7, COLORS.in, 'C');
			Draw.dot(ctx, D, 7, COLORS.in, 'D');
		}
		else {
			Draw.triangleFilled(ctx, B, C, D, COLORS.out);
			Draw.edge(ctx, B, C, COLORS.out);
			Draw.edge(ctx, C, D, COLORS.out);
			Draw.edge(ctx, D, B, COLORS.out);
			Draw.dot(ctx, A, 7, COLORS.white, 'A');
			Draw.dot(ctx, B, 7, COLORS.out, 'B');
			Draw.dot(ctx, C, 7, COLORS.out, 'C');
			Draw.dot(ctx, D, 7, COLORS.out, 'D');			
			
		}
  
	},
	
	pointedness(ctx,fourPoints, isIn) {
  
		const [A, B, C, D] = fourPoints;
		Draw.triangleFilledOriented(ctx, B, C, D, isIn);
  
		// Edges or arrows
		// Draw.edge(ctx, A, B);
		if (!isIn) {
			Draw.triangleFilled(ctx, B, C, D, COLORS.in);
			Draw.arrow(ctx, A, B, COLORS.in);
			Draw.arrow(ctx, A, C, COLORS.in);
			Draw.arrow(ctx, A, D, COLORS.in);
			Draw.dot(ctx, A, 7, COLORS.white, 'A');
			Draw.dot(ctx, B, 7, COLORS.in, 'B');
			Draw.dot(ctx, C, 7, COLORS.in, 'C');
			Draw.dot(ctx, D, 7, COLORS.in, 'D');
		}
		else {
			Draw.triangleFilled(ctx, B, C, D, COLORS.out);
			Draw.arrow(ctx, A, B, COLORS.out);
			Draw.arrow(ctx, A, C, COLORS.out);
			Draw.arrow(ctx, A, D, COLORS.out);
			Draw.dot(ctx, A, 7, COLORS.white, 'A');
			Draw.dot(ctx, B, 7, COLORS.out, 'B');
			Draw.dot(ctx, C, 7, COLORS.out, 'C');
			Draw.dot(ctx, D, 7, COLORS.out, 'D');			
			
		}
  
	},
	
	ccwAngle(ctx,threePoints, orientationSign, angle) {
  
		const [A, B, C] = threePoints;
		Draw.triangleFilledOriented(ctx, A, B, C, orientationSign);

		// Line AB extended
		// Draw.lineExtended(ctx, A, B);
  
		// Edges or arrows
		// Draw.edge(ctx, A, B);
		Draw.arrow(ctx, A, B);
		Draw.arrow(ctx, B, C);
 
		// Points A, B and C
		Draw.dot(ctx, A, 7, COLORS.purple, 'A');
		Draw.dot(ctx, B, 7, COLORS.teal, 'B');
		Draw.dot(ctx, C, 7, COLORS.amber, 'C');
  
	},
	
	circumCircle(ctx,threePoints, cCircle) {
  
		const [A, B, C] = threePoints;
		const center = cCircle[0];
		
  	  	Draw.disk(ctx, center, cCircle[1], COLORS.amber);
		
		Draw.triangleFilled(ctx, A, B, C, COLORS.white);
		
		Draw.edgeDotted(ctx, A, center, COLORS.purple);
		Draw.edgeDotted(ctx, B, center, COLORS.purple);
		Draw.edgeDotted(ctx, C, center, COLORS.purple);
		
		Draw.dot(ctx, A, 6, COLORS.red,'A');
		Draw.dot(ctx, B, 6, COLORS.red,'B');
		Draw.dot(ctx, C, 6, COLORS.red,'C');
		
		Draw.dot(ctx, center, 6, COLORS.purple,'O');
	}
}