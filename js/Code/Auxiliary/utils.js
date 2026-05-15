// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const Utils = {
	rand: (a, b) => a + Math.random() * (b - a),
	clamp: (t, a, b) => Math.max(a, Math.min(b, t)),
	
	
	// Box and range
	makeCBox(canvas, box){
	    const xmin = box.x - box.boxRange;
	    const xmax = box.x + box.boxRange;
	    const ymin = box.y - box.boxRange;
	   	const ymax = box.y + box.boxRange;
				
		const wPts = [
			{x: xmin , y: ymin},
			{x: xmax , y: ymin},
			{x: xmax , y: ymax},
			{x: xmin , y: ymax}
		];

		const edges = [[0,1],[1,2],[2,3],[3,0]];
		
		const cPts = Transform.worldToCanvasPoints(canvas,wPts);
		return [cPts, edges];
	},
	rangeToBox(range){
		// {xRange:{xMin:0,xMax:600},yRange:{yMin:0,yMax:600}};
		
	    const xmin = range.xRange.xMin;
	    const xmax = range.xRange.xMax;
	    const ymin = range.yRange.yMin;
	   	const ymax = range.yRange.yMax;
		
		const boxPts = [
			{x: xmin , y: ymin},
			{x: xmax , y: ymin},
			{x: xmax , y: ymax},
			{x: xmin , y: ymax}
		];
		
		// console.log("In rangeToBox: boxPts =" + JSON.stringify(boxPts));
		
		const boxEdges = [[0,1],[1,2],[2,3],[3,0]];
		return {pts: boxPts, edges: boxEdges};
	},
	boxFromRange(range){
		
	    const xmin = range.xRange.xMin;
	    const xmax = range.xRange.xMax;
	    const ymin = range.yRange.yMin;
	   	const ymax = range.yRange.yMax;
		
		const boxPts = [
			{x: xmin , y: ymin},
			{x: xmax , y: ymin},
			{x: xmax , y: ymax},
			{x: xmin , y: ymax}
		];
		
		// console.log("In rangeToBox: boxPts =" + JSON.stringify(boxPts));
		
		const boxEdges = [[0,1],[1,2],[2,3],[3,0]];
		return {pts: boxPts, edges: boxEdges};
		
	},
	
	// Range, box from canvas
	rangeFromCanvas(canvas){
		const r = canvas.getBoundingClientRect();
		const w = r.width;
		const h = r.height;
		
		return {xRange:{xMin:0,xMax:w},yRange:{yMin:0,yMax:h}};
	},
	boxFromCanvas(canvas){
		const r = canvas.getBoundingClientRect();
		const w = r.width;
		const h = r.height;
		
	    const xMin = 0;
	    const xMax = w;
	    const yMin = 0;
	   	const yMax = h;
		
		const boxPts = [
			{x: xMin , y: yMin},
			{x: xMax , y: yMin},
			{x: xMax , y: yMax},
			{x: xMin , y: yMax}
		];
		
		// console.log("In rangeToBox: boxPts =" + JSON.stringify(boxPts));
		
		const boxEdges = [[0,1],[1,2],[2,3],[3,0]];
		return {pts: boxPts, edges: boxEdges};
		
	},
	
	// Range
	range(start, stop, step = 1){return Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);},
	stdRange1(n){return Array.from({ length: n }, (_, i) => i+1);},
	stdRange(n){return Array.from({ length: n }, (_, i) => i);},

	// To String: for printing point coordinates
	pointsToString(fieldId, pts){
		const string = pts.map((p,i)=>
	      `<div class= ${fieldId} > pt${i+1}: <span>(${Math.round(p.x)}, ${Math.round(p.y)})</span></div>`
	    ).join('');
		return string;
	},
	nrToString(fieldId, nr, text){
		const string = 
		`<div class= ${fieldId} > ${text}: <span>${Math.round(nr)}</span></div>`;
		return string;
	},
	pointsLabelsToString(fieldId, pts,labs){
		const string = pts.map(
			(p,i)=>
			`<div class= ${fieldId} >${labs[i]}: <span>(${Math.round(p.x)}, ${Math.round(p.y)})</span>`
	    	).join('');
		return string;
	},
	pointLabelToString(fieldId, pt,lab){
		const str = `<div class= ${fieldId} >${lab}: <span>(${Math.round(pt.x)}, ${Math.round(pt.y)})</span>`;
		return str;
	},
	
	pointCoordsToString(pt){
		const str = `<span>(${Math.round(pt.x)}, ${Math.round(pt.y)})</span>`;
		return str;
	},
	pointCoordsToTdString(pt){
		const str = `<td><span>(${Math.round(pt.x)}, ${Math.round(pt.y)})</span></td>`;
		return str;
	},
	pointCoordsCWToTdString(ptC, ptW){
		const strC = `<td><span>(${Math.round(ptC.x)}, ${Math.round(ptC.y)})</span></td>`;
		const strW = "<td><span>" + this.pointCoordsWToString(ptW) + "</span></td>";
		return strC + strW;
	},
	pointCoordsCWLabToTdString(ptC, ptW, lab){
		const strL = `<td><span>${lab}</span></td>`;
		const strC = `<td><span>(${Math.round(ptC.x)}, ${Math.round(ptC.y)})</span></td>`;
		const strW = "<td><span>" + this.pointCoordsWToString(ptW) + "</span></td>";
		return '<tr>' + strL + strC + strW + '</tr>';
	},
	// in table format for both C and W coordinates
	pointsCoordsCWLabsToTableString(ptsC, ptsW, labs){
		// let str= "<table><tr><th><h3>Label</h3></th><th><h3>Canvas</h3></th><th><h3>World</h3></th><tr>"
		let str= "<table><tr><th>Label</th><th>Canvas</th><th>World</th><tr>"
		for (let i = 0; i < ptsC.length; i++){
			str += this.pointCoordsCWLabToTdString(ptsC[i], ptsW[i], labs[i]);
		}
		str += "</table>";
		// console.log("In pointsCoordsCWLabsToTrString: str = " + str);
		return str;
	},

	pointCoordsWToString(ptW) {
		let xStr = ptW.x.toPrecision(3);
		let yStr = ptW.y.toPrecision(3);
		console.log("xStr = " + xStr + ", yStr = " + yStr);

		// cut off trailing zeroes for whole numbers
		if (xStr.endsWith(".00")) {
			xStr = Math.round(ptW.x);
		}
		if (yStr.endsWith(".00")) {
			yStr = Math.round(ptW.y);
		}

		return xStr + ", " + yStr;
	},
	
	// Polygon
	stdPolygonEdges(n){return Array.from({ length: n }, (_, i) => [i, (i+1) % n]);},
	stdPolygonFace(n){return Array.from({ length: n }, (_, i) => i);},
	
	// Random Points
	makeRandomPoint(canvas){ 
		const r = canvas.getBoundingClientRect();
		const w = r.width;
		const h = r.height;
		let xCoord = Utils.rand(0,w);
		let yCoord = Utils.rand(0, h);
		let newPt = {x: xCoord, y: yCoord};
		return newPt;
	},
	makeRandomPoints(canvas, nr){ 
		const r = canvas.getBoundingClientRect();
		const w = r.width;
		const h = r.height;
		
		let pts = [];
		for (let i = 0; i< nr; i++){
			let xCoord = Utils.rand(0,w);
			let yCoord = Utils.rand(0, h);
			let newPt = {x: xCoord, y: yCoord};
			pts.push(newPt);
		}
		return pts;
	},
	
	// Random Graph
	makeRandomGraph(canvas, nr){ 
		// const r = canvas.getBoundingClientRect();
		// const minX = r.left;
		// const maxX = r.right;
		// console.log("minX = " + JSON.stringify(minX));
		// console.log("maxX = " + JSON.stringify(maxX));
		//
		// const minY = r.top;
		// const maxY = r.bottom;
		// console.log("minY = " + JSON.stringify(minY));
		// console.log("maxY = " + JSON.stringify(maxY));
		//
		// let pts = [];
		// for (let i = 0; i< nr; i++){
		// 	let xCoord = Utils.rand(minX, maxX);
		// 	// console.log("xCoord = " + JSON.stringify(xCoord));
		// 	let yCoord = Utils.rand(minY, maxY);
		// 	// console.log("yCoord = " + JSON.stringify(yCoord));
		// 	let newPt = {x: xCoord, y: yCoord};
		// 	// console.log("newPt = " + JSON.stringify(newPt));
		// 	pts.push(newPt);
		// };
		
		const pts = Utils.makeRandomPoints(canvas,nr);
		const labs = Utils.stdRange1(nr);
		
		// STUBS
		const edges = Utils.stdPolygonEdges(nr);
		const faces = [Utils.stdPolygonFace(nr)];
		
		return {points:pts,labels:labs,edges:edges,faces:faces};
	}
	
  // log: (msg) => {
  //   elements.log.value += msg + "\n";
  //   elements.log.scrollTop = elements.log.scrollHeight;
  // }
};

const ConvertPoint = {
	
	canvasToWorldCoords(ptC, originC, xAxisC, yAxisC){
		const xAxisLgC = xAxisC.x;
		const yAxisLgC = yAxisC.y;
		
		const xW = (ptC.x - originC.x)/xAxisLgC;
		const yW = (ptC.y - originC.y)/yAxisLgC;

		//console.log("IN canvasToWorldCoords:  xAxisLgC = " + JSON.stringify(xAxisLgC));
		//console.log("IN canvasToWorldCoords:  yAxisLgC = " + JSON.stringify(yAxisLgC));
		//console.log("IN canvasToWorldCoords: xW = " + ptC.x + " - " + originC.x + "/ xAxisLgC");
		//console.log("IN canvasToWorldCoords: yW = " + ptC.y + " - " + originC.y + "/ yAxisLgC");

		return {x:xW, y:yW};
	},
	
	// NOT TESTED
	worldToCanvasCoords(ptW, originC, xAxisLgC, yAxisLgC){
		// console.log("......IN worldToCanvasCoords:  originC = " + JSON.stringify(originC));
		// console.log("IN worldToCanvasCoords:  xAxisLgC = " + JSON.stringify(xAxisLgC));
		// console.log("IN worldToCanvasCoords:  yAxisLgC = " + JSON.stringify(yAxisLgC));
		
		// console.log("====== IN worldToCanvasCoords:  ptW = " + JSON.stringify(ptW));
		
		const xC = (ptW.x * xAxisLgC) + originC.x;
		// console.log("IN worldToCanvasCoords:  xC = " + JSON.stringify(xC));
		
		const yC = (ptW.y * yAxisLgC) + originC.y;
		// console.log("IN worldToCanvasCoords:  yC = " + JSON.stringify(yC));
		
		return {x:xC, y:yC};
	}
}

const ConvertPoints = {
	
	canvasToWorldCoords(ptsC, originC, xAxisC, yAxisC){
		let res = [];
		for(let i = 0; i<ptsC.length; i++){
			res.push(ConvertPoint.canvasToWorldCoords(ptsC[i], originC, xAxisC, yAxisC));
		}
		return res;
	},
	
	// NOT TESTED
	worldToCanvasCoords(ptsW, originC, xAxisLgC, yAxisLgC){
		let res = [];
		for(let i = 0; i<ptsW.length; i++){
			res.push(ConvertPoint.worldToCanvasCoords(ptsW[i],originC,xAxisLgC, yAxisLgC));
		}
		return res;
	}
}
