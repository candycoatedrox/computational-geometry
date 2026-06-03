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
	POSITIVECOLOR2 = colorSet.positiveColor2;
	NEGATIVECOLOR = colorSet.negativeColor;
	NEGATIVECOLOR2 = colorSet.negativeColor2;
	NEUTRALCOLOR = colorSet.neutralColor;
	NEUTRALCOLOR2 = colorSet.neutralColor2;
	
	THEMEAMBER = colorSet.themeAmber;
	THEMEPURPLE = colorSet.themePurple;
	THEMETEAL = colorSet.themeTeal;
}
