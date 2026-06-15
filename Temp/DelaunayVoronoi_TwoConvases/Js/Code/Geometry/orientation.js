// Signed and absolute (double) area

function doubleSignedArea(threePts){
	const [[ax, ay], [bx, by], [cx, cy]] = threePts;
	const dsArea = -ay * bx + ax * by + ay * cx - by * cx - ax * cy + bx * cy;
	return dsArea
}

function signedArea(threePts){
	const [[ax, ay], [bx, by], [cx, cy]]=threePts;
	const dsArea = -ay * bx + ax * by + ay * cx - by * cx - ax * cy + bx * cy;
	return dsArea / 2.0
}

function doubleAbsArea(threePts){
	const [[ax, ay], [bx, by], [cx, cy]] = threePts;
	const dsArea = -ay * bx + ax * by + ay * cx - by * cx - ax * cy + bx * cy;

	return Math.abs(dArea)
}

// Orientation tests

function leftTurn(threePts){
	return signedArea(threePts) < -EPS
}

function rightTurn(threePts){
	return signedArea(threePts) > EPS
}

function collinearApprox(threePts){
	return doubleAbsArea(threePts) <= EPS 
}

//

function twoPointsOnSameSideOfSegment(twoPts,seg){
	let [p1,p2] = twoPts;
	let [q1,q2] = seg;
	let res = (leftTurn([q1,q2,p1]) && leftTurn([q1,q2,p2])) ||(rightTurn([q1,q2,p1]) && rightTurn([q1,q2,p2])) ;
	// alert("res= " + res);
	
	return res;
}

// Two Segments crossing

function twoSegmentsNotIntersect(seg1,seg2){
	
	let notCross =  twoPointsOnSameSideOfSegment(seg1,seg2) || twoPointsOnSameSideOfSegment(seg2,seg1);
	// alert("notCross= " + notCross);
	
	return notCross;
	
}

function twoSegmentsIntersect(seg1,seg2){
	
	return (! twoSegmentsNotIntersect(seg1,seg2));
}

// Point in Triangle

function pointInTriangleQ(threePts,q) {
	const [p0,p1,p2] = threePts;
	let res = false; 
	
	if ( leftTurn(threePts)){
		res = leftTurn([p0,p1,q]) && leftTurn([p1,p2,q]) && leftTurn([p2,p0,q]);
	} else {
		res = rightTurn([p0,p1,q]) && rightTurn([p1,p2,q]) && rightTurn([p2,p0,q]);
	};
	
	return res;
}

// All points on one side of segment

function allPointsOnOneSideOfSegmentQ(seg,points){
	let [q1,q2] = seg;
	
	let allOnLeftSide = leftTurn([q1, q2, points[0]]);
	
	if (allOnLeftSide){
		for (let i = 1; i < points.length; i += 1) {
		  	if (rightTurn([q1, q2, points[i]])) {return false;
			} 
		}	
	} else {
		for (let i = 1; i < points.length; i += 1) {
		  	if (leftTurn([q1, q2, points[i]])) {return false;
			} 
		}	
		
	}

	return true;
}