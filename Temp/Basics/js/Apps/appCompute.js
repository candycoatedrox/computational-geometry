function computeCircumCircle(a, b, c) {
    const ax = b.x - a.x, ay = b.y - a.y;
    const bx = c.x - a.x, by = c.y - a.y;
    const D = 2 * (ax * by - ay * bx);
    if (Math.abs(D) < 1e-10) return null; // collinear
    const ux = (by * (ax * ax + ay * ay) - ay * (bx * bx + by * by)) / D;
    const uy = (ax * (bx * bx + by * by) - bx * (ax * ax + ay * ay)) / D;
    const cx = a.x + ux, cy = a.y + uy;
    const r2 = ux * ux + uy * uy;
    return { cx, cy, r2 };
}

// ───  COMPUTE ──────────────────────────────────
const Compute = {
	
	orientation(threePoints) {
		const [A, B, C] = threePoints;
		const orientationSign = Geometry.orientation(A, B, C);
		return orientationSign;
	},
	
	leftTurn(threePoints) {
		const [A, B, C] = threePoints;
		const isLeftTurn = Geometry.leftTurn(A, B, C);
		return isLeftTurn;
	},
	
	intersection(fourPoints) {
		const [A, B, C,D] = fourPoints;
		const intersectOrNot = Geometry.segmentsIntersect(A, B, C,D);
		const intersPoint = Geometry.lineIntersectionPoint(A, B, C, D);
		return {"intersectOrNot": intersectOrNot, "intersPoint": intersPoint};
	},
	
	pointInTriangle(fourPoints) {
		const [A, B, C,D] = fourPoints;
		const signBCD = Geometry.orientation(B, C, D);
		const signABC = Geometry.orientation(A, B, C);
		const signACD = Geometry.orientation(A, C, D);
		const signADB = Geometry.orientation(A, D, B);
		
		const inCW = (signBCD == 1) && (signABC == 1) && (signACD == 1) && (signADB == 1);
		const inCCW = (signBCD == -1) && (signABC == -1) && (signACD == -1) && (signADB == -1);
		
		return inCW || inCCW;
	},
	
	pointedness(fourPoints) {
		const [A, B, C,D] = fourPoints;
		const signBCD = Geometry.orientation(B, C, D);
		const signABC = Geometry.orientation(A, B, C);
		const signACD = Geometry.orientation(A, C, D);
		const signADB = Geometry.orientation(A, D, B);
		
		const inCW = (signBCD == 1) && (signABC == 1) && (signACD == 1) && (signADB == 1);
		const inCCW = (signBCD == -1) && (signABC == -1) && (signACD == -1) && (signADB == -1);
		
		return inCW || inCCW;
	},
	
	ccwAngle(threePoints) {
		const [A, B, C] = threePoints;
		// console.log("In Compute: ccwAngle: A, B, C  threePoints= " + JSON.stringify(threePoints));
		const ccwAngle = Geometry.ccwAngle(A, B, C);
		
		return ccwAngle;
	},
	
	circumCircle(threePoints) {
		const [A, B, C] = threePoints;
		let res = computeCircumCircle(A, B, C);
		// console.log("In Compute.circumCircle, threePoints = " + JSON.stringify(threePoints));
		// console.log("In Compute.circumCircle, res = " + JSON.stringify(res));
		
		let {cx,cy,r2} = res;
		let r = Math.sqrt(r2);
		// console.log("In Compute.circumCircle, r = " + JSON.stringify(r));
		let circle = [{x: cx, y: cy},r];
		// console.log("In Compute.circumCircle, circle = " + JSON.stringify(circle));
		
		return circle;
	}
}