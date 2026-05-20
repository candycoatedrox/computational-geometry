
function redrawActiveApp(){
	const activeTab = document.querySelector('nav button.active').dataset.tab;
	setColors();
	setTimeout(() => {
		if (activeTab === 'pointApp') POINTAPP.computeAndRefresh();
		if (activeTab === 'pointsApp') POINTSAPP.computeAndRefresh();
		if (activeTab === 'pointWorldApp') POINTWORLDAPP.computeAndRefresh();
		if (activeTab === 'pointsWorldApp') POINTSWORLDAPP.computeAndRefresh();
		if (activeTab === 'edgeApp') EDGEAPP.computeAndRefresh();
  }, 100);
}
