class OriginAxes extends Origin{
	constructor(canvas) {
		this.origin = new Origin(canvas);
		this.axes = new Axes(canvas);							
	}
  
  	setOrigin(a,b){
  		this.origin.point.set(a,b);
  	}
	
  	setAxes(ax,ay){
  		this.axes.set(ax,ay);
  	}
	
	fromCanvas(canvas){		
		this.origin.fromCanvas(canvas); 
		this.axes.fromCanvas(canvas);
	}
	
	print(message){
		console.log(message + " " + JSON.stringify(this));
	}
	
// 	draw(ctx){
// 		console.log("=== 1. In OriginAxes.draw. origin.point = " + JSON.stringify(this.origin.point));
// 		console.log("=== 2. In OriginAxes.draw. axes = " + JSON.stringify(this.axes));
// 		const ptX = structuredClone(this.origin.point);
// 		console.log("=== 3. In OriginAxes.draw. ptX = " + JSON.stringify(ptX));
//
//
// 		const trPtX =  structuredClone(ptX.translatedByVector(this.axes.xAxis));
// 		console.log("=== 4. In OriginAxes.draw. trPtX = " + JSON.stringify(trPtX));
//
// 		// Draw.arrow(ctx, this.origin.point, ptX.translatedByVector(this.axes.xAxis));
// // 		const ptY = structuredClone(this.origin.point).translatedByVector(this.axes.yAxis);
// // 		Draw.arrow(ctx, this.origin.point, ptY);
//
// 		this.origin.draw(ctx);
// 	}
  
}

