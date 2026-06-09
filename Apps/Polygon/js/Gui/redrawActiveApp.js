
function redrawActiveApp(){
	const activeTab = document.querySelector('nav button.active').dataset.tab;
	setColors();
	setTimeout(() => {
		if (activeTab === 'selfIntersectionApp') SELFINTERSECTIONAPP.computeAndRefresh();
  }, 100);
}
