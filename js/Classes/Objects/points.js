class Points extends Array {
	
	translate(vec){
		for (let i = 0; i< this.length; i++)
		{
			this[i].addTo(vec);
		}
	}

	snapToCanvas(canvas) {
		for (let i = 0; i < this.length; i++) {
			this[i].snapToCanvas(canvas);
		}
	}
	
	draw(ctx, color = POINTCOLOR, size = POINTSIZE){
  	  for (let i = 0; i< this.length; i++)
	  {
		  this[i].draw(ctx,color,size);
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
