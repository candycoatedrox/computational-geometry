
function redrawActiveApp(){
	const activeTab = document.querySelector('nav button.active').dataset.tab;
	setColors();
	setTimeout(() => {
		if (activeTab === 'orientationApp') ORIENTATIONAPP.computeAndRefresh();
		if (activeTab === 'lineSegIntersectApp') LINESEGINTERSECTAPP.computeAndRefresh();
  }, 100);
}
