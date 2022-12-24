(function(){

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //
	
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

	window.$$ = window._$;

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //
	
	window.XML = new Object();
	window.XML.parse = function( _string, mime="text/xml" ){ return new DOMParser().parseFromString( _string,mime ); }
	window.XML.stringify = function( _object ){ return new XMLSerializer().serializeToString( _object ); }
	
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //
	
	window.removeEvent = function( args ){ args[0].removeEventListener( args[1],args[2],true ); return args; }
	window.addEvent = function( ...args ){ args[0].addEventListener( args[1],args[2],true ); return args; }
	window.replaceElement= function(...args){ args[1].parentElement.replaceChild( args[0],args[1] ); }
	window.removeElement = function(...args){ args[0].parentElement.removeChild( args[0] ); }
	window.createElement = function(...args){ return document.createElement(args); }
	window.appendElement = function(...args){ return args[0].appendChild(args[1]); }

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

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
	
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

	window.device = new Object();

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

	window.device.worker = new Object();
	window.device.url = require('./url');
	window.device.state = require('./state');
	window.device.focus = require('./focus');
	
	window.device.base64toBlob = require('./base64');
	window.device.clipboard = require('./clipboard');
	window.device.session = require('./session');
	window.device.storage = require('./storage');
	window.device.sensors = require('./sensor');
	window.device.cookie = require('./cookie');
	window.device.query = require('./query');
	window.device.media = require('./media');
	window.device.fetch = require('./fetch');
	window.device.info = require('./info');
	window.device.hash = require('./hash');

	window.device.render = require('./render'); 

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //
	
	window.addEventListener( 'load',()=>{
		document.addEventListener( 'DOMSubtreeModified', function(){ window.device.render() } );
		(()=>{ window.device.hash(); window.device.render(); })();
	});

// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────── //

})();