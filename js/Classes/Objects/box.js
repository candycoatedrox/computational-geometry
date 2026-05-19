class Box {
	pts = [];
	edges = [[0,1],[1,2],[2,3],[3,0]];

	constructor(w,h) {

	    const xMin = 0;
	    const xMax = w;
	    const yMin = 0;
	   	const yMax = h;

		this.pts = [
			{x: xMin , y: yMin},
			{x: xMax , y: yMin},
			{x: xMax , y: yMax},
			{x: xMin , y: yMax}
		];
		
	}
	
	setPoints(pts){
		if (pts.length ==4 ){
			this.pts = pts
		} 
	}
	
	set(w,h){
	    const xMin = 0;
	    const xMax = w;
	    const yMin = 0;
	   	const yMax = h;

		this.pts = [
			{x: xMin , y: yMin},
			{x: xMax , y: yMin},
			{x: xMax , y: yMax},
			{x: xMin , y: yMax}
		];
	}
	fromCanvas(canvas) {
		const r = canvas.getBoundingClientRect();
		const w = r.width;
		const h = r.height;

	    const xMin = 0;
	    const xMax = w;
	    const yMin = 0;
	   	const yMax = h;

		this.pts = [
			{x: xMin , y: yMin},
			{x: xMax , y: yMin},
			{x: xMax , y: yMax},
			{x: xMin , y: yMax}
		];
	}
  
	fromRange(range){
		
	    const xmin = range.xRange.xMin;
	    const xmax = range.xRange.xMax;
	    const ymin = range.yRange.yMin;
	   	const ymax = range.yRange.yMax;
		
		this.pts = [
			{x: xmin , y: ymin},
			{x: xmax , y: ymin},
			{x: xmax , y: ymax},
			{x: xmin , y: ymax}
		];
		
		// this.edges = [[0,1],[1,2],[2,3],[3,0]];	
	}
	
	print(message){
		console.log(message + "[" + JSON.stringify(this.x) + "," + JSON.stringify(this.y) +"]");
	}
	
	draw(ctx,  color = BOXCOLOR, width = BOXTHICKNESS){
		Draw.edges(ctx, this.pts, this.edges, color, width);
	}
	
	toRange() {
		// const dx = a.x - b.x;
		// const dy = a.y - b.y;
		//
		// return Math.hypot(dx, dy);
	}
  
}
