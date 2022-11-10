	//TODO: Query Variables  ---------------------------------------------------------------------//

	store = window.localStorage; cookie = window.cookieStore;
	query = new URLSearchParams( window.location.search );
	device = new Object(); worker = new Object();
	
	//TODO: XML Parser - Serializer --------------------------------------------------------------//
	
	XML = new Object();
	XML.stringify = function( _object ){ return new XMLSerializer().serializeToString( _object ); }
	XML.parse = function( _string ){ return new DOMParser().parseFromString( _string,"text/xml" ); }

	//TODO: event  ------------------------------------------------------------------------------//
	
	removeEvent = function( args ){ args[0].removeEventListener( args[1],args[2],true ); return args; }
	addEvent = function( ...args ){ args[0].addEventListener( args[1],args[2],true ); return args; }
	
	//TODO: Element Modifier ---------------------------------------------------------------------//
	
	replaceElement = function(...args){ args[1].parentElement.replaceChild( args[0],args[1] ); }
	removeElement = function(...args){ args[0].parentElement.removeChild( args[0] ); }
	createElement = function(...args){ return document.createElement(args); }
	appendElement = function(...args){ return args[0].appendChild(args[1]); }

	//TODO: Dom Modifier -------------------------------------------------------------------------//
		
	$$ = function( ...args ){ let elements;
		if( args.length > 1 ) elements = args[0].querySelectorAll(args[1]);
		else elements = document.querySelectorAll(args[0]);
		return Array.from(elements);
	}
	
	$ = function( ...args ){ let elements;
		if( args.length > 1 ) elements = args[0].querySelector(args[1]);
		else elements = document.querySelector(args[0]);
		return elements;
	}
	
	//TODO: Web Mobile Sensors  ------------------------------------------------------------------//

	device.clipboard = require('./clipboard');
	device.sensors = require('./sensor');
	device.render = require('./render'); 
	base64toBlob = require('./base64');
	device.media = require('./media');
	device.fetch = require('./fetch');
	device.info = require('./info');
	
	//TODO: OnLoadEvent --------------------------------------------------------------------------//
	addEvent( document, 'DOMSubtreeModified', function(){ device.render(); });
	addEvent( document, 'DOMContentLoaded', function(){ device.render(); });
