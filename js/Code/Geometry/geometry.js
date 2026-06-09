/**
 * geometry.js — Computational Geometry Library
 * A library for 2D geometric operations in JavaScript/HTML.
 *
 * Layers:
 *   1. Basics     — signed triangle area, cross product, dot product, distance, bounding box
 *   2. Predicates     — orientation test, point-in-polygon, segment intersection
 *   3. Structural     — polygon area, convex hull, simple polygon test
 *   4. High-level     — visibility graph, triangulation (ear clipping)
 *   5. Delaunay & Voronoi — Bowyer–Watson + dual construction
 *   6. Shortest path      — visibility graph + Dijkstra
 */

// ============================================================================
// GEOMETRY FUNCTIONS - TO CLEAN UP and CONSOLIDATE
// ============================================================================
const Area2D = {
	signedTriangleDoubleArea(a, b, c){
		return -a.y * b.x + a.x * b.y + a.y * c.x - b.y * c.x - a.x * c.y + b.x * c.y;
	},
  
	signedTriangleArea(a, b, c){
		return (-a.y * b.x + a.x * b.y + a.y * c.x - b.y * c.x - a.x * c.y + b.x * c.y)*0.5;
	},
  
	triangleArea(a, b, c){
		const sArea = this.signedTriangleArea(a, b, c);
		if (sArea > 0) {
			area = sArea;
		  } else if (sArea < 0)
		  {
			  area = - sArea;
		  } else
		  {
			  area = 0;
		  }
		  return area;
	  }	
}

const Orientation = {	
	orientation(a, b, c) {
      const v = Area2D.signedTriangleDoubleArea(a, b, c);
      if (v > 0) return 1; 	// left turn
      if (v < 0) return -1;	// right turn
      return 0;
    },
	leftTurn(a, b, c) {
      const sign = this.orientation(a, b, c);
      if (sign > 0) return true;
      if (sign < 0) return false;
      return false;
    },
	rightTurn(a, b, c) {
      const sign = this.orientation(a, b, c);
      if (sign > 0) return false;
      if (sign < 0) return true;
      return false; 
    },
	collinear(a, b, c) {
      const sign = this.orientation(a, b, c);
      if (sign == 0) return true;
      return false;
    }	
};

const Geometry1 = {

  angleBisector(A, B, C) {
    let uCoords = A.distanceToCoords(B);
    let vCoords = A.distanceToCoords(C);
    let uVec = new Vector(uCoords.x, uCoords.y);
    let vVec = new Vector(vCoords.x, vCoords.y);

    let result = vVec.multiply(uVec.vectorLength()).add(uVec.multiply(vVec.vectorLength()));
    return result;
  },
	
	ccwAngle(A, B, C) {	  
		const a2 = this.distanceSq(B,C);
		const a = Math.sqrt(a2);
		const b2 = this.distanceSq(A,C);
		const b = Math.sqrt(b2);
		const c2 = this.distanceSq(A,B);
		const c = Math.sqrt(c2);
	  
		let angleAtB = Math.acos((a2 + c2 - b2)/(2*a*c));
		// console.log("In Geometry.ccwAngle: angleAtB = " + JSON.stringify(angleAtB));
	  
		let angleCcw;
	  
		if (Orientation.rightTurn(A,B,C)){
			// ccw angle is larger than Pi
			// console.log("In Geometry.ccwAngle: rightTurn(A,B,C) = " + JSON.stringify(rightTurn(A,B,C)));
			// console.log("In Geometry.ccwAngle: Math.PI = " + JSON.stringify(Math.PI));
			// angleCcw = angleAtB + Math.PI;
			angleCcw = 2*Math.PI - angleAtB; 
			// console.log("In Geometry.ccwAngle: angleCcw = " + JSON.stringify(angleCcw));
		} else if (Orientation.leftTurn(A,B,C))
		{
			// console.log("In Geometry.ccwAngle: leftTurn(A,B,C) = " + JSON.stringify(leftTurn(A,B,C)));
			// ccw angle is smaller than Pi
			angleCcw = angleAtB; 
			// console.log("In Geometry.ccwAngle: angleCcw = " + JSON.stringify(angleCcw));
		} else
		{
			// collinear: angle is 0 or Pi or 2Pi TODO and must clarify
			// STUB
			angleCcw = 0;
		}
		// console.log("In Geometry.ccwAngle. angleCcw = " + JSON.stringify(angleCcw));
		return angleCcw; 
	},
	
    ccwAngleBetweenVectors(A,B){
  	  const orig = {x:0, y:0};
  	  return this.ccwAngle(A,orig,B);
    },

  circumcenter(A,B,C) {
    const angleA = this.smallestAngle(B,A,C);
    const angleB = this.smallestAngle(A,B,C);
    const angleC = this.smallestAngle(A,C,B);
    
    const cx = (A.x*Math.sin(2*angleA) + B.x*Math.sin(2*angleB) + C.x*Math.sin(2*angleC)) / (Math.sin(2*angleA) + Math.sin(2*angleB) + Math.sin(2*angleC));
    const cy = (A.y*Math.sin(2*angleA) + B.y*Math.sin(2*angleB) + C.y*Math.sin(2*angleC)) / (Math.sin(2*angleA) + Math.sin(2*angleB) + Math.sin(2*angleC));

    return {x:cx, y:cy};
  },

  circumradius(A,B,C) {
    const sides = this.triangleSideLengths(A,B,C);
    const angleA = this.smallestAngle(B,A,C);
    const r = (sides.a / Math.sin(angleA)) / 2;

    return r;
  },
	
	distance(a, b) {
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		const dxy = dx * dx + dy * dy;
		const dd = Math.sqrt(dxy);
		return dd;
	},
	
	distanceSq(a, b) {
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		const dxy = dx * dx + dy * dy;
		return dxy;
	},

  excenter(A,B,C) { // finds the excenter opposite to the first vertex A
    const sides = this.triangleSideLengths(A,B,C);

    const cx = (-sides.a*A.x + sides.b*B.x + sides.c*C.x) / (-sides.a + sides.b + sides.c);
    const cy = (-sides.a*A.y + sides.b*B.y + sides.c*C.y) / (-sides.a + sides.b + sides.c);

    return {x:cx, y:cy};
  },

  exradius(A,B,C) { // finds the radius of the excircle opposite to the first vertex A
    const sides = this.triangleSideLengths(A,B,C);
    const s = this.semiperimeter(A,B,C);

    const r = Area2D.triangleArea(A,B,C) / (s - sides.a);
    return r;
  },

  incenter(A,B,C) {
    const sides = this.triangleSideLengths(A,B,C);

    const cx = (sides.a*A.x + sides.b*B.x + sides.c*C.x) / (sides.a + sides.b + sides.c);
    const cy = (sides.a*A.y + sides.b*B.y + sides.c*C.y) / (sides.a + sides.b + sides.c);

    return {x:cx, y:cy};
  },

  inradius(A,B,C) {
    return Area2D.triangleArea(A,B,C) / this.semiperimeter(A,B,C);
  },
	
	isPerpendicular(seg, edgeVec) {
      const ux = seg.bx - seg.ax, uy = seg.by - seg.ay;
      const vx = edgeVec.x, vy = edgeVec.y;
      const den = Math.hypot(ux, uy) * Math.hypot(vx, vy);
      if (den <= 1e-12) return false;
      const c = Math.abs((ux * vx + uy * vy) / den);
      return c <= TOLERANCE.PERP;
    },

    // Check if segment AB lies entirely inside polygon poly (including boundary)
	isSegmentInsidePolygon(poly, A, B) {
      // Robust diagonal test: A and B are vertices of poly.
      // 1. Sample several interior points along AB — all must be inside.
      // 2. AB must not properly cross any polygon edge.
      const eps  = 1e-7;
      const veps = 1e-6;
      const SAMPLES = 7;
      for (let i = 1; i < SAMPLES; i++) {
        const t   = i / SAMPLES;
        const mid = { x: A.x + t*(B.x-A.x), y: A.y + t*(B.y-A.y) };
        if (!this.pointInPolygon(mid, poly)) return false;
      }
      const m = poly.length;
      for (let i = 0; i < m; i++) {
        const C = poly[i], D = poly[(i+1) % m];
        const r = Vec.sub(B, A), s = Vec.sub(D, C);
        const denom = Vec.cross(r, s);
        if (Math.abs(denom) < eps) continue;
        const w = Vec.sub(C, A);
        const t = Vec.cross(w, s) / denom;
        const u = Vec.cross(w, r) / denom;
        if (t > veps && t < 1-veps && u > veps && u < 1-veps) return false;
      }
      return true;
    },
	
	lineSegIntersection(P, Q, A, B, eps = 1e-10) {
      const dir = Vec.sub(Q, P);
      const s = Vec.sub(B, A);
      const w = Vec.sub(A, P);
      const den = Vec.cross(dir, s);
      if (Math.abs(den) < eps) return null;
      const t = Vec.cross(w, s) / den;
      const u = Vec.cross(w, dir) / den;
      if (t > -eps && t < 1 + eps && u > -eps && u < 1 + eps) {
        const tt = Utils.clamp(t, 0, 1);
        const X = Vec.add(P, Vec.mul(dir, tt));
        return { t: tt, u: Utils.clamp(u, 0, 1), X };
      }
      return null;
    },

  nearestEdge(P, pts, edges) {
    let edge = edges[0];
    let lowDist = this.pointLineDistance(P, pts[edges[0][0]], pts[edges[0][1]]);
    for (let i = 1; i < edges.length; i++) {
      let dxy = this.pointLineDistance(P, pts[edges[i][0]], pts[edges[i][1]]);
      if (dxy < lowDist) {
        edge = edges[i];
        lowDist = dxy;
      }
    }

    return edge;
  },

  nearestEdgeByMidpoint(P, pts, edges) {
    let edge = edges[0];
    let lowDist = this.distance(P, this.midpoint(pts[edges[0][0]], pts[edges[0][1]]));
    for (let i = 1; i < edges.length; i++) {
      let dxy = this.distance(P, this.midpoint(pts[edges[i][0]], pts[edges[i][1]]));
      if (dxy < lowDist) {
        edge = edges[i];
        lowDist = dxy;
      }
    }

    return edge;
  },

	midpoint(i, j) {
      return {
        x: (i.x + j.x) / 2,
        y: (i.y + j.y) / 2
      };
    },
	
	pointFromT(a, b, t) {
		return {
			x: a.x + t * (b.x - a.x),
			y: a.y + t * (b.y - a.y)
		};
	},

	pointInPolygon(P, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const A = poly[i], B = poly[j];
      const intersect = ((A.y > P.y) !== (B.y > P.y)) &&
        (P.x < (B.x - A.x) * (P.y - A.y) / (B.y - A.y + 1e-30) + A.x);
      if (intersect) inside = !inside;
    }
    return inside;
  },

  pointInTriangle(P, A, B, C) {
		let signAB = Area2D.signedTriangleDoubleArea(P,A,B);
		let signBC = Area2D.signedTriangleDoubleArea(P,B,C);
		let signCA = Area2D.signedTriangleDoubleArea(P,C,A);
		
		if (signAB > 0) {
			return signBC > 0 && signCA > 0;
		} else if (signAB < 0) {
			return signBC < 0 && signCA < 0;
		} else {
			return false;
		}
  },
	
	pointLineDistance(p, a, b) {
    const abx = b.x - a.x, aby = b.y - a.y;
    const den = abx * abx + aby * aby;
    if (den <= 1e-12) return Infinity;
    const t = ((p.x - a.x) * abx + (p.y - a.y) * aby) / den;
    const qx = a.x + t * abx, qy = a.y + t * aby;
    return Math.hypot(p.x - qx, p.y - qy);
  },
  
	polygonEdges(poly) {
		return poly.map((A, i) => ({
			A,
			B: poly[(i + 1) % poly.length],
			i
		}));
	},

  polygonSideLengths(poly, edges) {
    let s = [];
    for (let i = 0; i < edges.length; i++) {
      s.push(this.distance(poly[edges[i][0]], poly[edges[i][1]]));
    }
    
    return s;
  },

	projectionT(p, a, b) {
    const abx = b.x - a.x, aby = b.y - a.y;
    const den = abx * abx + aby * aby;
    if (den <= 1e-12) return null;
    const t = ((p.x - a.x) * abx + (p.y - a.y) * aby) / den;
    return Utils.clamp(t, 0, 1);
  },
  
	raySegIntersection(P, dir, A, B, eps = 1e-10) {
		const r = dir;
		const s = Vec.sub(B, A);
		const w = Vec.sub(A, P);
		const den = Vec.cross(r, s);
		if (Math.abs(den) < eps) return null;
		const t = Vec.cross(w, s) / den;
		const u = Vec.cross(w, r) / den;
		if (t > eps && u > -eps && u < 1 + eps) {
			const uu = Utils.clamp(u, 0, 1);
			const X = Vec.add(A, Vec.mul(s, uu));
			return { t, u: uu, X };
		}
		return null;
	},
  
	segSegIntersection(A, B, C, D) {
		const r=Vec.sub(B,A), s=Vec.sub(D,C), denom=Vec.cross(r,s);
		if (Math.abs(denom)<1e-8) return false;
		const w=Vec.sub(C,A), t=Vec.cross(w,s)/denom, u=Vec.cross(w,r)/denom;
		return t>1e-4 && t<1-1e-4 && u>1e-4 && u<1-1e-4;
	},

  semiperimeter(A,B,C) {
    const sides = this.triangleSideLengths(A,B,C);
    return (sides.a + sides.b + sides.c)/2;
  },

	signedArea(poly) {
		let A = 0;
		for (let i = 0; i < poly.length; i++) {
			const p = poly[i], q = poly[(i + 1) % poly.length];
			A += p.x * q.y - p.y * q.x;
		}
		return 0.5 * A;
	},

  smallestAngle(A,B,C) { // either CW or CCW, whichever is smaller
    let theta = this.ccwAngle(A,B,C);
    if (theta > Math.PI) theta = 2*Math.PI - theta;
    return theta;
  },

  triangleSideLengths(A,B,C) {
    const a = this.distance(B,C);
    const b = this.distance(A,C);
    const c = this.distance(A,B);
    
    return {a:a, b:b, c:c};
  },

  vectorBetween(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    return {x:dx, y:dy};
  },

  vectorCoordinates(r, theta) {
    let rx = r*Math.cos(theta);
    let ry = r*Math.sin(theta);
    if (rx < 1e-10 && rx > -1e-10) rx = 0;
    if (ry < 1e-10 && ry > -1e-10) ry = 0;
    return {x:rx, y:ry};
  },
  
	vectorLength(a) {
		const dx = a.x;
		const dy = a.y;
		const dxy = dx * dx + dy * dy;
		const dd = Math.sqrt(dxy);
		// console.log("dd = " + JSON.stringify(dd));
		return dd;
	}
};


const Geometry = (() => {
  "use strict";

  // ─────────────────────────────────────────────────────────────
  // LAYER 1 · BASICS
  // ─────────────────────────────────────────────────────────────
	
  function signedTriangleDoubleArea(a, b, c){
	  return -a.y * b.x + a.x * b.y + a.y * c.x - b.y * c.x - a.x * c.y + b.x * c.y;
  }
  
  function signedTriangleArea(a, b, c){
	  return (-a.y * b.x + a.x * b.y + a.y * c.x - b.y * c.x - a.x * c.y + b.x * c.y)*0.5;
  }
  
  function triangleArea(a, b, c){
	  const sArea = signedTriangleArea(a, b, c);
	  if (sArea < 0) {
		  area = sArea;
	  } else if (sArea > 0)
	  {
	  	area = - sArea;
	  } else
	  {
		  area = 0;
	  }
	  return area;
  }

  /**
   * 2D cross product of vectors AB and AC.
   * Equivalent to the determinant |AB AC|.
   * @param {{x,y}} a
   * @param {{x,y}} b
   * @param {{x,y}} c
   * @returns {number}
   */
  function cross2D(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  }

  /**
   * 2D dot product of vectors AB · AC.
   * @param {{x,y}} a
   * @param {{x,y}} b
   * @param {{x,y}} c
   * @returns {number}
   */
  function dot2D(a, b, c) {
    return (b.x - a.x) * (c.x - a.x) + (b.y - a.y) * (c.y - a.y);
  }

  /**
   * Euclidean distance between two points.
   * @param {{x,y}} a
   * @param {{x,y}} b
   * @returns {number}
   */
  function distance(a, b) {
	  const dx = b.x - a.x;
	  const dy = b.y - a.y;
	  const dxy = dx * dx + dy * dy;
	  const dd = Math.sqrt(dxy);
	  return dd;
  }
  
  function vectorLength(a) {
	  const dx = a.x;
	  const dy = a.y;
	  const dxy = dx * dx + dy * dy;
	  const dd = Math.sqrt(dxy);
	  // console.log("dd = " + JSON.stringify(dd));
	  return dd;
  }

  /**
   * Squared distance (avoids sqrt, useful for comparisons).
   * @param {{x,y}} a
   * @param {{x,y}} b
   * @returns {number}
   */
  function distanceSq(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y;
    return dx * dx + dy * dy;
  }

  /**
   * Axis-aligned bounding box of a point array.
   * @param {{x,y}[]} points
   * @returns {{minX, minY, maxX, maxY}}
   */
  function boundingBox(points) {
    if (!points || points.length === 0) throw new Error("Empty point array");
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of points) {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
    return { minX, minY, maxX, maxY };
  }

  /**
   * Returns true if two bounding boxes overlap.
   * @param {{minX,minY,maxX,maxY}} bb1
   * @param {{minX,minY,maxX,maxY}} bb2
   * @returns {boolean}
   */
  function boundingBoxesOverlap(bb1, bb2) {
    return bb1.maxX >= bb2.minX && bb2.maxX >= bb1.minX &&
           bb1.maxY >= bb2.minY && bb2.maxY >= bb1.minY;
  }


  /**
   * Angle in radians of vector ab with the x-axis
   * @param {{x,y}} a  origin
   * @param {{x,y}} b  target
   * @returns {number} angle in [-π, π]
   */
  // function angleTo(a, b) {
  //   return Math.atan2(b.y - a.y, b.x - a.x);
  // }
  function segmentSlopeAngle(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }
  
  function slopeAngle(x, y) {
    return Math.atan2(y, x);
  }
  
  /**
   * Ccw angle in radians at vertex B, from point A toward point C.
   * @param {{x,y}} a  origin
   * @param {{x,y}} b  target
   * @returns {number} angle in [-π, π]
   */
  function ccwAngle(A, B, C) {
	  // const slopeAB = segmentSlopeAngle(A, B);
	  // const slopeCB = slopeAngle(B, C);
	  
	  const a2 = distanceSq(B,C);
	  const a = Math.sqrt(a2);
	  const b2 = distanceSq(A,C);
	  const b = Math.sqrt(b2);
	  const c2 = distanceSq(A,B);
	  const c = Math.sqrt(c2);
	  
	  let angleAtB = Math.acos((a2 + c2 - b2)/(2*a*c));
	  // console.log("In Geometry.ccwAngle: angleAtB = " + JSON.stringify(angleAtB));
	  
	  let angleCcw;
	  
	  if (rightTurn(A,B,C)){
		  // ccw angle is larger than Pi
		  // console.log("In Geometry.ccwAngle: rightTurn(A,B,C) = " + JSON.stringify(rightTurn(A,B,C)));
		  // console.log("In Geometry.ccwAngle: Math.PI = " + JSON.stringify(Math.PI));
		  // angleCcw = angleAtB + Math.PI;
		  angleCcw = 2*Math.PI - angleAtB; 
		  // console.log("In Geometry.ccwAngle: angleCcw = " + JSON.stringify(angleCcw));
		  
	  	
	  } else if (leftTurn(A,B,C))
	  {
		  // console.log("In Geometry.ccwAngle: leftTurn(A,B,C) = " + JSON.stringify(leftTurn(A,B,C)));
		  // ccw angle is smaller than Pi
		  angleCcw = angleAtB; 
		  // console.log("In Geometry.ccwAngle: angleCcw = " + JSON.stringify(angleCcw));
	  } else
	  {
		  // collinear: angle is 0 or Pi or 2Pi TODO and must clarify
		  // STUB
		  angleCcw = 0;
	  }

	  
	  // console.log("In Geometry.ccwAngle. angleCcw = " + JSON.stringify(angleCcw));
	  return angleCcw; 
  }

  function ccwAngleBetweenVectors(A,B){
	  const orig = {x:0, y:0};
	  return ccwAngle(A,orig,B);
  }
  /**
   * Midpoint between two points.
   * @param {{x,y}} a
   * @param {{x,y}} b
   * @returns {{x,y}}
   */
  function midpoint(a, b) {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }

  // ─────────────────────────────────────────────────────────────
  // LAYER 2 · PREDICATES
  // ─────────────────────────────────────────────────────────────

  /**
   * ★ ORIENTATION TEST
   * Given three points a, b, c, returns:
   *   +1  → c is to the LEFT of line AB  (counter-clockwise turn)
   *   -1  → c is to the RIGHT of line AB (clockwise turn)
   *    0  → a, b, c are collinear
   *
   * Uses the sign of the 2D cross product (determinant).
   * @param {{x,y}} a
   * @param {{x,y}} b
   * @param {{x,y}} c
   * @returns {1 | -1 | 0}
   */
  
  function orientation(a, b, c) {
    const v = cross2D(a, b, c);
    if (v > 0) return 1; 	// left turn
    if (v < 0) return -1;	// right turn
    return 0;
  }
  
  function leftTurn(a, b, c) {
    const sign = orientation(a, b, c);
    if (sign > 0) return true;
    if (sign < 0) return false;
    return false;
  }
  
  function rightTurn(a, b, c) {
    const sign = orientation(a, b, c);
    if (sign > 0) return false;
    if (sign < 0) return true;
    return false; 
  }
  
  function collinear(a, b, c) {
    const sign = orientation(a, b, c);
    if (sign == 0) return true;
    return false;
  }
  

  /**
   * Returns true if point p lies on segment [a, b].
   * Assumes a, b, p are already known to be collinear.
   * @param {{x,y}} a
   * @param {{x,y}} b
   * @param {{x,y}} p
   * @returns {boolean}
   */
  function onSegment(a, b, p) {
    return Math.min(a.x, b.x) <= p.x && p.x <= Math.max(a.x, b.x) &&
           Math.min(a.y, b.y) <= p.y && p.y <= Math.max(a.y, b.y);
  }

  /**
   * ★ SEGMENT INTERSECTION TEST
   * Decides whether segment [p1,p2] and segment [p3,p4] intersect.
   * Handles collinear/degenerate cases correctly.
   * @param {{x,y}} p1
   * @param {{x,y}} p2
   * @param {{x,y}} p3
   * @param {{x,y}} p4
   * @returns {boolean}
   */
  function segmentsIntersect(p1, p2, p3, p4) {
    const d1 = orientation(p3, p4, p1);
    const d2 = orientation(p3, p4, p2);
    const d3 = orientation(p1, p2, p3);
    const d4 = orientation(p1, p2, p4);

    if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
        ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
      return true;
    }
    // Collinear cases
    if (d1 === 0 && onSegment(p3, p4, p1)) return true;
    if (d2 === 0 && onSegment(p3, p4, p2)) return true;
    if (d3 === 0 && onSegment(p1, p2, p3)) return true;
    if (d4 === 0 && onSegment(p1, p2, p4)) return true;
    return false;
  }

  /**
   * Computes the actual intersection point of two lines (not segments).
   * Returns null if lines are parallel.
   * @param {{x,y}} p1
   * @param {{x,y}} p2
   * @param {{x,y}} p3
   * @param {{x,y}} p4
   * @returns {{x,y}|null}
   */
  function lineIntersectionPoint(p1, p2, p3, p4) {
    const denom = (p1.x - p2.x) * (p3.y - p4.y) -
                  (p1.y - p2.y) * (p3.x - p4.x);
    if (Math.abs(denom) < 1e-10) return null; // parallel
    const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y)
    };
  }

  /**
   * ★ POINT IN POLYGON (ray casting)
   * Returns true if point p is strictly inside the polygon.
   * Handles convex and concave polygons. O(n).
   * @param {{x,y}} p
   * @param {{x,y}[]} polygon  array of vertices in order
   * @returns {boolean}
   */
  function pointInPolygon(p, polygon) {
    const n = polygon.length;
    let inside = false;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const vi = polygon[i], vj = polygon[j];
      if (((vi.y > p.y) !== (vj.y > p.y)) &&
          p.x < (vj.x - vi.x) * (p.y - vi.y) / (vj.y - vi.y) + vi.x) {
        inside = !inside;
      }
    }
    return inside;
  }

  /**
   * Shortest distance from point p to segment [a, b].
   * @param {{x,y}} p
   * @param {{x,y}} a
   * @param {{x,y}} b
   * @returns {number}
   */
  function pointToSegmentDistance(p, a, b) {
    const lenSq = distanceSq(a, b);
    if (lenSq < 1e-10) return distance(p, a);
    const t = Math.max(0, Math.min(1,
      ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / lenSq
    ));
    return distance(p, { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) });
  }

  // ─────────────────────────────────────────────────────────────
  // LAYER 3 · STRUCTURAL ALGORITHMS
  // ─────────────────────────────────────────────────────────────

  /**
   * Signed area of a polygon via the Shoelace formula.
   * Positive if vertices are counter-clockwise, negative if clockwise.
   * @param {{x,y}[]} polygon
   * @returns {number}
   */
  function polygonSignedArea(polygon) {
    // Standard shoelace formula: positive for CCW (math convention), negative for CW.
    const n = polygon.length;
    let area = 0;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      area += polygon[j].x * polygon[i].y - polygon[i].x * polygon[j].y;
    }
    return area / 2;
  }

  /**
   * Absolute area of a polygon.
   * @param {{x,y}[]} polygon
   * @returns {number}
   */
  function polygonArea(polygon) {
    return Math.abs(polygonSignedArea(polygon));
  }

  /**
   * Returns true if polygon vertices are ordered counter-clockwise.
   * @param {{x,y}[]} polygon
   * @returns {boolean}
   */
  function isCounterClockwise(polygon) {
    return polygonSignedArea(polygon) > 0;
  }
  
  // STUB - TO ELABORATE - FOR NOW IS JUST TESTING IF SIMPLE
  function isCcwPolygon(polygon) {
    const n = polygon.length;
    if (n < 3) return false;

    // Two edges share a vertex iff they are consecutive in the polygon.
    // We skip those pairs entirely (a shared endpoint is not a crossing).
    for (let i = 0; i < n; i++) {
      const a = polygon[i], b = polygon[(i + 1) % n];

      // Compare edge i against every non-adjacent edge j
      // j starts at i+2 to avoid the immediately following edge (shares vertex b)
      // The last edge (n-1 → 0) shares vertex a with edge 0, so we stop at n-2 for i=0
      const jEnd = (i === 0) ? n - 1 : n;

      for (let j = i + 2; j < jEnd; j++) {
        const c = polygon[j], d = polygon[(j + 1) % n];
        if (segmentsIntersect(a, b, c, d)) return false;
      }
    }
    return true;
  }

  /**
   * Centroid (geometric center) of a polygon.
   * @param {{x,y}[]} polygon
   * @returns {{x,y}}
   */
  function polygonCentroid(polygon) {
    const n = polygon.length;
    let cx = 0, cy = 0, area = 0;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const f = polygon[j].x * polygon[i].y - polygon[i].x * polygon[j].y;
      area += f;
      cx += (polygon[j].x + polygon[i].x) * f;
      cy += (polygon[j].y + polygon[i].y) * f;
    }
    area /= 2;
    return { x: cx / (6 * area), y: cy / (6 * area) };
  }

  /**
   * ★ SIMPLE POLYGON TEST
   * Returns true if the polygon has no self-intersections, i.e. no two
   * non-adjacent edges properly cross each other.
   *
   * Algorithm: O(n²) pairwise check over all non-adjacent edge pairs.
   * This is provably correct for all inputs including:
   *   - Vertical edges
   *   - Collinear edges
   *   - Edges sharing an endpoint (adjacent = always skipped)
   *   - Polygons with vertices at the same X coordinate
   *
   * Note on Shamos–Hoey O(n log n): a correct sweep implementation requires
   * a self-balancing BST that handles edge swaps when two edges cross. Without
   * that structure, adjacent-edge masking causes false negatives in several
   * topologically valid polygon configurations. The O(n²) approach below is
   * simpler, always correct, and fast enough for polygons up to ~10 000 vertices.
   *
   * @param {{x,y}[]} polygon  vertices in cyclic order (CW or CCW)
   * @returns {boolean}
   */
  function isSimplePolygon(polygon) {
    const n = polygon.length;
    if (n < 3) return false;

    // Two edges share a vertex iff they are consecutive in the polygon.
    // We skip those pairs entirely (a shared endpoint is not a crossing).
    for (let i = 0; i < n; i++) {
      const a = polygon[i], b = polygon[(i + 1) % n];

      // Compare edge i against every non-adjacent edge j
      // j starts at i+2 to avoid the immediately following edge (shares vertex b)
      // The last edge (n-1 → 0) shares vertex a with edge 0, so we stop at n-2 for i=0
      const jEnd = (i === 0) ? n - 1 : n;

      for (let j = i + 2; j < jEnd; j++) {
        const c = polygon[j], d = polygon[(j + 1) % n];
        if (segmentsIntersect(a, b, c, d)) return false;
      }
    }
    return true;
  }
 

  /**
   * ★ CONVEX HULL — Andrew's Monotone Chain O(n log n)
   * Returns the vertices of the convex hull in counter-clockwise order.
   * @param {{x,y}[]} points
   * @returns {{x,y}[]}
   */
  function convexHull(points) {
    const n = points.length;
    if (n === 0) return [];
    if (n === 1) return [{ ...points[0] }];
    if (n === 2) {
      // Hull is the segment; return both endpoints (or just one if they coincide)
      const [a, b] = points;
      if (a.x === b.x && a.y === b.y) return [{ ...a }];
      return [{ ...a }, { ...b }];
    }

    const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);

    const lower = [];
    for (const p of pts) {
      while (lower.length >= 2 &&
             cross2D(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
        lower.pop();
      }
      lower.push(p);
    }

    const upper = [];
    for (let i = n - 1; i >= 0; i--) {
      const p = pts[i];
      while (upper.length >= 2 &&
             cross2D(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
        upper.pop();
      }
      upper.push(p);
    }

    // Remove last point of each half (duplicated at junction)
    lower.pop();
    upper.pop();
    return lower.concat(upper);
  }

  /**
   * Returns true if a polygon is convex (all turns same direction).
   * @param {{x,y}[]} polygon
   * @returns {boolean}
   */
  function isConvex(polygon) {
    const n = polygon.length;
    if (n < 3) return false;
    let sign = 0;
    for (let i = 0; i < n; i++) {
      const o = orientation(polygon[i], polygon[(i+1)%n], polygon[(i+2)%n]);
      if (o !== 0) {
        if (sign === 0) sign = o;
        else if (sign !== o) return false;
      }
    }
    return true;
  }

  // ─────────────────────────────────────────────────────────────
  // LAYER 4 · HIGH-LEVEL ALGORITHMS
  // ─────────────────────────────────────────────────────────────

  /**
   * ★ VISIBILITY GRAPH CONSTRUCTION
   * For a simple polygon P with n vertices, computes an n×n boolean matrix
   * Vis where Vis[i][j] = true iff vi and vj can "see" each other without
   * crossing any polygon edge.
   *
   * Algorithm: for each vertex vi, angular sweep of all other vertices vj.
   * Two vertices are mutually visible if the segment vi-vj does not properly
   * cross any non-incident polygon edge.
   *
   * @param {{x,y}[]} polygon  vertices of a simple polygon in cyclic order
   * @returns {boolean[][]}    n×n visibility matrix
   */
  function visibilityGraph(polygon) {
    const n = polygon.length;
    // Initialize: every vertex sees itself and its neighbors
    const Vis = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => {
        if (i === j) return true;
        if (j === (i - 1 + n) % n || j === (i + 1) % n) return true;
        return false;
      })
    );

    const edges = polygon.map((p, i) => [p, polygon[(i + 1) % n], i]);

    // Check if segment p-q is blocked by any non-adjacent polygon edge
    const isVisible = (i, j) => {
      const p = polygon[i], q = polygon[j];
      // Adjacent vertices are always visible (already set above)
      if (Math.abs(i - j) <= 1 || Math.abs(i - j) === n - 1) return true;

      for (let k = 0; k < n; k++) {
        // Skip edges incident to either endpoint
        const next = (k + 1) % n;
        if (k === i || next === i || k === j || next === j) continue;

        if (segmentsIntersect(p, q, polygon[k], polygon[next])) return false;
      }

      // Also check midpoint is inside the polygon
      // (avoids false positives from collinear exterior paths)
      const mid = midpoint(p, q);
      if (!pointInPolygon(mid, polygon)) {
        // Midpoint could be exactly on an edge — treat as visible only for polygon edges
        // For non-adjacent pairs, require midpoint strictly inside
        return false;
      }
      return true;
    };

    for (let i = 0; i < n; i++) {
      for (let j = i + 2; j < n; j++) {
        if (i === 0 && j === n - 1) continue; // already adjacent
        const vis = isVisible(i, j);
        Vis[i][j] = vis;
        Vis[j][i] = vis;
      }
    }

    return Vis;
  }

  /**
   * ★ TRIANGULATION — Ear Clipping O(n²)
   * Decomposes a simple polygon into exactly (n−2) non-overlapping triangles
   * whose union equals the interior of the polygon.
   * Vertices of each output triangle are original polygon vertices (no new points).
   *
   * Works correctly for convex and concave polygons given in CW or CCW order,
   * including polygons in screen coordinates (Y axis pointing down).
   *
   * @param {{x,y}[]} polygon  simple polygon, any winding order
   * @returns {Array<[{x,y},{x,y},{x,y}]>}  array of (n−2) triangles
   */
  function triangulate(polygon) {
    const n = polygon.length;
    if (n < 3) return [];
    if (n === 3) return [[polygon[0], polygon[1], polygon[2]]];

    // ── Working copy: indices into the original vertex array ──────
    // We never mutate 'polygon'; 'remaining' tracks the active vertex ring.
    const remaining = polygon.map((_, i) => i);

    // ── Winding sign ──────────────────────────────────────────────
    // An ear at vertex curr requires a CONVEX turn, whose orientation sign
    // depends on whether the polygon winds CCW (+1) or CW (−1).
    // We derive this from the signed area so the function works for both
    // standard math coords (Y up) and screen coords (Y down).
    const convexSign = polygonSignedArea(polygon) >= 0 ? 1 : -1;

    // ── Point-in-triangle test via orientations ───────────────────
    // Returns true if point p is inside or on the boundary of triangle ABC.
    // All three orientation tests must agree in sign (no mixed pos/neg).
    // We use convexSign so the test works for both winding orders.
    const pointInTriangle = (p, a, b, c) => {
      const d1 = convexSign * orientation(a, b, p);
      const d2 = convexSign * orientation(b, c, p);
      const d3 = convexSign * orientation(c, a, p);
      return d1 >= 0 && d2 >= 0 && d3 >= 0;
    };

    // ── Ear test ──────────────────────────────────────────────────
    // Vertex at position i in 'remaining' is an ear if:
    //   1. The turn at curr is convex (orientation === convexSign).
    //   2. No other ACTIVE vertex lies strictly inside the triangle.
    const isEar = (i) => {
      const len = remaining.length;
      const iPrev = (i - 1 + len) % len;
      const iNext = (i + 1) % len;
      const a = polygon[remaining[iPrev]];
      const b = polygon[remaining[i]];
      const c = polygon[remaining[iNext]];

      // Must be a convex turn
      if (orientation(a, b, c) !== convexSign) return false;

      // No active (remaining) vertex may lie inside the ear triangle.
      // We skip the three vertices of the triangle themselves.
      for (let k = 0; k < len; k++) {
        if (k === iPrev || k === i || k === iNext) continue;
        if (pointInTriangle(polygon[remaining[k]], a, b, c)) return false;
      }
      return true;
    };

    // ── Clip loop ─────────────────────────────────────────────────
    const triangles = [];

    // Precompute ear status for all vertices (avoids recomputing unchanged ones)
    let earCache = remaining.map((_, i) => isEar(i));

    while (remaining.length > 3) {
      let clipped = false;

      for (let i = 0; i < remaining.length; i++) {
        if (!earCache[i]) continue;

        // Emit triangle
        const len = remaining.length;
        const iPrev = (i - 1 + len) % len;
        const iNext = (i + 1) % len;
        triangles.push([
          polygon[remaining[iPrev]],
          polygon[remaining[i]],
          polygon[remaining[iNext]],
        ]);

        // Remove clipped vertex
        remaining.splice(i, 1);
        earCache.splice(i, 1);

        // Only re-evaluate the two neighbors whose ear status may have changed
        const newLen = remaining.length;
        if (newLen < 3) break;
        const prevIdx = (i - 1 + newLen) % newLen;
        const nextIdx = i % newLen;
        earCache[prevIdx] = isEar(prevIdx);
        earCache[nextIdx] = isEar(nextIdx);

        clipped = true;
        break;
      }

      if (!clipped) break; // safety: degenerate / collinear polygon
    }

    // Last triangle
    if (remaining.length === 3) {
      triangles.push([polygon[remaining[0]], polygon[remaining[1]], polygon[remaining[2]]]);
    }

    return triangles;
  }

  /**
   * Polygon offset / buffer (Minkowski sum approximation).
   * Expands or contracts a convex polygon by distance d.
   * Positive d → expand outward. Negative d → shrink inward.
   * Works best on convex polygons; for concave, pre-triangulate.
   *
   * @param {{x,y}[]} polygon
   * @param {number} d  offset distance
   * @returns {{x,y}[]}
   */
  function polygonOffset(polygon, d) {
    const n = polygon.length;
    const result = [];
    for (let i = 0; i < n; i++) {
      const prev = polygon[(i - 1 + n) % n];
      const curr = polygon[i];
      const next = polygon[(i + 1) % n];

      // Inward normals of adjacent edges
      const e1 = { x: curr.x - prev.x, y: curr.y - prev.y };
      const e2 = { x: next.x - curr.x, y: next.y - curr.y };
      const len1 = Math.sqrt(e1.x * e1.x + e1.y * e1.y);
      const len2 = Math.sqrt(e2.x * e2.x + e2.y * e2.y);

      if (len1 < 1e-10 || len2 < 1e-10) { result.push({ ...curr }); continue; }

      // Perpendicular (normal) pointing inward for CCW polygon
      const n1 = { x: -e1.y / len1, y: e1.x / len1 };
      const n2 = { x: -e2.y / len2, y: e2.x / len2 };

      // Bisector
      const bis = { x: n1.x + n2.x, y: n1.y + n2.y };
      const bisLen = Math.sqrt(bis.x * bis.x + bis.y * bis.y);

      if (bisLen < 1e-10) {
        result.push({ x: curr.x + n1.x * d, y: curr.y + n1.y * d });
      } else {
        const scale = d / (bis.x * n1.x + bis.y * n1.y);
        result.push({ x: curr.x + bis.x * scale, y: curr.y + bis.y * scale });
      }
    }
    return result;
  }

  /**
   * POLYGON CONTAINS
   * Returns true if every vertex of `inner` lies inside `outer`,
   * and no edge of `inner` crosses any edge of `outer`.
   * Handles the case where one polygon is wholly inside another
   * without any boundary contact.
   *
   * @param {{x,y}[]} outer
   * @param {{x,y}[]} inner
   * @returns {boolean}
   */
  function polygonContains(outer, inner) {
    // All vertices of inner must be inside outer
    for (const v of inner) {
      if (!pointInPolygon(v, outer)) return false;
    }
    // No edges may cross (handles concave outer with inner poking through)
    const no = outer.length, ni = inner.length;
    for (let i = 0; i < no; i++) {
      const a = outer[i], b = outer[(i + 1) % no];
      for (let j = 0; j < ni; j++) {
        const c = inner[j], d = inner[(j + 1) % ni];
        if (segmentsIntersect(a, b, c, d)) return false;
      }
    }
    return true;
  }

  /**
   * ★ POLYGONS INTERSECT
   * Returns true if polygon P and polygon Q overlap in any way:
   *
   *   Case 1 — Edge crossing: at least one edge of P crosses an edge of Q.
   *   Case 2 — Containment:   P is wholly inside Q (or Q inside P).
   *            Detected by testing one vertex from each polygon against
   *            the other — if either is inside, the polygons overlap.
   *
   * A fast bounding-box pre-filter eliminates most non-overlapping pairs
   * in O(1) before the O(n·m) edge-crossing check.
   *
   * Returns false when the polygons are completely disjoint OR when one
   * merely touches the other at a single point or along a shared edge
   * (boundary-only contact is not considered intersection).
   *
   * @param {{x,y}[]} P  simple polygon (any winding)
   * @param {{x,y}[]} Q  simple polygon (any winding)
   * @returns {boolean}
   */
  function polygonsIntersect(P, Q) {
    if (P.length < 3 || Q.length < 3) return false;

    // ── Fast reject: bounding boxes ───────────────────────────────
    const bbP = boundingBox(P);
    const bbQ = boundingBox(Q);
    if (!boundingBoxesOverlap(bbP, bbQ)) return false;

    const np = P.length, nq = Q.length;

    // ── Case 1: edge crossing ─────────────────────────────────────
    for (let i = 0; i < np; i++) {
      const a = P[i], b = P[(i + 1) % np];
      for (let j = 0; j < nq; j++) {
        const c = Q[j], d = Q[(j + 1) % nq];
        if (segmentsIntersect(a, b, c, d)) return true;
      }
    }

    // ── Case 2: containment ───────────────────────────────────────
    // If no edges cross, one polygon might be entirely inside the other.
    // Testing a single vertex from each is sufficient.
    if (pointInPolygon(P[0], Q)) return true;
    if (pointInPolygon(Q[0], P)) return true;

    return false;
  }

  // ─────────────────────────────────────────────────────────────
  // LAYER 5 · DELAUNAY & VORONOI
  // ─────────────────────────────────────────────────────────────

  // ── Internal helpers ─────────────────────────────────────────

  /**
   * Circumcircle of triangle (a, b, c).
   * Returns { cx, cy, r2 } where r2 is the squared radius.
   * Returns null if the three points are collinear.
   */
  function _circumCircle(a, b, c) {
    const ax = b.x - a.x, ay = b.y - a.y;
    const bx = c.x - a.x, by = c.y - a.y;
    const D = 2 * (ax * by - ay * bx);
    if (Math.abs(D) < 1e-10) return null; // collinear
    const ux = (by * (ax * ax + ay * ay) - ay * (bx * bx + by * by)) / D;
    const uy = (ax * (bx * bx + by * by) - bx * (ax * ax + ay * ay)) / D;
    const cx = a.x + ux, cy = a.y + uy;
    const r2 = ux * ux + uy * uy;
    return { cx, cy, r2 };
  }

  /**
   * Returns true if point p is strictly inside the circumCircle of triangle t.
   */
  function _inCircumcircle(t, p) {
    const cc = t.cc;
    if (!cc) return false;
    const dx = p.x - cc.cx, dy = p.y - cc.cy;
    return dx * dx + dy * dy < cc.r2 - 1e-10;
  }

  /**
   * Key for an undirected edge (i, j) — always min,max order.
   */
  function _edgeKey(i, j) {
    return i < j ? `${i},${j}` : `${j},${i}`;
  }

  /**
   * ★ DELAUNAY TRIANGULATION — Bowyer–Watson O(n²)
   *
   * Given a set of points, returns a triangulation where no point lies
   * inside the circumCircle of any triangle (Delaunay property).
   * This maximizes the minimum angle of all triangles, avoiding slivers.
   *
   * Algorithm:
   *   1. Create a super-triangle large enough to contain all points.
   *   2. Insert each point incrementally:
   *      a. Find all "bad" triangles whose circumCircle contains the point.
   *      b. Find the boundary polygon of the bad-triangle cavity.
   *      c. Remove bad triangles; re-triangulate cavity with new point.
   *   3. Remove all triangles that share a vertex with the super-triangle.
   *
   * @param {{x,y}[]} points   array of 2D points (min 3)
   * @returns {{ vertices: {x,y}[], triangles: [number,number,number][] }}
   *   vertices — deduplicated point array (original points in same order)
   *   triangles — array of index triples into vertices
   */
  function delaunay(points) {
    if (points.length < 3) return { vertices: [...points], triangles: [] };

    // Work with indexed copies; keep originals untouched
    const verts = points.map((p, i) => ({ x: p.x, y: p.y, _orig: i }));
    const n = verts.length;

    // ── Super-triangle ────────────────────────────────────────
    const bb = boundingBox(verts);
    const dx = bb.maxX - bb.minX, dy = bb.maxY - bb.minY;
    const delta = Math.max(dx, dy) * 10;
    const cx = (bb.minX + bb.maxX) / 2, cy = (bb.minY + bb.maxY) / 2;
    const s0 = { x: cx - 20 * delta, y: cy - delta,      _super: true };
    const s1 = { x: cx,              y: cy + 20 * delta, _super: true };
    const s2 = { x: cx + 20 * delta, y: cy - delta,      _super: true };
    verts.push(s0, s1, s2);
    const si0 = n, si1 = n + 1, si2 = n + 2;

    // Triangle object: { a, b, c, cc }  (indices + circumCircle)
    const makeTri = (a, b, c) => {
      const cc = _circumCircle(verts[a], verts[b], verts[c]);
      return { a, b, c, cc };
    };

    let tris = [makeTri(si0, si1, si2)];

    // ── Insert points one by one ──────────────────────────────
    for (let pi = 0; pi < n; pi++) {
      const p = verts[pi];

      // Find bad triangles (circumCircle contains p)
      const bad = tris.filter(t => _inCircumcircle(t, p));

      // Find boundary of the cavity (edges not shared by two bad triangles)
      const edgeCount = new Map();
      for (const t of bad) {
        for (const [ea, eb] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]]) {
          const key = _edgeKey(ea, eb);
          edgeCount.set(key, (edgeCount.get(key) || 0) + 1);
        }
      }
      const boundary = [];
      for (const t of bad) {
        for (const [ea, eb] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]]) {
          if (edgeCount.get(_edgeKey(ea, eb)) === 1) boundary.push([ea, eb]);
        }
      }

      // Remove bad triangles
      tris = tris.filter(t => !bad.includes(t));

      // Re-triangulate cavity
      for (const [ea, eb] of boundary) {
        tris.push(makeTri(ea, eb, pi));
      }
    }

    // ── Remove super-triangle vertices ────────────────────────
    const superIdx = new Set([si0, si1, si2]);
    tris = tris.filter(t =>
      !superIdx.has(t.a) && !superIdx.has(t.b) && !superIdx.has(t.c)
    );

    return {
      vertices: points,
      triangles: tris.map(t => [t.a, t.b, t.c]),
    };
  }

  /**
   * Clips a convex polygon against an axis-aligned bounding box
   * using the Sutherland–Hodgman algorithm.
   * Works correctly for any winding order.
   * @param {{x,y}[]} polygon
   * @param {{minX,minY,maxX,maxY}} box
   * @returns {{x,y}[]}
   */
  function _clipPolygonToBox(polygon, box) {
    const planes = [
      { inside: p => p.x >= box.minX,
        cross:  (a, b) => { const t = (box.minX - a.x) / (b.x - a.x); return { x: box.minX, y: a.y + t * (b.y - a.y) }; } },
      { inside: p => p.x <= box.maxX,
        cross:  (a, b) => { const t = (box.maxX - a.x) / (b.x - a.x); return { x: box.maxX, y: a.y + t * (b.y - a.y) }; } },
      { inside: p => p.y >= box.minY,
        cross:  (a, b) => { const t = (box.minY - a.y) / (b.y - a.y); return { x: a.x + t * (b.x - a.x), y: box.minY }; } },
      { inside: p => p.y <= box.maxY,
        cross:  (a, b) => { const t = (box.maxY - a.y) / (b.y - a.y); return { x: a.x + t * (b.x - a.x), y: box.maxY }; } },
    ];
    let out = polygon;
    for (const pl of planes) {
      if (!out.length) break;
      const inp = out; out = [];
      for (let i = 0; i < inp.length; i++) {
        const cur = inp[i], prv = inp[(i - 1 + inp.length) % inp.length];
        const cIn = pl.inside(cur), pIn = pl.inside(prv);
        if (cIn) { if (!pIn) out.push(pl.cross(prv, cur)); out.push(cur); }
        else if (pIn) out.push(pl.cross(prv, cur));
      }
    }
    return out;
  }

  /**
   * ★ VORONOI DIAGRAM — Dual of Delaunay + Sutherland–Hodgman clipping
   *
   * Strategy:
   *   1. Build Delaunay triangulation.
   *   2. For each site, collect its Voronoi cell as an UNBOUNDED polygon:
   *      - Interior vertices = circumcenters of adjacent triangles (sorted by angle).
   *      - For each boundary Delaunay edge, append an outward ray endpoint
   *        far enough to guarantee it lies outside any reasonable clip box.
   *   3. Clip each cell polygon against the bounding box using Sutherland–Hodgman.
   *
   * This separates the two concerns cleanly:
   *   - Step 2 only needs correct ray directions (no corner-insertion logic).
   *   - Step 3 handles all clipping correctly, including box corners.
   *
   * Ray direction: from edge midpoint toward circumcenter, flipped if it
   * points toward the third triangle vertex (i.e., toward the interior).
   *
   * @param {{x,y}[]} points   array of 2D points (min 3)
   * @param {number}  [margin=80]  clip box padding beyond the point bbox
   * @returns {{ vertices:{x,y}[], cells:Array<{site:{x,y}, polygon:{x,y}[]}> }}
   */
  function voronoi(points, margin = 80) {
    // ── 1-point case: cell = entire plane (clip box) ─────────────
    if (points.length === 0) {
      return { vertices: [], cells: [] };
    }
    if (points.length === 1) {
      const p = points[0];
      const box = { minX: p.x - margin, minY: p.y - margin,
                    maxX: p.x + margin, maxY: p.y + margin };
      const polygon = [
        { x: box.minX, y: box.minY }, { x: box.maxX, y: box.minY },
        { x: box.maxX, y: box.maxY }, { x: box.minX, y: box.maxY },
      ];
      return { vertices: [...points], cells: [{ site: p, polygon }] };
    }

    // ── 2-point case: perpendicular bisector of the segment ───────
    if (points.length === 2) {
      const [p0, p1] = points;
      const bb = boundingBox(points);
      const box = {
        minX: bb.minX - margin, minY: bb.minY - margin,
        maxX: bb.maxX + margin, maxY: bb.maxY + margin,
      };
      // Bisector: passes through the midpoint, perpendicular to p0→p1
      const mx = (p0.x + p1.x) / 2, my = (p0.y + p1.y) / 2;
      const dx = p1.x - p0.x,       dy = p1.y - p0.y;
      // Normalized perpendicular direction
      const len = Math.sqrt(dx*dx + dy*dy) || 1;
      const px = -dy / len, py = dx / len;
      // Two far points along the bisector line
      const far = (box.maxX - box.minX + box.maxY - box.minY) * 10;
      const bisA = { x: mx + px * far, y: my + py * far };
      const bisB = { x: mx - px * far, y: my - py * far };
      // Each cell = one half-plane clipped to the box via Sutherland-Hodgman
      const boxPoly = [
        { x: box.minX, y: box.minY }, { x: box.maxX, y: box.minY },
        { x: box.maxX, y: box.maxY }, { x: box.minX, y: box.maxY },
      ];
      const clipHalfPlane = (poly, sidePoint) => {
        // Half-plane on the same side as sidePoint relative to line bisA→bisB
        const inside = (p) => {
          const cx = (bisB.x-bisA.x)*(p.y-bisA.y) - (bisB.y-bisA.y)*(p.x-bisA.x);
          const ref = (bisB.x-bisA.x)*(sidePoint.y-bisA.y) - (bisB.y-bisA.y)*(sidePoint.x-bisA.x);
          return (cx >= 0) === (ref >= 0);
        };
        const intersect = (a, b) => {
          const t_num = (bisA.x-a.x)*(bisB.y-bisA.y) - (bisA.y-a.y)*(bisB.x-bisA.x);
          const t_den = (b.x-a.x)*(bisB.y-bisA.y) - (b.y-a.y)*(bisB.x-bisA.x);
          if (Math.abs(t_den) < 1e-10) return a;
          const t = t_num / t_den;
          return { x: a.x + t*(b.x-a.x), y: a.y + t*(b.y-a.y) };
        };
        const out = [];
        for (let i = 0; i < poly.length; i++) {
          const cur = poly[i], prv = poly[(i-1+poly.length)%poly.length];
          const cIn = inside(cur), pIn = inside(prv);
          if (cIn) { if (!pIn) out.push(intersect(prv, cur)); out.push(cur); }
          else if (pIn) out.push(intersect(prv, cur));
        }
        return out;
      };
      const cell0 = clipHalfPlane(boxPoly, p0);
      const cell1 = clipHalfPlane(boxPoly, p1);
      return {
        vertices: [...points],
        cells: [
          { site: p0, polygon: cell0 },
          { site: p1, polygon: cell1 },
        ],
      };
    }

    const { triangles } = delaunay(points);
    const n = points.length;

    // Clip box (used only in step 3)
    const bb = boundingBox(points);
    const box = {
      minX: bb.minX - margin, minY: bb.minY - margin,
      maxX: bb.maxX + margin, maxY: bb.maxY + margin,
    };

    // Circumcenter per triangle — NOT clamped, kept as-is for step 2
    const ccPts = triangles.map(([a, b, c]) => {
      const r = _circumCircle(points[a], points[b], points[c]);
      return r ? { x: r.cx, y: r.cy }
               : midpoint(midpoint(points[a], points[b]), points[c]);
    });

    // Edge → triangle indices
    const edgeToTris = new Map();
    triangles.forEach((tri, ti) => {
      for (const [ea, eb] of [[tri[0],tri[1]],[tri[1],tri[2]],[tri[2],tri[0]]]) {
        const k = _edgeKey(ea, eb);
        if (!edgeToTris.has(k)) edgeToTris.set(k, []);
        edgeToTris.get(k).push(ti);
      }
    });

    // Site → adjacent triangles
    const siteAdj = Array.from({ length: n }, () => []);
    triangles.forEach((tri, ti) => tri.forEach(si => siteAdj[si].push(ti)));

    // How far to extend boundary rays (well beyond any clip box)
    const rayLen = (bb.maxX - bb.minX + bb.maxY - bb.minY + margin * 4) * 10;

    const cells = points.map((site, si) => {
      const adj = siteAdj[si];
      if (!adj.length) return { site, polygon: [] };

      // ── Step 2a: collect interior Voronoi vertices ─────────────
      // Sort adjacent triangles by angle of their circumcenter around the site
      const sorted = adj.slice().sort((ta, tb) => {
        const aa = Math.atan2(ccPts[ta].y - site.y, ccPts[ta].x - site.x);
        const ab = Math.atan2(ccPts[tb].y - site.y, ccPts[tb].x - site.x);
        return aa - ab;
      });

      const cellVerts = sorted.map(ti => ({ ...ccPts[ti] }));

      // ── Step 2b: insert ray endpoints for boundary edges ───────
      // For each boundary Delaunay edge incident to this site, insert a
      // far-away point in the outward direction.
      //
      // Outward direction = (circumcenter − edge_midpoint), flipped if it
      // points toward the third triangle vertex (toward the interior).
      //
      // Insertion position: between the two adjacent circumcenters in the
      // sorted angular order (i.e., between the triangle on the left and
      // the one on the right of the boundary edge).
      const rayVerts = [];
      for (const ti of adj) {
        const tri = triangles[ti];
        for (let k = 0; k < 3; k++) {
          const ea = tri[k], eb = tri[(k+1) % 3];
          if (ea !== si && eb !== si) continue;
          if (edgeToTris.get(_edgeKey(ea, eb)).length !== 1) continue;

          const pa = points[ea], pb = points[eb];
          const ec = tri.find(v => v !== ea && v !== eb);
          const mid = { x: (pa.x + pb.x) / 2, y: (pa.y + pb.y) / 2 };
          const cc  = ccPts[ti];
          let dir = { x: cc.x - mid.x, y: cc.y - mid.y };

          // Flip if pointing toward ec (toward interior)
          const toEc = { x: points[ec].x - mid.x, y: points[ec].y - mid.y };
          if (dir.x * toEc.x + dir.y * toEc.y > 0) dir = { x: -dir.x, y: -dir.y };

          // Normalize and extend to rayLen
          const len = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
          if (len < 1e-10) continue;
          const far = {
            x: cc.x + dir.x / len * rayLen,
            y: cc.y + dir.y / len * rayLen,
            isBoundaryRay: true,
            angle: Math.atan2(cc.y - site.y + dir.y / len * rayLen, cc.x - site.x + dir.x / len * rayLen),
          };
          rayVerts.push(far);
        }
      }

      // Merge circumcenters + rays, sort by angle around site
      const allVerts = [
        ...cellVerts.map(v => ({ ...v, angle: Math.atan2(v.y - site.y, v.x - site.x) })),
        ...rayVerts,
      ];
      allVerts.sort((a, b) => a.angle - b.angle);

      // Deduplicate very close points
      const merged = [];
      for (const v of allVerts)
        if (!merged.some(u => Math.hypot(u.x - v.x, u.y - v.y) < 1e-6)) merged.push(v);

      if (merged.length < 2) return { site, polygon: [] };

      // ── Step 3: clip against the bounding box ──────────────────
      const clipped = _clipPolygonToBox(merged, box);

      return { site, polygon: clipped };
    });

    return { vertices: points, cells };
  }

  // ─────────────────────────────────────────────────────────────
  // LAYER 6 · SHORTEST PATH (visibility graph + Dijkstra)
  // ─────────────────────────────────────────────────────────────

  /**
   * Returns true if segment (a→b) does not properly cross or pass through
   * the interior of any obstacle polygon.
   *
   * Rules:
   *  - The segment may touch obstacle vertices (grazing a corner is allowed).
   *  - The segment may not properly cross any obstacle edge.
   *  - The midpoint of the segment must not be strictly inside any obstacle.
   *
   * @param {{x,y}} a
   * @param {{x,y}} b
   * @param {{x,y}[][]} obstacles  array of simple polygons (obstacles)
   * @returns {boolean}
   */
  function _segmentFree(a, b, obstacles) {
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    for (const obs of obstacles) {
      // Midpoint inside obstacle → blocked
      if (pointInPolygon(mid, obs)) return false;
      // Proper crossing of any obstacle edge → blocked
      const n = obs.length;
      for (let k = 0; k < n; k++) {
        const c = obs[k], d = obs[(k + 1) % n];
        if (segmentsIntersect(a, b, c, d)) {
          // Allow if the intersection is only at a shared endpoint (grazing)
          // i.e. both segments share exactly one endpoint and don't cross otherwise
          const sharedEndpoint =
            (Math.hypot(a.x-c.x, a.y-c.y) < 1e-9 || Math.hypot(a.x-d.x, a.y-d.y) < 1e-9) ||
            (Math.hypot(b.x-c.x, b.y-c.y) < 1e-9 || Math.hypot(b.x-d.x, b.y-d.y) < 1e-9);
          if (!sharedEndpoint) return false;
        }
      }
    }
    return true;
  }

  /**
   * VISIBILITY GRAPH FOR PATHFINDING
   *
   * Builds a weighted undirected graph over a set of obstacle polygons plus
   * two extra query points (start and end). Each node is a 2D point; each
   * edge connects two mutually visible nodes with weight = Euclidean distance.
   *
   * Nodes are indexed as:
   *   0          → start
   *   1          → end
   *   2 … 2+N-1  → obstacle vertices in the order they appear in `obstacles`
   *                 (polygon 0 vertices first, then polygon 1, etc.)
   *
   * @param {{x,y}}     start
   * @param {{x,y}}     end
   * @param {{x,y}[][]} obstacles  array of simple obstacle polygons
   * @returns {{
   *   nodes  : {x,y}[],
   *   edges  : Array<{from:number, to:number, weight:number}>,
   *   adj    : Map<number, Array<{to:number, weight:number}>>
   * }}
   */
  function buildVisibilityGraph(start, end, obstacles) {
    // Flatten all points: [start, end, ...obstacle vertices]
    const nodes = [{ ...start }, { ...end }];
    for (const obs of obstacles)
      for (const v of obs) nodes.push({ ...v });

    const N = nodes.length;
    const edges = [];
    const adj = new Map();
    for (let i = 0; i < N; i++) adj.set(i, []);

    const addEdge = (i, j) => {
      const w = distance(nodes[i], nodes[j]);
      edges.push({ from: i, to: j, weight: w });
      adj.get(i).push({ to: j, weight: w });
      adj.get(j).push({ to: i, weight: w });
    };

    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (_segmentFree(nodes[i], nodes[j], obstacles))
          addEdge(i, j);
      }
    }

    return { nodes, edges, adj };
  }

  /**
   * SHORTEST PATH — Dijkstra's algorithm
   *
   * Finds the shortest path from `start` to `end` in a 2D environment with
   * polygonal obstacles, using a visibility graph internally.
   *
   * Returns null if no path exists (start or end inside an obstacle, or
   * the environment is fully disconnected).
   *
   * @param {{x,y}}     start
   * @param {{x,y}}     end
   * @param {{x,y}[][]} obstacles  array of simple polygons acting as obstacles
   * @returns {{
   *   path     : {x,y}[],   // sequence of waypoints from start to end
   *   length   : number,    // total Euclidean length of the path
   *   graph    : object     // the visibility graph (for visualisation)
   * } | null}
   */
  function shortestPath(start, end, obstacles) {
    // Reject if start or end is inside any obstacle
    for (const obs of obstacles) {
      if (pointInPolygon(start, obs)) return null;
      if (pointInPolygon(end,   obs)) return null;
    }

    const graph = buildVisibilityGraph(start, end, obstacles);
    const { nodes, adj } = graph;
    const N = nodes.length;
    const SRC = 0, DST = 1;          // indices of start and end

    // ── Dijkstra with a binary min-heap ──────────────────────────
    const dist = new Float64Array(N).fill(Infinity);
    const prev = new Int32Array(N).fill(-1);
    const visited = new Uint8Array(N);
    dist[SRC] = 0;

    // Simple binary min-heap: entries are [cost, nodeIndex]
    const heap = [[0, SRC]];
    const heapPush = (cost, node) => {
      heap.push([cost, node]);
      let i = heap.length - 1;
      while (i > 0) {
        const parent = (i - 1) >> 1;
        if (heap[parent][0] <= heap[i][0]) break;
        [heap[parent], heap[i]] = [heap[i], heap[parent]];
        i = parent;
      }
    };
    const heapPop = () => {
      const top = heap[0];
      const last = heap.pop();
      if (heap.length > 0) {
        heap[0] = last;
        let i = 0;
        while (true) {
          let smallest = i;
          const l = 2*i+1, r = 2*i+2;
          if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l;
          if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r;
          if (smallest === i) break;
          [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
          i = smallest;
        }
      }
      return top;
    };

    while (heap.length > 0) {
      const [cost, u] = heapPop();
      if (visited[u]) continue;
      visited[u] = 1;
      if (u === DST) break;

      for (const { to: v, weight: w } of adj.get(u)) {
        if (visited[v]) continue;
        const newDist = cost + w;
        if (newDist < dist[v]) {
          dist[v] = newDist;
          prev[v] = u;
          heapPush(newDist, v);
        }
      }
    }

    if (dist[DST] === Infinity) return null;  // no path

    // Reconstruct path by following prev[] back from DST to SRC
    const path = [];
    for (let cur = DST; cur !== -1; cur = prev[cur])
      path.push(nodes[cur]);
    path.reverse();

    return { path, length: dist[DST], graph };
  }

  // ─────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────
  return {
	  // Layer 1 — Basics
	  signedTriangleDoubleArea,
	  signedTriangleArea,
	  triangleArea,
	  cross2D,
	  dot2D,
	  distance,
	  distanceSq,
	  boundingBox,
	  boundingBoxesOverlap,
	  slopeAngle,
	  segmentSlopeAngle,
	  midpoint,

	  // Layer 2 — Orientation
	  orientation,
	  leftTurn,
	  rightTurn,
	  collinear,
	  onSegment,
	  segmentsIntersect,
	  lineIntersectionPoint,
	  ccwAngle,
	  
	  // Layer 3 — Polygon
	  pointInPolygon,
	  pointToSegmentDistance,
	  polygonSignedArea,
	  polygonArea,
	  isCounterClockwise,
	  isCcwPolygon,
	  polygonCentroid,
	  isSimplePolygon,


	  // Layer 4 — Convex Hull, Voronoi, Delaunay
	  convexHull,
	  isConvex,
	  visibilityGraph,
	  triangulate,
	  polygonOffset,
	  polygonContains,
	  polygonsIntersect,
	  delaunay,
	  voronoi,
	  buildVisibilityGraph,
	  shortestPath,
	  
	  // Auxiliary
	  _circumCircle,
	  _inCircumcircle,
	  _edgeKey,
	  _clipPolygonToBox,
	  _segmentFree
	};
})();

// ES module compatibility
if (typeof module !== "undefined" && module.exports) module.exports = Geometry;
