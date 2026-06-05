
function redrawActiveApp(){
	const activeTab = document.querySelector('nav button.active').dataset.tab;
	setColors();
	setTimeout(() => {
		if (activeTab === 'orientationApp') ORIENTATIONAPP.computeAndRefresh();
		if (activeTab === 'lineSegIntersectApp') LINESEGINTERSECTAPP.computeAndRefresh();
		if (activeTab === 'pointInTriangleApp') POINTINTRIANGLEAPP.computeAndRefresh();
		if (activeTab === 'pointednessApp') POINTEDNESSAPP.computeAndRefresh();
		if (activeTab === 'incircleApp') INCIRCLEAPP.computeAndRefresh();
		if (activeTab === 'circumcircleApp') CIRCUMCIRCLEAPP.computeAndRefresh();
		if (activeTab === 'excirclesApp') EXCIRCLESAPP.computeAndRefresh();
  }, 100);
}
