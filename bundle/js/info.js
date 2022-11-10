const output = new Object();
	
output.isMobile = function(){
	const match = [ 
		/Windows Phone/i, /BlackBerry/i, 
		/webOS/i, /iPad/i, /iPod/i,
		/Android/i, /iPhone/i, 
	];
	return match.some( (item) => {
	    return navigator.userAgent.match( item );
	});
}

output.isTV = function(){
	const match = [ 
		/SmartTV/i, /Espial/i, /Opera TV/i, /inetTV/i,
		/HbbTV/i, /LG Browser/i, /Viera/i,
		/PhilipsTV/i, /POV_TV/i, /Roku/i, 
		/AppleTV/i, /GoogleTV/i, 
		/TV/i, /technisat/i,
	];
	return match.some( (item) => {
	    return navigator.userAgent.match( item );
	});
}
	
output.getBrowser = function(){
	const match = [ 
		/Chrome/i, /Safari/i, 
		/Opera/i, /Mozilla/i, 
	];
		
	var output = 'generic';
	for( var i in match ){		
		if( navigator.userAgent.match(match[i]) ){
			output = match[i]; break;
		}	continue;
	}	return output;
}
	
output.getOS = function(){
	const match = [ 
		/Windows Phone/i, /BlackBerry/i, /Android/i,
		/iPhone/i, /webOS/i, /iPad/i, 
		/iPod/i, /Linux/i, /MacOS/i,
		/LG/i, /SmartTV/i, /Roku/i,
		/windows/i, /ChromeOS/i,
		/Philips/i, /Apple/i
	];	var output = 'generic';
		
	for( var i in match ){
		let data = navigator.userAgent.match(match[i])
		if( navigator.userAgent.match(match[i]) ){
			output = data[0]; break;
		}	continue;
	}	return output;
}
	
output.getSize = function( _bool ){
	const size = [ 
		[150,'small'], [480,'medium'],
		[640,'xlarge'], [720,'xxsmall'],
	];
		
	for( var i=size.length; i--; ){
		if ( window.innerWidth>size[i][0] )	
			return !_bool ? size[i][1] : i;
	}
}

module.exports = output;