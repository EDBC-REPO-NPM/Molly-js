
	let observer = undefined; try{
		observer = new IntersectionObserver( (entries, observer)=>{
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
		},{ rootMargin:'250px 0px' });
	} catch(e) { }
	
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
		return new Promise(async(response,reject)=>{
			try{ 

				let data = body.innerHTML;
				const script = data.match(/\/\°[^°]+\°\//gi);
				const fragmt = data.match(/\#\°[^°]+\°\#/gi);
				
				for( var i in fragmt ){ const x = fragmt[i];
					try{ 
						const code = x.replace(/\#\°|\°\#| /gi,'');
						const res = await fetch(code);
						const text = await res.text();
						data = data.replace( x,text );
					} catch(e) { console.error(e);
						data = `/* ${e?.message} */`;
					}
				}

				for( var i in script ){ const x = script[i];
					try{ 
						const code = x.replace(/\/\°|\°\//gi,'');
						data = data.replace( x,eval(code) );
					} catch(e) { console.error(e);
						data = `/* ${e?.message} */`;
					}
				}

				body.innerHTML = data;
				if( script || fragmt ) response( _loadCode_(body) );
			} catch(e) {/* console.log(e) */} response();
		})
	}

/*--------------------------------------------------------------------------------------------------*/

	const _loadLazys_ = function( lazys ){
		try{ lazys.map( lazy=>{ 
				observer.observe( lazy );
			});
		} catch(e) {/* console.log(e); */} 
	}
	
/*--------------------------------------------------------------------------------------------------*/

	const _loadWorkers_ = function( body ){
		try {
			const workers = $$(body,'script[type=worker]');
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

				window.device.worker[id] = {
					data: url, id: id,
					worker: thread,
				};	wrk.remove();

			});
		} catch(e) {/* console.log(e) */}
	}

	async function _loadDOM_(body){
		return new Promise(async(response,reject)=>{
			try{ 

				const el = $$(body,'*[load]');
				for( var i in el ){ const x = el[i];
					try{ 
						const res = await fetch(x.getAttribute('load'));
						const text = await res.text();
						x.removeAttribute('load');
						x.innerHTML = text;
					} catch(e) { console.error(e);
						data = `/* ${e?.message} */`;
					}
				}

				if( el.length ) response( _loadDOM_(body) );
			} catch(e) {/* console.log(e) */} response();
		});
	}

/*--------------------------------------------------------------------------------------------------*/

	const _loadScripts_ = async function(body){
		const scripts = $$(body,'script[type=module],script:not([type]),script[type~=javascript]');
		for(var i in scripts){ 

			const content = scripts[i].innerHTML;
			const file = new Blob([content],{type:'text/javascript'});
			const source = scripts[i].getAttribute('src');
				  scripts[i].remove();

			const element = createElement('script');
			const url = URL.createObjectURL(file);
				  element.src = source || url;

			$('head').appendChild(element);
		}
	}

/*--------------------------------------------------------------------------------------------------*/

	const _loadStyles_ = async function(body){
		const links = $$(body,'style');
		for(var i in links){ 

			const content = links[i].innerHTML;
			const file = new Blob([content],{type:'text/css'});
			const source = links[i].getAttribute('src');
				  links[i].remove();

			const element = createElement('link');
			const url = URL.createObjectURL(file);
				element.href = source || url;
				element.rel = 'stylesheet';

			$('head').appendChild(element);
		}
	}

/*--------------------------------------------------------------------------------------------------*/

	const _loadComponents_ = async function(){ 
		try{

			if( window['_changing_'] ) return undefined;
				window['_changing_'] = true;
			
			await _loadBases_($$('*[b64]'));
			await _loadLazys_($$('*[lazy]'));

			const data = $('body').innerHTML;
			const inp = window.XML.parse(data,'text/html');
				  await _loadDOM_($(inp,'body'));
				  await _loadCode_($(inp,'body'));
				  await _loadStyles_($(inp,'body'));
				  await _loadScripts_($(inp,'body'));
				  await _loadWorkers_($(inp,'body'));
			const out = $(inp,'body').innerHTML;

			if( data != out ) $('body').innerHTML = out;

			window['_changing_'] = false;
		} catch(e) {/* console.error(e) */}
	}

module.exports = _loadComponents_;

/*--------------------------------------------------------------------------------------------------*/