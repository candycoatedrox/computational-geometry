
function redrawActiveApp(){
	const activeTab = document.querySelector('nav button.active').dataset.tab;
	setColors();
	setTimeout(() => {
		if (activeTab === 'selfIntersectionApp') SELFINTERSECTIONAPP.computeAndRefresh();
		if (activeTab === 'pointInPolygonApp') POINTINPOLYGONAPP.computeAndRefresh();
  }, 100);
}
