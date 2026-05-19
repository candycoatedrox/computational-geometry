class Origin extends Point {
	
	constructor(x,y){
		super(x,y);
	}
	
	set(x,y){
		super.set(x,y);
	}
	
	draw(ctx){
		super.draw(ctx,ORIGINCOLOR,ORIGINSIZE);
	}

	fromCanvas(canvas){
		const r = canvas.getBoundingClientRect();
		const w = r.width;
		const h = r.height;
		
		this.set(w/2, h/2);
		// super.set(w/2, h/2);
	}
  	
	debug(){
		console.log("In origin.js" + JSON.stringify(this));
	}
	 
}

