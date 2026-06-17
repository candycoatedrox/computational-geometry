
function redrawActiveApp(){
	const activeTab = document.querySelector('nav button.active').dataset.tab;
	setColors();
	setTimeout(() => {
		if (activeTab === 'graphEditorApp') GRAPHEDITORAPP.computeAndRefresh();
		if (activeTab === 'faceGraphEditorApp') FACEGRAPHEDITORAPP.computeAndRefresh();
		if (activeTab === 'nonCrossingGraphEditorApp') NONCROSSINGGRAPHEDITORAPP.computeAndRefresh();
		if (activeTab === 'treeEditorApp') TREEEDITORAPP.computeAndRefresh();
		if (activeTab === 'planarGraphEditorApp') PLANARGRAPHEDITORAPP.computeAndRefresh();
  }, 100);
}
