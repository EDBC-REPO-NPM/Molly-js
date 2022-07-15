const crypto = require('./baseJS/crypto');

//TODO: Function ---------------------------------------------------------------------------------//

const store = {
	set: function(key,data){ localStorage.setItem(key,data); },
	key: function(index){ return localStorage.key(index); },
	get: function(key){ return localStorage.getItem(key); },
	clear: function(){ localStorage.clear(); },
	length: localStorage.length,
}

//TODO: Function ---------------------------------------------------------------------------------//

const JsonFormatter = {
	'stringify': function(cipherParams) {
    	var jsonObj = { ct: cipherParams.ciphertext.toString(crypto.enc.Base64) };
    	if (cipherParams.salt) jsonObj.s = cipherParams.salt.toString();
	    if (cipherParams.iv) jsonObj.iv = cipherParams.iv.toString(); 
	    return btoa( JSON.stringify(jsonObj) );
  	},

  	'parse': function(jsonStr) {
    	var jsonObj = JSON.parse( atob(jsonStr) );
    	var cipherParams = crypto.lib.CipherParams.create({
     	 	ciphertext: crypto.enc.Base64.parse(jsonObj.ct)
    	});
    	if (jsonObj.iv) cipherParams.iv = crypto.enc.Hex.parse(jsonObj.iv);
    	if (jsonObj.s) cipherParams.salt = crypto.enc.Hex.parse(jsonObj.s);
    	return cipherParams;
 	}
};

//TODO: Function ---------------------------------------------------------------------------------//

const init = function( _table,_config,_self ){
	return {
		_i: 0,
		_res: new Array(),
		_itr: _createNewTable_( _table ),
		_cfg: !_config ? _self.default : _config,
	}
};

const _lineConstrain_ = function( _i,_config ){
	if( _i >= parseInt(_config.length)+parseInt(_config.offset) ) return 1;
	else if ( _i < parseInt(_config.offset) ) return -1
	else return 0;
}

const _createNewTable_ = function( _path ){
	const content = store.get( _path )
	if( content == null ) return new Array();
	return content.split('\n'); 
}

const _createNewHash_ = function( _object ){
	_object['_stamp'] = Date.now();
	const _base = JSON.stringify( _object );
	if( !_object.hash )
		_object.hash = crypto.SHA256( _base ).toString();
	return _object;
}


//TODO: localDB Class ----------------------------------------------------------------------------//

class createWebDB{

	constructor( _password ){

		this.encrypted = false
		this.events = new Object()
		this.default = { offset: 0, length: 100 }

		if( _password ){
			this.password = _password;
			this.encrypted = true;
		}
	}

	//TODO: clear all LocalStorage //
	removeTable( _table ){ 
		store.set( _table, null ); 
		delete localStorage[ _table ];
	}

	//TODO: clear all LocalStorage //
	removeTable( _table ){ 
		store.set( _table, null ); 
		delete localStorage[ _table ];
	}

	clearDB(){ store.clear(); }

	// TODO: Encription & Decription DATA //
	encrypt( _message,_password=this.password,_encrypted=this.encrypted ){ try{
		if( this.encrypted )
			return crypto.AES.encrypt( _message,this.password,{
				format: JsonFormatter
			}).toString( crypto.enc.Utf8 );
		return _message;
		} catch(e) { return _message; }
	}
	
	decrypt( _message,_password=this.password,_encrypted=this.encrypted ){ try{
		if( this.encrypted )
			return crypto.AES.decrypt( _message,this.password,{
				format: JsonFormatter
			}).toString( crypto.enc.Utf8 );
		return _message;
		} catch(e) { return _message; }
	}

	// TODO: Searching functions //
	list( _table, _config ){ 
		return new Promise( (res,rej)=>{ try{

			let { _i,_cfg,_itr,_res,_tmp,_path } = init( _table,_config,this );

			_itr.every( ( encryptedLine )=>{ try{

				const line = this.decrypt( encryptedLine );
				const cns = _lineConstrain_( _i, _cfg );
				const data = JSON.parse( line );

				if( cns == 0 ) _res.push( data );
				else if( cns == 1 ) return false;

				} catch(e) { rej(`the db can be decripted ${e}`) }

			_i++; return true; }); res({data:_res,table:_table});

		} catch(e) { rej( e ); } }); 
	}

	find( _table, _target, _logic='AND', _config ){ 
		return new Promise( (res,rej)=>{ try{
			
			let { _i,_cfg,_itr,_res,_tmp,_path } = init( _table,_config,this );

			_itr.every( ( encryptedLine )=>{ try{

				const line = this.decrypt( encryptedLine );
				const keys = Object.keys( _target );
				const data = JSON.parse( line );

				const some = keys.some( (x)=> slugify(data[x].toString()) == slugify(_target[x].toString()) );
				const every = keys.every( (x)=> slugify(data[x].toString()) == slugify(_target[x].toString()) );

				if( ( _logic == 'AND' && every ) || ( _logic == 'OR' && some ) ){
					const cns = _lineConstrain_(_i, _cfg );
					if( cns == 0 ) _res.push( data );
					else if( cns == 1 ) return false;
				_i++;}

				} catch(e) { rej(`the db can be decripted ${e}`) }

			return true; }); res({data:_res,table:_table});

		} catch(e) { rej( e ); } }); 
	}

	match( _table, _match, _config ){ 
		return new Promise( (res,rej)=>{ try{
			
			let { _i,_cfg,_itr,_res,_tmp,_path } = init( _table,_config,this );

			_itr.every( ( encryptedLine )=>{ try{

				const line = this.decrypt( encryptedLine );
				if( slugify(line).search( slugify(_match) ) >= 0 ){
					const cns = _lineConstrain_(_i, _cfg );
					const data = JSON.parse( line );
					if( cns == 0 ) _res.push( data );
					else if( cns == 1 ) return false;
				i++;}
				
				} catch(e) { rej(`the db can be decripted ${e}`) }
			return true; }); res({data:_res,table:_table});

		} catch(e) { rej( e ); } }); 
	}

	findByHash( _table, _hash ){ 
		return new Promise( (res,rej)=>{ try{
			
			let { _i,_cfg,_itr,_res,_tmp,_path } = init( _table,null,this );

			_itr.every( ( encryptedLine )=>{ try{

				const line = this.decrypt( encryptedLine );
				const data = JSON.parse( line );

				if( data.hash == _hash ){
					_res.push( data );
					return false;
				}

				} catch(e) { rej(`the db can be decripted ${e}`) }
			_i++; return true; }); res({data:_res,table:_table});

		} catch(e) { rej( e ); } }); 
	}

	// TODO: Saving functions //
	push( _table, ..._object ){ 
		return new Promise( (res,rej)=>{ try{
			
			let { _i,_cfg,_itr,_res,_tmp,_path } = init( _table,null,this );

			_object.flat().forEach( item=>{
				item = _createNewHash_( item );
				const data = JSON.stringify(item);
				_itr.push( this.encrypt( data ) );
			}); store.set( _table,_itr.join('\n') ); res({table:_table});

		} catch(e) { rej( e ); } }); 
	}

	unshift( _table, ..._object ){ 
		return new Promise( (res,rej)=>{ try{
			
			let { _i,_cfg,_itr,_res,_tmp,_path } = init( _table,null,this );
			
			_object.flat().forEach( item=>{
				item = _createNewHash_( item );
				const data = JSON.stringify(item);
				_itr.unshift( this.encrypt(data) );
			}); store.set( _table,_itr.join('\n') ); res({table:_table});

		} catch(e) { rej( e ); } }); 
	}

	place( _table, _line, ..._object ){ 
		return new Promise( (res,rej)=>{ try{
			
			let { _i,_cfg,_itr,_res,_tmp,_path } = init( _table,null,this );
			
			_object.flat().forEach( item=>{
				item = _createNewHash_( item );
				const data = JSON.stringify(item);
				_itr.splice( _line,0,this.encrypt(data) );
			}); store.set( _table,_itr.join('\n') ); res({table:_table});

		} catch(e) { rej( e ); } }); 
	}

	update( _table, _hash, ..._object ){ 
		return new Promise( (res,rej)=>{ try{
			
			let { _i,_cfg,_itr,_res,_tmp,_path } = init( _table,null,this );

			_itr.every( ( encryptedLine )=>{ try{

				const line = this.decrypt( encryptedLine );
				const data = JSON.parse( line );

				if( data.hash == _hash ){

					_object.flat().forEach( item=>{
						item = _createNewHash_( item );
						const data = JSON.stringify(item);
						_itr.splice( _i,1,this.encrypt(data) );
					}); return false;
				}

				_i++;} catch(e) { rej(`the db can be decripted ${e}`) }
			return true; }); store.set( _table,_itr.join('\n') ); res({table:_table});

		} catch(e) { rej( e ); } }); 
	}

	// TODO: Removing functions //
	remove( _table, _hash ){ 
		return new Promise( (res,rej)=>{ try{
			
			let { _i,_cfg,_itr,_res,_tmp,_path } = init( _table,null,this );

			_itr.every( ( encryptedLine )=>{ try{

				const line = this.decrypt( encryptedLine );
				const data = JSON.parse( line );

				if( data.hash == _hash ){
					_object = _createNewHash_( _object );
					_itr.splice( _i,0 );
					return false;
				}

				_i++;} catch(e) { rej(`the db can be decripted ${e}`) }
			return true; }); store.set( _table,_itr.join('\n') ); res({table:_table});

		} catch(e) { rej( e ); } }); 
	}

	shif( _table ){ 
		return new Promise( (res,rej)=>{ try{
			const _itr = _createNewTable_( _table );
			_itr.shif(); store.set( _table,_itr.join('\n') ); res({table:_table});
		} catch(e) { rej( e ); } }); 
	}

	pop( _table ){ 
		return new Promise( (res,rej)=>{ try{
			const _itr = _createNewTable_( _table );
			_itr.pop(); store.set( _table,_itr.join('\n') ); res({table:_table});
		} catch(e) { rej( e ); } }); 
	}

}

// TODO: export --------------------------------------------------------------------------------------//
module.exports = { createWebDB:createWebDB, store:store, };
