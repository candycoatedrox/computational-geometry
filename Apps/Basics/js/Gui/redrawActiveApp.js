
function redrawActiveApp(){
	const activeTab = document.querySelector('nav button.active').dataset.tab;
	setColors();
	setTimeout(() => {
		if (activeTab === 'pointApp') POINTAPP.computeAndRefresh();
		if (activeTab === 'pointsApp') POINTSAPP.computeAndRefresh();
  }, 100);
}
