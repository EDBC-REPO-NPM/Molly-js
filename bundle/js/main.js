(function(){

	//TODO: Dom Modifier -------------------------------------------------------------------------//
	
	window.$ = function( ...args ){
		return ( args.length > 1 ) ? 
			args[0].querySelector(args[1]):
			document.querySelector(args[0]);
	};

	window._$ = function( ...args ){
		return ( args.length > 1 ) ? 
			Array.from(args[0].querySelectorAll(args[1])):
			Array.from(document.querySelectorAll(args[0]));
	};

	//TODO: XML Parser - Serializer --------------------------------------------------------------//
	
	window.XML = new Object();
	window.XML.parse = function( _string, mime="text/xml" ){ return new DOMParser().parseFromString( _string,mime ); }
	window.XML.stringify = function( _object ){ return new XMLSerializer().serializeToString( _object ); }
	
	//TODO: Element Modifier ---------------------------------------------------------------------//
	
	window.removeEvent = function( args ){ args[0].removeEventListener( args[1],args[2],true ); return args; }
	window.addEvent = function( ...args ){ args[0].addEventListener( args[1],args[2],true ); return args; }
	window.replaceElement= function(...args){ args[1].parentElement.replaceChild( args[0],args[1] ); }
	window.removeElement = function(...args){ args[0].parentElement.removeChild( args[0] ); }
	window.createElement = function(...args){ return document.createElement(args); }
	window.appendElement = function(...args){ return args[0].appendChild(args[1]); }

	//TODO: Dom Modifier -------------------------------------------------------------------------//

	window.slugify = function( text ){
		
		const reg = {
			a:'á|à|ã|â|ä',e:'é|è|ê|ë',
			o:'ó|ò|ô|õ|ö',i:'í|ì|î|ï',  
			c:'ç',n:'ñ',  u:'ú|ù|û|ü', 
			'':'\\W+|\\t+|\\n+| +',
		};
		
		Object.keys(reg).map( x=>{
			const key = new RegExp(reg[x],'gi');
			text = text.replace(key,x);
		});	return text.toLowerCase();

	}
	
	//TODO: Web Mobile Sensors  ------------------------------------------------------------------//

	window.device = new Object();

	//TODO: Query Variables  ---------------------------------------------------------------------//

	window.device.worker = new Object();
	window.device.state = require('./state');

	window.device.url = require('./url');
	window.device.hash = require('./hash');
	window.device.info = require('./info');
	window.device.fetch = require('./fetch');
	window.device.media = require('./media');
	window.device.query = require('./query');
	window.device.focus = require('./focus');
	window.device.cookie = require('./cookie');
	window.device.sensors = require('./sensor');
	window.device.storage = require('./storage');
	window.device.clipboard = require('./clipboard');
	window.device.base64toBlob = require('./base64');

	window.device.render = require('./render'); 

	//TODO: OnLoadEvent --------------------------------------------------------------------------//
	
	document.addEventListener( 'DOMSubtreeModified', function(){ window.device.render() } );
	document.addEventListener( 'DOMContentLoaded', function(){ window.device.render() });
	window.addEventListener( 'load',function(){ window.device.hash(); } )

	//TODO: OnLoadEvent --------------------------------------------------------------------------//

})();