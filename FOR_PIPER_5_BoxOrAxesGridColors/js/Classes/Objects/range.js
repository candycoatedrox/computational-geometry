class Range { 
	
	xRange = null;
	yRange = null;
	
	constructor(xRange,yRange) {
		this.xRange = xRange;
		this.yRange = yRange;
	}
  
  	set(xMin,xMax,yMin,yMax){
		this.xRange.min = xMin;
		this.xRange.max = xMax;
		this.yRange.min = yMin;
		this.yRange.max = yMax;
  	}
	
	fromCanvas(canvas){
		const r = canvas.getBoundingClientRect();
		
		this.xRange.min = 0;
		this.xRange.max = r.width;
		
		this.yRange.min = 0;
		this.yRange.max = r.height;
	}
	
	drawGrid(ctx, origin, xAxis, yAxis){
		
			ctx.strokeStyle = GRIDCOLOR;		
			ctx.lineWidth = GRIDTHICKNESS;
		
			for (let i = origin.x ; i < this.xRange.max; i += xAxis.x) { 
				ctx.beginPath(); 
				ctx.moveTo(i, this.yRange.min);
				ctx.lineTo(i, this.yRange.max);
				ctx.stroke(); 
			}
		
			for (let i = origin.x ; i > this.xRange.min; i -= xAxis.x) {
				ctx.beginPath();
				ctx.moveTo(i, this.yRange.min);
				ctx.lineTo(i, this.yRange.max);
				ctx.stroke();
			}
		
			for (let i = origin.y ; i < this.yRange.max; i -= yAxis.y) {
				ctx.beginPath();
				ctx.moveTo(this.xRange.min, i);
				ctx.lineTo(this.xRange.max, i);
				ctx.stroke();
			}

			for (let i = origin.y ; i > this.yRange.min; i += yAxis.y) {
				ctx.beginPath();
				ctx.moveTo(this.xRange.min, i);
				ctx.lineTo(this.xRange.max, i);
				ctx.stroke();
			}
	}
	  
	print(message){
		console.log(message + JSON.stringify(this));
	}
	
}

