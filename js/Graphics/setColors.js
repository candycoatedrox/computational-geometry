// ─── PREPARE INFRASTRUCTURE FOR ALL CANVASES ───────────────────────────────────────

function setColors() {
	const savedTheme = localStorage.getItem('theme');
	const isLight = savedTheme === 'light';
	let colorSet = isLight ? LIGHT : DARK;
	
    ORIGINCOLOR = colorSet.originColor;

	AXESCOLOR = colorSet.axesColor;
	
	XAXISCOLOR = colorSet.xAxisColor;
	YAXISCOLOR = colorSet.yAxisColor;

	GRIDCOLOR = colorSet.gridColor;
	BOXCOLOR = colorSet.boxColor;

	POINTCOLOR = colorSet.pointColor;
	POINTLABELCOLOR = colorSet.pointLabelColor;

	EDGECOLOR = colorSet.edgeColor;
	FACECOLOR = colorSet.faceColor;

	LINECOLOR = colorSet.lineColor;
	DOTTEDEDGECOLOR = colorSet.dottedEdgeColor;
	ARROWCOLOR = colorSet.arrowColor;

	INTERSECTIONCOLOR = colorSet.intersectionColor;

	POSITIVECOLOR = colorSet.positiveColor;
	NEGATIVECOLOR = colorSet.negativeColor;
	NEUTRALCOLOR = colorSet.neutralColor;
	
	THEMEAMBER = colorSet.themeAmber;
	THEMEPURPLE = colorSet.themePurple;
	THEMETEAL = colorSet.themeTeal;
}
