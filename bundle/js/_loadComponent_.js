	const config = { rootMargin:'250px 0px' };
	const observer = new IntersectionObserver( (entries, observer)=>{
		entries.forEach( entry=>{
			const object = entry.target;
			const placeholder = object.src;
			if( entry.isIntersecting ){
				object.src = object.getAttribute('lazy');
				observer.unobserve( object );
				object.removeAttribute('lazy');
				addEvent(object,'error',(el)=>{
					try{const clss = object.getAttribute('class');
						const newElement = createElement( object.tagName );
						  	  newElement.setAttribute('src',placeholder);
							  newElement.setAttribute('class',clss);
						replaceElement( newElement,object );
					} catch(e) { console.log(e) }});
			}
		});
	}, config); 
	
/*--------------------------------------------------------------------------------------------------*/

	const _loadBases_ = function( bases ){
		return new Promise( (response,reject)=>{ try{
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
								
			}); response(true); } catch(e) { reject(true); console.log(e); }
		});
	}
	
/*--------------------------------------------------------------------------------------------------*/

	const _loadCode_ = function( body ){ try{
		var data = body.innerHTML;
		const script = Array.from(data.match(/\/\°[^°]+\°\//gi));
		script.map(x=>{ try{ const code = x.replace(/\/\°|\°\//gi,'');
			data = data.replace( x,eval(code) );
		} catch(e) { console.log(e);
			data = `<!-- ${e?.message} -->`;
		}}); body.innerHTML = data; return true;
	} catch(e) { return true; } }
	
/*--------------------------------------------------------------------------------------------------*/

	const _loadLazys_ = function( lazys ){
		return new Promise( (response,reject)=>{ try{
			lazys.forEach( lazy=>{ observer.observe( lazy );
			});	response(true);
		} catch(e) { reject(true); console.log(e); } });
	}
	
/*--------------------------------------------------------------------------------------------------*/

	const _loadComponents_ = async function(){ 
		try{

			if( window['_changing_'] ) return undefined;
				window['_changing_'] = true;
			
			const D = await _loadCode_($('body'));
			const B = await _loadBases_($$('*[b64]'));
			const C = await _loadLazys_($$('*[lazy]'));

			window['_changing_'] = false;
    
		} catch(e) { console.error(e) }
	}

module.exports = _loadComponents_;

/*--------------------------------------------------------------------------------------------------*/