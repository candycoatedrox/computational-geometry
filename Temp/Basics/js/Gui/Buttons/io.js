// -----  HELPERS: BUTTON ACTIONS	
// Buttons I/O

const ButtonsIO = {
	
	orientation: {
		loadPreset(name) {
			THREEPOINTS = [...DATATHREEPOINTS[name]]; // separate copy, to allow modification			
			PrepareComputeDrawUpdate.orientation(); 
		},
		reset(){
			THREEPOINTS = [...INITTHREEPOINTS]; // separate copy, to allow modification			
			PrepareComputeDrawUpdate.orientation(); 
		}		
	},
	
	intersection: {
		loadPreset(name) {
			FOURPOINTS = [...DATAFOURPOINTS[name]]; // separate copy, to allow modification			
			PrepareComputeDrawUpdate.intersection(); 
		},
		reset(){
			FOURPOINTS = [...INITFOURPOINTS]; 		// separate copy, to allow modification			
			PrepareComputeDrawUpdate.intersection(); 
		}
	},
	
	pointInTriangle: {
		loadPreset(name) {
			POINTINTRIANGLE = [...DATAPOINTINTRIANGLE[name]]; // separate copy, to allow modification			
			PrepareComputeDrawUpdate.pointInTriangle(); 
		},
		reset(){
			POINTINTRIANGLE = [...INITPOINTINTRIANGLE]; // separate copy, to allow modification			
			PrepareComputeDrawUpdate.pointInTriangle(); 
		}		
	},
	
	ccwAngle: {
		loadPreset(name) {
			POINTEDNESS = [...DATAPOINTEDNESS[name]]; // separate copy, to allow modification			
			PrepareComputeDrawUpdate.pointedness(); 
		},
		reset(){
			POINTEDNESS = [...INITPOINTEDNESS]; // separate copy, to allow modification			
			PrepareComputeDrawUpdate.pointedness(); 
		}		
	}, // STUB
	
	pointedness: {
		loadPreset(name) {
			POINTEDNESS = [...DATAPOINTEDNESS[name]]; // separate copy, to allow modification			
			PrepareComputeDrawUpdate.pointedness(); 
		},
		reset(){
			POINTEDNESS = [...INITPOINTEDNESS]; // separate copy, to allow modification			
			PrepareComputeDrawUpdate.pointedness(); 
		}		
	},
	
	circumCircle: {
		loadPreset(name) {
			THREEPOINTSCIRCUMCIRCLE = [...DATATHREEPOINTSCIRCUMCIRCLE[name]]; // separate copy, to allow modification			
			PrepareComputeDrawUpdate.circumCircle(); 
		},
		reset(){
			THREEPOINTSCIRCUMCIRCLE = [...INITTHREEPOINTSCIRCUMCIRCLE]; // separate copy, to allow modification			
			PrepareComputeDrawUpdate.circumCircle(); 
		}		
	}

}