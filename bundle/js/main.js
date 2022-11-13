
	//TODO: polyfills ----------------------------------------------------------------------------//
	
	require("@babel/polyfill/noConflict");
	if( !window.fetch ) require('fetch-polyfill');
	if( !window.clipboard ) require('clipboard-polyfill');
	if( !window.IntersectionObserver) require('intersection-observer');
	if( !window.URLSearchParams ) require('url-search-params-polyfill');

	//TODO: Query Variables  ---------------------------------------------------------------------//

	window.query = new URLSearchParams( window.location.search );
	window.device = new Object(); window.worker = new Object();
	
	//TODO: XML Parser - Serializer --------------------------------------------------------------//
	
	window.XML = new Object();
	window.XML.stringify = function( _object ){ return new XMLSerializer().serializeToString( _object ); }
	window.XML.parse = function( _string ){ return new DOMParser().parseFromString( _string,"text/xml" ); }

	//TODO: event  ------------------------------------------------------------------------------//
	
	window.removeEvent = function( args ){ args[0].removeEventListener( args[1],args[2],true ); return args; }
	window.addEvent = function( ...args ){ args[0].addEventListener( args[1],args[2],true ); return args; }
	
	//TODO: Element Modifier ---------------------------------------------------------------------//
	
	window.replaceElement = function(...args){ args[1].parentElement.replaceChild( args[0],args[1] ); }
	window.removeElement = function(...args){ args[0].parentElement.removeChild( args[0] ); }
	window.createElement = function(...args){ return document.createElement(args); }
	window.appendElement = function(...args){ return args[0].appendChild(args[1]); }

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

	window.device.clipboard = require('./clipboard');
	window.device.sensors = require('./sensor');
	window.device.render = require('./render'); 
	window.base64toBlob = require('./base64');
	window.device.media = require('./media');
	window.device.fetch = require('./fetch');
	window.device.info = require('./info');
	
	//TODO: OnLoadEvent --------------------------------------------------------------------------//
	addEvent( document, 'DOMSubtreeModified', function(){ device.render(); });
	addEvent( document, 'DOMContentLoaded', function(){ device.render(); });
