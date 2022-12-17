const output = new Object();

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

function slugify( text ){
		
	const reg = {
		a:'á|à|ã|â|ä',e:'é|è|ê|ë',
		o:'ó|ò|ô|õ|ö',i:'í|ì|î|ï',  
		c:'ç',n:'ñ',  u:'ú|ù|û|ü', 
		'':'\\W+|\\t+|\\n+| +',
	};
	
	Object.keys(reg).map( x=>{
		const key = new RegExp(reg[x],'gi');
		text = text?.replace(key,x);
	});	return text?.toLowerCase();

}

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //
	
output.isMobile = (req,res)=>{
	const match = [ 
		/Windows Phone/i, /BlackBerry/i, 
		/webOS/i, /iPad/i, /iPod/i,
		/Android/i, /iPhone/i, 
		/Mobile/i 
	];
	return match.some( (item) => {
		const data = req.headers['sec-ch-ua-platform'];
	    return item.test(slugify(data));
	});
}

output.isDesktop = (req,res)=>{
	return [
		!output.isTV(req,res),
		!output.isMobile(req,res),
	].every( x=>x );
}

output.isTV = (req,res)=>{
	const match = [ 
		/SmartTV/i, /Espial/i, /Opera TV/i, /inetTV/i,
		/HbbTV/i, /LG Browser/i, /Viera/i,
		/PhilipsTV/i, /POV_TV/i, /Roku/i, 
		/AppleTV/i, /GoogleTV/i, 
		/technisat/i, /TV/i,
	];
	return match.some( (item) => {
		const data = req.headers['sec-ch-ua-platform'];
	    return item.test(slugify(data));
	});
}
	
output.getBrowser = (req,res)=>{
	const data = req.headers['user-agent'];
	var output = 'generic';
	const match = [ 
		/Chrome/i, /Chromium/i, 
		/Safari/i, /Opera/i, 
		/Mozilla/i, 
	];

	for( var i in match ){		
		if( match[i].test(slugify(data)) )
			return match[i].source;
	}	return 'generic';
}
	
output.getOS = (req,res)=>{
	const match = [ 
		/Windows Phone/i, /BlackBerry/i, /Android/i,
		/iPhone/i, /webOS/i, /iPad/i, 
		/iPod/i, /Linux/i, /MacOS/i,
		/LG/i, /SmartTV/i, /Roku/i,
		/windows/i, /ChromeOS/i,
		/Philips/i, /Apple/i
	];
		
	for( var i in match ){
		const data = req.headers['sec-ch-ua-platform'];
		if( match[i].test(slugify(data)) )
			return match[i].source;
	}	return 'generic';
}
	
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

module.exports = output;
