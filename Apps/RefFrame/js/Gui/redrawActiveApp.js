
function redrawActiveApp(){
	const activeTab = document.querySelector('nav button.active').dataset.tab;
	setColors();
	setTimeout(() => {
		if (activeTab === 'boxApp') BOXAPP.computeAndRefresh();
		if (activeTab === 'originApp') ORIGINAPP.computeAndRefresh();
		if (activeTab === 'originAxesApp') ORIGINAXESAPP.computeAndRefresh();
		if (activeTab === 'boxOrApp') BOXORAPP.computeAndRefresh();
		if (activeTab === 'boxAxesApp') BOXAXESAPP.computeAndRefresh();
		if (activeTab === 'boxAxesGridApp') BOXAXESGRIDAPP.computeAndRefresh();
  }, 100);
}
