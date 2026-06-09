class Points extends Array {

	constructor(n = 0) {
		super();
		for (let i = 0; i < n; i++) {
			this[i] = new Point(0,0);
		}
	}

	setAll(pts) {
		for (let i = 0; i < this.length; i++) {
			this[i].coords = pts[i];
		}
	}
	
	translate(vec){
		for (let i = 0; i < this.length; i++) {
			this[i].addTo(vec);
		}
	}

	snapToCanvas(canvas) {
		for (let i = 0; i < this.length; i++) {
			this[i].snapToCanvas(canvas);
		}
	}
	
	draw(ctx, labels = [], color = POINTCOLOR, size = POINTSIZE){
		const labeled = labels !== [];
		for (let i = 0; i < this.length; i++) {
			let lab = labeled ? labels[i] : '';
			this[i].draw(ctx,lab,color,size);
		}
	}
	
	//
	//
	// distanceTo(a) {
	// 	const dx = a.x - this.x;
	// 	const dy = a.y - this.y;
	//
	// 	return Math.hypot(dx, dy);
	// }
	//
	// distanceToSq(a) {
	// 	const dx = this.x - a.x;
	// 	const dy = this.y - a.y;
	// 	return dx * dx + dy * dy;
	// }
  
}
