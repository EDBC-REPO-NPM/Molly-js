'use strict';

require('@babel/polyfill');
require('intersection-observer');
require('url-search-params-polyfill');
		
//TODO: Query Variables  ---------------------------------------------------------------------//

window.query = new URLSearchParams( window.location.search );
window.state = new Object();

// TODO: Slugify -----------------------------------------------------------------------------//

window.slugify = function(str){ const map = {
	'o' : 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
	'a' : 'á|à|ã|â|ä|À|Á|Ã|Â|Ä',
	'e' : 'é|è|ê|ë|É|È|Ê|Ë',
	'i' : 'í|ì|î|ï|Í|Ì|Î|Ï',
	'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
	'c' : 'ç|Ç','n':'ñ|Ñ',
	''  : /\s|\W/,
};	for (var pattern in map) { 
		str=str.replace( new RegExp(map[pattern],'g' ), pattern); 
	}	return str.toLowerCase();
}

//TODO: XML Parser - Serializer --------------------------------------------------------------//

window.XML = new Object();
XML.stringify = function( _object ){ return new XMLSerializer().serializeToString( _object ); }
XML.parse = function( _string ){ return new DOMParser().parseFromString( _string,"text/xml" ); }

// TODO: Base64 to Blob ----------------------------------------------------------------------//

window.base64toBlob = function( b64Data, contentType='', sliceSize=512 ) {
	const byteCharacters = atob(b64Data);
	const byteArrays = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		const byteArray = new Uint8Array(byteNumbers);
		byteArrays.push(byteArray);
	}

	return new Blob(byteArrays, {type: contentType});

}

//TODO: event  ------------------------------------------------------------------------------//
window.removeEvent = function( args ){ args[0].removeEventListener( args[1],args[2],true ); return args; }
window.addEvent = function( ...args ){ args[0].addEventListener( args[1],args[2],true ); return args; }

//TODO: Element Modifier ---------------------------------------------------------------------//

window.replaceElement = function(...args){ args[1].parentElement.replaceChild( args[0],args[1] ); }
window.removeElement = function(...args){ args[0].parentElement.removeChild( args[0] ); }
window.createElement = function(...args){ return document.createElement(args); }
window.appendElement = function(...args){ return args[0].appendChild(args[1]); }

//TODO: Dom Modifier -------------------------------------------------------------------------//
	
window.$$= function(...args){ 
	if( args.length > 1 ) return args[0].querySelectorAll(args[1]); 
	else return document.querySelectorAll(args[0]); 
}

window.$ = function(...args){
	if( args.length > 1 ) return args[0].querySelector(args[1]); 
	else return document.querySelector(args[0]); 
}

//TODO: Clipboard ----------------------------------------------------------------------------//

window.clipboard = new Object()
clipboard.paste = async()=>{ return navigator.clipboard.readText(); }
clipboard.copy = ( _value )=>{ navigator.clipboard.writeText( _value ); }

//TODO: DEVICE DETECTION ---------------------------------------------------------------------//

window.device = new Object();

device.isMobile = function(){
	const match = [ 
		/Windows Phone/i, /BlackBerry/i, 
		/webOS/i, /iPad/i, /iPod/i,
		/Android/i, /iPhone/i, 
	];
	return match.some( (item) => {
		return navigator.userAgent.match( item );
	});
}

device.getBrowser = function(){
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

device.getOS = function(){
	const match = [ 
		/Windows Phone/i, /BlackBerry/i, /Android/i,
		/iPhone/i, /webOS/i, /iPad/i, 
		/iPod/i, /Linux/i, /MacOS/i,
		/windows/i, /ChromeOS/i,
	];	var output = 'generic';
	
	for( var i in match ){
		let data = navigator.userAgent.match(match[i])
		if( navigator.userAgent.match(match[i]) ){
			output = data[0]; break;
		}	continue;
	}	return output;
	
}

device.getSize = function( _bool ){
	const size = [ 
		[150,'small'], [480,'medium'],
		[640,'xlarge'], [720,'xxsmall'],
	];
	
	for( var i=size.length; i--; ){
		if ( window.innerWidth>size[i][0] )	
			return !_bool ? size[i][1] : i;
	}
	
}

//TODE: Device Event -------------------------------------------------------------------------//
device.onload = function( callback ){ window['loadEvent'] = callback; }

//TODO: IP  ----------------------------------------------------------------------------------//

device.getIP = async function( _ip='' ){
	const response = await ajax.get('http://ip-api.com/json/'+_ip);
	return await response.json();
}

//TODO: Web Mobile Sensors  ------------------------------------------------------------------//

device.battery = function(){
	if( !window.BatteryManager ) 
		return console.error(' battery is not supported ');
	return navigator.getBattery();
}

device.gyroscope = function( callback ){ 
	if( !window.DeviceOrientationEvent ) 
		return console.error(' gyroscope is not supported ');
	addEvent( window,'deviceorientation', (event)=>callback(event) );
}

device.accelerometer = function( callback ){ 
	if( !window.DeviceMotionEvent )
		return console.error(' Accelerometer is not supported ');
	addEvent( window,'deviceorientation', (event)=>callback(event) ); 
}

device.geolocation = function( _obj ){
	if( !window.navigator.geolocation )
		return console.error(' geolocation is not supported ');
		
	if( typeof( _obj ) !== 'object' ){ _obj = new Object();	
		 _obj.enableHighAccuracy = true;
		  _obj.timeout = 5000;
		  _obj.maximumAge = 0;
	}	

	const promise = new Promise( function(res,rej){
		navigator.geolocation.getCurrentPosition( res,rej,_obj );
	});	return promise;
}

//TODO: Desktop ------------------------------------------------------------------------------//
	
device.getScreen = function( _obj ){
	if( !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) )
		return console.error('screen recorder is not suported');

	if( typeof( _obj ) !== 'object' ){ 
		_obj = new Object();	
		_obj.video = true; 
		_obj.audio = true;
	}	
	
	return navigator.mediaDevices.getDisplayMedia( _obj );
}

//TODO: Camera  ------------------------------------------------------------------------------//
	
device.getCamera = function( _obj ){
	if( !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) )
		return console.error('camera is not suported');

	if( typeof( _obj ) !== 'object' ){ 
		_obj = new Object();	
		_obj.video = true; 
		_obj.audio = true;
	}	
	
	return navigator.mediaDevices.getUserMedia( _obj );
}

//TODO: Microphone  --------------------------------------------------------------------------//
	
device.getMicrophone = function( _obj ){
	if( !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) )
		return console.error('microphone is not suported');

	if( typeof( _obj ) !== 'object' ){ 
		_obj = new Object();	
		_obj.video = false;
		_obj.audio = true;
	}	
	
	return navigator.mediaDevices.getUserMedia( _obj );
}

//TODO: stopStream ---------------------------------------------------------------------------//

device.stopMediaStream = function( _stream ){ _stream.getTracks().forEach(item=>item.stop()) }

//TODO: Record Element  ----------------------------------------------------------------------//

device.stopRecording = function( _recorder ){ _recorder.mediaRecorder.stop(); }
device.startRecording = function( _recorder ){
	   const mediaRecorder = new MediaRecorder( _recorder );
		_recorder.mediaRecorder = mediaRecorder;
	const data = new Array();

	_recorder.mediaRecorder.ondataavailable = (event)=>{
		data.push( event.data );
	};	_recorder.mediaRecorder.start();
	
	var promise = new Promise( (res,rej)=>{
		_recorder.mediaRecorder.onerror = (err)=> rej(err);
		_recorder.mediaRecorder.onstop = ()=>res(data);
	});	return promise;
}

device.saveRecord = function( _blobs,_name ){ 	
	var _blob = new Blob( _blobs, {'type':_blobs[0].type});	
	var url = URL.createObjectURL( _blob );
	var a = createElement('a');
	$('body').appendChild(a);
		a.setAttribute('download',_name);
		a.setAttribute('href',url);
		a.style = "display: none";
		a.click();
	URL.revokeObjectURL(url);
	$('body').removeChild(a);
}

//TODO: WebSocket OBJECT ---------------------------------------------------------------------//

device.WebSocket = WebSocket;
//device.db = require('./db');
//device.hls = require('./hls');
  window.ajax = require('./ajax');
//device.peer = require('./peer');

//TODO: Lazy Load Fuction   ------------------------------------------------------------------//

const config = { rootMargin:'250px 0px' };
const observer = new IntersectionObserver( (entries, observer)=>{
	entries.forEach( entry=>{
		const object = entry.target;
		const placeholder = object.src;
		if( entry.isIntersecting ){
			object.src = object.dataset.src;
			observer.unobserve( object );
			addEvent(object,'error',(el)=>{try{
				const newElement = createElement( object.tagName );
					  newElement.setAttribute('src',placeholder);
				replaceElement( newElement,object );
			}catch(e){ }});
		}
	});
}, config); 


//TODO: Load Component Fuction  --------------------------------------------------------------//

const _loadRenders_ = function( renders ){
	return new Promise( async(res,rej)=>{ try{
		for( var index=renders.length; index--; ){
			const render = renders[index];
			
			const response = await ajax.get( render.getAttribute('path') );
			const attr = render.attributes;
			let element = undefined;

			if( render.getAttribute('type') )
				element = createElement(render.getAttribute('type'));
			else
				element = createElement('div');
				
			const data = new Array();
			element.innerHTML = await response.text();
			
			for( var i=attr.length; i--; ){
				if( attr[i].localName !== 'path' )
					element.setAttribute( attr[i].localName,attr[i].value );
			}	render.replaceWith( element );
			
		} res(true); 
		} catch(e) { console.log(e);rej(false); }
	});
}

const _loadBases_ = function( bases ){
	return new Promise( (res,rej)=>{ try{
		bases.forEach( async(base,index)=>{
			
			const mimeType = base.getAttribute('type') || '';

			const data = base.getAttribute('b64');
			const file = base64toBlob( data, mimeType );
			const url = URL.createObjectURL( file );

			if( base.getAttribute('lazy') )
				base.setAttribute('data-src',url);
			else
				base.setAttribute('src',url);

			base.removeAttribute('type');
			base.removeAttribute('b64');
							
		}); res(true); } catch(e) { rej(false); }
	});
}

const _loadLazys_ = function( lazys ){
	return new Promise( (res,rej)=>{ try{
		lazys.forEach( lazy=>{ 
			observer.observe( lazy );
		});	res(true);
	} catch(e) { rej(false); } });
}
	
const _loadComponents_ = async function(){ try{
	
	if( window['_changing_'] ) 
		return undefined;
		window['_changing_'] = true;

	const bases = $$('*[b64]');
	const lazys = $$('*[lazy]');
	const renders = $$('component[path]'); 

	const A = await _loadRenders_( renders );
	
	if( !(renders.length>0) /*&& !(bases.length>0) && !(lazys.length>0)*/ ){
		
		const B = await _loadBases_( bases );
		const C = await _loadLazys_( lazys );
		
		if( !window['_loaded_'] && B && C ){
			window['_loaded_'] = true;
			window.loadEvent();	
		} 	window['_changing_'] = false;
		
	} else if( A ){
		window['_changing_'] = false;
		return _loadComponents_();
	}
	
} catch(e) { /*console.error(e)*/ }}
		
//TODO: OnLoadEvent --------------------------------------------------------------------------//
addEvent( document, 'DOMSubtreeModified', function(){ _loadComponents_(); });
addEvent( document, 'DOMContentLoaded', function(){ _loadComponents_(); });
window.render = _loadComponents_;

module.exports = { 
	render: _loadComponents_,
	clipboard: clipboard,
	device: device,
	event: event,
	state: state,
	self: window,
	ajax: ajax,
}