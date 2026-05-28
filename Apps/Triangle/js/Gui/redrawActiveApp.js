
function redrawActiveApp(){
	const activeTab = document.querySelector('nav button.active').dataset.tab;
	setColors();
	setTimeout(() => {
		if (activeTab === 'orientationApp') ORIENTATIONAPP.computeAndRefresh();
		if (activeTab === 'lineSegIntersectApp') LINESEGINTERSECTAPP.computeAndRefresh();
		if (activeTab === 'pointInTriangleApp') POINTINTRIANGLEAPP.computeAndRefresh();
		if (activeTab === 'pointednessApp') POINTEDNESSAPP.computeAndRefresh();
		if (activeTab === 'inscribedCircleApp') INSCRIBEDCIRCLEAPP.computeAndRefresh();
		if (activeTab === 'circumscribedCircleApp') CIRCUMSCRIBEDCIRCLEAPP.computeAndRefresh();
  }, 100);
}
