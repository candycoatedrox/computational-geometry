// ─── COLORS ──────────────────────────────────────────
const COLORS = {
	setAlpha: (color, alpha = 0.5) => { // returns the given color at the given opacity (0.5 by default)
		if (alpha < 0) {
			alpha = 0;
		} else if (alpha > 1) {
			alpha = 1;
		}

		if (color.startsWith("#")) { // hex code
			const alphaHex = Math.round(alpha * 255);
			return color.substring(0,7) + alphaHex.toString(16);
		} else if (color.startsWith("rgba(")) { // rgba
			let valStr = color.slice(5,-1);
			let vals = valStr.split(",");
			return `rgba(${vals[0]},${vals[1]},${vals[2]},${alpha})`;
		} else {
			return color;
		}
	},

	black: '#000000',
	white: '#ffffff',
	lightGray: 'rgba(204,204,204)',
	darkGray: 'rgba(63,63,63)',
	gray: 'rgba(153,153,153)',
	red: '#FF0000',
	green:'#00FF00',
	blue: '#0000FF',
	reddish: '#f47c7c',
	darkReddish: '#af4d4d',
	darkishGreen: '#008000',
	darkGreen: '#06402B',
	limeGreen: '#C7EA46',
	emeraldGreen: '#50C878',
	seaGreen: '#2E8B57',

	purple: '#7c6af7', 
	teal: '#4ec9b0',
	amber: '#f7c56a',
	scarlet: '#e8482b',
	indigo: '#4e75e9',
	
	
	muted: '#3a3a45',
	
	
	text: '#e8e6f0',
	bg: '#111116',
	surface: '#1f1f24',
	border: '#2e2e38',
	plus: '#f47c7c', // reddish
	minus: '#50C878', // emeraldGreen
	yes:  '#50C878', // emeraldGreen
	no: '#f47c7c', // reddish
	undefined: '#7c6af7',
	simple: '#6ef0a0', 		// simple polygon
	notSimple: '#f47c7c',	// not simple polygon "reddish"
	
	in:  '#50C878', // emeraldGreen
	out: '#f47c7c', // reddish
	
	pointed:  '#50C878', // emeraldGreen
	notPointed: '#f47c7c', // reddish
	
	// minus: '#2E8B57' // seaGreen
	// minus: '#06402B' // darkGreen
	
	highlight: 'rgba(247,197,106,.8)',
	delaunayEdge: 'rgba(255,255,255,.06)'
};
// const OPACITY = .7;
const RED = {
	'1': 'rgba(255,0,0,0.1)',
	'2': 'rgba(255,0,0,0.2)',
	'3': 'rgba(255,0,0,0.3)',
	'4': 'rgba(255,0,0,0.4)',
	'5': 'rgba(255,0,0,0.5)',
	'6': 'rgba(255,0,0,0.6)',
	'7': 'rgba(255,0,0,0.7)',
	'8': 'rgba(255,0,0,0.8)',
	'9': 'rgba(255,0,0,0.9)',
	'10': 'rgba(255,0,0)',
};
const GREEN = {
	'1': 'rgba(0,255,0,0.1)',
	'2': 'rgba(0,255,0,0.2)',
	'3': 'rgba(0,255,0,0.3)',
	'4': 'rgba(0,255,0,0.4)',
	'5': 'rgba(0,255,0,0.5)',
	'6': 'rgba(0,255,0,0.6)',
	'7': 'rgba(0,255,0,0.7)',
	'8': 'rgba(0,255,0,0.8)',
	'9': 'rgba(0,255,0,0.9)',
	'10': 'rgba(0,255,0)',
};
const BLUE = {
	'1': 'rgba(0,0,255,0.1)',
	'2': 'rgba(0,0,255,0.2)',
	'3': 'rgba(0,0,255,0.3)',
	'4': 'rgba(0,0,255,0.4)',
	'5': 'rgba(0,0,255,0.5)',
	'6': 'rgba(0,0,255,0.6)',
	'7': 'rgba(0,0,255,0.7)',
	'8': 'rgba(0,0,255,0.8)',
	'9': 'rgba(0,0,255,0.9)',
	'10': 'rgba(0,0,255)',
};