

const Peer = require('./baseJS/peer');
class createPeer{

	constructor( ..._id ){
		this.peer = new Peer( _id );
		this.oncall = function(){return undefined;}
		this.onopen = function(){return undefined;}
		this.onerror = function(){return undefined;}
		this.onclose = function(){return undefined;}
		this.onstream = function(){return undefined;}
		this.onmessage = function(){return undefined;}
		this.onconnected = function(){return undefined;}
		this.onconnection = function(){return undefined;}
		this.ondisconnected = function(){return undefined;}
	}

	connect( _id ,_mediaStream ){
		this.peer.on('disconnected', ()=>this.ondisconnected());
		this.peer.on('stream', (data)=>this.onstream(data));
		this.peer.on('call', (_call)=>this.oncall(_call));
		this.peer.on('data', (msg)=>this.onmessage(msg));
		this.peer.on('error', (err)=>this.onerror(err));
		this.peer.on('close', ()=>this.onclose());

		const _conn = this.peer.connect(_id)
		_conn.on('open',()=>{ this.onopen(_conn);
			_conn.on('disconnected', ()=>this.ondisconnected());
			_conn.on('stream', (data)=>this.onstream(data));
			_conn.on('data', (msg)=>this.onmessage(msg));
			_conn.on('error', (err)=>this.onerror(err));
			_conn.on('close', ()=>this.onclose());
		});
		
		if( _mediaStream!==undefined ){
			const _call = this.peer.call( _id, _mediaStream );
			_call.on('stream', (data)=>this.onstream(data) );
		}
	}

	recive( _mediaStream ){	
		this.peer.on('disconnected', ()=>this.ondisconnected());
		this.peer.on('stream', (data)=>this.onstream(data));
		this.peer.on('data', (msg)=>this.onmessage(msg));
		this.peer.on('error', (err)=>this.onerror(err));
		this.peer.on('close', ()=>this.onclose());

		this.peer.on('connection', (_conn)=>{
			_conn.on('open', ()=>{ this.onopen(_conn);
			_conn.on('disconnected', ()=>this.ondisconnected());
			_conn.on('stream', (data)=>this.onstream(data));
			_conn.on('data', (msg)=>this.onmessage(msg));
			_conn.on('error', (err)=>this.onerror(err));
			_conn.on('close', ()=>this.onclose());	
			});
			
		});
		
		this.peer.on('call',(_call)=>{ this.oncall( _call );
			_call.on('stream', (data)=>this.onstream(data) );
			if( _mediaStream!==undefined ){ _call.answer( _mediaStream ); }
		});
	}

}

module.exports = createPeer