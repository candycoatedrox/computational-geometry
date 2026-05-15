// ─── PREPARE INFRASTRUCTURE FOR ALL CANVASES ───────────────────────────────────────


function setColors(isLight = document.body.classList.contains('light-theme')) {
	const colorSet = isLight ? LIGHT : DARK;

    ORIGINCOLOR = colorSet.originColor;

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
}

const ToggleAction = {

	refFrame() {
		setTimeout(() => {
			ORIGINAPP.refresh(),
			ORIGINAXESAPP.refresh(),
			BOXAPP.refresh(),
			BOXORAPP.refresh(),
			BOXAXESAPP.refresh()
		}, 50);
	}

}

const ResizeAction = {
	
	refFrame(){
	    setTimeout(() => {
			ORIGINAPP.computeAndRefresh(),
			ORIGINAXESAPP.computeAndRefresh(),
			BOXAPP.computeAndRefresh(),
			BOXORAPP.computeAndRefresh(),
			BOXAXESAPP.computeAndRefresh()
	  	}, 50);	
	}
}

const LoadAction = {
	
	refFrame(){
	    setTimeout(() => {
			ORIGINAPP.computeAndRefresh(),
			ORIGINAXESAPP.computeAndRefresh(),
			BOXAPP.computeAndRefresh(),
			BOXORAPP.computeAndRefresh(),
			BOXAXESAPP.computeAndRefresh()
	  	}, 50);	
	}
}

const InitTabApps = {
	
	refFrame(){
		setColors();
	    setTimeout(() => {
			ORIGINAPP.computeAndRefresh(),
			ORIGINAXESAPP.computeAndRefresh(),
			BOXAPP.computeAndRefresh(),
			BOXORAPP.computeAndRefresh(),
			BOXAXESAPP.computeAndRefresh()
	  	}, 50);	
	}
}
