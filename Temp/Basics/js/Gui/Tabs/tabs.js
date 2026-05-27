
// ─── TAB SWITCHING ───────────────────────────────────                           BASICS
function setUpTabSwitchingBasics(){
	document.querySelectorAll('nav button').forEach(btn => {
		// add click event listener to each navigation button btn
		btn.addEventListener('click', () => {
			// deactivate all navigation buttons and demo-containers
			document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
			document.querySelectorAll('.demo-container').forEach(d => d.classList.remove('active'));
			// activate all classes of current btn and all elements with id's starting with tab-
			btn.classList.add('active');
			document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
			// init all canvases, in an asynchronous manner
			initPrepareComputeDrawUpdateAllCanvasesBasics();
		});
	})
};
