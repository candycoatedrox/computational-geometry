
function redrawActiveApp(){
	const activeTab = document.querySelector('nav button.active').dataset.tab;
	setColors();
	setTimeout(() => {
		if (activeTab === 'delaunayApp') DELAUNAYAPP.computeAndRefresh();
		if (activeTab === 'voronoiApp') VORONOIAPP.computeAndRefresh();
  }, 100);
}
