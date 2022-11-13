	const observer = new IntersectionObserver( (entries, observer)=>{
		entries.map( entry=>{

			const object = entry.target;
			const placeholder = object.src;

			if( entry.isIntersecting ){
				object.src = object.getAttribute('lazy');
				observer.unobserve( object );
				object.removeAttribute('lazy');
				object.addEventListener('error',(el)=>{
					try{const clss = object.getAttribute('class');
						const newElement = createElement( object.tagName );
						  	  newElement.setAttribute('src',placeholder);
							  newElement.setAttribute('class',clss);
						replaceElement( newElement,object );
					} catch(e) {/* console.log(e) */}});
			}
			
		});
	}, config); const config = { rootMargin:'250px 0px' };
	
/*--------------------------------------------------------------------------------------------------*/

	const _loadBases_ = function( bases ){
		try{
			bases.map( (base,index)=>{
				
				const mimeType = base.getAttribute('type') || 'image/png';

				const data = base.getAttribute('b64');
				const file = base64toBlob( data, mimeType );
				const url = URL.createObjectURL( file );

				if( base.getAttribute('lazy') )
					 base.setAttribute('data-src',url);
				else base.setAttribute('src',url);

				base.removeAttribute('type');
				base.removeAttribute('b64');
								
			})
		} catch(e) {/* console.log(e) */}
	}
	
/*--------------------------------------------------------------------------------------------------*/

	const _loadCode_ = function( body ){ 
		try{ 

			let data = body.innerHTML;
			const script = data.match(/\/\°[^°]+\°\//gi);
			script.map((x)=>{
				try{ const code = x.replace(/\/\°|\°\//gi,'');
					 data = data.replace( x,eval(code) );
				} catch(e) { console.log(e);
					data = `<!-- ${e?.message} -->`;
				}
			}); 
			
			if( script ) body.innerHTML = data; 

		} catch(e) {/* console.log(e) */}
	}

/*--------------------------------------------------------------------------------------------------*/

	const _loadLazys_ = function( lazys ){
		try{lazys.map( lazy=>{ 
				observer.observe( lazy );
			});
		} catch(e) {/* console.log(e); */} 
	}
	
/*--------------------------------------------------------------------------------------------------*/

	const _loadWorkers_ = function( workers ){
		try {
			workers.map((wrk,i)=>{

				let url = undefined;
				let thread = undefined;
				const id = wrk.getAttribute('id');

				if( !id ) return console.error('please set a worker id attribute');

				if( !wrk.getAttribute('src') ){
					const data = wrk.innerText;
					const blob = new Blob([data],{type: 'text/javascript'});
						  url = URL.createObjectURL(blob);
				} else { url = wrk.getAttribute('src'); }

				if( wrk.hasAttribute('shared') )
					 thread = new SharedWorker(url);
				else thread = new Worker(url);

				worker[id] = {
					worker: thread,
					data: url,
					id: id,
				};

			});
		} catch(e) {/* console.log(e) */}
	}

	async function _loaddom_(body){
		try{ 

			let data = body.innerHTML;
			const script = data.match(/\#\°[^°]+\°\#/gi);
			for( var i in script ){ const x = script[i];
				try{ 
					
					const raw = x.replace(/\#\°|\°\#| /gi,'');
					const cmp = raw.match(/.+/);

					const res = await fetch(cmp);
					const inf = await res.text();

					data = data.replace( x,inf );
				
				} catch(e) { console.log(e);
					data = `<!-- ${e?.message} -->`;
				}
			}
			
			if( script ) body.innerHTML = data; 

		} catch(e) {/* console.log(e) */}
	}

/*--------------------------------------------------------------------------------------------------*/

	const _loadComponents_ = function(){ 
		try{

			if( window['_changing_'] ) return undefined;
				window['_changing_'] = true;
			
			_loadWorkers_($$('script[type=worker]'));
			_loadLazys_($$('*[lazy]'));
			_loadBases_($$('*[b64]'));
			_loadCode_($('body'));
			_loaddom_($('body'));

			window['_changing_'] = false;
    
		} catch(e) {/* console.error(e) */}
	}

module.exports = _loadComponents_;

/*--------------------------------------------------------------------------------------------------*/