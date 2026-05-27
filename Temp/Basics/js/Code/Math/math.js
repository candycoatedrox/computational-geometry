'use strict';
// ============================================================================
// CONSTANTS
// ============================================================================
const TOLERANCE = { RECTA: 0.03, PERP: 0.05 };
const BOX_V = 105;
const MAX_CYCLES = 100;
const RADIUS = { RED: 14, BLUE: 12, HIT: 14, MIDPOINT: 10 };
const RAY_OPTS = {
  hitVeps: 0.20,
  epsStep: 0.05,
  minT: 1e-3,
  minSegLen: 1e-2,
  startIgnoreHit: 0.30,
  startKick: 0.20
};
const ARROW_OPTS = {
  color: "red",
  outline: "white",
  headLen: 18,
  headWid: 12,
  inset: 0.58,
  outlineW: 4.2,
  fillW: 2.8
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const Utils = {
	rand: (a, b) => a + Math.random() * (b - a),
	clamp: (t, a, b) => Math.max(a, Math.min(b, t)),
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
	pointsToString(pts){
		const string = pts.map((p,i)=>
	      `<div class="point-item">pt${i+1}: <span>(${Math.round(p.x)}, ${Math.round(p.y)})</span></div>`
	    ).join('');
		return string;
	}
  // log: (msg) => {
  //   elements.log.value += msg + "\n";
  //   elements.log.scrollTop = elements.log.scrollHeight;
  // }
};

// ============================================================================
// COORDINATE TRANSFORMATIONS
// ============================================================================
// const Transform = {
//
//     worldXToCanvasX(cv, wx) {
// 		// console.log("In worldXToCanvasX: wx = " + JSON.stringify(wx));
// 		const sw = cv.width / (2 * CAMERA.rbox);
// 		// console.log("In worldXToCanvasX: sw = " + JSON.stringify(sw));
// 		// const cx = (wx - (CAMERA.x - CAMERA.rbox)) * sw;
// 		const cx = (wx - (CAMERA.x - CAMERA.rbox)) * sw;
// 		// console.log("In worldXToCanvasX: cx = " + JSON.stringify(cx));
// 		return cx;
//     },
//
//     worldYToCanvasY(cv, wy) {
//       const sh = cv.height / (2 * CAMERA.rbox);
//       return ((CAMERA.y + CAMERA.rbox) - wy) * sh;
//     },
//
// 	worldToCanvas(cv, p) {
// 		const sw = cv.width / (2 * CAMERA.rbox);
// 		const sh = cv.height / (2 * CAMERA.rbox);
// 		return {
// 			x: (p.x - (CAMERA.x - CAMERA.rbox)) * sw,
// 			y: ((CAMERA.y + CAMERA.rbox) - p.y) * sh
// 		};
// 	},
//
//   worldToCanvasPoints(cv, pts) {
//   	  let cPts=[];
//       for (let i = 0; i < pts.length; i++) {
//   		  cPts.push(Transform.worldToCanvas(cv, pts[i]));
//       }
//       return cPts;
//
//   },
//
//   canvasToWorld(cv, x, y) {
//     const sw = cv.width / (2 * CAMERA.rbox);
// 	const sh = cv.height / (2 * CAMERA.rbox);
//     return {
//       x: (CAMERA.x - CAMERA.rbox) + x / sw,
//       y: (CAMERA.y + CAMERA.rbox) - y / sh
//     };
//   },
//
//   canvasXToWorldX(cv, x) {
//     const sw = cv.width / (2 * CAMERA.rbox);
//     return (CAMERA.x - CAMERA.rbox) + x / sw;
//   },
//
//   canvasYToWorldY(cv, y) {
//     const sh = cv.width / (2 * CAMERA.rbox);
//     return (CAMERA.y + CAMERA.rbox) - y / sh;
//   }
//
//  // canvasToWorldPoints(cv,pts) {
//  // 	  let wPts=[];
//  //      for (let i = 0; i < pts.length; i++) {
//  // 		  wPts.push(Transform.canvasToWorld(cv, pts[i].x, pts[i].y));
//  //      }
//  //      return wPts;
//  //
//  //  }
// };

// ============================================================================
// VECTOR MATH
// ============================================================================
const Vec = {
  sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
  add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
  mul: (a, t) => ({ x: a.x * t, y: a.y * t }),
  dot: (a, b) => a.x * b.x + a.y * b.y,
  cross: (a, b) => a.x * b.y - a.y * b.x,
  norm: (a) => Math.hypot(a.x, a.y),
  unit: (a) => {
    const n = Vec.norm(a);
    return (n < 1e-12) ? { x: 0, y: 0 } : { x: a.x / n, y: a.y / n };
  },
  rotate: (v, ang) => {
    const c = Math.cos(ang), s = Math.sin(ang);
    return { x: c * v.x - s * v.y, y: s * v.x + c * v.y };
  }
};

