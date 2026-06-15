//------------------------ For the SU-POLYGON project
function makeNsPointLabs(nrPts,sourcePtId){
	let labs = [];
	for (let i = 0; i < nrPts +1; i += 1) {
	  	if (i != sourcePtId){
	  		labs.push(i);
	  	}			
	}
	return labs;
}
