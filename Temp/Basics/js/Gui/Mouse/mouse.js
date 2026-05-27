
// MouseSetup
const MouseSetup = {
	
	orientation(){
		CANVASorientation.addEventListener('mousedown', e => {
			const r = CANVASorientation.getBoundingClientRect();
			const mx = e.clientX-r.left, my = e.clientY-r.top;
			DRAGGINGorientation = null;
			THREEPOINTS.forEach((p,i) => { if (Math.hypot(p.x-mx,p.y-my)<14) DRAGGINGorientation=i; });
			if (DRAGGINGorientation===null) {
				const idx = THREEPOINTS.length < 3 ? 
					THREEPOINTS.length : 
					(()=>{ 
						let best=0,bd=Infinity; 
						THREEPOINTS.forEach((p,i)=>{const d=Math.hypot(p.x-mx,p.y-my);if(d<bd){bd=d;best=i;}}); return best; })();
				THREEPOINTS[idx] = {x:mx,y:my}; 
				DRAGGINGorientation=idx;
			}
			// prepareCanvasComputeDrawSceneUpdateGuiOrientation();
			PrepareComputeDrawUpdate.orientation();
		});
		
		CANVASorientation.addEventListener('mousemove', e => {
			if (DRAGGINGorientation===null) return;
			const r=CANVASorientation.getBoundingClientRect();
			THREEPOINTS[DRAGGINGorientation]={x:e.clientX-r.left,y:e.clientY-r.top};
			// prepareCanvasComputeDrawSceneUpdateGuiOrientation();
			PrepareComputeDrawUpdate.orientation();
		});
		
		CANVASorientation.addEventListener('mouseup', ()=>{ DRAGGINGorientation=null; });
	},

	intersection(){
		
		CANVASintersection.addEventListener('mousedown', e => {
		  if (!FOURPOINTS) return;
		  const r=CANVASintersection.getBoundingClientRect(); 
		  const mx=e.clientX-r.left, my=e.clientY-r.top;
		  DRAGGINGintersection = null;
		  FOURPOINTS.forEach((p,i)=>{ if(Math.hypot(p.x-mx,p.y-my)<14) DRAGGINGintersection=i; });
		  PrepareComputeDrawUpdate.intersection();
		});
		CANVASintersection.addEventListener('mousemove', e => {
		  if (DRAGGINGintersection===null) return;
		  const r=CANVASintersection.getBoundingClientRect();
		  FOURPOINTS[DRAGGINGintersection]={x:e.clientX-r.left,y:e.clientY-r.top};
		  PrepareComputeDrawUpdate.intersection();
		});
		CANVASintersection.addEventListener('mouseup',()=>{ DRAGGINGintersection=null; });
		
	},
	
	pointInTriangle(){
		
		CANVASpointInTriangle.addEventListener('mousedown', e => {
		  if (!POINTINTRIANGLE) return;
		  const r=CANVASpointInTriangle.getBoundingClientRect(); 
		  const mx=e.clientX-r.left, my=e.clientY-r.top;
		  DRAGGINGpointInTriangle = null;
		  POINTINTRIANGLE.forEach((p,i)=>{ if(Math.hypot(p.x-mx,p.y-my)<14) DRAGGINGpointInTriangle=i; });
		  PrepareComputeDrawUpdate.pointInTriangle();
		});
		
		CANVASpointInTriangle.addEventListener('mousemove', e => {
		  if (DRAGGINGpointInTriangle===null) return;
		  const r=CANVASpointInTriangle.getBoundingClientRect();
		  POINTINTRIANGLE[DRAGGINGpointInTriangle]={x:e.clientX-r.left,y:e.clientY-r.top};
		  PrepareComputeDrawUpdate.pointInTriangle();
		});
		
		CANVASpointInTriangle.addEventListener('mouseup',()=>{ DRAGGINGpointInTriangle=null; });
		
	},
	
	pointedness(){
		
		CANVASpointedness.addEventListener('mousedown', e => {
		  if (!POINTEDNESS) return;
		  const r=CANVASpointedness.getBoundingClientRect(); 
		  const mx=e.clientX-r.left, my=e.clientY-r.top;
		  DRAGGINGpointedness = null;
		  POINTEDNESS.forEach((p,i)=>{ if(Math.hypot(p.x-mx,p.y-my)<14) DRAGGINGpointedness=i; });
		  PrepareComputeDrawUpdate.pointedness();
		});
		
		CANVASpointedness.addEventListener('mousemove', e => {
		  if (DRAGGINGpointedness===null) return;
		  const r=CANVASpointedness.getBoundingClientRect();
		  POINTEDNESS[DRAGGINGpointedness]={x:e.clientX-r.left,y:e.clientY-r.top};
		  PrepareComputeDrawUpdate.pointedness();
		});
		
		CANVASpointedness.addEventListener('mouseup',()=>{ DRAGGINGpointedness=null; });
		
	},
	
	ccwAngle(){
		
		CANVASccwAngle.addEventListener('mousedown', e => {
		  if (!CCWANGLEPOINTS) return;
		  const r=CANVASccwAngle.getBoundingClientRect(); 
		  const mx=e.clientX-r.left, my=e.clientY-r.top;
		  DRAGGINGccwAngle = null;
		  CCWANGLEPOINTS.forEach((p,i)=>{ if(Math.hypot(p.x-mx,p.y-my)<14) DRAGGINGccwAngle=i; });
		  PrepareComputeDrawUpdate.ccwAngle();
		});
		
		CANVASccwAngle.addEventListener('mousemove', e => {
		  if (DRAGGINGccwAngle===null) return;
		  const r=CANVASccwAngle.getBoundingClientRect();
		  CCWANGLEPOINTS[DRAGGINGccwAngle]={x:e.clientX-r.left,y:e.clientY-r.top};
		  PrepareComputeDrawUpdate.ccwAngle();
		});
		
		CANVASccwAngle.addEventListener('mouseup',()=>{ DRAGGINGccwAngle=null; });
		
	},
	
	circumCircle(){
		
		CANVAScircumCircle.addEventListener('mousedown', e => {
		  if (!THREEPOINTSCIRCUMCIRCLE) return;
		  const r=CANVAScircumCircle.getBoundingClientRect(); 
		  const mx=e.clientX-r.left, my=e.clientY-r.top;
		  DRAGGINGcircumCircle = null;
		  THREEPOINTSCIRCUMCIRCLE.forEach((p,i)=>{ if(Math.hypot(p.x-mx,p.y-my)<14) DRAGGINGcircumCircle=i; });
		  PrepareComputeDrawUpdate.circumCircle();
		});
		
		CANVAScircumCircle.addEventListener('mousemove', e => {
		  if (DRAGGINGcircumCircle===null) return;
		  const r=CANVAScircumCircle.getBoundingClientRect();
		  THREEPOINTSCIRCUMCIRCLE[DRAGGINGcircumCircle]={x:e.clientX-r.left,y:e.clientY-r.top};
		  PrepareComputeDrawUpdate.circumCircle();
		});
		
		CANVAScircumCircle.addEventListener('mouseup',()=>{ DRAGGINGcircumCircle=null; });
		
	}

}