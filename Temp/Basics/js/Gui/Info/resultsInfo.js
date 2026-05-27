
// ─── RESULTS and INFO ─────────────────────────────────────
const ResultsAndInfoForPanel = { 

	
	orientation(orientationSign ){
		
		let orientationVal = null; 
		let orientationClass = null; 
		let orientationInterpret = null;
		let orientationColor = null;
 
		if (orientationSign === 1) 
		{
			orientationVal = '+1';
			orientationClass = 'val pos';
			orientationInterpret = 'RIGHT of';
			orientationColor = COLORS.plus;
		} else if (orientationSign === -1) 
		{
			orientationVal = '-1';
			orientationClass = 'val neg';
			orientationInterpret = 'LEFT of';
			orientationColor = COLORS.minus;
		} else if (orientationSign === 0) 
		{
			orientationVal = '0';
			orientationClass = 'val zero';
			orientationInterpret = 'COLLINEAR with';
			orientationColor = COLORS.white;
		}
 
		// set color for orientation result elements
		document.querySelectorAll('#orientation-result .val').forEach(el => {
			el.style.color = orientationColor;
		});
 
		// set text content for orientation result elements
		const orVal = document.getElementById('orientation-val');
		orVal.textContent = orientationVal;
		const orInterp = document.getElementById('orientation-interp');
		orInterp.textContent = orientationInterpret;
 
	},
	
	intersection(intersectOrNot, intersPoint ){

		let intersectionVal = null;
		let intersectionPoint = null;
		let intersectionClass = null;
		let intersectionInterpret = null;
		let intersectionColor = null;

		if (intersectOrNot)
		{
			intersectionVal = 'true';
			// intersectionPoint = JSON.stringify(intersPoint);
			intersectionPoint = "{" + intersPoint.x.toFixed(0) + "," + intersPoint.y.toFixed(0)+"}";
			intersectionClass = 'val pos';
			intersectionInterpret = 'intersect';
			// intersectionColor = 'rgba(255, 0, 0)';
			intersectionColor = COLORS.plus;
		} else {
			intersectionVal = 'false';
			intersectionPoint = " none ";
			intersectionClass = 'val neg';
			intersectionInterpret = 'do not intersect';
			// intersectionColor = 'rgba(255, 0, 0)';
			intersectionColor = COLORS.minus;
			
		}
	
		// set color for orientation result elements
		document.querySelectorAll('#isect-result .val').forEach(el => {
			el.style.color = intersectionColor;
		});
		
		// set up the interpretation of the result
		const intersInterp = document.getElementById('isect-interp');
		intersInterp.textContent = intersectionInterpret;
	
		// set up the value of the intersection
		const intersVal = document.getElementById('isect-val');
		intersVal.textContent = "{" + intersectionVal + "," + intersectionPoint + "}";
 
	},
	
	pointInTriangle(isIn ){

		let pointInTriangleVal = null;
		let textIn = null;
		// let pointInTriangleInterpret = null;
		let pointInTriangleColor = null;

		if (isIn)
		{
			pointInTriangleVal = 'true';
			// pointInTriangleClass = 'val pos';
			// pointInTriangleInterpret = 'intersect';
			pointInTriangleColor = COLORS.minus;
			textIn ="";
		} else {
			pointInTriangleVal = 'false';
			// pointInTriangleClass = 'val neg';
			pointInTriangleInterpret = 'do not intersect';
			pointInTriangleColor = COLORS.plus;
			textIn = "not";
		}
	
		// set color for orientation result elements
		document.querySelectorAll('#pointInTriangle-result .val').forEach(el => {
			el.style.color = pointInTriangleColor;
		});
		
		// set up the interpretation of the result
		const pointInTriangleInterp = document.getElementById('pointInTriangle-interp');
		pointInTriangleInterp.textContent = textIn;
		
		const pointInTriangleTextVal = document.getElementById('pointInTriangle-val');
		pointInTriangleTextVal.textContent = isIn;
 
	},
	
	ccwAngle(isIn ){

		let pointednessVal = null;
		let textIn = null;
		// let pointednessInterpret = null;
		let pointednessColor = null;

		if (!isIn)
		{
			pointednessVal = 'true';
			// pointednessClass = 'val pos';
			// pointednessInterpret = 'intersect';
			pointednessColor = COLORS.minus;
			textIn ="";
		} else {
			pointednessVal = 'true';
			// pointednessClass = 'val neg';
			// pointednessInterpret = 'do not intersect';
			pointednessColor = COLORS.plus;
			textIn = "not";
		}
	
		// set color for orientation result elements
		document.querySelectorAll('#pointedness-result .val').forEach(el => {
			el.style.color = pointednessColor;
		});
		
		// set up the interpretation of the result
		const pointednessInterp = document.getElementById('pointedness-interp');
		pointednessInterp.textContent = textIn;
		
		const pointednessTextVal = document.getElementById('pointedness-val');
		pointednessTextVal.textContent = !isIn;
 
	}, // STUB
	
	pointedness(isIn ){

		let pointednessVal = null;
		let textIn = null;
		// let pointednessInterpret = null;
		let pointednessColor = null;

		if (!isIn)
		{
			pointednessVal = 'true';
			// pointednessClass = 'val pos';
			// pointednessInterpret = 'intersect';
			pointednessColor = COLORS.minus;
			textIn ="";
		} else {
			pointednessVal = 'true';
			// pointednessClass = 'val neg';
			// pointednessInterpret = 'do not intersect';
			pointednessColor = COLORS.plus;
			textIn = "not";
		}
	
		// set color for orientation result elements
		document.querySelectorAll('#pointedness-result .val').forEach(el => {
			el.style.color = pointednessColor;
		});
		
		// set up the interpretation of the result
		const pointednessInterp = document.getElementById('pointedness-interp');
		pointednessInterp.textContent = textIn;
		
		const pointednessTextVal = document.getElementById('pointedness-val');
		pointednessTextVal.textContent = !isIn;
 
	},
	
	circumCircle( ){

		// let pointednessVal = null;
		// let textIn = null;
		// // let pointednessInterpret = null;
		// let pointednessColor = null;
		//
		// if (!isIn)
		// {
		// 	pointednessVal = 'true';
		// 	// pointednessClass = 'val pos';
		// 	// pointednessInterpret = 'intersect';
		// 	pointednessColor = COLORS.minus;
		// 	textIn ="";
		// } else {
		// 	pointednessVal = 'true';
		// 	// pointednessClass = 'val neg';
		// 	// pointednessInterpret = 'do not intersect';
		// 	pointednessColor = COLORS.plus;
		// 	textIn = "not";
		// }
		//
		// // set color for orientation result elements
		// document.querySelectorAll('#pointedness-result .val').forEach(el => {
		// 	el.style.color = pointednessColor;
		// });
		//
		// // set up the interpretation of the result
		// const pointednessInterp = document.getElementById('pointedness-interp');
		// pointednessInterp.textContent = textIn;
		//
		// const pointednessTextVal = document.getElementById('pointedness-val');
		// pointednessTextVal.textContent = !isIn;
 
	}
};