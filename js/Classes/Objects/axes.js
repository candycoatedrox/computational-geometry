class Axes {
	
	
	constructor(a,b) {		
		this.xAxis = new Vector(a,0); 	
		this.yAxis = new Vector(0,b); 
	}
  
  	set(ax, ay){
  		this.xAxis.set(ax.x,ax.y);
		this.yAxis.set(ay.x,ay.y);
  	}
	
	fromCanvas(canvas){		
		const r = canvas.getBoundingClientRect();
		const w = r.width;
		const h = r.height;
		
		this.xAxis = new Vector(h/10,0); 	
		this.yAxis = new Vector(0,-h/10);
	}
	
	print(message){
		console.log(message + "[" + JSON.stringify(this.orxAxisigin) + "," + JSON.stringify(this.yAxis) +"]");
	}
	
	draw(ctx, origin, color = AXESCOLOR){
		// console.log("In Axes.draw: AXESCOLOR =" + JSON.stringify(AXESCOLOR));
		// console.log("In Axes.draw: color =" + JSON.stringify(color));
		Draw.axes(ctx, origin, this.xAxis, this.yAxis, color);
	}
 
}

