
const output = new Object();

function expirationAge(){

    const today = new Date();
    const tomrw = new Date();

    tomrw.setDate( tomrw.getDate() + 1 );
    tomrw.setHours(0); tomrw.setSeconds(0);
    tomrw.setMinutes(0); tomrw.setMilliseconds(0);
    timeout = (tomrw.getTime()-today.getTime()) / Math.pow(10,3);

	/*console.log(timeout)*/ return process.molly.maxAge || parseInt( timeout );

}

output.headerExtention = ( headers,cache,size )=>{

	if( process.molly.strict ){
		headers["Content-Security-Policy-Reporn-Only"] = "default-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self';";
		headers["referrer-policy"] = "origin-when-cross-origin, strict-origin-when-cross-origin";
		headers["Strict-Transport-Security"] = `max-age=${ expirationAge() }; preload`;
	};	
	
	if( cache ) headers["Cache-Control"] = `public, max-age=${ expirationAge() }`;

	if( process.molly.cors ){ 
		headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";
		headers["Access-Control-Allow-Methods"] = "OPTIONS, POST, GET";
		headers["cross-origin-resource-policy"] = "cross-origin";
		headers["Access-Control-Max-Age"] = expirationAge();
		headers["Access-Control-Allow-Origin"] = "*"; 
	}

	if( process.molly.iframe ) 
		headers["x-frame-options"] = process.molly.iframe;
	if( size!=0 ) headers["Content-Length"] = size;
		headers["powered-by"] = "molly-js";
		headers["x-xss-protection"] = 0;
		
	if( process.molly.headers )
		Object.keys( process.headers ).forEach( (key)=>{
			headers[key] = process.headers[key];
		});
	
	return headers;			
}
	
output.staticHeader = function( mimeType,cache=true,size=0 ){
	const headers = { "Content-Type":mimeType }; 
	return output.headerExtention( headers,cache,size );
}

output.streamHeader = function( mimeType,start,end,size ){
	const length = end-start+1; const headers = {
		"Content-Range":`bytes ${start}-${end}/${size}`,
		"Accept-Ranges":"bytes", "Content-Type": mimeType,
	};	return output.headerExtention( headers,false,length );
}

module.exports = output;
