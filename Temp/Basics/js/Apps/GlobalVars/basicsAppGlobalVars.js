// -----  GLOBAL VARIABLES and INITS - ALL APPS										// GLOBALS

//=====================================================================================    BASICS  =========================

//..............................................................................................................................

// ─── TAB 1: ORIENTATION ──────────────────────────────							// ORIENTATION
//		Datasets
const DATATHREEPOINTS = {
	left: [{x:350,y:150},{x:150,y:300},{x:350,y:300}],
	right: [{x:150,y:300},{x:350,y:150},{x:350,y:300}],
	collinear: [{x:350,y:150},{x:200,y:150},{x:100,y:150}]
};

// const DATATHREEPOINTS = {
// 	left: [{x:3.5,y:1.5},{x:1.50,y:3.00},{x:3.50,y:3.00}],
// 	right: [{x:1.50,y:3.00},{x:3.50,y:1.50},{x:3.50,y:3.00}],
// 	collinear: [{x:3.50,y:1.50},{x:2.00,y:1.50},{x:1.00,y:1.50}]
// };

const INITTHREEPOINTS = [...DATATHREEPOINTS.left];

//		Model
var THREEPOINTS = [...INITTHREEPOINTS];

//		View
const CANVASorientation = document.getElementById('canvas-orientation');

//		Controller
var DRAGGINGorientation = null;


// ─── TAB 2: INTERSECTION ──────────────────────────────							// INTERSECTION
//		Datasets
const DATAFOURPOINTS = {
	cross: [{x:150,y:300},{x:400,y:300},{x:350,y:150},{x:350,y:400}],
	dontCross: [{x:150,y:300},{x:400,y:300},{x:350,y:150},{x:500,y:400}]
};
const INITFOURPOINTS = [...DATAFOURPOINTS.dontCross];

//		Model
var FOURPOINTS = [...INITFOURPOINTS];
//		View
const CANVASintersection = document.getElementById('canvas-intersection');
//		Controller
let DRAGGINGintersection = null;	

// ─── TAB 3: POINT IN TRIANGLE ──────────────────────────────						// POINT IN TRIANGLE
//		Datasets
const DATAPOINTINTRIANGLE = {
	in: [{x:150,y:300},{x:400,y:300},{x:350,y:150},{x:350,y:400}],
	out: [{x:150,y:300},{x:400,y:300},{x:350,y:150},{x:500,y:400}]
};
const INITPOINTINTRIANGLE = [...DATAPOINTINTRIANGLE.in];

//		Model
var POINTINTRIANGLE = [...INITPOINTINTRIANGLE];
//		View
const CANVASpointInTriangle = document.getElementById('canvas-pointInTriangle');
//		Controller
let DRAGGINGpointInTriangle = null;	

// ─── TAB 4: POINTEDNESS ──────────────────────────────							// POINTEDNESS
//		Datasets
const DATAPOINTEDNESS = {
	in: [{x:150,y:300},{x:400,y:300},{x:350,y:150},{x:350,y:400}],
	out: [{x:150,y:300},{x:400,y:300},{x:350,y:150},{x:500,y:400}]
};
const INITPOINTEDNESS = [...DATAPOINTEDNESS.in];

//		Model
var POINTEDNESS = [...INITPOINTEDNESS];
//		View
const CANVASpointedness = document.getElementById('canvas-pointedness');
//		Controller
let DRAGGINGpointedness = null;	

// ─── TAB 5: CCWANGLE ──────────────────────────────								// CCWANGLE
//		Datasets
const DATACCWANGLEPOINTS = {
	in: [{x:150,y:300},{x:400,y:300},{x:350,y:150}],
	out: [{x:150,y:300},{x:400,y:300},{x:350,y:150}]
};
const INITCCWANGLEPOINTS = [...DATACCWANGLEPOINTS.in];

//		Model
var CCWANGLEPOINTS = [...INITCCWANGLEPOINTS];
var CCWANGLE = null;
//		View
const CANVASccwAngle = document.getElementById('canvas-ccwAngle');
//		Controller
let DRAGGINGccwAngle = null;	



// ─── TAB 6: CIRCUMCIRCLE ──────────────────────────────							// CIRCUMCIRCLE

//		Datasets
const DATATHREEPOINTSCIRCUMCIRCLE = {
	acute: [{x:276,y:233},{x:384,y:127},{x:455,y:348}],
	obtuse: [{x:276,y:233},{x:384,y:127},{x:613,y:205}]
};

const INITTHREEPOINTSCIRCUMCIRCLE = [...DATATHREEPOINTSCIRCUMCIRCLE.acute];

//		Model
var THREEPOINTSCIRCUMCIRCLE = [...INITTHREEPOINTSCIRCUMCIRCLE];
//		View
const CANVAScircumCircle = document.getElementById('canvas-circumCircle');
//		Controller
let DRAGGINGcircumCircle = null;	




