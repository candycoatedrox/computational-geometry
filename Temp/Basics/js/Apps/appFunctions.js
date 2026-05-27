

const Main = {
		
	// ───------------------──────────────────────────────-------------------------------------------	
	//       PAGE 1: BASICS 														// BASICS
	// ───------------------──────────────────────────────-------------------------------------------	
	
	// ─── TAB 1: ORIENTATION ──────────────────────────────							// orientation
	orientation(){
		// Init Controller: 														
	MouseSetup.orientation();															// 		Set up mouse
	// Interact, Compute and View														// 		Launch orientation app
	PrepareComputeDrawUpdate.orientation();
	},
	
	// ─── TAB 2: INTERSECTION ─────────────────────────────							// intersection
	intersection(){
		// Init Controller: 														
		MouseSetup.intersection();															// 		Set up mouse
		// Interact, Compute and View														// 		Launch intersection app
		PrepareComputeDrawUpdate.intersection();
	},
	
	// ─── TAB 3: POINT IN TRIANGLE ────────────────────────							// point-in-triangle
	pointInTriangle(){
		// Init Controller: 														
		MouseSetup.pointInTriangle();														// 		Set up mouse
		// Interact, Compute and View														// 		Launch simple polygon app
		PrepareComputeDrawUpdate.pointInTriangle();
		
	},
	
	// ─── TAB 4: POINTEDNESS ──────────────────────────────							// pointedness
	pointedness(){
		// Init Controller: 														
		MouseSetup.pointedness();															// 		Set up mouse
		// Interact, Compute and View														// 		Launch simple polygon app
		PrepareComputeDrawUpdate.pointedness();
		
	},
	
	// ─── TAB 5: CCWANGLE ──────────────────────────────								// ccwAngle
	ccwAngle(){
		// Init Controller: 														
		MouseSetup.ccwAngle();															// 		Set up mouse
		// Interact, Compute and View														// 		Launch simple polygon app
		PrepareComputeDrawUpdate.ccwAngle();
		
	},
	
	// ─── TAB 6: CIRCUMCIRCLE ─────────────────────────────							// circumcircle
	circumCircle(){
		// Init Controller: 														
		MouseSetup.circumCircle();															// 		Set up mouse
		// Interact, Compute and View														// 		Launch simple polygon app
		PrepareComputeDrawUpdate.circumCircle();
		
	}
	
}
