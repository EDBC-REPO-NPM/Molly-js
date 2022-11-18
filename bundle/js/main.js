
	//TODO: polyfills ----------------------------------------------------------------------------//
	
	//require("@babel/polyfill/noConflict");
	//if( !window.fetch ) require('fetch-polyfill');
	//if( !window.clipboard ) require('clipboard-polyfill');
	//if( !window.IntersectionObserver) require('intersection-observer');
	//if( !window.URLSearchParams ) require('url-search-params-polyfill');

	//TODO: Query Variables  ---------------------------------------------------------------------//

	window.device = new Object(); 
	window.device.worker = new Object();

	//TODO: event  ------------------------------------------------------------------------------//
	
	window.addEvent = function( ...args ){ args[0].addEventListener( args[1],args[2],true ); return args; }
	window.removeEvent = function( args ){ args[0].removeEventListener( args[1],args[2],true ); return args; }
	
	//TODO: XML Parser - Serializer --------------------------------------------------------------//
	
	window.XML = new Object();
	window.XML.parse = function( _string, mime="text/xml" ){ 
		_string = _string.replace(/\<\°/gi,'#°')
						 .replace(/\°\>/gi,'°#')
		return new DOMParser().parseFromString( _string,mime ); 
	}
	window.XML.stringify = function( _object ){ return new XMLSerializer().serializeToString( _object ); }
	
	//TODO: Element Modifier ---------------------------------------------------------------------//
	
	window.replaceElement = function(...args){ args[1].parentElement.replaceChild( args[0],args[1] ); }
	window.removeElement = function(...args){ args[0].parentElement.removeChild( args[0] ); }
	window.createElement = function(...args){ return document.createElement(args); }
	window.appendElement = function(...args){ return args[0].appendChild(args[1]); }

	//TODO: Dom Modifier -------------------------------------------------------------------------//

	window.slugify = function( text ){
		
		const reg = {
			u:'ú|ü', n:'ñ',
			a:'á|ä', e:'é|ë',
			i:'í|ï', o:'ó|ö',
			'':'\\W+|\\t+|\\n+| +',
		};
		
		Object.keys(reg).map( x=>{
			const key = new RegExp(reg[x],'gi');
			text = text.replace(key,x);
		});	return text.toLowerCase();

	}

	//TODO: Dom Modifier -------------------------------------------------------------------------//
		
	window.$$ = function( ...args ){ let elements;
		if( args.length > 1 ) elements = args[0].querySelectorAll(args[1]);
		else elements = document.querySelectorAll(args[0]);
		return Array.from(elements);
	}
	
	window.$ = function( ...args ){ let elements;
		if( args.length > 1 ) elements = args[0].querySelector(args[1]);
		else elements = document.querySelector(args[0]);
		return elements;
	}
	
	//TODO: Web Mobile Sensors  ------------------------------------------------------------------//

	window.device.url = require('./url');
	window.device.info = require('./info');
	window.device.state = require('./state');
	window.device.fetch = require('./fetch');
	window.device.media = require('./media');
	window.device.query = require('./query');
	window.base64toBlob = require('./base64');
	window.device.cookie = require('./cookie');
	window.device.render = require('./render'); 
	window.device.sensors = require('./sensor');
	window.device.clipboard = require('./clipboard');
	
	//TODO: OnLoadEvent --------------------------------------------------------------------------//
	addEvent( document, 'DOMSubtreeModified', function(){ device.render(); });
	addEvent( document, 'DOMContentLoaded', function(){ device.render(); });
