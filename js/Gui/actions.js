// ─── PREPARE INFRASTRUCTURE FOR ALL CANVASES ───────────────────────────────────────


function setColors(){
    const isLight = document.body.classList.contains('light-theme');
	GRIDCOLOR = isLight ? COLORS.lightGray : COLORS.gray;	
}

const ResizeAction = {
	
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

const LoadAction = {
	
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

const InitTabApps = {
	
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
