function fill( _obj,xhr ){

    if( _obj.responseType ) xhr.responseType = _obj.responseType; 
    if( _obj.async!=false ) _obj.async = true;
    if( !_obj.password ) _obj.password = '';
    if( !_obj.method ) _obj.method = 'GET';
    if( !_obj.body ) _obj.body = null;
    if( !_obj.user ) _obj.user = '';

    if( _obj.headers ){
        const keys = Object.keys( _obj['headers'] );
        keys.forEach(function(x){
            xhr.setRequestHeader( x,_obj['headers'][x] );
        });
    }

    return _obj;
}

function response( xhr ){ return {
    json: function(){ return JSON.parse(xhr.response) },
    text: function(){ return xhr.response },
    Credential: xhr.withCredentials,
    mimeType: xhr.responseType,
    data: xhr.responseText,
    status: xhr.statusText,
    url: xhr.responseURL,
    status: xhr.status,
    raw: xhr.response,
}}

module.exports = ( _url,_obj )=>{ 
    const xhr = new XMLHttpRequest(); 
    _obj = fill( _obj,xhr );
    
    xhr.open( _obj.method, _url, _obj.async, _obj.user, _obj.password );
    xhr.send( _obj.body );
    
    if( _obj.async ) return new Promise( function(res,rej){
        xhr.onerror = function(e){ rej(response(xhr)) }
        xhr.onload = function(e){ res(response(xhr)) }			
    }); else return response(xhr);

}