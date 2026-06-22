
function redrawActiveApp(){
	const activeTab = document.querySelector('nav button.active').dataset.tab;
	setColors();
	setTimeout(() => {
		if (activeTab === 'delaunayApp') DELAUNAYAPP.computeAndRefresh();
  }, 100);
}
