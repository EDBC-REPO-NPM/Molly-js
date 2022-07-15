const ajax = new Object();

if( !window.fetch ) window.fetch = require('./baseJS/fetch');

ajax.put = function( _url,_obj ){
	if( typeof( _obj ) !== 'object' ) _obj = new Object();
	_obj.method = 'PUT'; return fetch( _url,_obj );
}

ajax.get = function( _url,_obj ){
	if( typeof( _obj ) !== 'object' ) _obj = new Object();
	_obj.method = 'GET'; return fetch( _url,_obj );
}

ajax.patch = function( _url,_obj ){
	if( typeof( _obj ) !== 'object' ) _obj = new Object();
	_obj.method = 'PATCH'; return fetch( _url,_obj );
}

ajax.delete = function( _url,_obj ){
	if( typeof( _obj ) !== 'object' ) _obj = new Object();
	_obj.method = 'DELETE'; return fetch( _url,_obj );
}
	
ajax.post = function( _url,_body,_obj ){
	if( typeof( _obj ) !== 'object' ) _obj = new Object();
	if( _body !== undefined ) _obj.body = _body; 
	_obj.method = 'POST'; return fetch( _url,_obj );
}

module.exports = ajax;