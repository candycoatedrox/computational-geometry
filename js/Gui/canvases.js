// ─── CANVAS SETUP ────────────────────────────────────
function setupCanvasInWrapById(id) {
  const canvas = document.getElementById(id);
  const wrap = canvas.parentElement;
  if (canvas.width !== wrap.clientWidth || canvas.height !== wrap.clientHeight) {
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
  }
  return canvas;
}

function setupCanvasInWrap(canvas) {
  // const canvas = document.getElementById(id);
  const wrap = canvas.parentElement;
  if (canvas.width !== wrap.clientWidth || canvas.height !== wrap.clientHeight) {
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
  }
  return canvas;
}

function clearCanvas(cv){
	const w = cv.width, h = cv.height;
	const ctx = cv.getContext('2d');
	
	ctx.clearRect(0,0,w,h); 
	return ctx;
}

function prepareCanvas(cv){	
		
	const cv1 = setupCanvasInWrap(cv);
	return clearCanvas(cv1);
	// const ctx = cv1.getContext('2d');
	// // clear rectangle and return context
	// const w = cv1.width, h = cv1.height;
	// ctx.clearRect(0,0,w,h);
	// return ctx;
}

function initCanvasGraphics(canvas){	
	const cv = setupCanvasInWrap(canvas);
	return clearCanvas(cv);
}

function resetCanvasGraphics(canvas){	
	const cv = setupCanvasInWrap(canvas);
	return clearCanvas(cv);
}