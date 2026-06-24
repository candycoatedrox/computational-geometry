
function redrawActiveApp(){
	const activeTab = document.querySelector('nav button.active').dataset.tab;
	setColors();
	setTimeout(() => {
		if (activeTab === 'polygonSubdivisionApp') POLYGONSUBDIVISIONAPP.computeAndRefresh();
  }, 100);
}
