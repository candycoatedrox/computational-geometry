
//----------------    CIRCUM CIRCLES

function computeCircumCircle3(p0,p1,p2){
	let [ax,ay] = p0;
	let [bx,by] = p1;
	let [cx,cy] = p2;

	const nx = ay * bx**2 - ax**2 * by - ay**2 * by + ay * by**2 - ay * cx**2 + by * cx**2 + ax**2 * cy +
	ay**2 * cy - bx**2 * cy - by**2 * cy - ay * cy**2 + by * cy**2;
	const dx = 2 * (-ay * bx + ax *  by + ay * cx - by * cx - ax * cy + bx * cy);

	const x = - nx / dx;

	const ny = ax**2 * bx + ay**2 * bx - ax * bx**2 - ax * by**2 - ax**2 * cx - ay**2 * cx + bx**2 * cx +
 by**2 * cx + ax * cx**2 - bx * cx**2 + ax * cy**2 - bx * cy**2;
	const dy = 2 * (ay * bx - ax * by - ay * cx + by * cx + ax * cy - bx * cy);

	const y = ny /  dy;
	
	const nr = Math.sqrt((ax**2 + ay**2 - 2 * ax * bx + bx**2 - 2 * ay * by + by**2) * (ax**2 + ay**2 - 
   2 * ax * cx + cx**2 - 2 * ay * cy + cy**2) * (bx**2 + by**2 - 2 * bx * cx + cx**2 - 
	   2 * by * cy + cy**2));
	   
	const dr = 2 * Math.abs(-ay * bx + ax * by + ay * cx - by * cx - ax * cy + bx * cy);
	
	const radius = nr / dr;

	return [[x, y], radius]
}

function computeCircumCircle(threePoints){
	let [p0,p1,p2] = threePoints;
	let [ax,ay] = p0;
	let [bx,by] = p1;
	let [cx,cy] = p2;

	const nx = ay * bx**2 - ax**2 * by - ay**2 * by + ay * by**2 - ay * cx**2 + by * cx**2 + ax**2 * cy +
	ay**2 * cy - bx**2 * cy - by**2 * cy - ay * cy**2 + by * cy**2;
	const dx = 2 * (-ay * bx + ax *  by + ay * cx - by * cx - ax * cy + bx * cy);

	const x = - nx / dx;

	const ny = ax**2 * bx + ay**2 * bx - ax * bx**2 - ax * by**2 - ax**2 * cx - ay**2 * cx + bx**2 * cx +
 by**2 * cx + ax * cx**2 - bx * cx**2 + ax * cy**2 - bx * cy**2;
	const dy = 2 * (ay * bx - ax * by - ay * cx + by * cx + ax * cy - bx * cy);

	const y = ny /  dy;
	
	const nr = Math.sqrt((ax**2 + ay**2 - 2 * ax * bx + bx**2 - 2 * ay * by + by**2) * (ax**2 + ay**2 - 
   2 * ax * cx + cx**2 - 2 * ay * cy + cy**2) * (bx**2 + by**2 - 2 * bx * cx + cx**2 - 
	   2 * by * cy + cy**2));
	   
	const dr = 2 * Math.abs(-ay * bx + ax * by + ay * cx - by * cx - ax * cy + bx * cy);
	
	const radius = nr / dr;

	return [[x, y], radius]
}

function computeCircumCircles(points,triangles){
	
	let circles=[];
	if (points.length < 3) {return circles};
	
	for (let i = 0; i < triangles.length; i += 3) {
		const crtTriang = [triangles[i],triangles[i + 1],triangles[i + 2]];
	
		const [k0,k1,k2] = crtTriang;
		
		const p0 = points[k0];
		const p1 = points[k1];
		const p2 = points[k2];

		let circle =  computeCircumCircle3(p0,p1,p2); 
		circles.push(circle); 
	}
	
	return circles;
}